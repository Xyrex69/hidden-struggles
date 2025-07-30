console.log('JOURNAL.JS LOADED');
const express = require('express');
const router  = express.Router();
const JournalEntry = require('../models/JournalEntry');

// GET /api/journal - Retrieve all approved entries (most recent first)
router.get('/', async (req, res) => {
  try {
    const entries = await JournalEntry.find({ approved: true }).sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/journal/pending - Retrieve all pending (unapproved) entries
router.get('/pending', async (req, res) => {
  try {
    const pending = await JournalEntry.find({ approved: false });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/journal/:id - Approve or deny a journal entry
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let update = {};
    if (status === 'approved') {
      update.approved = true;
    } else if (status === 'denied') {
      update.approved = false; // or handle deletion in another route
    }

    const entry = await JournalEntry.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
    );

    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/journal/:id - Permanently delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    const result = await JournalEntry.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new entry
router.post('/', async (req, res) => {
  const { text, tag } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  try {
    const entry = new JournalEntry({ text, tag });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const entries = await JournalEntry.find().exec();
    res.json(entries);
  } catch (error) {
    console.error('Failed to fetch all journal entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
