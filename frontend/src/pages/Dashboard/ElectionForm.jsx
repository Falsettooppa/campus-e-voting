import { useState, useEffect } from 'react';
import { createElection, updateElection, getElectionById } from '../../services/electionService';

function ElectionForm({ electionId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  // If editing, fetch existing election data
  useEffect(() => {
    if (electionId) {
      const fetchElection = async () => {
        try {
          const data = await getElectionById(electionId);
          setFormData({
            title: data.title,
            description: data.description,
            startDate: data.startDate.slice(0, 16), // for datetime-local input
            endDate: data.endDate.slice(0, 16)
          });
        } catch (error) {
          console.error('Failed to fetch election:', error);
        }
      };
      fetchElection();
    }
  }, [electionId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (electionId) {
        await updateElection(electionId, formData);
      } else {
        await createElection(formData);
      }
      onSuccess(); // Refresh dashboard
    } catch (error) {
      console.error('Failed to save election:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{electionId ? 'Edit Election' : 'Create Election'}</h3>
      <div>
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Start Date:</label>
        <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
      </div>
      <div>
        <label>End Date:</label>
        <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required />
      </div>
      <button type="submit">{electionId ? 'Update' : 'Create'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default ElectionForm;
