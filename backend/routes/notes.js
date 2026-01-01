const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const { summarizeText } = require('../utils/summarize');

const router = express.Router();

// 🔐 Protect all routes
router.use(auth);

// ===============================
// 📝 CREATE NOTE
// ===============================
router.post('/', async (req, res) => {
  try {
    const note = new Note({
      userId: req.userId,
      title: req.body.title,
      content: req.body.content,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 📄 GET NOTES
// ===============================
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🗑️ DELETE NOTE
// ===============================
router.delete('/:id', async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🤖 AI SUMMARIZE (FIXED)
// ===============================


router.post('/:id/summarize', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    let summary;

    try {
      summary = await summarizeText(note.content);
    } catch (aiError) {
      console.error('AI ERROR:', aiError.message);

      // 👇 graceful fallback (IMPORTANT)
      return res.status(200).json({
        summary: '⚠️ AI is currently busy. Please try again in a moment.',
      });
    }

    note.summary = summary;
    await note.save();

    res.json({ summary });
  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({
      summary: '⚠️ Internal server error. Try again later.',
    });
  }
});


module.exports = router;
