import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Map, AlertCircle, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

// CONFIGURATION: API URL
// For Localhost: Use 'http://127.0.0.1:5000'
// For Production: Replace with your Render/Railway Backend URL (e.g., 'https://dmrc-backend.onrender.com')
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://127.0.0.1:5000' 
  : 'https://YOUR-BACKEND-APP-NAME.onrender.com'; 

const LINE_COLORS = {
  "Red Line": "#ef4444",
  "Yellow Line": "#eab308",
  "Blue Line": "#3b82f6",
  "Blue Line Branch": "#60a5fa",
  "Green Line": "#22c55e",
  "Violet Line": "#a855f7",
  "Pink Line": "#ec4899",
  "Magenta Line": "#d946ef",
  "Grey Line": "#6b7280",
  "Airport Express": "#f97316"
};

// Language strings
const STRINGS = {
  en: {
    title: "MetroSahayak",
    subtitle: "Your Delhi Metro Assistant",
    placeholder: "Ask about routes, fares, or get emergency help...",
    sendBtn: "Send",
    route: "Find Route",
    fares: "Fares",
    info: "Info",
    emergency: "Emergency",
    language: "Language",
    askStation: "Which station do you want to go to?",
    fromStation: "From Station",
    toStation: "To Station",
    search: "Search",
    selectStation: "Select a station..."
  },
  hi: {
    title: "मेट्रो साहायक",
    subtitle: "आपका दिल्ली मेट्रो सहायक",
    placeholder: "रूट, किराया के बारे में पूछें या आपातकालीन मदद लें...",
    sendBtn: "भेजें",
    route: "रूट खोजें",
    fares: "किराया",
    info: "जानकारी",
    emergency: "आपातकाल",
    language: "भाषा",
    askStation: "आप किस स्टेशन पर जाना चाहते हैं?",
    fromStation: "कहाँ से",
    toStation: "कहाँ तक",
    search: "खोजें",
    selectStation: "एक स्टेशन चुनें..."
  }
};

