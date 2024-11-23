const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const port = 3000;
const apiKey = 'YOUR_GOOGLE_API_KEY';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/placesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model
const placeSchema = new mongoose.Schema({
  name: String,
  vicinity: String,
  type: String,
  timestamp: { type: Date, default: Date.now },
});
const Place = mongoose.model('Place', placeSchema);

// API Route
app.get('/places', async (req, res) => {
  const { type, location } = req.query; // Get type and location from the query
  const radius = 5000;

  try {
    // Check the database
    const cachedPlaces = await Place.find({ type });
    if (cachedPlaces.length) {
      return res.json(cachedPlaces); // Send cached data
    }

    // Fetch from Google API if not cached
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
    const response = await axios.get(url);
    const places = response.data.results.map((place) => ({
      name: place.name,
      vicinity: place.vicinity,
      type,
    }));

    // Save to database
    await Place.insertMany(places);

    res.json(places); // Send fetched data
  } catch (error) {
    res.status(500).send('Error fetching places');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
