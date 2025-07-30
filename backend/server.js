console.log('SERVER.JS STARTED');
console.log('About to require journal routes...');
const journalRoutes = require('./routes/journal');
console.log('Journal routes required!');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/journal', journalRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// connect to MongoDB
const mongoUri = 'mongodb://localhost:27017/hiddenStruggles';
mongoose.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
