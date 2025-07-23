// src/pages/user/TicketDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const TicketDetails = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');

  useEffect(() => {
    let unsubTicket;
    if (ticketId) {
      const ticketRef = doc(db, 'tickets', ticketId);
      unsubTicket = onSnapshot(ticketRef, (docSnap) => {
        if (docSnap.exists()) {
          setTicket({ id: docSnap.id, ...docSnap.data() });
        }
      });
      const commentsRef = collection(db, 'tickets', ticketId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      const unsubComments = onSnapshot(q, (snapshot) => {
        setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => {
        unsubTicket && unsubTicket();
        unsubComments && unsubComments();
      };
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticket && ticket.paymentStatus) setPaymentStatus(ticket.paymentStatus);
  }, [ticket]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'tickets', ticketId, 'comments'), {
        text: newComment,
        createdAt: serverTimestamp(),
        author: 'user', // Replace with user email if available
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handlePayment = async () => {
    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Razorpay SDK failed to load.');
      return;
    }
    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: 50000, // Amount in paise (e.g., 50000 = ₹500)
      currency: 'INR',
      name: 'ServiceDesk Ticket Payment',
      description: 'Premium Support Ticket',
      handler: async function (response) {
        // On payment success, update Firestore
        await updateDoc(doc(db, 'tickets', ticketId), {
          paymentStatus: 'paid',
          paymentId: response.razorpay_payment_id,
        });
        setPaymentStatus('paid');
      },
      prefill: {
        email: ticket?.userEmail,
      },
      theme: { color: '#6366f1' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  if (!ticket)
    return (
      <div className="text-white p-6">Ticket not found or invalid ID.</div>
    );

  return (
    <div className="flex">
      <Sidebar isAdmin={false} />
      <div className="flex-1 ml-64 p-6 bg-blue-900 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg space-y-2">
          <h2 className="text-2xl font-semibold">{ticket.subject}</h2>
          <p><strong>ID:</strong> {ticket.id}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Assigned Admin:</strong> {ticket.assignedAdmin || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(ticket.createdAt?.seconds * 1000).toLocaleString()}</p>
          <div className="mt-4">
            <p><strong>Payment Status:</strong> <span className={paymentStatus === 'paid' ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'}>{paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span></p>
            {paymentStatus !== 'paid' && (
              <button onClick={handlePayment} className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition">Pay Now</button>
            )}
          </div>
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
      </div>
    </div>
  );
};

export default TicketDetails;