// Animated Metro Train Logo
const AnimatedLogo = () => (
  <div className="logo-container">
    <motion.div
      className="train-logo"
      animate={{ x: [0, 20, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="6" width="32" height="16" rx="2" fill="#DC143C" stroke="white" strokeWidth="2"/>
        <circle cx="12" cy="22" r="3" fill="#DC143C"/>
        <circle cx="36" cy="22" r="3" fill="#DC143C"/>
        <rect x="16" y="8" width="4" height="6" fill="white" opacity="0.7"/>
        <rect x="28" y="8" width="4" height="6" fill="white" opacity="0.7"/>
      </svg>
    </motion.div>
  </div>
);

// Chat Message Component
const ChatMessage = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`chat-message ${isUser ? 'user' : 'bot'}`}
  >
    <div className={`message-content ${isUser ? 'user-content' : 'bot-content'}`}>
      {message}
    </div>
  </motion.div>
);

// Route Map Visualization Component
const RouteMap = ({ steps, language }) => (
  <div className="route-map" style={{ margin: '20px 0', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
    <h4 style={{ marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Map size={18} />
      {language === 'en' ? 'Route Map' : 'रूट मैप'}
    </h4>
    <div style={{ position: 'relative', paddingLeft: '10px' }}>
      {steps.map((step, index) => {
        const color = LINE_COLORS[step.line] || '#9ca3af';
        const isLast = index === steps.length - 1;
        
        return (
          <div key={index} style={{ position: 'relative', paddingBottom: isLast ? '0' : '40px' }}>
            {/* Vertical Line connecting nodes */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                left: '9px',
                top: '20px',
                bottom: '-10px',
                width: '4px',
                backgroundColor: color,
                opacity: 0.3
              }} />
            )}
            
            {/* Start Node of this segment */}
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: `5px solid ${color}`,
                marginRight: '15px',
                boxShadow: '0 0 0 2px white'
              }} />
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.05em', color: '#334155' }}>{step.start}</div>
                <div style={{ fontSize: '0.85em', color: color, fontWeight: '600', marginTop: '2px' }}>
                  {step.line} • {step.stops} {language === 'en' ? 'stops' : 'स्टेशन'}
                </div>
              </div>
            </div>

            {/* Destination Node (Only for last step) */}
            {isLast && (
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2, marginTop: '40px' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: `5px solid ${color}`,
                  marginRight: '15px',
                  boxShadow: '0 0 0 2px white'
                }} />
                <div style={{ fontWeight: 'bold', fontSize: '1.05em', color: '#334155' }}>{step.end}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// Route Display Component
const RouteDisplay = ({ route, language }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="route-display"
  >
    <h3 className="route-title">
      {language === 'en' ? 'Route Found' : 'रूट मिल गया'}
    </h3>

    {/* NEW: Clean Fare & Stats Card */}
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '20px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
        
        {/* Stations Count */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
            {route.distance}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {language === 'en' ? 'Stations' : 'स्टेशन'}
          </span>
        </div>

        {/* Fare Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            ₹{route.fare.base_fare}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {language === 'en' ? 'Fare' : 'किराया'}
          </span>
        </div>

        {/* Interchanges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
            {route.interchanges ? route.interchanges.length : 0}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {language === 'en' ? 'Changes' : 'बदलाव'}
          </span>
        </div>

      </div>
    </div>

    <div className="route-info">
      <p><strong>{language === 'en' ? 'From:' : 'कहाँ से:'}</strong> {route.from_station}</p>
      <p><strong>{language === 'en' ? 'To:' : 'कहाँ तक:'}</strong> {route.to_station}</p>
    </div>

    {/* NEW: Route Map Visualization */}
    {route.steps && <RouteMap steps={route.steps} language={language} />}

    <div className="stations-list">
      <h4>{language === 'en' ? 'Stations:' : 'स्टेशन:'}</h4>
      {route.stations.map((station, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          className="station-item"
        >
          <span className="station-number">{index + 1}</span>
          <span className="station-name">{station}</span>
        </motion.div>
      ))}
    </div>

    {route.interchanges.length > 0 && (
      <div className="interchanges">
        <h4>{language === 'en' ? 'Interchanges:' : 'बदलाव:'}</h4>
        {route.interchanges.map((interchange, index) => (
          <div key={index} className="interchange-item">
            <strong>{interchange.station}</strong>
            <span className="lines">{interchange.lines.join(', ')}</span>
          </div>
        ))}
      </div>
    )}

    {/* Detailed Fare Breakdown (Secondary) */}
    <div className="fare-info" style={{ marginTop: '15px', fontSize: '0.9em', color: '#666', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
        <span>{language === 'en' ? 'Smart Card:' : 'स्मार्ट कार्ड:'}</span>
        <strong>₹{route.fare.smart_card_fare}</strong>
      </div>
    </div>
  </motion.div>
);

// Main App Component
export default function MetroSahayak() {
  const [messages, setMessages] = useState([
    {
      text: STRINGS.en.subtitle,
      isUser: false,
      language: 'en'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [stations, setStations] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all stations on mount
  useEffect(() => {
    fetchAllStations();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAllStations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stations`);
      // Backend returns { stations: [...] }
      const allStations = response.data.stations;
      setStations(allStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = inputValue;
    setMessages(prev => [...prev, {
      text: userMessage,
      isUser: true,
      language: language
    }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMessage,
        language: language
      });

      setMessages(prev => [...prev, {
        text: response.data.response,
        isUser: false,
        language: language
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: language === 'en'
          ? 'Sorry, an error occurred. Please try again.'
          : 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        isUser: false,
        language: language
      }]);
    }

    setLoading(false);
  };

  const handleFindRoute = async () => {
    if (!fromStation || !toStation) {
      setMessages(prev => [...prev, {
        text: language === 'en'
          ? 'Please select both stations'
          : 'कृपया दोनों स्टेशन चुनें',
        isUser: false,
        language: language
      }]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/find-route`, {
        source: fromStation,
        destination: toStation
      });

      const data = response.data;
      
      // Map Flask backend response to Frontend structure
      const mappedData = {
        from_station: data.source,
        to_station: data.destination,
        distance: data.total_stations,
        stations: data.path || [],
        steps: data.steps || [], // Pass raw steps for RouteMap
        interchanges: (data.steps || []).filter((s, i) => s.line !== data.steps[i+1]?.line).slice(0, -1).map(s => ({
             station: s.end,
             lines: [s.line, "Next Line"] // Simplified for display
        })),
        fare: data.fare_details || { base_fare: data.fare, off_peak_fare: data.fare, smart_card_fare: data.fare }
      };

      // Note: The backend 'interchanges' is a count, 'steps' has details. 
      // For now, we pass the raw data or a mapped version.
      // If backend returned an error object, show message (but backend now uses HTTP errors)
      if (data.error) {
        setMessages(prev => [...prev, {
          text: response.data.error,
          isUser: false,
          language: language
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'route',
          data: mappedData,
          isUser: false,
          language: language
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Read backend error message if available
      const serverMsg = error?.response?.data?.detail;
      setMessages(prev => [...prev, {
        text: serverMsg || (language === 'en'
          ? 'Route not found. Try different stations.'
          : 'रूट नहीं मिला। अलग स्टेशन आजमाएं।'),
        isUser: false,
        language: language
      }]);
    }

    setLoading(false);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    setMenuOpen(false);
  };

  const strings = STRINGS[language];

  return (
    <div className="metro-sahayak">
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
          <AnimatedLogo />
          <div className="header-text">
            <h1 className="app-title">{strings.title}</h1>
            <p className="app-subtitle">{strings.subtitle}</p>
          </div>
        </div>

        <div className="header-controls">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`language-btn ${language}`}
            onClick={toggleLanguage}
          >
            <Globe size={20} />
            {language === 'en' ? 'EN' : 'HI'}
          </motion.button>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <button
              className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); setMenuOpen(false); }}
            >
              <MessageCircle size={20} /> {strings.route}
            </button>
            <button
              className={`menu-item ${activeTab === 'route' ? 'active' : ''}`}
              onClick={() => { setActiveTab('route'); setMenuOpen(false); }}
            >
              <Map size={20} /> {strings.route}
            </button>
            <button
              className={`menu-item ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => { setActiveTab('emergency'); setMenuOpen(false); }}
            >
              <AlertCircle size={20} /> {strings.emergency}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <motion.button
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={20} />
          <span className="tab-label">{strings.subtitle}</span>
        </motion.button>

        <motion.button
          className={`tab-btn ${activeTab === 'route' ? 'active' : ''}`}
          onClick={() => setActiveTab('route')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Map size={20} />
          <span className="tab-label">{strings.route}</span>
        </motion.button>

        <motion.button
          className={`tab-btn ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlertCircle size={20} />
          <span className="tab-label">{strings.emergency}</span>
        </motion.button>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="chat-container">
          <div className="messages-container">
            <AnimatePresence>
              {messages.map((msg, index) => (
                msg.type === 'route' ? (
                  <div key={index}>
                    <RouteDisplay route={msg.data} language={language} />
                  </div>
                ) : (
                  <ChatMessage
                    key={index}
                    message={msg.text}
                    isUser={msg.isUser}
                  />
                )
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="loading-indicator"
              >
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={strings.placeholder}
              className="chat-input"
              disabled={loading}
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="send-btn"
            >
              <Send size={20} />
            </motion.button>
          </form>
        </div>
      )}

      {/* Route Tab */}
      {activeTab === 'route' && (
        <div className="route-container">
          <div className="route-form">
            <div className="form-group">
              <label>{strings.fromStation}</label>
              <select
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="station-select"
              >
                <option value="">{strings.selectStation}</option>
                {stations.map((station, index) => (
                  <option key={index} value={station}>{station}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{strings.toStation}</label>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="station-select"
              >
                <option value="">{strings.selectStation}</option>
                {stations.map((station, index) => (
                  <option key={index} value={station}>{station}</option>
                ))}
              </select>
            </div>

            <motion.button
              onClick={handleFindRoute}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="search-btn"
            >
              {strings.search}
            </motion.button>
          </div>

          <div className="route-messages">
            <AnimatePresence>
              {messages
                .filter(msg => msg.type === 'route' || (!msg.isUser && msg.text))
                .map((msg, index) => (
                  msg.type === 'route' ? (
                    <div key={index}>
                      <RouteDisplay route={msg.data} language={language} />
                    </div>
                  ) : (
                    <ChatMessage
                      key={index}
                      message={msg.text}
                      isUser={false}
                    />
                  )
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Emergency Tab */}
      {activeTab === 'emergency' && (
        <div className="emergency-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="emergency-content"
          >
            <AlertCircle size={48} className="emergency-icon" />
            <h2>{strings.emergency}</h2>

            <div className="emergency-contacts">
              <div className="contact-card">
                <h3>{language === 'en' ? 'Customer Care' : 'कस्टमर केयर'}</h3>
                <p className="contact-number">155370</p>
              </div>

              <div className="contact-card">
                <h3>{language === 'en' ? 'Security (CISF)' : 'सुरक्षा (सीआईएसएफ)'}</h3>
                <p className="contact-number">155655</p>
              </div>

              <div className="contact-card">
                <h3>{language === 'en' ? 'Lost & Found' : 'खोई हुई चीजें'}</h3>
                <p className="contact-info">
                  {language === 'en' ? 'Kashmere Gate Station' : 'कश्मीरी गेट स्टेशन'}
                </p>
              </div>

              <div className="contact-card">
                <h3>{language === 'en' ? 'Medical Emergency' : 'चिकित्सा आपातकाल'}</h3>
                <p className="contact-number">155370</p>
              </div>

              <div className="contact-card">
                <h3>{language === 'en' ? 'Women Safety' : 'महिला सुरक्षा'}</h3>
                <p className="contact-number">155370</p>
              </div>
            </div>

            <div className="emergency-tips">
              <h3>{language === 'en' ? 'Safety Tips' : 'सुरक्षा टिप्स'}</h3>
              <ul>
                <li>{language === 'en' ? 'Keep your belongings safe' : 'अपनी चीजों को सुरक्षित रखें'}</li>
                <li>{language === 'en' ? 'Use designated women\'s coaches' : 'महिलाओं के लिए निर्दिष्ट कोच का उपयोग करें'}</li>
                <li>{language === 'en' ? 'Report any suspicious activity' : 'किसी भी संदिग्ध गतिविधि की रिपोर्ट करें'}</li>
                <li>{language === 'en' ? 'Keep emergency contacts handy' : 'आपातकालीन संपर्क हाथ में रखें'}</li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}