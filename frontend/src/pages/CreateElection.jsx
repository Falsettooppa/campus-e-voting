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

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && candidates.length > 0 && !loading;
  }, [title, candidates.length, loading]);

  const addCandidate = () => {
    const name = candidateName.trim();
    if (!name) return;

    // prevent duplicates (case-insensitive)
    const exists = candidates.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setMessage('Candidate already added.');
      setOk(false);
      return;
    }

    setCandidates((prev) => [...prev, { name }]);
    setCandidateName('');
    setMessage('');
  };

  const removeCandidate = (name) => {
    setCandidates((prev) => prev.filter((c) => c.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setOk(false);

    if (!title.trim()) {
      setMessage('Election title is required.');
      return;
    }
    if (candidates.length === 0) {
      setMessage('Add at least one candidate.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        candidates
      };

      await createElection(payload);

      setOk(true);
      setMessage('Election created successfully.');
      setTitle('');
      setDescription('');
      setStatus('upcoming');
      setCandidates([]);

      // optional: go back to dashboard after a short moment
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      setOk(false);
      setMessage(err.response?.data?.message || 'Failed to create election.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-fit rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">
            Create Election
          </h1>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Create an election, add candidates, then activate voting when ready.
          </p>

          {message ? (
            <div
              className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                ok
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Election info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Election Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., SUG Presidential Election 2026"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the election..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="upcoming">upcoming</option>
                  <option value="active">active</option>
                  <option value="closed">closed</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Recommendation: create as <span className="font-medium">upcoming</span>, activate later.
                </p>
              </div>

              <div className="rounded-xl border bg-slate-50 p-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Tip</p>
                <p className="mt-1 text-gray-600">
                  For best governance, keep elections “upcoming” until candidates are finalised.
                </p>
              </div>
            </div>

            <hr />

            {/* Candidates */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
              <p className="mt-1 text-sm text-gray-600">
                Add candidates one by one. You can remove them before submitting.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Candidate name"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={addCandidate}
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Add
                </button>
              </div>

              {candidates.length === 0 ? (
                <div className="mt-4 rounded-xl border bg-slate-50 p-4">
                  <p className="text-sm text-gray-700">No candidates added yet.</p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {candidates.map((c) => (
                    <div key={c.name} className="flex items-center justify-between rounded-xl border p-3">
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <button
                        type="button"
                        onClick={() => removeCandidate(c.name)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating…' : 'Create Election'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateElection;
