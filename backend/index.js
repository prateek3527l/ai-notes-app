require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// 🔐 ADD THESE LINES ⬇⬇⬇
const auth = require('./middleware/auth');

app.get('/api/protected', auth, (req, res) => {
  res.json({
    message: 'Access granted',
    userId: req.userId,
  });
});
// 🔐 ADD THESE LINES ⬆⬆⬆

// database + server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection failed ❌', err));
