'use client';

import { useState, useRef, useEffect } from 'react';
import DemoMiniMap from '../components/DemoMiniMap';

export default function Chat() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your medical assistant. You can describe symptoms for medical advice, ask general questions, or find nearby pharmacies. For symptoms, please check the 'Medical Query' option below.", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMedicalQuery, setIsMedicalQuery] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          setIsGettingLocation(false);
          setMessages(prev => [...prev, { text: `📍 Location detected successfully! Ready to find nearby pharmacies.`, isUser: false, isSystem: true }]);
        },
        (error) => {
          setIsGettingLocation(false);
          setMessages(prev => [...prev, { text: `❌ Location access denied. You can manually enter your address to find nearby pharmacies.`, isUser: false, isSystem: true }]);
          console.error('Error getting location:', error);
        }
      );
    } else {
      setIsGettingLocation(false);
      setMessages(prev => [...prev, { text: `❌ Geolocation is not supported by this browser. You can manually enter your address to find nearby pharmacies.`, isUser: false, isSystem: true }]);
    }
  };

  const findNearbyPharmacy = async () => {
    if (!userLocation && !inputMessage.trim()) {
      setMessages(prev => [...prev, { text: `Please either allow location access or enter your address in the message box to find nearby pharmacies.`, isUser: false, isSystem: true }]);
      return;
    }

    setIsLoading(true);
    
    try {
      const requestBody = userLocation 
        ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
        : { address: inputMessage.trim() };

      const response = await fetch('/api/pharmacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        const pharmacyMessage = `🏥 **Nearby Pharmacies Found!**\n\n📍 Location: ${data.location}\n\n🗺️ [View on Google Maps](${data.googleMapsUrl})\n\nClick the link above to see pharmacy locations, hours, and contact information.`;
        setMessages(prev => [...prev, { 
          text: pharmacyMessage, 
          isUser: false, 
          isPharmacy: true,
          location: data.location,
          googleMapsUrl: data.googleMapsUrl,
          embedMapUrl: data.embedMapUrl
        }]);
      } else {
        setMessages(prev => [...prev, { text: 'Error: ' + data.error, isUser: false }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Error: Failed to find nearby pharmacies. Please try again.', isUser: false }]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          isSymptomQuery: isMedicalQuery 
        }),
      });

      const data = await response.json();

      if (data.success) {
        const responseText = data.type === 'medical' 
          ? `🏥 **Medical Information**\n\n${data.response}\n\n⚠️ **Disclaimer**: This information is for educational purposes only. Always consult with a healthcare professional for proper medical advice.`
          : data.response;
        setMessages(prev => [...prev, { text: responseText, isUser: false, isMedical: data.type === 'medical' }]);
      } else {
        setMessages(prev => [...prev, { text: 'Error: ' + data.error, isUser: false }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Error: Failed to send message. Please check your connection.', isUser: false }]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          ChatGPT Interface
        </h1>
        
        {/* Chat Container */}
        <div 
          ref={chatContainerRef} 
          className="bg-white border border-gray-200 rounded-lg shadow-md h-96 overflow-y-auto p-4 mb-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${message.isPharmacy ? 'max-w-md lg:max-w-lg' : 'max-w-xs lg:max-w-md'} px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : message.isMedical
                    ? 'bg-green-50 border border-green-200 text-gray-800 rounded-bl-none'
                    : message.isPharmacy
                    ? 'bg-blue-50 border border-blue-200 text-gray-800 rounded-bl-none'
                    : message.isSystem
                    ? 'bg-yellow-50 border border-yellow-200 text-gray-800 rounded-bl-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">
                  {message.text}
                </div>
                
                {/* Mini Map Display */}
                {message.isPharmacy && message.location && (
                  <div className="mt-3">
                    <DemoMiniMap 
                      location={message.location}
                    />
                  </div>
                )}
                
                {message.googleMapsUrl && (
                  <div className="mt-2 space-y-1">
                    <a 
                      href={message.googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors mr-2"
                    >
                      🗺️ Open Full Map
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-600 rounded-bl-none animate-pulse">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="ml-2">ChatGPT is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="space-y-3">
          {/* Pharmacy Finding Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={getUserLocation}
              disabled={isGettingLocation || isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              {isGettingLocation ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Getting Location...</span>
                </div>
              ) : (
                '📍 Get My Location'
              )}
            </button>
            
            <button
              onClick={findNearbyPharmacy}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              🏥 Find Nearby Pharmacy
            </button>
          </div>

          {/* Medical Query Toggle */}
          <div className="flex items-center justify-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMedicalQuery}
                onChange={(e) => setIsMedicalQuery(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                🏥 Medical/Symptom Query (for health-related questions)
              </span>
            </label>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isMedicalQuery ? "Describe your symptoms..." : "Type your message or address for pharmacy search..."}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending</span>
                </div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6 space-y-2">
          <div>Powered by OpenAI ChatGPT API</div>
          <div className="text-xs text-red-500">
            ⚠️ Medical information provided is for educational purposes only. Always consult healthcare professionals for proper medical advice.
          </div>
        </div>
      </div>
    </div>
  );
}
