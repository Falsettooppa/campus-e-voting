import { useEffect, useState } from 'react';
import { getAllElections, deleteElection } from '../../services/electionService';
import ElectionForm from './ElectionForm';

function ElectionDashboard() {
  const [elections, setElections] = useState([]);
  const [editingElection, setEditingElection] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchElections = async () => {
    try {
      const data = await getAllElections();
      setElections(data);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      await deleteElection(id);
      fetchElections();
    }
  };

  const handleEdit = (id) => {
    setEditingElection(id);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingElection(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchElections();
  };

  const handleCancel = () => setShowForm(false);

  return (
    <div>
      <h2>Election Dashboard</h2>
      {!showForm && <button onClick={handleCreate}>Create New Election</button>}
      {showForm && (
        <ElectionForm
          electionId={editingElection}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}
      {!showForm && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {elections.map(e => (
              <tr key={e._id}>
                <td>{e.title}</td>
                <td>{new Date(e.startDate).toLocaleString()}</td>
                <td>{new Date(e.endDate).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(e._id)}>Edit</button>
                  <button onClick={() => handleDelete(e._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ElectionDashboard;
