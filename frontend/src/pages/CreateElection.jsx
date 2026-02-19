import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createElection } from '../services/electionService';
import { getUserProfile } from '../services/authService';

const CreateElection = () => {
  const navigate = useNavigate();

  const [checkingRole, setCheckingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('upcoming');

  const [candidateName, setCandidateName] = useState('');
  const [candidates, setCandidates] = useState([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await getUserProfile();
        const role = res.data?.role;
        const admin = role === 'admin' || role === 'superadmin';
        setIsAdmin(admin);

        if (!admin) {
          alert('Access denied. Admins only.');
          navigate('/');
        }
      } catch (err) {
        alert('Please login again.');
        navigate('/login');
      } finally {
        setCheckingRole(false);
      }
    };

    checkRole();
  }, [navigate]);

  const addCandidate = () => {
    const name = candidateName.trim();
    if (!name) return;

    setCandidates((prev) => [...prev, { name }]);
    setCandidateName('');
  };

  const removeCandidate = (index) => {
    setCandidates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return alert('Title is required');
    }

    if (candidates.length === 0) {
      return alert('Add at least one candidate');
    }

    try {
      setSaving(true);

      await createElection({
        title: title.trim(),
        description: description.trim(),
        status,
        candidates
      });

      alert('Election created successfully');
      navigate('/'); // back to elections list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create election');
    } finally {
      setSaving(false);
    }
  };

  if (checkingRole) return <p>Checking access...</p>;
  if (!isAdmin) return null;

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2>Create Election (Admin)</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Title
            <input
              style={{ width: '100%', padding: 8, display: 'block', marginTop: 6 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SUG Election 2026"
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Description
            <textarea
              style={{ width: '100%', padding: 8, display: 'block', marginTop: 6 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Status
            <select
              style={{ width: '100%', padding: 8, display: 'block', marginTop: 6 }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="upcoming">upcoming</option>
              <option value="active">active</option>
              <option value="closed">closed</option>
            </select>
          </label>
        </div>

        <hr style={{ margin: '16px 0' }} />

        <h3>Candidates</h3>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            style={{ flex: 1, padding: 8 }}
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Candidate name"
          />
          <button type="button" onClick={addCandidate}>
            Add
          </button>
        </div>

        {candidates.length === 0 ? (
          <p>No candidates added yet.</p>
        ) : (
          <ul>
            {candidates.map((c, idx) => (
              <li key={`${c.name}-${idx}`} style={{ marginBottom: 8 }}>
                {c.name}{' '}
                <button type="button" onClick={() => removeCandidate(idx)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Create Election'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateElection;
