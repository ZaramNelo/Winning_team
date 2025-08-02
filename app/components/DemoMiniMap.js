'use client';

import { useState } from 'react';

export default function DemoMiniMap({ location }) {
  const [mapSize, setMapSize] = useState('medium'); 
  
  const getSizeConfig = () => {
    switch (mapSize) {
      case 'small':
        return { height: '150px' };
      case 'medium':
        return { height: '200px' };
      case 'large':
        return { height: '300px' };
      default:
        return { height: '200px' };
    }
  };

  const config = getSizeConfig();
  
  // Demo pharmacy data - in real app this would come from Google Places API
  const demoPharmacies = [
    { name: "CVS Pharmacy", distance: "0.2 miles", address: "123 Main St", phone: "(555) 123-4567", hours: "8AM-10PM" },
    { name: "Walgreens", distance: "0.4 miles", address: "456 Oak Ave", phone: "(555) 234-5678", hours: "7AM-11PM" },
    { name: "Rite Aid", distance: "0.6 miles", address: "789 Pine Rd", phone: "(555) 345-6789", hours: "9AM-9PM" },
    { name: "Local Pharmacy", distance: "0.8 miles", address: "321 Elm St", phone: "(555) 456-7890", hours: "9AM-6PM" }
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">🏥 Nearby Pharmacies</span>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            📍 {location}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMapSize('small')}
            className={`px-2 py-1 text-xs rounded transition-colors ${mapSize === 'small' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            title="Small view"
          >
            S
          </button>
          <button
            onClick={() => setMapSize('medium')}
            className={`px-2 py-1 text-xs rounded transition-colors ${mapSize === 'medium' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            title="Medium view"
          >
            M
          </button>
          <button
            onClick={() => setMapSize('large')}
            className={`px-2 py-1 text-xs rounded transition-colors ${mapSize === 'large' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            title="Large view"
          >
            L
          </button>
        </div>
      </div>
      
      {/* Map Content */}
      <div style={{ height: config.height, backgroundColor: '#f0f9ff' }} className="relative overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
          {/* Map Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          ></div>
          
          {/* Your Location Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
              📍
            </div>
            <div className="text-xs text-center mt-1 bg-white px-2 py-1 rounded shadow text-gray-700 font-medium">
              You
            </div>
          </div>
          
          {/* Pharmacy Markers */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg">
              🏥
            </div>
          </div>
          <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
            <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg">
              🏥
            </div>
          </div>
          <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg">
              🏥
            </div>
          </div>
          
          {/* Distance Rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="border border-blue-300 rounded-full w-20 h-20 opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-blue-300 rounded-full w-32 h-32 opacity-20"></div>
          </div>
        </div>
        
        {/* Open Full Map Button */}
        <div className="absolute top-2 right-2">
          <button 
            onClick={() => window.open(`https://www.google.com/maps/search/pharmacy+near+${encodeURIComponent(location)}`, '_blank')}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-600 p-2 rounded-lg shadow text-xs border border-blue-200 transition-all hover:shadow-md"
            title="Open in Google Maps"
          >
            🗺️ Full Map
          </button>
        </div>
      </div>
      
      {/* Pharmacy List */}
      <div className="max-h-40 overflow-y-auto">
        {demoPharmacies.slice(0, mapSize === 'large' ? 4 : mapSize === 'medium' ? 3 : 2).map((pharmacy, index) => (
          <div key={index} className="px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-800">{pharmacy.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {pharmacy.distance}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{pharmacy.address}</div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-green-600">🕒 {pharmacy.hours}</span>
                  <span className="text-xs text-blue-600">📞 {pharmacy.phone}</span>
                </div>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(pharmacy.name + ' ' + pharmacy.address)}`, '_blank')}
                className="text-blue-500 hover:text-blue-700 text-xs ml-2"
              >
                →
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Map Footer */}
      <div className="bg-gray-50 px-3 py-2 border-t">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>🏥 {demoPharmacies.length} pharmacies found</span>
          <a 
            href={`https://www.google.com/maps/search/pharmacy+near+${encodeURIComponent(location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All on Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}
