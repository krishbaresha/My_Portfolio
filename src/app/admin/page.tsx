'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Unlock,
  Users,
  Plus,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  Shield,
  FolderGit,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/supabase';
import { RepoData } from '@/lib/github';

interface NewTestimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  avatar_url: string;
  rating: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar_url?: string;
  rating: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'testimonials' | 'contacts' | 'projects'>('testimonials');

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [projectSettings, setProjectSettings] = useState<Record<string, { repoName: string; visible: boolean; customThumbnail?: string; customDescription?: string; customWebsite?: string; certificateLink?: string }>>({});
  const [githubRepos, setGithubRepos] = useState<RepoData[]>([]);
  const [savingProject, setSavingProject] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [generatingDesc, setGeneratingDesc] = useState<string | null>(null);

  const [newTestimonial, setNewTestimonial] = useState<NewTestimonial>({
    name: '',
    role: '',
    company: '',
    text: '',
    avatar_url: '',
    rating: 5,
  });
  const [addingTestimonial, setAddingTestimonial] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Hardcoded client-side passcode check
  // In production, this should be validated against a server-side API route
  const PASSCODE = 'Kali@Linux';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === PASSCODE) {
      setAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('Invalid passcode. Access denied.');
      setPasscode('');
    }
  };

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [tData, cData, pSettings, repoRes] = await Promise.all([
        db.getTestimonials(),
        db.getContacts(),
        db.getProjectSettings ? db.getProjectSettings() : Promise.resolve({}),
        fetch('/api/github').then(res => res.json()).catch(() => [])
      ]);
      setTestimonials(tData);
      setContacts(cData);
      setProjectSettings(pSettings || {});
      if (Array.isArray(repoRes)) {
        setGithubRepos(repoRes);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTestimonial(true);
    try {
      await db.addTestimonial(newTestimonial);
      setNewTestimonial({ name: '', role: '', company: '', text: '', avatar_url: '', rating: 5 });
      setShowAddForm(false);
      await loadData();
    } catch (err) {
      console.error('Error adding testimonial:', err);
    } finally {
      setAddingTestimonial(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#030303] font-sans flex items-center justify-center px-6 relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl glass-panel p-8 space-y-8">
            {/* Lock icon header */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-blue flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white uppercase">Admin Access</h1>
                <p className="text-sm text-zinc-500 font-light mt-1">Enter your passcode to manage portfolio content.</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  placeholder="Enter passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="w-full bg-white/5 border border-white/5 focus:border-accent-purple focus:bg-white/10 focus:outline-none transition-all rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4 top-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 text-center"
                >
                  {authError}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold text-sm uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" /> Authenticate
              </button>
            </form>

            <div className="text-center">
              <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Portfolio
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030303] font-sans py-24 px-6 relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider mb-4">
              <ArrowLeft className="w-4 h-4" /> Portfolio
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500 font-light mt-1">Manage portfolio content and incoming contacts.</p>
          </div>
          <button
            onClick={loadData}
            disabled={loadingData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl glass-panel p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-accent-purple">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{testimonials.length}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Testimonials</div>
            </div>
          </div>
          <div className="rounded-2xl glass-panel p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-accent-blue">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{contacts.length}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Contact Leads</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          {(['testimonials', 'contacts', 'projects'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Manage Testimonials</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl glass-panel p-6 overflow-hidden"
                >
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">New Testimonial</h3>
                  <form onSubmit={handleAddTestimonial} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      { key: 'name', label: 'Name', placeholder: 'John Doe' },
                      { key: 'role', label: 'Role / Title', placeholder: 'CEO' },
                      { key: 'company', label: 'Company', placeholder: 'Stripe Inc.' },
                      { key: 'avatar_url', label: 'Avatar URL or Upload', placeholder: 'https://... or upload photo' },
                    ] as const).map(({key, label, placeholder}) => (
                    <div key={key} className="space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={newTestimonial[key]}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, [key]: e.target.value })}
                          className="w-full bg-white/5 border border-white/5 focus:border-accent-purple focus:outline-none transition-all rounded-xl px-3 py-2.5 text-white text-xs placeholder:text-zinc-700"
                        />
                      </div>
                      {key === 'avatar_url' && (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewTestimonial({ ...newTestimonial, avatar_url: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer transition-all inline-block"
                          >
                            Upload Photo
                          </label>
                          <button
                            type="button"
                            onClick={async () => {
                              const prompt = window.prompt("Enter a prompt for the Gemini AI image generator:", `A professional, highly detailed, photorealistic portrait photo of a tech professional looking at the camera, studio lighting`);
                              if (!prompt) return;
                              
                              setGeneratingImage('avatar');
                              try {
                                const res = await fetch('/api/generate-image', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ prompt })
                                });
                                const data = await res.json();
                                if (data.success && data.image) {
                                  setNewTestimonial({ ...newTestimonial, avatar_url: data.image });
                                } else {
                                  alert('Failed to generate image: ' + (data.error || 'Unknown error'));
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Error generating image');
                              } finally {
                                setGeneratingImage(null);
                              }
                            }}
                            disabled={generatingImage === 'avatar'}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 hover:from-accent-purple/40 hover:to-accent-blue/40 border border-accent-purple/20 text-[10px] font-bold uppercase tracking-wider text-accent-purple cursor-pointer transition-all flex items-center justify-center shrink-0 disabled:opacity-50 inline-block"
                          >
                            {generatingImage === 'avatar' ? 'Generating...' : 'AI Avatar'}
                          </button>
                          {newTestimonial.avatar_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={newTestimonial.avatar_url} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                          )}
                        </div>
                      )}
                    </div>
                    ))}

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Testimonial Text</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write the testimonial..."
                        value={newTestimonial.text}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 focus:border-accent-purple focus:outline-none transition-all rounded-xl px-3 py-2.5 text-white text-xs placeholder:text-zinc-700 resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Rating</label>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setNewTestimonial({ ...newTestimonial, rating: r })}
                            className={`cursor-pointer transition-colors ${r <= newTestimonial.rating ? 'text-yellow-400' : 'text-zinc-700'}`}
                          >
                            <Star className="w-4 h-4" fill={r <= newTestimonial.rating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        disabled={addingTestimonial}
                        className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                      >
                        {addingTestimonial ? 'Adding...' : 'Add Testimonial'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Testimonial List */}
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-xl glass-panel p-5 flex gap-4 items-start">
                  {t.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
                  )}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{t.name}</span>
                      <span className="text-xs text-zinc-500">·</span>
                      <span className="text-xs text-zinc-500">{t.role} @ {t.company}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed truncate">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && !loadingData && (
                <p className="text-center text-zinc-600 text-sm py-10">No testimonials yet. Add one above!</p>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Contact Form Leads</h2>
            {contacts.length === 0 && !loadingData ? (
              <p className="text-center text-zinc-600 text-sm py-10">No contact submissions yet.</p>
            ) : (
              contacts.map((c) => (
                <div key={c.id} className="rounded-xl glass-panel p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-sm font-bold text-white">{c.name}</span>
                      <span className="text-zinc-500 text-xs ml-2">· {c.company}</span>
                    </div>
                    <span className="text-[10px] font-mono text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full">
                      {c.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Mail className="w-3.5 h-3.5" />
                    <a href={`mailto:${c.email}`} className="hover:text-white transition-colors">{c.email}</a>
                  </div>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed bg-white/5 rounded-lg p-3">
                    {c.message}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Manage Case Studies (GitHub Repositories)</h2>
                <p className="text-xs text-zinc-500 mt-1">Select which repositories appear in the landing page Case Studies section and set their custom cover images.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {githubRepos.map((repo) => {
                const setting = projectSettings[repo.name] || {
                  repoName: repo.name,
                  visible: ['neuro-flow', 'aurora-canvas', 'synapse-rag'].includes(repo.name.toLowerCase()),
                  customThumbnail: '',
                  customDescription: '',
                  customWebsite: '',
                  certificateLink: ''
                };
                const currentThumbnail = setting.customThumbnail || repo.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

                return (
                  <div key={repo.id} className="rounded-xl glass-panel p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Project Image Preview */}
                    <div className="w-full md:w-44 h-28 rounded-lg overflow-hidden border border-white/10 shrink-0 relative bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={currentThumbnail} alt={repo.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/80 text-white">
                        {setting.visible ? 'Visible' : 'Hidden'}
                      </div>
                    </div>

                    {/* Project Details & Form */}
                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <h3 className="text-md font-bold text-white uppercase tracking-wider">{repo.name}</h3>
                        <p className="text-xs text-zinc-500 font-light mt-1 line-clamp-1">{repo.description || 'No description provided.'}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Toggle Visibility */}
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={setting.visible}
                              onChange={(e) => {
                                const newVisible = e.target.checked;
                                setProjectSettings(prev => ({
                                  ...prev,
                                  [repo.name]: { ...setting, visible: newVisible }
                                }));
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-white/10 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-purple"></div>
                            <span className="ml-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Show in Portfolio</span>
                          </label>
                        </div>

                        {/* Edit Thumbnail */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Cover Image URL / Upload</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Paste cover URL..."
                              value={setting.customThumbnail || ''}
                              onChange={(e) => {
                                setProjectSettings(prev => ({
                                  ...prev,
                                  [repo.name]: { ...setting, customThumbnail: e.target.value }
                                }));
                              }}
                              className="flex-1 bg-white/5 border border-white/5 focus:border-accent-purple focus:outline-none transition-all rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-zinc-700"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              id={`thumbnail-upload-${repo.name}`}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setProjectSettings(prev => ({
                                      ...prev,
                                      [repo.name]: { ...setting, customThumbnail: reader.result as string }
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label
                              htmlFor={`thumbnail-upload-${repo.name}`}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer transition-all flex items-center justify-center shrink-0"
                            >
                              Upload
                            </label>
                            <button
                              type="button"
                              onClick={async () => {
                                const prompt = window.prompt("Enter a prompt for the Gemini AI image generator:", `A cinematic, premium abstract visual representation of a coding project named ${repo.name}`);
                                if (!prompt) return;
                                
                                setGeneratingImage(repo.name);
                                try {
                                  const res = await fetch('/api/generate-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ prompt })
                                  });
                                  const data = await res.json();
                                  if (data.success && data.image) {
                                    setProjectSettings(prev => ({
                                      ...prev,
                                      [repo.name]: { ...setting, customThumbnail: data.image }
                                    }));
                                  } else {
                                    alert('Failed to generate image: ' + (data.error || 'Unknown error'));
                                  }
                                } catch (err) {
                                  console.error(err);
                                  alert('Error generating image');
                                } finally {
                                  setGeneratingImage(null);
                                }
                              }}
                              disabled={generatingImage === repo.name}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 hover:from-accent-purple/40 hover:to-accent-blue/40 border border-accent-purple/20 text-[10px] font-bold uppercase tracking-wider text-accent-purple cursor-pointer transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
                            >
                              {generatingImage === repo.name ? 'Generating...' : 'AI Cover'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Edit Description */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Custom Case Study Description</label>
                          <button
                            type="button"
                            onClick={async () => {
                              setGeneratingDesc(repo.name);
                              try {
                                const res = await fetch('/api/generate-description', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ 
                                    owner: 'krishbaresha', 
                                    repo: repo.name,
                                    description: repo.description,
                                    language: repo.languages?.[0] || 'Unknown'
                                  })
                                });
                                const data = await res.json();
                                if (data.success && data.description) {
                                  setProjectSettings(prev => ({
                                    ...prev,
                                    [repo.name]: { ...setting, customDescription: data.description }
                                  }));
                                } else {
                                  alert('Failed to generate description: ' + (data.error || 'Unknown error'));
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Error generating description');
                              } finally {
                                setGeneratingDesc(null);
                              }
                            }}
                            disabled={generatingDesc === repo.name}
                            className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-accent-purple text-[9px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                            {generatingDesc === repo.name ? 'Generating...' : 'AI Auto-Write'}
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Write a custom description or generate one with AI..."
                          value={setting.customDescription || ''}
                          onChange={(e) => {
                            setProjectSettings(prev => ({
                              ...prev,
                              [repo.name]: { ...setting, customDescription: e.target.value }
                            }));
                          }}
                          className="w-full bg-white/5 border border-white/5 focus:border-accent-purple focus:outline-none transition-all rounded-lg px-3 py-2 text-white text-xs placeholder:text-zinc-700 resize-y"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Custom Website Link */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Live Website / Demo Link</label>
                          <input
                            type="text"
                            placeholder="https://my-demo.com"
                            value={setting.customWebsite || ''}
                            onChange={(e) => {
                              setProjectSettings(prev => ({
                                ...prev,
                                [repo.name]: { ...setting, customWebsite: e.target.value }
                              }));
                            }}
                            className="w-full bg-white/5 border border-white/5 focus:border-accent-purple focus:outline-none transition-all rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-zinc-700"
                          />
                        </div>

                        {/* Certificate Link */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Certificate / Award Link</label>
                          <input
                            type="text"
                            placeholder="URL to certificate or credential"
                            value={setting.certificateLink || ''}
                            onChange={(e) => {
                              setProjectSettings(prev => ({
                                ...prev,
                                [repo.name]: { ...setting, certificateLink: e.target.value }
                              }));
                            }}
                            className="w-full bg-white/5 border border-white/5 focus:border-accent-purple focus:outline-none transition-all rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-zinc-700"
                          />
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={async () => {
                            setSavingProject(repo.name);
                            try {
                              await db.saveProjectSetting(repo.name, {
                                visible: setting.visible,
                                customThumbnail: setting.customThumbnail,
                                customDescription: setting.customDescription,
                                customWebsite: setting.customWebsite,
                                certificateLink: setting.certificateLink
                              });
                            } catch (err) {
                              console.error('Failed to save project settings:', err);
                            } finally {
                              setSavingProject(null);
                            }
                          }}
                          disabled={savingProject === repo.name}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                        >
                          {savingProject === repo.name ? 'Saving...' : 'Save Settings'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {githubRepos.length === 0 && !loadingData && (
                <p className="text-center text-zinc-600 text-sm py-10">No repositories fetched. Click Refresh or check configuration.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
