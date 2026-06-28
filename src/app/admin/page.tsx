'use client';

import { useState, useEffect } from 'react';
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
  FolderOpen,
  Trash2,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/supabase';
import { verifyAdminPasscode, checkAdminSession } from '@/lib/actions/auth';
import { upsertProjectAction, deleteProjectAction } from '@/lib/actions/projects';
import { addTestimonialAction, deleteTestimonialAction } from '@/lib/actions/testimonials';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { GithubIcon } from '@/components/Icons';
import type { Project, ProjectUpsert, Testimonial } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  created_at: string;
}

interface NewTestimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  avatar_url: string;
  rating: number;
}

const EMPTY_PROJECT: ProjectUpsert = {
  title: '',
  slug: '',
  description: '',
  thumbnail: '',
  tech_stack: [],
  github_url: '',
  live_url: '',
  featured: false,
  sort_order: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ProjectUpsert;
  onSave: (p: ProjectUpsert) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProjectUpsert>(initial);
  const [techInput, setTechInput] = useState(initial.tech_stack.join(', '));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, tech_stack: techInput.split(',').map((s) => s.trim()).filter(Boolean) });
    setSaving(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="liquid-glass rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-heading font-600 text-foreground">
          {initial.id ? 'Edit Project' : 'New Project'}
        </h3>
        <button type="button" onClick={onCancel} className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
            className="form-field"
            placeholder="Neuro Flow"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="form-field font-mono"
            placeholder="neuro-flow"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Description</label>
        <textarea
          rows={2}
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="form-field resize-none"
          placeholder="Short project description..."
        />
      </div>

      <ImageUpload
        label="Thumbnail"
        folder="projects"
        value={form.thumbnail ?? ''}
        onChange={(url) => setForm({ ...form, thumbnail: url })}
      />

      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Tech Stack (comma-separated)</label>
        <input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          className="form-field"
          placeholder="Next.js, TypeScript, Supabase"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">GitHub URL</label>
          <input
            value={form.github_url ?? ''}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            className="form-field"
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Live URL</label>
          <input
            value={form.live_url ?? ''}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            className="form-field"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Sort Order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="form-field"
            min={0}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`w-10 h-5 rounded-full transition-all cursor-pointer ${
                form.featured ? 'bg-amber-500' : 'bg-foreground/20'
              } relative`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.featured ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-xs text-foreground/60 group-hover:text-foreground transition-colors">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? 'Saving...' : 'Save Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl liquid-glass text-xs font-semibold text-foreground/60 hover:text-foreground transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials' | 'contacts'>('projects');

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [editingProject, setEditingProject] = useState<ProjectUpsert | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const [newTestimonial, setNewTestimonial] = useState<NewTestimonial>({
    name: '', role: '', company: '', text: '', avatar_url: '', rating: 5,
  });
  const [addingTestimonial, setAddingTestimonial] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminSession().then((valid) => {
      if (valid) {
        setAuthenticated(true);
        loadData();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const result = await verifyAdminPasscode(passcode);
    if (result.success) {
      setAuthenticated(true);
      setPasscode('');
      loadData();
    } else {
      setAuthError(result.error ?? 'Invalid passcode. Access denied.');
      setPasscode('');
    }
  };

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [tData, cData, pData] = await Promise.all([
        db.getTestimonials(),
        db.getContacts(),
        db.getProjects(),
      ]);
      setTestimonials(tData);
      setContacts(cData);
      setProjects(pData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveProject = async (project: ProjectUpsert) => {
    setActionError(null);
    const { error } = await upsertProjectAction(project);
    if (error) {
      setActionError(error);
      console.error('Error saving project:', error);
      return;
    }
    setShowProjectForm(false);
    setEditingProject(null);
    await loadData();
  };

  const handleDeleteProject = async (id: string) => {
    setActionError(null);
    setDeletingProjectId(id);
    const { error } = await deleteProjectAction(id);
    setDeletingProjectId(null);
    if (error) {
      setActionError(error);
      console.error('Error deleting project:', error);
      return;
    }
    await loadData();
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setAddingTestimonial(true);
    try {
      const { error } = await addTestimonialAction(newTestimonial);
      if (error) {
        setActionError(error);
        return;
      }
      setNewTestimonial({ name: '', role: '', company: '', text: '', avatar_url: '', rating: 5 });
      setShowAddForm(false);
      await loadData();
    } catch (err) {
      console.error(err);
      setActionError(err instanceof Error ? err.message : 'Failed to add testimonial');
    } finally {
      setAddingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    setActionError(null);
    setDeletingTestimonialId(id);
    const { error } = await deleteTestimonialAction(id);
    setDeletingTestimonialId(null);
    if (error) {
      setActionError(error);
      return;
    }
    await loadData();
  };

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
        <div className="mesh-background" aria-hidden="true">
          <div className="mesh-blob mesh-blob-a" />
          <div className="mesh-blob mesh-blob-b" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="liquid-glass rounded-2xl p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-700 text-foreground tracking-tight">Admin Panel</h1>
                <p className="text-sm text-foreground/40 font-light mt-1">Enter your passcode to continue.</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  id="admin-passcode"
                  placeholder="Passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="form-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {authError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400 text-center"
                  >
                    {authError}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                id="admin-login-btn"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" /> Authenticate
              </button>
            </form>

            <div className="text-center">
              <Link href="/" className="text-xs text-foreground/30 hover:text-foreground/70 transition-colors flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Portfolio
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  const TABS = [
    { id: 'projects' as const, label: 'Projects', icon: FolderOpen, count: projects.length },
    { id: 'testimonials' as const, label: 'Testimonials', icon: Users, count: testimonials.length },
    { id: 'contacts' as const, label: 'Contacts', icon: Mail, count: contacts.length },
  ];

  return (
    <main className="min-h-screen bg-background font-body">
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob mesh-blob-a" />
        <div className="mesh-blob mesh-blob-b" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-700 text-foreground tracking-tight">Admin Panel</h1>
            <p className="text-xs text-foreground/40 mt-1">Manage your portfolio content</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="admin-refresh"
              onClick={loadData}
              disabled={loadingData}
              className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/" className="px-4 py-2 rounded-xl liquid-glass text-xs font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3 h-3" /> Portfolio
            </Link>
          </div>
        </div>

        {actionError && (
          <p className="text-xs text-red-500 liquid-glass rounded-xl px-4 py-3">{actionError}</p>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'liquid-glass text-foreground/60 hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-foreground/10 text-foreground/50'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Projects Tab ── */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-600 text-foreground">Projects</h2>
              <button
                id="add-project-btn"
                onClick={() => { setEditingProject(EMPTY_PROJECT); setShowProjectForm(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            {/* Project form */}
            <AnimatePresence>
              {showProjectForm && editingProject && (
                <ProjectForm
                  initial={editingProject}
                  onSave={handleSaveProject}
                  onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
                />
              )}
            </AnimatePresence>

            {/* Project list */}
            {loadingData ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="liquid-glass rounded-2xl p-12 text-center">
                <FolderOpen className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-foreground/40">No projects yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    className="liquid-glass rounded-2xl p-4 flex items-start gap-4"
                  >
                    {p.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-foreground/10"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-heading font-600 text-foreground">{p.title}</span>
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-500 text-[10px] font-semibold">
                            <Star className="w-2.5 h-2.5 fill-amber-500" /> Featured
                          </span>
                        )}
                        <span className="text-[10px] text-foreground/30 font-mono">#{p.sort_order}</span>
                      </div>
                      <p className="text-xs text-foreground/50 mt-1 line-clamp-1">{p.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tech_stack.slice(0, 4).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-foreground/5 border border-foreground/8 text-foreground/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors">
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => { setEditingProject(p); setShowProjectForm(true); }}
                        className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-foreground/40 hover:text-blue-400 transition-colors cursor-pointer"
                        aria-label={`Edit ${p.title}`}
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        disabled={deletingProjectId === p.id}
                        className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-foreground/40 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                        aria-label={`Delete ${p.title}`}
                      >
                        {deletingProjectId === p.id
                          ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Testimonials Tab ── */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-600 text-foreground">Testimonials</h2>
              <button
                id="add-testimonial-btn"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Testimonial
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleAddTestimonial}
                  className="liquid-glass rounded-2xl p-6 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {(['name', 'role', 'company'] as const).map((field) => (
                      <div key={field} className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">{field}</label>
                        <input
                          value={newTestimonial[field]}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, [field]: e.target.value })}
                          className="form-field"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <ImageUpload
                    label="Avatar"
                    folder="testimonials"
                    value={newTestimonial.avatar_url}
                    onChange={(url) => setNewTestimonial({ ...newTestimonial, avatar_url: url })}
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Testimonial Text</label>
                    <textarea
                      required
                      rows={3}
                      value={newTestimonial.text}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                      className="form-field resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">Rating:</label>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNewTestimonial({ ...newTestimonial, rating: n })}
                        className={`cursor-pointer transition-colors ${n <= newTestimonial.rating ? 'text-amber-500' : 'text-foreground/20'}`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={addingTestimonial} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                      {addingTestimonial ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      {addingTestimonial ? 'Saving...' : 'Add Testimonial'}
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl liquid-glass text-xs text-foreground/50 hover:text-foreground transition-all cursor-pointer">Cancel</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {loadingData ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
            ) : (
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="liquid-glass rounded-2xl p-5 flex gap-4 items-start">
                    {t.avatar_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-foreground/10 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{t.name}</span>
                        <span className="text-[10px] text-foreground/40">{t.role} @ {t.company}</span>
                      </div>
                      <p className="text-xs text-foreground/50 mt-1 leading-relaxed line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                      <div className="flex gap-0.5 mt-2">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      disabled={deletingTestimonialId === t.id}
                      className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center text-foreground/40 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                      aria-label={`Delete testimonial from ${t.name}`}
                    >
                      {deletingTestimonialId === t.id
                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Contacts Tab ── */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <h2 className="text-sm font-heading font-600 text-foreground">Contact Submissions</h2>
            {loadingData ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
            ) : contacts.length === 0 ? (
              <div className="liquid-glass rounded-2xl p-12 text-center">
                <Mail className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-foreground/40">No contact submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => (
                  <div key={c.id} className="liquid-glass rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{c.name}</div>
                        <div className="text-xs text-foreground/40">{c.email} · {c.company}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-amber-500 font-medium">{c.budget}</div>
                        <div className="text-[10px] text-foreground/30 mt-0.5">
                          {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-foreground/50 leading-relaxed border-t border-foreground/8 pt-3">{c.message}</p>
                    <a
                      href={`mailto:${c.email}?subject=Re: Portfolio Inquiry`}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      <Mail className="w-3 h-3" /> Reply via Email
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
