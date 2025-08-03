'use client';

import { useState, useEffect } from 'react';

export default function PharmacyFinder({ isOpen, onClose, initialLocation }) {
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(initialLocation || null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState('');

  // Automatically find pharmacies when initialLocation is provided
  useEffect(() => {
    if (initialLocation && isOpen) {
      setUserLocation(initialLocation);
      setLocation(`${initialLocation.latitude.toFixed(4)}, ${initialLocation.longitude.toFixed(4)}`);
      // Auto-search for pharmacies
      findNearbyPharmacies(initialLocation);
    }
  }, [initialLocation, isOpen]);

  const findNearbyPharmacies = async (locationData = userLocation) => {
    const targetLocation = locationData || userLocation;
    
    if (!targetLocation && !location.trim()) {
      setError('Please provide a location or allow GPS access.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const requestBody = targetLocation 
        ? { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
        : { address: location.trim() };

      const response = await fetch('/api/pharmacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);

      if (data.success) {
        setPharmacies(data.pharmacies);
        setMapData({
          embedMapUrl: data.embedMapUrl,
          googleMapsUrl: data.googleMapsUrl,
          location: data.location
        });
      } else {
        setError(data.error || 'Failed to find pharmacies');
      }
    } catch (error) {
      if (error.message.includes('JSON')) {
        setError('Server returned invalid data. Please try again.');
      } else {
        setError('Failed to find nearby pharmacies. Please try again.');
      }
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    setIsGettingLocation(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(coords);
          setIsGettingLocation(false);
          setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
        },
        (error) => {
          setIsGettingLocation(false);
          setError('Location access denied. Please enter your address manually.');
          console.error('Error getting location:', error);
        }
      );
    } else {
      setIsGettingLocation(false);
      setError('Geolocation is not supported by this browser.');
    }
  };

  const resetState = () => {
    setLocation('');
    setUserLocation(null);
    setPharmacies([]);
    setMapData(null);
    setError('');
    setIsLoading(false);
    setIsGettingLocation(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center bg-black/50 justify-center z-50 p-4">
      {/* Modal content */}
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Find Nearby Pharmacies
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* Location Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Your Location
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your address or zip code..."
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              <button
                onClick={getUserLocation}
                disabled={isGettingLocation}
                className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isGettingLocation ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Getting Location...
                  </div>
                ) : (
                  'Use GPS'
                )}
              </button>
            </div>

            <button
              onClick={() => findNearbyPharmacies()}
              disabled={isLoading || (!userLocation && !location.trim())}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Finding Pharmacies...
                </div>
              ) : (
                'Find Pharmacies'
              )}
            </button>
          </div>

          {/* Results Section */}
          {mapData && pharmacies.length > 0 && (
            <div className="space-y-6">
              {/* Map Section */}
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Map View
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Location: {mapData.location}</p>
                </div>
                
                <div className="relative">
                  <iframe
                    src={mapData.embedMapUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Pharmacy Locations Map"
                    className="w-full"
                  ></iframe>
                  
                  <div className="absolute top-2 right-2">
                    <a
                      href={mapData.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-gray-50 text-blue-600 px-3 py-2 rounded-md shadow text-sm font-medium transition-all hover:shadow-lg border border-gray-200"
                    >
                      Open Full Map
                    </a>
                  </div>
                </div>
              </div>

              {/* Pharmacy List */}
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Nearby Pharmacies ({pharmacies.length})
                  </h3>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {pharmacies.map((pharmacy, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {pharmacy.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {pharmacy.isOpen ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              Open
                            </span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                              Closed
                            </span>
                          )}
                          <span className="text-blue-600 font-medium text-sm">
                            {pharmacy.distance}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {pharmacy.address}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {pharmacy.phone}
                          </p>
                          
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {pharmacy.hours}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{pharmacy.rating}/5.0</span>
                          </div>
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(pharmacy.name + ' ' + pharmacy.address)}`, '_blank')}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Get Directions →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!mapData && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-6">
                <svg
                  className="mx-auto h-20 w-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Find Nearby Pharmacies
              </h3>
              <p className="text-gray-500">
                Enter your location above to discover drug stores and pharmacies near you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
