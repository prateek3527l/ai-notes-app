const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

/*
  🔐 AUTH MIDDLEWARE
  -----------------
  All routes below this line are protected.
  A valid JWT token is REQUIRED in the Authorization header.
*/
router.use(auth);

/*
  📝 CREATE NOTE
  POST /api/notes
  Creates a new note for the logged-in user
*/
router.post('/', async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const note = new Note({
      userId: req.userId, // comes from JWT middleware
      title,
      content,
      tags,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  📄 GET ALL NOTES
  GET /api/notes
  Returns only the notes that belong to the logged-in user
*/
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  ✏️ UPDATE NOTE
  PUT /api/notes/:id
  Updates a note ONLY if it belongs to the logged-in user
*/
router.put('/:id', async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content, tags },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  🗑️ DELETE NOTE
  DELETE /api/notes/:id
  Deletes a note ONLY if it belongs to the logged-in user
*/
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================================================================
   🤖 AI SUMMARIZATION ROUTE (TEMPORARILY DISABLED)
   ===================================================================

   Why is this commented out?
   ---------------------------
   • OpenAI API returned `insufficient_quota` (billing not enabled)
   • Core backend (auth + notes) must remain stable
   • We don’t want external services blocking frontend work

   This is a PROFESSIONAL decision, not a hack.

   How to re-enable later?
   ----------------------
   1. Enable OpenAI billing or add credits
   2. Install OpenAI SDK (already done earlier)
   3. Uncomment this block
   4. Restart server

   Route behavior (when enabled):
   ------------------------------
   POST /api/notes/:id/summarize
   • Requires JWT
   • Uses note content
   • Generates AI summary
   • Saves summary in MongoDB
*/

/*
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/:id/summarize', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Summarize this note in short bullet points:\n\n${note.content}`,
    });

    note.summary = completion.output_text;
    await note.save();

    res.json({
      message: 'Note summarized successfully',
      summary: note.summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI summarization failed' });
  }
});
*/

module.exports = router;
