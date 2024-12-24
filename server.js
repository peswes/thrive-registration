const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for simplicity (using an array)
const volunteers = [];

// Route to get all volunteers (optional, for debugging)
app.get('/volunteers', (req, res) => {
  res.json(volunteers);
});

// Route to register a volunteer
app.post('/volunteers', (req, res) => {
  const { name, ageGroup, email, phone, whyJoining } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !ageGroup || !whyJoining) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validate age group
  const validAgeGroups = ['18-25', '26-35', '36-45', '46-55', '56-65', '66-70'];
  if (!validAgeGroups.includes(ageGroup)) {
    return res.status(400).json({ message: 'Invalid age group selected.' });
  }

  // Check for duplicate email or phone number
  const existingVolunteer = volunteers.find(volunteer => volunteer.email === email || volunteer.phone === phone);
  if (existingVolunteer) {
    return res.status(400).json({ message: 'You have already registered with this email or phone number.' });
  }

  // Save the new volunteer
  volunteers.push({ name, ageGroup, email, phone, whyJoining, date: new Date() });
  res.status(201).json({ message: 'Registration successful!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
