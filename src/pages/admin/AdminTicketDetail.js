// src/pages/admin/AdminTicketDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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
    if (id) {
      const commentsRef = collection(db, 'tickets', id, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [id]);

  const handleStatusChange = async () => {
    try {
      await updateDoc(doc(db, 'tickets', id), { status });
      alert('Status updated successfully.');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'tickets', id, 'comments'), {
        text: newComment,
        createdAt: new Date(),
        author: 'admin', // Replace with admin email if available
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) return <p className="text-indigo-600 text-center text-lg mt-10">Loading ticket...</p>;
  if (!ticket) return <p className="text-rose-500 text-center text-lg mt-10">Ticket not found.</p>;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">Ticket Details</h1>
        <div className="bg-white p-8 rounded-xl shadow border border-slate-100">
          <p className="mb-2"><strong>Subject:</strong> <span className="text-slate-800">{ticket.subject}</span></p>
          <p className="mb-2"><strong>Description:</strong> <span className="text-slate-700">{ticket.description}</span></p>
          <p className="mb-2"><strong>Category:</strong> {ticket.category}</p>
          <p className="mb-2"><strong>Priority:</strong> {ticket.priority}</p>
          <p className="mb-2"><strong>Status:</strong> <span className={`font-semibold ${
            ticket.status === 'resolved' || ticket.status === 'Resolved'
              ? 'text-emerald-600'
              : ticket.status === 'in progress' || ticket.status === 'In Progress'
              ? 'text-indigo-500'
              : 'text-rose-500'
          }`}>{ticket.status}</span></p>
          <p className="mb-2"><strong>User:</strong> {ticket.userEmail}</p>
          <p className="mb-4"><strong>Created:</strong> {ticket.createdAt?.seconds ? new Date(ticket.createdAt.seconds * 1000).toLocaleString() : ''}</p>

          <div className="mt-4 flex items-center gap-4">
            <label htmlFor="status" className="block font-semibold mb-1">Update Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-100 text-slate-800 px-4 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={handleStatusChange}
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg text-white font-semibold transition ml-2"
            >
              Save
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">Comments</h2>
            <div className="bg-slate-100 rounded p-4 mb-4 max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-slate-400">No comments yet.</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="mb-2">
                    <span className="font-semibold text-slate-700">{comment.author}:</span> <span className="text-slate-600">{comment.text}</span>
                    <span className="text-xs text-slate-400 ml-2">{comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleString() : ''}</span>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="flex-1 p-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Add a comment..."
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Send</button>
            </form>
          </div>

          <button
            onClick={() => navigate('/admin/all-tickets')}
            className="mt-8 text-sm text-indigo-600 underline hover:text-indigo-800"
          >
            ← Back to All Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetails;
