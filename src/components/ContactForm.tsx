'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Link2, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/supabase';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('submitting');
    try {
      const { error } = await db.submitContact(form);
      if (error) throw error;

      setStatus('success');
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#3b82f6', '#ec4899']
      });

      setTimeout(() => {
        setForm({ name: '', email: '', company: '', budget: '', message: '' });
        setStatus('idle');
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const channelClass =
    'flex items-center gap-4 p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-foreground/15 transition-all group cursor-pointer';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
      <div className="lg:col-span-5 space-y-8">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-accent-purple uppercase">
            Get in touch
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mt-2 leading-tight">
            LET&apos;S BUILD SOMETHING EXTRAORDINARY.
          </h2>
          <p className="text-foreground/60 font-light mt-4 leading-relaxed">
            Have a project, job opening, or vision you want to bring to life? Drop a message, or reach out directly on WhatsApp or LinkedIn. Let&apos;s engineer something beautiful.
          </p>
        </div>

        <div className="space-y-4">
          <a href="https://wa.me/923142291356" target="_blank" rel="noopener noreferrer" className={channelClass}>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-foreground/50 font-semibold tracking-wider uppercase">WhatsApp Chat</div>
              <div className="text-sm font-medium text-foreground">+92 314 2291356</div>
            </div>
          </a>

          <a href="https://www.linkedin.com/in/krish-baresha/" target="_blank" rel="noopener noreferrer" className={channelClass}>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-foreground/50 font-semibold tracking-wider uppercase">LinkedIn Connect</div>
              <div className="text-sm font-medium text-foreground">in/krishbaresha</div>
            </div>
          </a>

          <a href="mailto:krishbareshaworking@gmail.com" className={channelClass}>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-foreground/50 font-semibold tracking-wider uppercase">Direct Email</div>
              <div className="text-sm font-medium text-foreground">krishbareshaworking@gmail.com</div>
            </div>
          </a>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="contact-card p-8 relative overflow-hidden">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center space-y-4 relative z-10"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
              <h3 className="text-2xl font-bold text-foreground">Message Transmitted!</h3>
              <p className="text-sm text-foreground/60 max-w-sm leading-relaxed">
                Thank you for reaching out. Your details have been stored, and I will get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={status === 'submitting'}
                    className="form-field"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={status === 'submitting'}
                    className="form-field"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-company" className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    id="contact-company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    disabled={status === 'submitting'}
                    className="form-field"
                    placeholder="Stripe, Inc."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-budget" className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Project Budget (Any Currency)
                  </label>
                  <input
                    type="text"
                    id="contact-budget"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    disabled={status === 'submitting'}
                    className="form-field"
                    placeholder="e.g., $10k, €5,000, 10 Lakh INR..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  Project Brief
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  disabled={status === 'submitting'}
                  className="form-field resize-none"
                  placeholder="Tell me about what we are building..."
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500 text-center">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold text-sm tracking-wider uppercase shadow-lg shadow-purple-500/15 hover:shadow-purple-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
