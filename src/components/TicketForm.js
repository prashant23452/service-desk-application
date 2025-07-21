// src/pages/user/TicketForm.js
import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const TicketForm = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('IT');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'tickets'), {
        subject,
        description,
        priority,
        category,
        status: 'Open',
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('Failed to create ticket. Try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-blue-800 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Create New Ticket</h2>
      {error && <p className="text-red-400 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 rounded bg-blue-900 border border-blue-600"
          required
        />
        <textarea
          placeholder="Describe your issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-blue-900 border border-blue-600"
          rows="5"
          required
        />
        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 bg-blue-900 border border-blue-600 rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 bg-blue-900 border border-blue-600 rounded"
          >
            <option>IT</option>
            <option>Finance</option>
            <option>HR</option>
            <option>General</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
