// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getUserProfile } from '../services/authService';
// import { getAllElections } from '../services/electionService';

// const Home = () => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [elections, setElections] = useState([]);
//   const [loadingElections, setLoadingElections] = useState(true);

//   useEffect(() => {
//     const fetchUserAndElections = async () => {
//       try {
//         const userRes = await getUserProfile();
//         setUser(userRes.data);

//         const electionsRes = await getAllElections();
//         setElections(Array.isArray(electionsRes) ? electionsRes : []);
//       } catch (err) {
//         console.error('Error:', err);
//       } finally {
//         setLoadingElections(false);
//       }
//     };

//     fetchUserAndElections();
//   }, []);

//   if (!user) return <p>Loading user data...</p>;

//   return (
//     <div style={{ padding: 16 }}>
//       <h2>Welcome, {user.fullName}</h2>
//       <p>Email: {user.email}</p>

//       <hr style={{ margin: '16px 0' }} />

//       <h3>Available Elections</h3>

//       {loadingElections ? (
//         <p>Loading elections...</p>
//       ) : elections.length === 0 ? (
//         <p>No elections available yet.</p>
//       ) : (
//         <ul>
//           {elections.map((election) => (
//             <li key={election._id} style={{ marginBottom: 12 }}>
//               <strong>{election.title}</strong>
//               {election.description ? <div>{election.description}</div> : null}
//               {election.status ? <div><small>Status: {election.status}</small></div> : null}

//               <div style={{ marginTop: 8 }}>
//                 <button onClick={() => navigate(`/elections/${election._id}`)}>
//                   View
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Home;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../services/authService';
import { getAllElections } from '../services/electionService';

const badgeStyles = {
  upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200'
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingElections, setLoadingElections] = useState(true);

  useEffect(() => {
    const fetchUserAndElections = async () => {
      try {
        setLoading(true);
        setLoadingElections(true);

        const userRes = await getUserProfile();
        setUser(userRes.data);

        const electionsRes = await getAllElections();
        setElections(Array.isArray(electionsRes) ? electionsRes : []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
        setLoadingElections(false);
      }
    };

    fetchUserAndElections();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Loading your dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  const role = user?.role || 'voter';
  const isAdmin = role === 'admin' || role === 'superadmin';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome, <span className="font-medium text-gray-900">{user.fullName}</span> — {user.email}
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-gray-700">
              Role: <span className="font-semibold">{role}</span>
            </span>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Elections list */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Available Elections</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    View elections and cast your vote when active.
                  </p>
                </div>

                <span className="rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-700">
                  Total: {elections.length}
                </span>
              </div>

              <div className="mt-5">
                {loadingElections ? (
                  <p className="text-sm text-gray-600">Loading elections…</p>
                ) : elections.length === 0 ? (
                  <div className="rounded-xl border bg-slate-50 p-4">
                    <p className="text-sm text-gray-700">No elections available yet.</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Admins can create elections from the “Create Election” page.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {elections.map((election) => {
                      const status = election.status || 'upcoming';
                      const badge = badgeStyles[status] || badgeStyles.upcoming;

                      return (
                        <div
                          key={election._id}
                          className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">
                                {election.title}
                              </h3>
                              {election.description ? (
                                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                                  {election.description}
                                </p>
                              ) : (
                                <p className="mt-1 text-sm text-gray-500">No description provided.</p>
                              )}
                            </div>

                            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${badge}`}>
                              {status}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Candidates: {Array.isArray(election.candidates) ? election.candidates.length : 0}
                            </span>

                            <Link
                              to={`/elections/${election._id}`}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Side panel */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Quick Guide</h2>

              <div className="mt-3 space-y-3 text-sm text-gray-700">
                <div className="rounded-xl border bg-slate-50 p-3">
                  <p className="font-semibold text-gray-900">How voting works</p>
                  <p className="mt-1 text-gray-600">
                    You can vote only when an election is <span className="font-medium">active</span>. Once you vote,
                    you cannot vote again for that election.
                  </p>
                </div>

                <div className="rounded-xl border bg-slate-50 p-3">
                  <p className="font-semibold text-gray-900">Statuses</p>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li><span className="font-medium">upcoming</span> — not started</li>
                    <li><span className="font-medium">active</span> — voting open</li>
                    <li><span className="font-medium">closed</span> — voting ended</li>
                  </ul>
                </div>

                {isAdmin ? (
                  <div className="rounded-xl border bg-blue-50 p-3">
                    <p className="font-semibold text-blue-900">Admin note</p>
                    <p className="mt-1 text-blue-800">
                      You can create elections and control election status from the admin pages.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">Need help?</p>
                    <p className="mt-1 text-gray-600">
                      Contact the election committee or your departmental electoral officer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
