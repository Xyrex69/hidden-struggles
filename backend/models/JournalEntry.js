const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
  text: { type: String, required: true },
  tag: String,
  approved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema); 