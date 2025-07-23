// src/pages/user/TicketForm.js
import React, { useState } from 'react';
import { db, auth } from './../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const TicketForm = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('IT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl text-slate-800 shadow-lg border border-slate-100 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Create New Ticket</h2>
      {error && <p className="text-rose-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 rounded border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <textarea
          placeholder="Describe your issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows="5"
          required
        />
        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>IT</option>
            <option>Finance</option>
            <option>HR</option>
            <option>General</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg text-white flex items-center justify-center font-semibold text-lg transition"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Ticket'
          )}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
