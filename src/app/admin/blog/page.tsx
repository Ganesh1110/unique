'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

type Article = {
  id: number;
  handle: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  image: string;
  author: string;
  publishedAt: string;
};

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('AURA Atelier');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = () => {
    setLoading(true);
    fetch('/api/blog')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok) setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHandle(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, handle, excerpt, contentHtml, image, author }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setShowModal(false);
        setTitle('');
        setHandle('');
        setExcerpt('');
        setContentHtml('');
        setImage('');
        fetchArticles();
      } else {
        setError(data.error || 'Failed to create article');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6 sm:p-10 space-y-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-heading text-heading-md font-bold text-white">Journal &amp; Content Marketing</h1>
              <p className="text-caption text-neutral-400">Publish articles, care guides, and brand story pieces for SEO</p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-body-xs font-bold uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" /> Create New Article
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading journal database...</div>
        ) : articles.length === 0 ? (
          <div className="p-12 bg-neutral-800/50 rounded-xl border border-neutral-700 text-center text-neutral-400 space-y-3">
            <BookOpen className="h-10 w-10 text-neutral-500 mx-auto" />
            <p className="font-bold text-white">No articles published yet</p>
            <p className="text-caption">Click &quot;Create New Article&quot; to publish your first blog post.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((art) => (
              <div key={art.id} className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-neutral-400">/blog/{art.handle}</span>
                  <h3 className="font-bold text-white text-body-sm">{art.title}</h3>
                  <p className="text-caption text-neutral-400 line-clamp-2">{art.excerpt}</p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-700/60 pt-3 text-caption text-neutral-400">
                  <span>Author: {art.author}</span>
                  <Link href={`/blog/${art.handle}`} target="_blank" className="text-emerald-400 hover:underline font-bold">
                    View Page →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-800 max-w-2xl w-full rounded-2xl p-6 sm:p-8 border border-neutral-700 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-4">
              <h3 className="font-heading text-heading-sm font-bold">Create Journal Article</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white font-bold text-body-lg">×</button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded text-caption">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-caption font-bold text-neutral-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-body-xs text-white outline-none focus:border-emerald-500"
                  placeholder="e.g. Caring for Pure Kanjeevaram Silks"
                />
              </div>

              <div>
                <label className="block text-caption font-bold text-neutral-300 mb-1">Handle / URL Slug *</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-body-xs text-neutral-400 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-bold text-neutral-300 mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-body-xs text-white outline-none"
                  placeholder="Short description for blog index card..."
                />
              </div>

              <div>
                <label className="block text-caption font-bold text-neutral-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-body-xs text-white outline-none"
                  placeholder="https://... or /uploads/..."
                />
              </div>

              <div>
                <label className="block text-caption font-bold text-neutral-300 mb-1">Article Content (HTML/Text) *</label>
                <textarea
                  required
                  rows={6}
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-body-xs text-white outline-none font-mono"
                  placeholder="<p>Write your article content here...</p>"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-body-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-body-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
