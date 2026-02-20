import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionResults } from '../services/electionService';

const ElectionResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResults = useCallback(async () => {
    try {
      setError(''); setLoading(true);
      const res = await getElectionResults(id);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load results');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
  loadResults();
}, [loadResults]);

  const electionTitle = data?.election?.title || 'Election Results';
  const totalVotes = Number(data?.totalVotes) || 0;

  const sortedResults = useMemo(() => {
    const list = Array.isArray(data?.results) ? data.results : [];
    return [...list].sort((a, b) => (Number(b.votes) || 0) - (Number(a.votes) || 0));
  }, [data]);

  const winners = Array.isArray(data?.winners) ? data.winners : [];

  // ── Loading ──
  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-7 w-7 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-slate-500">Loading results…</p>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="h-7 w-7 fill-red-400" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-1">Failed to load results</p>
        <p className="text-xs text-slate-500 mb-5">{error}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Back
          </button>
          <button onClick={loadResults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <button onClick={loadResults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="h-3.5 w-3.5 fill-slate-500" viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            Refresh
          </button>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"/>
              Closed
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {sortedResults.length} candidate{sortedResults.length !== 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{electionTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Official results · Percentages represent each candidate's share of total votes
          </p>
        </div>

        {/* Winner(s) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-amber-50 flex items-center justify-center">
              <svg className="h-3.5 w-3.5 fill-amber-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">
              {winners.length > 1 ? 'Winners — Tie' : 'Winner'}
            </h2>
          </div>

          <div className="p-6">
            {winners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 fill-slate-300" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <p className="text-sm font-medium text-slate-500">No votes cast</p>
                <p className="text-xs text-slate-400 mt-0.5">No winner to declare</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {winners.map((w, i) => (
                  <div key={w.candidateId}
                    className="relative rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 overflow-hidden">
                    {/* decorative star */}
                    <div className="absolute top-3 right-3 opacity-10">
                      <svg className="h-16 w-16 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <svg className="h-4 w-4 fill-amber-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                          {winners.length > 1 ? 'Co-winner' : 'Winner'}
                        </span>
                      </div>
                      <p className="text-base font-bold text-slate-900">{w.name}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-semibold text-slate-900">{w.votes}</span> vote{w.votes !== 1 ? 's' : ''}
                        {totalVotes > 0 && (
                          <span className="text-slate-400 ml-1.5">
                            ({Math.round((w.votes / totalVotes) * 100)}%)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Candidate Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by total votes received</p>
            </div>
            {totalVotes > 0 && (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                Final
              </span>
            )}
          </div>

          <div className="p-6">
            {sortedResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 fill-slate-300" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                </div>
                <p className="text-sm font-medium text-slate-500">No candidates found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedResults.map((r, idx) => {
                  const votes = Number(r.votes) || 0;
                  const pct = Number(r.percentage) || 0;
                  const isWinner = winners.some(w => w.candidateId === r.candidateId);
                  const isLeading = idx === 0 && totalVotes > 0;

                  return (
                    <div key={r.candidateId}
                      className={`rounded-xl border p-4 transition-colors ${isWinner ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-white'}`}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank badge */}
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            idx === 0 ? 'bg-amber-100 text-amber-700'
                            : idx === 1 ? 'bg-slate-200 text-slate-600'
                            : idx === 2 ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-500'
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{r.name}</p>
                            <p className="text-xs text-slate-400">
                              {votes} vote{votes !== 1 ? 's' : ''} · {pct}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 sm:ml-4">
                          {isWinner && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                              <svg className="h-3 w-3 fill-amber-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              Winner
                            </span>
                          )}
                          {isLeading && !isWinner && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                              Leading
                            </span>
                          )}
                          <span className="text-sm font-bold text-slate-700 w-10 text-right tabular-nums">
                            {pct}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            isWinner ? 'bg-amber-400' : idx === 0 ? 'bg-blue-500' : 'bg-slate-300'
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-400 text-center">
          {winners.length > 1
            ? 'Multiple winners indicate a tie based on vote count.'
            : 'Results are final and computed from all votes cast.'}
        </p>
      </div>
    </div>
  );
};

export default ElectionResults;