const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables from the .env file in the root directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { handleChatRequest } = require('./controllers/chatController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.post('/api/chat', handleChatRequest);

// New route for pharmacy recommendations
app.post('/api/find-pharmacy', async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    
    let location = '';
    if (latitude && longitude) {
      location = `${latitude},${longitude}`;
    } else if (address) {
      location = address;
    } else {
      return res.status(400).json({ error: 'Location (coordinates or address) is required' });
    }

    // Generate Google Maps search URL for nearby pharmacies
    const googleMapsUrl = `https://www.google.com/maps/search/pharmacy+near+${encodeURIComponent(location)}`;
    
    // Generate embedded map URL
    const embedMapUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=pharmacy+near+${encodeURIComponent(location)}`;

    res.json({
      success: true,
      location: location,
      googleMapsUrl: googleMapsUrl,
      embedMapUrl: embedMapUrl,
      message: `Here are the nearest pharmacies to your location. Click the link to view on Google Maps.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error finding pharmacy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find nearby pharmacies'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ChatGPT API service is running' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to use the ChatGPT interface`);
});
