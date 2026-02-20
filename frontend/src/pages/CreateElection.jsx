import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createElection } from '../services/electionService';

const CreateElection = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [candidateName, setCandidateName] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);

  const canSubmit = useMemo(() =>
    title.trim().length > 0 && candidates.length > 0 && !loading,
    [title, candidates.length, loading]);

  const addCandidate = () => {
    const name = candidateName.trim();
    if (!name) return;
    const exists = candidates.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) { setMessage('Candidate already added.'); setOk(false); return; }
    setCandidates(prev => [...prev, { name }]);
    setCandidateName('');
    setMessage('');
  };

  const handleCandidateKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCandidate(); }
  };

  const removeCandidate = (name) => {
    setCandidates(prev => prev.filter(c => c.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setOk(false);
    if (!title.trim()) { setMessage('Election title is required.'); return; }
    if (candidates.length === 0) { setMessage('Add at least one candidate.'); return; }
    try {
      setLoading(true);
      await createElection({ title: title.trim(), description: description.trim(), status, candidates });
      setOk(true);
      setMessage('Election created successfully.');
      setTitle(''); setDescription(''); setStatus('upcoming'); setCandidates([]);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setOk(false);
      setMessage(err.response?.data?.message || 'Failed to create election.');
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = {
    upcoming: { badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    active:   { badge: 'bg-green-50 text-green-700 border-green-200' },
    closed:   { badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Election</h1>
            <p className="text-sm text-slate-500 mt-0.5">Add candidates then publish when ready</p>
          </div>
        </div>

        {/* Alert */}
        {message && (
          <div className={`mb-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            <svg className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? 'fill-green-500' : 'fill-red-500'}`} viewBox="0 0 24 24">
              {ok
                ? <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                : <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              }
            </svg>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Section 1: Election Details ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-blue-50 flex items-center justify-center">
                <svg className="h-3.5 w-3.5 fill-blue-600" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Election Details</h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Election Title <span className="text-red-400">*</span>
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. SUG Presidential Election 2026"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of this election…"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 pr-9"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 fill-slate-400" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${(statusMeta[status] || statusMeta.upcoming).badge}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 flex gap-2.5">
                  <svg className="h-4 w-4 fill-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <span className="font-semibold">Recommended:</span> Start as <span className="font-semibold">Upcoming</span> until all candidates are finalised, then activate voting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Candidates ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-green-50 flex items-center justify-center">
                  <svg className="h-3.5 w-3.5 fill-green-600" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                </div>
                <h2 className="text-sm font-semibold text-slate-900">Candidates</h2>
              </div>
              {candidates.length > 0 && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {candidates.length} added
                </span>
              )}
            </div>

            <div className="p-6">
              {/* Add candidate input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg className="h-4 w-4 fill-slate-400" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </span>
                  <input
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    onKeyDown={handleCandidateKeyDown}
                    placeholder="Enter candidate name, press Enter or Add"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <button type="button" onClick={addCandidate}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors shrink-0">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Add
                </button>
              </div>

              {/* Candidate list */}
              {candidates.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <svg className="h-8 w-8 fill-slate-300 mb-2" viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <p className="text-sm font-medium text-slate-500">No candidates yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">Add at least one to create the election</p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {candidates.map((c, idx) => (
                    <div key={c.name}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-white transition-colors group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 truncate">{c.name}</span>
                      </div>
                      <button type="button" onClick={() => removeCandidate(c.name)}
                        className="ml-2 flex items-center justify-center h-6 w-6 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center">
            <button type="button" onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>

            <button type="submit" disabled={!canSubmit}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin fill-white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z"/></svg>
                  Creating…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Create Election
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateElection;