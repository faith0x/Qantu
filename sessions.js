// Simple in-memory session store.
// Replace with Supabase/Postgres/Redis once you move past testing —
// this resets every time the server restarts.

const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      userId,
      channel: null,        // 'whatsapp' | 'instagram'
      messages: [],          // conversation history for Claude context
      status: 'active',      // 'active' | 'awaiting_owner' | 'handed_off' | 'completed'
      createdAt: new Date().toISOString(),
    });
  }
  return sessions.get(userId);
}

function updateSession(userId, updates) {
  const session = getSession(userId);
  Object.assign(session, updates);
  sessions.set(userId, session);
  return session;
}

function addMessage(userId, role, content) {
  const session = getSession(userId);
  session.messages.push({ role, content, timestamp: new Date().toISOString() });
  sessions.set(userId, session);
  return session;
}

module.exports = { getSession, updateSession, addMessage };

