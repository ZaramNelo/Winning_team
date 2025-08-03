export async function GET() {
  return new Response('Pharmacy API is working');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { latitude, longitude, address } = body;
    
    let location = '';
    if (latitude && longitude) {
      location = `${latitude},${longitude}`;
    } else if (address) {
      location = address;
    } else {
      return new Response(JSON.stringify({ error: 'Location required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate Google Maps URLs
    const googleMapsUrl = `https://www.google.com/maps/search/pharmacy+near+${encodeURIComponent(location)}`;
    const embedMapUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.GOOGLE_MAPS_API_KEY}&q=pharmacy+near+${encodeURIComponent(location)}&zoom=14`;

    let pharmacies = [];

    // Try to get real pharmacy data using Google Places API
    if (latitude && longitude && process.env.GOOGLE_MAPS_API_KEY) {
      try {
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=pharmacy&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        
        console.log('Fetching from Google Places API:', placesUrl);
        const placesResponse = await fetch(placesUrl);
        const placesData = await placesResponse.json();

        if (placesData.status === 'OK' && placesData.results) {
          pharmacies = placesData.results.slice(0, 10).map(place => {
            // Calculate distance (approximate)
            const distance = calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng);
            
            return {
              name: place.name,
              address: place.vicinity || place.formatted_address || 'Address not available',
              distance: `${distance.toFixed(1)} miles`,
              phone: place.formatted_phone_number || 'Phone not available',
              hours: place.opening_hours?.open_now ? 'Open now' : 'Hours not available',
              rating: place.rating || 'No rating',
              isOpen: place.opening_hours?.open_now || false,
              placeId: place.place_id,
              location: place.geometry.location
            };
          });

          console.log(`Found ${pharmacies.length} real pharmacies via Google Places API`);
        } else {
          console.log('Google Places API returned:', placesData.status, placesData.error_message);
        }
      } catch (error) {
        console.error('Error fetching from Google Places API:', error);
      }
    }

    // Fallback to mock data if no real data was found
    if (pharmacies.length === 0) {
      console.log('Using fallback mock data');
      pharmacies = [
        {
          name: "CVS Pharmacy",
          address: "123 Main St",
          distance: "0.2 miles",
          phone: "(555) 123-4567",
          hours: "8AM-10PM",
          rating: 4.2,
          isOpen: true
        },
        {
          name: "Walgreens",
          address: "456 Oak Ave",
          distance: "0.4 miles", 
          phone: "(555) 234-5678",
          hours: "7AM-11PM",
          rating: 4.5,
          isOpen: true
        },
        {
          name: "Rite Aid",
          address: "789 Pine Rd",
          distance: "0.6 miles",
          phone: "(555) 345-6789", 
          hours: "9AM-9PM",
          rating: 4.1,
          isOpen: true
        },
        {
          name: "Local Pharmacy",
          address: "321 Elm St",
          distance: "0.8 miles",
          phone: "(555) 456-7890",
          hours: "9AM-6PM", 
          rating: 4.7,
          isOpen: false
        }
      ];
    }

    const result = {
      success: true,
      location: location,
      googleMapsUrl: googleMapsUrl,
      embedMapUrl: embedMapUrl,
      pharmacies: pharmacies,
      message: `Found ${pharmacies.length} pharmacies near your location.`,
      timestamp: new Date().toISOString(),
      dataSource: pharmacies.length > 0 && pharmacies[0].placeId ? 'Google Places API' : 'Mock Data'
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error finding pharmacy:', error);
    return new Response(JSON.stringify({ error: 'Failed to find nearby pharmacies' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}
