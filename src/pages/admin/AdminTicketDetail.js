// src/pages/admin/AdminTicketDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketRef = doc(db, 'tickets', id);
        const ticketSnap = await getDoc(ticketRef);

        if (ticketSnap.exists()) {
          const data = ticketSnap.data();
          setTicket(data);
          setStatus(data.status || 'open');
        } else {
          console.error('No such ticket!');
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      await updateDoc(doc(db, 'tickets', id), { status });
      alert('Status updated successfully.');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <p className="text-white text-center">Loading ticket...</p>;
  if (!ticket) return <p className="text-white text-center">Ticket not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>

      <div className="bg-blue-800 p-6 rounded shadow">
        <p><strong>Subject:</strong> {ticket.subject}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>User:</strong> {ticket.userEmail}</p>
        <p><strong>Created:</strong> {new Date(ticket.createdAt?.seconds * 1000).toLocaleString()}</p>

        <div className="mt-4">
          <label htmlFor="status" className="block font-semibold mb-1">Update Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={handleStatusChange}
            className="ml-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

        <button
          onClick={() => navigate('/admin/all-tickets')}
          className="mt-6 text-sm text-blue-300 underline hover:text-blue-100"
        >
          ← Back to All Tickets
        </button>
      </div>
    </div>
  );
};

export default AdminTicketDetails;
