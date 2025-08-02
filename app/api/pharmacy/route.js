export async function POST(request) {
  try {
    const { latitude, longitude, address } = await request.json();
    
    let location = '';
    if (latitude && longitude) {
      location = `${latitude},${longitude}`;
    } else if (address) {
      location = address;
    } else {
      return Response.json({ error: 'Location (coordinates or address) is required' }, { status: 400 });
    }

    // Generate Google Maps search URL for nearby pharmacies
    const googleMapsUrl = `https://www.google.com/maps/search/pharmacy+near+${encodeURIComponent(location)}`;
    
    // Generate embedded map URL (you'll need to add your Google Maps API key to .env)
    const embedMapUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=pharmacy+near+${encodeURIComponent(location)}`;

    return Response.json({
      success: true,
      location: location,
      googleMapsUrl: googleMapsUrl,
      embedMapUrl: embedMapUrl,
      message: `Here are the nearest pharmacies to your location. Click the link to view on Google Maps.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error finding pharmacy:', error);
    return Response.json({
      success: false,
      error: 'Failed to find nearby pharmacies'
    }, { status: 500 });
  }
}
