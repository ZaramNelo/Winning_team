'use client';

import { useState } from 'react';

export default function MiniMap({ location, onClose }) {
  const [mapSize, setMapSize] = useState('small'); // small, medium, large
  
  const getSizeConfig = () => {
    switch (mapSize) {
      case 'small':
        return { width: '100%', height: '150px', zoom: 13 };
      case 'medium':
        return { width: '100%', height: '250px', zoom: 14 };
      case 'large':
        return { width: '100%', height: '350px', zoom: 15 };
      default:
        return { width: '100%', height: '200px', zoom: 14 };
    }
  };

  const config = getSizeConfig();
  
  // Fallback map URL without API key for demo purposes
  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=demo&q=pharmacy+near+${encodeURIComponent(location)}&zoom=${config.zoom}`;
  
  // Alternative: Use Google Maps static API for better performance
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(location)}&zoom=${config.zoom}&size=400x${config.height.replace('px', '')}&markers=color:red%7C${encodeURIComponent(location)}&key=demo`;

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Map Header */}
      <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">📍 Nearby Pharmacies</span>
          <span className="text-xs text-gray-500">({location})</span>
        </div>
        <div className="flex items-center space-x-1">
          {/* Size Toggle Buttons */}
          <button
            onClick={() => setMapSize('small')}
            className={`px-2 py-1 text-xs rounded ${mapSize === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            title="Small map"
          >
            S
          </button>
          <button
            onClick={() => setMapSize('medium')}
            className={`px-2 py-1 text-xs rounded ${mapSize === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            title="Medium map"
          >
            M
          </button>
          <button
            onClick={() => setMapSize('large')}
            className={`px-2 py-1 text-xs rounded ${mapSize === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            title="Large map"
          >
            L
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-600 text-lg"
              title="Close map"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Map Content */}
      <div className="relative">
        <iframe
          width={config.width}
          height={config.height}
          frameBorder="0"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Pharmacy Locations Map"
          onError={(e) => {
            console.log('Map loading error, showing fallback');
            // Fallback to static map
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        ></iframe>
        
        {/* Fallback Static Map */}
        <div 
          style={{ 
            display: 'none', 
            width: config.width, 
            height: config.height,
            backgroundImage: `url(${staticMapUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="bg-gray-100 flex items-center justify-center"
        >
          <div className="text-center text-gray-600">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm">Map Preview</div>
            <div className="text-xs text-gray-500 mt-1">Location: {location}</div>
          </div>
        </div>
        
        {/* Map Overlay Controls */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          <button 
            onClick={() => window.open(`https://www.google.com/maps/search/pharmacy+near+${encodeURIComponent(location)}`, '_blank')}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-1 rounded shadow text-xs border"
            title="Open in Google Maps"
          >
            🔗
          </button>
        </div>
      </div>
      
      {/* Map Footer */}
      <div className="bg-gray-50 px-3 py-2 border-t">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>🏥 Pharmacies nearby</span>
          <a 
            href={`https://www.google.com/maps/search/pharmacy+near+${encodeURIComponent(location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Full Map →
          </a>
        </div>
      </div>
    </div>
  );
}
