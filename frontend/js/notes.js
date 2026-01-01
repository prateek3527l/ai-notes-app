// =====================================
// 🔐 AUTH CHECK
// =====================================
const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

// =====================================
// 🎯 DOM ELEMENTS
// =====================================
const notesGrid = document.getElementById('notesGrid');
const noteForm = document.getElementById('noteForm');
const logoutBtn = document.getElementById('logoutBtn');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

// =====================================
// 🚪 LOGOUT
// =====================================
logoutBtn.onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
};

// =====================================
// 📥 FETCH NOTES
// =====================================
async function fetchNotes() {
  try {
    const notes = await apiRequest('/api/notes');
    renderNotes(notes);
  } catch (err) {
    console.error('Fetch notes failed:', err);
  }
}

// =====================================
// 🎨 RENDER NOTES
// =====================================
function renderNotes(notes) {
  notesGrid.innerHTML = '';

  if (!notes || notes.length === 0) {
    window.updateNotesUI(notes);
    return;
  }

  notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';

    card.innerHTML = `
      <div class="note-card-header">
        <h3 class="note-title">${escapeHTML(note.title)}</h3>
        <div class="note-actions">
          <button
            class="btn-icon btn-delete"
            onclick="deleteNote('${note._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div class="note-content-preview">
        <p>${escapeHTML(note.content)}</p>
      </div>

      ${
        note.summary
          ? `
            <div class="note-summary">
              <strong>🤖 AI Summary</strong>
              <p>${escapeHTML(note.summary)}</p>
            </div>
          `
          : `
            <button
              class="btn-secondary"
              onclick="summarizeNote('${note._id}', this)">
              🤖 Summarize
            </button>
          `
      }
    `;

    notesGrid.appendChild(card);
  });

  window.updateNotesUI(notes);
}

// =====================================
// ➕ CREATE NOTE
// =====================================
noteForm.onsubmit = async e => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert('Title and content are required');
    return;
  }

  try {
    await apiRequest('/api/notes', 'POST', { title, content });
    noteForm.reset();
    fetchNotes();
  } catch (err) {
    console.error('Create note failed:', err);
  }
};

// =====================================
// 🗑️ DELETE NOTE
// =====================================
async function deleteNote(id) {
  if (!confirm('Delete this note?')) return;

  try {
    await apiRequest(`/api/notes/${id}`, 'DELETE');
    fetchNotes();
  } catch (err) {
    console.error('Delete failed:', err);
  }
}

// =====================================
// 🤖 AI SUMMARIZE (FINAL FIXED VERSION)
// =====================================
async function summarizeNote(id, button) {
  try {
    button.disabled = true;
    button.textContent = 'Summarizing...';

    const res = await apiRequest(`/api/notes/${id}/summarize`, 'POST');

    console.log('📦 AI RESPONSE:', res);

    if (!res || !res.summary) {
      throw new Error('Summary missing');
    }

    // Reload notes to show saved summary
    fetchNotes();

  } catch (err) {
    console.error('Summarize failed:', err);
    alert('AI summarization failed. Try again later.');
    button.disabled = false;
    button.textContent = '🤖 Summarize';
  }
}

// =====================================
// 🛠️ UTILS
// =====================================
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// =====================================
// 🚀 INIT
// =====================================
document.addEventListener('DOMContentLoaded', fetchNotes);
