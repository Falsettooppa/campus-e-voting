// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getElectionResults } from '../services/electionService';

// const ElectionResults = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const loadResults = async () => {
//       try {
//         const res = await getElectionResults(id);
//         setData(res);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Unable to load results');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadResults();
//   }, [id]);

//   if (loading) return <p>Loading results...</p>;
//   if (error) return <p>{error}</p>;
//   if (!data) return null;

//   return (
//     <div style={{ padding: 16 }}>
//       <button onClick={() => navigate(-1)}>Back</button>

//       <h2 style={{ marginTop: 12 }}>{data.election.title} — Results</h2>

//       <p><strong>Total Votes:</strong> {data.totalVotes}</p>

//       <hr style={{ margin: '16px 0' }} />

//       <h3>Candidates</h3>

//       <ul>
//         {data.results.map((r) => (
//           <li key={r.candidateId} style={{ marginBottom: 10 }}>
//             <strong>{r.name}</strong>
//             <div>Votes: {r.votes}</div>
//             <div>Percentage: {r.percentage}%</div>
//           </li>
//         ))}
//       </ul>

//       <hr style={{ margin: '16px 0' }} />

//       <h3>Winner{data.winners.length > 1 ? 's' : ''}</h3>

//       {data.winners.length === 0 ? (
//         <p>No votes cast.</p>
//       ) : (
//         <ul>
//           {data.winners.map((w) => (
//             <li key={w.candidateId}>
//               🏆 <strong>{w.name}</strong> ({w.votes} votes)
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ElectionResults;
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionResults } from '../services/electionService';

const ElectionResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResults = async () => {
    try {
      setError('');
      setLoading(true);
      const res = await getElectionResults(id);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const electionTitle = data?.election?.title || 'Election Results';
  const totalVotes = Number(data?.totalVotes) || 0;

  const sortedResults = useMemo(() => {
    const list = Array.isArray(data?.results) ? data.results : [];
    return [...list].sort((a, b) => (Number(b.votes) || 0) - (Number(a.votes) || 0));
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Loading results…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                ← Back
              </button>
              <button
                onClick={loadResults}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const winners = Array.isArray(data.winners) ? data.winners : [];
  const hasWinners = winners.length > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-fit rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            ← Back
          </button>

          <button
            onClick={loadResults}
            className="w-fit rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* Header */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            {electionTitle} <span className="text-gray-400">— Results</span>
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-700">
              Total Votes: <span className="ml-1 font-semibold text-gray-900">{totalVotes}</span>
            </span>
            <span className="inline-flex rounded-full border bg-slate-50 px-3 py-1 text-xs text-gray-700">
              Candidates: <span className="ml-1 font-semibold text-gray-900">{sortedResults.length}</span>
            </span>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Results are computed from votes cast in the system. Percentages represent vote share.
          </p>
        </div>

        {/* Winner card */}
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Winner{winners.length > 1 ? 's' : ''}
          </h2>

          {!hasWinners ? (
            <div className="mt-3 rounded-xl border bg-slate-50 p-4">
              <p className="text-sm text-gray-700">No votes cast.</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {winners.map((w) => (
                <div
                  key={w.candidateId}
                  className="rounded-xl border bg-green-50 p-4"
                >
                  <p className="text-sm font-semibold text-green-900">
                    🏆 {w.name}
                  </p>
                  <p className="mt-1 text-sm text-green-800">
                    Votes: <span className="font-semibold">{w.votes}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidate results */}
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Candidate Breakdown</h2>
              <p className="mt-1 text-sm text-gray-600">Ranked by total votes.</p>
            </div>

            {totalVotes > 0 ? (
              <span className="rounded-full border bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Live Summary
              </span>
            ) : null}
          </div>

          <div className="mt-5 space-y-3">
            {sortedResults.length === 0 ? (
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm text-gray-700">No candidates found.</p>
              </div>
            ) : (
              sortedResults.map((r, idx) => {
                const votes = Number(r.votes) || 0;
                const pct = Number(r.percentage) || 0;

                return (
                  <div key={r.candidateId} className="rounded-xl border p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          #{idx + 1} — {r.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          Votes: <span className="font-semibold">{votes}</span> • Share:{' '}
                          <span className="font-semibold">{pct}%</span>
                        </p>
                      </div>

                      {idx === 0 && totalVotes > 0 ? (
                        <span className="w-fit rounded-full border bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Leading
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Note: If multiple winners exist, it indicates a tie based on vote count.
        </p>
      </div>
    </div>
  );
};

export default ElectionResults;