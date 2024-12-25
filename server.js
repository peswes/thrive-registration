
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file where data will be stored
const volunteersFilePath = path.join(__dirname, 'volunteers.json');

// Helper function to read data from the JSON file
function readVolunteersFromFile() {
  if (fs.existsSync(volunteersFilePath)) {
    const data = fs.readFileSync(volunteersFilePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Helper function to write data to the JSON file
function writeVolunteersToFile(volunteers) {
  fs.writeFileSync(volunteersFilePath, JSON.stringify(volunteers, null, 2), 'utf8');
}

// Route to get all volunteers (optional, for debugging)
app.get('/volunteers', (req, res) => {
  const volunteers = readVolunteersFromFile();
  res.json(volunteers);
});

// Route to register a volunteer
app.post('/volunteers', (req, res) => {
  const { name, email, phone, ageGroup, whyJoining } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !ageGroup || !whyJoining) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validate age group
  const validAgeGroups = ['18-25', '26-35', '36-45', '46-55', '56-65', '66-70'];
  if (!validAgeGroups.includes(ageGroup)) {
    return res.status(400).json({ message: 'Invalid age group selected.' });
  }

  // Read existing volunteers from the file
  const volunteers = readVolunteersFromFile();

  // Check for duplicate email or phone number
  const existingVolunteer = volunteers.find(volunteer => volunteer.email === email || volunteer.phone === phone);
  if (existingVolunteer) {
    return res.status(400).json({ message: 'You have already registered with this email or phone number.' });
  }

  // Create new volunteer and add to the list
  const newVolunteer = { name, email, phone, ageGroup, whyJoining, date: new Date() };
  volunteers.push(newVolunteer);

  // Write the updated volunteers list to the file
  writeVolunteersToFile(volunteers);

  res.status(201).json({ message: 'Registration successful!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
