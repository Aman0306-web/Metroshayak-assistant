import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Map, AlertCircle, RotateCcw, ArrowUpDown, Star, QrCode, X, LocateFixed, Clock, Camera, Utensils, Stethoscope, ShoppingBag, ExternalLink, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App-enhanced.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Enhanced Language Strings
// STEP 2: FULL STATION DATABASE
const LINES = {
  Red: {
    color: "#e30613", name: "Red Line", short: "RED",
    stations: [
      "Shahabad Mohammadpur","Tikri Kalan","Tikri Border",
      "Pandit Shree Ram Sharma","Bahadurgarh City","Brigadier Hoshiyar Singh",
      "Mundka Industrial Area","Mundka","Rajdhani Park","Nangloi Depot",
      "Nangloi","Paschim Vihar West","Paschim Vihar East","Peeragarhi",
      "Udyog Nagar","Surajmal Stadium","Madipur","Shivaji Park",
      "Punjabi Bagh West","ESI Hospital","Satguru Ram Singh Marg",
      "Inderlok","Kanhaiya Nagar","Keshav Puram","Netaji Subhash Place",
      "Kohat Enclave","Pitampura","Rohini East","Rohini West","Rithala"
    ]
  },
  Red_East: {
    color: "#e30613", name: "Red Line", short: "RED",
    stations: [
      "Dilshad Garden","Jhilmil","Mansarovar Park","Shahdara",
      "Welcome","Seelampur","Shastri Park","Kashmere Gate"
    ]
  },
  Yellow: {
    color: "#c8b800", name: "Yellow Line", short: "YEL",
    stations: [
      "Samaypur Badli","Rohini Sector 18 19","Haiderpur Badli Mor",
      "Jahangirpuri","Adarsh Nagar","Azadpur","Model Town","GTB Nagar",
      "Vishwavidyalaya","Vidhan Sabha","Civil Lines","Kashmere Gate",
      "Chandni Chowk","Chawri Bazar","New Delhi","Rajiv Chowk",
      "Patel Chowk","Central Secretariat","Udyog Bhawan","Lok Kalyan Marg",
      "Jor Bagh","INA","AIIMS","Green Park","Hauz Khas","Malviya Nagar",
      "Saket","Qutub Minar","Chhatarpur","Sultanpur","Ghitorni",
      "Arjangarh","Guru Dronacharya","Sikandarpur","MG Road",
      "IFFCO Chowk","Huda City Centre"
    ]
  },
  Blue: {
    color: "#1565c0", name: "Blue Line", short: "BLU",
    stations: [
      "Dwarka Sector 21","Dwarka Sector 8","Dwarka Sector 9",
      "Dwarka Sector 10","Dwarka Sector 11","Dwarka Sector 12",
      "Dwarka Sector 13","Dwarka Sector 14","Dwarka","Dwarka Mor",
      "Nawada","Uttam Nagar West","Uttam Nagar East","Janakpuri West",
      "Janakpuri East","Tilak Nagar","Subhash Nagar","Tagore Garden",
      "Rajouri Garden","Ramesh Nagar","Moti Nagar","Kirti Nagar",
      "Shadipur","Patel Nagar","Rajendra Place","Karol Bagh",
      "Jhandewalan","Ramakrishna Ashram Marg","Rajiv Chowk",
      "Barakhamba Road","Mandi House","Pragati Maidan","Indraprastha",
      "Yamuna Bank","Laxmi Nagar","Nirman Vihar","Preet Vihar",
      "Karkardooma","Anand Vihar ISBT","Kaushambi","Vaishali"
    ]
  },
  Blue_Noida: {
    color: "#1565c0", name: "Blue Line", short: "BLU",
    stations: [
      "Yamuna Bank","Akshardham","Mayur Vihar Phase 1",
      "Mayur Vihar Extension","New Ashok Nagar",
      "Noida Sector 15","Noida Sector 16","Noida Sector 18",
      "Botanical Garden","Golf Course","Noida City Centre",
      "Noida Sector 34","Noida Sector 52","Noida Sector 61",
      "Noida Sector 59","Noida Sector 62","Noida Electronic City"
    ]
  },
  Green: {
    color: "#00c853", name: "Green Line", short: "GRN",
    stations: [
      "Inderlok","Ashok Park Main","Punjabi Bagh East",
      "Punjabi Bagh West","ESI Hospital","Satguru Ram Singh Marg",
      "Kirti Nagar","Shadipur","Patel Nagar","Rajendra Place"
    ]
  },
  Green_West: {
    color: "#00c853", name: "Green Line", short: "GRN",
    stations: [
      "Brigadier Hoshiyar Singh","Bahadurgarh City",
      "Pandit Shree Ram Sharma","Tikri Border","Tikri Kalan",
      "Shahabad Mohammadpur","Mundka","Mundka Industrial Area",
      "Ghevra","Peeragarhi","Udyog Nagar","Surajmal Stadium",
      "Madipur","Shivaji Park","Punjabi Bagh West"
    ]
  },
  Green_South: {
    color: "#00c853", name: "Green Line", short: "GRN",
    stations: [
      "Inderlok","Ashok Park Main","Punjabi Bagh East","Punjabi Bagh West",
      "Rajouri Garden","Mayapuri","Naraina Vihar","Delhi Cantt",
      "Durgabai Deshmukh South Campus","Sir Vishweshwaraiah Moti Bagh",
      "Bhikaji Cama Place","Sarojini Nagar","INA","South Extension",
      "Lajpat Nagar"
    ]
  },
  Violet: {
    color: "#7b2d8b", name: "Violet Line", short: "VIO",
    stations: [
      "Kashmere Gate","Lal Quila","Jama Masjid","Delhi Gate",
      "ITO","Mandi House","Janpath","Khan Market",
      "Jawaharlal Nehru Stadium","Jangpura","Lajpat Nagar",
      "Moolchand","Kailash Colony","Nehru Place","Kalkaji Mandir",
      "Okhla NSIC","Govindpuri","Harkesh Nagar Okhla",
      "Jasola Apollo","Sarita Vihar","Mohan Estate","Tughlakabad",
      "Badarpur Border","Sarai","NHPC Chowk","Mewala Maharajpur",
      "Sector 28 Faridabad","Badkhal Mor","Old Faridabad",
      "Neelam Chowk Ajronda","Bata Chowk","Escorts Mujesar",
      "Sant Surdas Sihi","Raja Nahar Singh Ballabhgarh"
    ]
  },
  Pink: {
    color: "#e91e8c", name: "Pink Line", short: "PNK",
    stations: [
      "Majlis Park","Azadpur","Shalimar Bagh","Netaji Subhash Place",
      "Shakurpur","Punjabi Bagh West","ESI Hospital",
      "Rajouri Garden","Mayapuri","Naraina Vihar","Delhi Cantt",
      "Durgabai Deshmukh South Campus","Sir Vishweshwaraiah Moti Bagh",
      "Bhikaji Cama Place","Sarojini Nagar","INA","South Extension",
      "Lajpat Nagar","Vinobapuri","Ashram","Hazrat Nizamuddin",
      "Mayur Vihar Phase 1","Trilokpuri Sanjay Lake",
      "Vinod Nagar East","Mandawali West Vinod Nagar",
      "IP Extension","Anand Vihar","Karkardooma Court",
      "Krishna Nagar","East Azad Nagar","Welcome",
      "Jaffrabad","Maujpur Babarpur","Gokulpuri",
      "Johri Enclave","Shiv Vihar"
    ]
  },
  Orange: {
    color: "#f57c00", name: "Airport Express", short: "AIR",
    stations: [
      "New Delhi","Shivaji Stadium","Dhaula Kuan",
      "Delhi Aerocity","IGI Airport","Dwarka Sector 21"
    ]
  },
  Magenta: {
    color: "#c2185b", name: "Magenta Line", short: "MAG",
    stations: [
      "Janakpuri West","Dabri Mor Janakpuri South","Dashrathpuri",
      "Palam","Sadar Bazar Cantonment","Terminal 1 IGI Airport",
      "Shankar Vihar","Vasant Vihar","Munirka","RK Puram",
      "IIT Delhi","Hauz Khas","Panchsheel Park","Chirag Delhi",
      "Greater Kailash","Nehru Enclave","Kalkaji Mandir",
      "Okhla NSIC","Jasola Vihar Shaheen Bagh","Kalindi Kunj",
      "Okhla Bird Sanctuary","Botanical Garden"
    ]
  },
  Grey: {
    color: "#607d8b", name: "Grey Line", short: "GRY",
    stations: ["Dwarka","Nangli","Najafgarh"]
  },
  Aqua: {
    color: "#00bcd4", name: "Aqua Line", short: "AQU",
    stations: [
      "Noida Sector 51","Noida Sector 50","Noida Sector 76",
      "Noida Sector 101","Noida Sector 81","Noida Sector 83",
      "Noida Sector 137","Noida Sector 142","Noida Sector 143",
      "Noida Sector 144","Noida Sector 145","Noida Sector 146",
      "Noida Sector 147","Noida Sector 148","Knowledge Park 2",
      "Knowledge Park 3","Pari Chowk","Alpha 1","Delta 1",
      "GNIDA Office","Depot Station Greater Noida"
    ]
  },
  Rapid_Phase1: {
    color: "#6a1b9a", name: "Rapid Metro Phase 1", short: "RPD",
    stations: [
      "Sikandarpur",
      "Guru Dronacharya Rapid",
      "Phase 1 Rapid",
      "Moulsari Avenue",
      "Cyber City",
      "Sector 53-54"
    ]
  },
  Rapid_Phase2: {
    color: "#6a1b9a", name: "Rapid Metro Phase 2", short: "RPD",
    stations: [
      "Sikandarpur",
      "Sector 42-43",
      "Sector 42-44",
      "Sector 53-54",
      "Sector 54 Chowk",
      "Sector 55-56"
    ]
  }
};

// STEP 3: INTERCHANGES
const INTERCHANGES = {
  "Kashmere Gate":              ["Yellow","Red_East","Violet"],
  "Rajiv Chowk":               ["Yellow","Blue"],
  "Mandi House":               ["Blue","Violet"],
  "Yamuna Bank":               ["Blue","Blue_Noida"],
  "Inderlok":                  ["Red","Green","Green_South"],
  "Netaji Subhash Place":      ["Red","Pink"],
  "Punjabi Bagh West":         ["Red","Green","Green_West","Pink"],
  "ESI Hospital":              ["Red","Green","Pink"],
  "Kirti Nagar":               ["Blue","Green"],
  "Shadipur":                  ["Blue","Green"],
  "Patel Nagar":               ["Blue","Green"],
  "Rajendra Place":            ["Blue","Green"],
  "INA":                       ["Yellow","Pink","Green_South"],
  "Hauz Khas":                 ["Yellow","Magenta"],
  "Lajpat Nagar":              ["Violet","Pink","Green_South"],
  "Kalkaji Mandir":            ["Violet","Magenta"],
  "Okhla NSIC":                ["Violet","Magenta"],
  "Botanical Garden":          ["Blue_Noida","Magenta"],
  "Janakpuri West":            ["Blue","Magenta"],
  "Azadpur":                   ["Yellow","Pink"],
  "Anand Vihar ISBT":          ["Blue","Pink"],
  "Karkardooma":               ["Blue","Pink"],
  "New Delhi":                 ["Yellow","Orange"],
  "Dwarka Sector 21":          ["Blue","Orange","Grey","Green_South"],
  "Dwarka":                    ["Blue","Grey"],
  "Mayur Vihar Phase 1":       ["Blue_Noida","Pink"],
  "Welcome":                   ["Red","Pink","Red_East"],
  "Rajouri Garden":            ["Blue","Pink","Green_South"],
  "Satguru Ram Singh Marg":    ["Red","Green"],
  "Mayapuri":                  ["Pink","Green_South"],
  "Naraina Vihar":             ["Pink","Green_South"],
  "Delhi Cantt":               ["Pink","Green_South"],
  "Durgabai Deshmukh South Campus": ["Pink","Green_South"],
  "Sir Vishweshwaraiah Moti Bagh":   ["Pink","Green_South"],
  "Bhikaji Cama Place":        ["Pink","Green_South"],
  "Sarojini Nagar":            ["Pink","Green_South"],
  "South Extension":           ["Pink","Green_South"],
  "Ashok Park Main":           ["Green","Green_South"],
  "Punjabi Bagh East":         ["Green","Green_South"],
  "Brigadier Hoshiyar Singh":  ["Red","Green_West"],
  "Mundka":                    ["Red","Green_West"],
  "Mundka Industrial Area":    ["Red","Green_West"],
  "Sikandarpur":               ["Yellow","Rapid_Phase1","Rapid_Phase2"],
  "Sector 53-54":              ["Rapid_Phase1","Rapid_Phase2"]
};

// Helper to map line names to colors for UI
const getLineColor = (lineName) => {
  for (const key in LINES) {
    if (LINES[key].name === lineName) return LINES[key].color;
  }
  return '#9ca3af';
};

// STEP 4: GRAPH BUILDER
function buildGraph() {
  const graph = {};
  function addEdge(a, b, line) {
    if (!graph[a]) graph[a] = [];
    if (!graph[b]) graph[b] = [];
    if (!graph[a].find(e => e.s === b && e.l === line))
      graph[a].push({ s: b, l: line });
    if (!graph[b].find(e => e.s === a && e.l === line))
      graph[b].push({ s: a, l: line });
  }
  for (const [lineKey, lineData] of Object.entries(LINES)) {
    const stns = lineData.stations;
    for (let i = 0; i < stns.length - 1; i++) {
      addEdge(stns[i], stns[i + 1], LINES[lineKey].name);
    }
  }
  return graph;
}

const GRAPH = buildGraph();

function getAllStations() {
  const all = new Set();
  for (const line of Object.values(LINES)) {
    for (const s of line.stations) all.add(s);
  }
  return [...all].sort();
}

// STEP 5: BFS ROUTE FINDER
function findRoute(src, dst) {
  if (!GRAPH[src] || !GRAPH[dst]) return { found: false, msg: "Station not found" };
  if (src === dst) return { found: false, msg: "Source and destination are same" };

  const queue = [{ node: src, path: [src], lines: [] }];
  const visited = new Set([src]);

  while (queue.length > 0) {
    const { node, path, lines } = queue.shift();

    for (const edge of (GRAPH[node] || [])) {
      if (visited.has(edge.s)) continue;
      const newPath = [...path, edge.s];
      const newLines = [...lines, edge.l];
      
      if (edge.s === dst) {
        return buildResult(src, dst, newPath, newLines);
      }
      
      visited.add(edge.s);
      queue.push({ node: edge.s, path: newPath, lines: newLines });
    }
  }
  return { found: false, msg: "No route found" };
}

function buildResult(src, dst, path, lineArr) {
  const stops = path.length - 1;
  const ics = [];
  const uniqueLines = [];
  let cur = lineArr[0];
  if (!uniqueLines.includes(cur)) uniqueLines.push(cur);

  for (let i = 1; i < lineArr.length; i++) {
    if (lineArr[i] !== cur) {
      ics.push({ station: path[i], from: cur, to: lineArr[i] });
      cur = lineArr[i];
      if (!uniqueLines.includes(cur)) uniqueLines.push(cur);
    }
  }

  const isAirport = uniqueLines.includes('Airport Express');
  const isRapid = uniqueLines.some(l => l.includes('Rapid Metro'));
  
  let fare = { token: 0, card: 0, note: '' };

  if (isAirport) {
    fare = { token: 60, card: 60, note: "Airport Express Fare" };
  } else if (isRapid && uniqueLines.every(l => l.includes('Rapid Metro'))) {
    // Pure Rapid Metro journey
    fare = { token: 20, card: 20, note: "Rapid Metro Flat Fare (Separate Ticket)" };
  } else if (isRapid) {
    // Mixed Journey (DMRC + Rapid)
    const dist = stops;
    let dmrcFare;
    if (dist <= 2) dmrcFare = { token: 10, card: 9 };
    else if (dist <= 5) dmrcFare = { token: 20, card: 18 };
    else if (dist <= 12) dmrcFare = { token: 30, card: 27 };
    else if (dist <= 21) dmrcFare = { token: 40, card: 36 };
    else if (dist <= 32) dmrcFare = { token: 50, card: 45 };
    else dmrcFare = { token: 60, card: 54 };

    fare = { 
      token: dmrcFare.token + 20, 
      card: dmrcFare.card + 18, 
      note: "Includes ₹20 Rapid Metro Fare (Separate Ticket Required)" 
    };
  } else {
    const dist = stops; // Simplified distance metric
    if (dist <= 2) fare = { token: 10, card: 9, note: '' };
    else if (dist <= 5) fare = { token: 20, card: 18, note: '' };
    else if (dist <= 12) fare = { token: 30, card: 27, note: '' };
    else if (dist <= 21) fare = { token: 40, card: 36, note: '' };
    else if (dist <= 32) fare = { token: 50, card: 45, note: '' };
    else fare = { token: 60, card: 54, note: '' };
  }

  // Estimate time: 2 mins per stop + 5 mins per interchange
  const time = (stops * 2) + (ics.length * 5);

  return { found: true, src, dst, path, stops, ics, uniq: uniqueLines, fare, lines: lineArr, time };
}

// Helper to generate steps for RouteMap
function generateSteps(path, lineArr) {
  const steps = [];
  if (path.length < 2) return steps;

  let currentLine = lineArr[0];
  let segmentStart = path[0];
  let count = 0;

  for (let i = 0; i < lineArr.length; i++) {
    if (lineArr[i] !== currentLine) {
      steps.push({
        start: segmentStart,
        end: path[i],
        line: currentLine,
        stops: count
      });
      currentLine = lineArr[i];
      segmentStart = path[i];
      count = 0;
    }
    count++;
  }
  // Add last segment
  steps.push({
    start: segmentStart,
    end: path[path.length - 1],
    line: currentLine,
    stops: count
  });
  return steps;
}

// Enhanced Station Details Database
const STATION_DETAILS = {
  "Chandni Chowk": {
    tourist: ["Red Fort", "Jama Masjid", "Sis Ganj Sahib", "Town Hall"],
    food: ["Paranthe Wali Gali", "Karim's", "Natraj Dahi Bhalle", "Giani's"],
    health: ["Kasturba Hospital", "Marwari Hospital"],
    shopping: ["Chandni Chowk Market", "Nai Sarak (Books)", "Dariba Kalan (Silver)"]
  },
  "Rajiv Chowk": {
    tourist: ["Central Park", "Madame Tussauds", "Jantar Mantar", "Hanuman Mandir"],
    food: ["Wenger's", "Saravana Bhavan", "Keventers", "United Coffee House"],
    health: ["Lady Hardinge Medical College", "Dr. RML Hospital"],
    shopping: ["Connaught Place", "Janpath Market", "Palika Bazar", "Shankar Market"]
  },
  "AIIMS": {
    tourist: ["Dilli Haat (INA)", "Safdarjung Tomb"],
    food: ["South Ext Market Eateries", "Dilli Haat Food Stalls"],
    health: ["AIIMS Hospital", "Safdarjung Hospital", "Trauma Centre"],
    shopping: ["Kidwai Nagar Market", "South Extension"]
  },
  "Hauz Khas": {
    tourist: ["Hauz Khas Fort", "Deer Park", "Rose Garden"],
    food: ["Social Offline", "Hauz Khas Village Cafes", "Naivedyam", "Elma's Bakery"],
    health: ["Max Hospital Saket (Nearby)"],
    shopping: ["Aurobindo Market"]
  },
  "Nehru Place": {
    tourist: ["Lotus Temple", "ISKCON Temple", "Prachin Bhairav Mandir"],
    food: ["Epicuria Food Mall", "Sona Sweets", "Taco Bell"],
    health: ["Irene Hospital"],
    shopping: ["Nehru Place IT Market", "Fabric Market"]
  },
  "Saket": {
    tourist: ["Garden of Five Senses", "Qutub Minar (Nearby)"],
    food: ["Select Citywalk Food Court", "DLF Avenue Commons", "Big Chill"],
    health: ["Max Super Speciality Hospital"],
    shopping: ["Select Citywalk", "DLF Avenue", "MGF Metropolitan"]
  },
  "Moolchand": {
    tourist: ["Japan Park", "Lotus Temple (Nearby)"],
    food: ["Moolchand Parantha", "Sanjay Chur Chur Naan"],
    health: ["Moolchand Medcity", "Vimhans"],
    shopping: ["Lajpat Nagar (Nearby)"]
  },
  "Kashmere Gate": {
    tourist: ["St. James Church", "Nicholson Cemetery", "Old Delhi Railway Station"],
    food: ["Ritz Cinema Restaurants", "ISBT Food Court", "McDonald's"],
    health: ["St. Stephen's Hospital"],
    shopping: ["Monastery Market"]
  },
  "Mandi House": {
    tourist: ["National School of Drama", "Triveni Kala Sangam", "FICCI Auditorium"],
    food: ["Triveni Terrace Cafe", "Bengali Sweet House", "Shri Ram Centre Canteen"],
    health: ["LNJP Hospital (Nearby)"],
    shopping: ["Bengali Market"]
  },
  "Khan Market": {
    tourist: ["Lodhi Gardens", "India Habitat Centre"],
    food: ["Big Chill", "Khan Chacha", "Town Hall", "SodaBottleOpenerWala"],
    health: ["Subramania Bharati"],
    shopping: ["Khan Market High Street", "Bahrisons Books"]
  },
  "Noida Sector 18": {
    tourist: ["Worlds of Wonder", "DLF Mall of India"],
    food: ["DLF Mall of India Food Court", "GIP Food Court", "Desi Vibes"],
    health: ["Kailash Hospital", "Vinayak Hospital"],
    shopping: ["Atta Market", "DLF Mall of India", "GIP Mall"]
  },
  "Cyber City": {
    tourist: ["Cyber Hub Amphitheatre"],
    food: ["Cyber Hub (50+ Restaurants)", "Farzi Cafe", "Burma Burma", "Starbucks"],
    health: ["Narayana Super Speciality"],
    shopping: ["Ambience Mall (Nearby)"]
  },
  "Central Secretariat": {
    tourist: ["India Gate", "Rashtrapati Bhavan", "National Museum", "Parliament House"],
    food: ["Pandara Road (Gulati's)", "Andhra Bhawan Canteen"],
    health: ["RML Hospital"],
    shopping: ["Janpath"]
  },
  "Lajpat Nagar": {
    tourist: ["Iskcon Temple (Nearby)"],
    food: ["Dolma Aunty Momos", "Nagpal Chole Bhature", "Golden Fiesta"],
    health: ["Moolchand Hospital (Nearby)"],
    shopping: ["Central Market", "Amar Colony"]
  },
  "Karol Bagh": {
    tourist: ["Jhandewalan Temple"],
    food: ["Roshan Di Kulfi", "Om Corner Chole Bhature"],
    health: ["BLK Super Speciality Hospital"],
    shopping: ["Gaffar Market", "Ajmal Khan Road"]
  },
  "Vishwavidyalaya": {
    tourist: ["Vice Chancellor's Office", "Ridge Road"],
    food: ["Hudson Lane Cafes", "Big Yellow Door", "Rico's"],
    health: ["Hindu Rao Hospital"],
    shopping: ["Kamla Nagar Market"]
  },
  "INA": {
    tourist: ["Dilli Haat"],
    food: ["Dilli Haat Food Stalls", "Kerala Hotel"],
    health: ["AIIMS", "Safdarjung Hospital"],
    shopping: ["INA Market (Spices/Fresh Produce)"]
  }
};

const STRINGS = {
  en: {
    title: "MetroSahayak",
    placeholder: "Ask about routes, fares, timings, or emergency help...",
    sendBtn: "Send",
    chat: "Chat",
    route: "Find Route",
    tour: "Tour Guide",
    info: "Info",
    emergency: "Emergency",
    fromStation: "From Station",
    toStation: "To Station",
    search: "Search Route",
    clear: "Clear Route",
    selectStation: "Select a station...",
    tourTitle: "Explore Delhi",
    tourSubtitle: "Discover food, hospitals, and places near metro stations",
    noPlaces: "No specific tourist spots listed for this station yet.",
    favorites: "Favorites",
    quickActions: {
      timings: "Metro Timings",
      recharge: "Card Recharge",
      lines: "Metro Lines",
      peak: "Peak Hours"
    }
  },
  hi: {
    title: "MetroSahayak",
    placeholder: "रूट, किराया, समय के बारे में पूछें...",
    sendBtn: "भेजें",
    chat: "चैट",
    route: "रूट खोजें",
    tour: "पर्यटन गाइड",
    info: "जानकारी",
    emergency: "आपातकाल",
    fromStation: "कहाँ से",
    toStation: "कहाँ तक",
    search: "रूट खोजें",
    clear: "रूट साफ़ करें",
    selectStation: "एक स्टेशन चुनें...",
    tourTitle: "दिल्ली दर्शन",
    tourSubtitle: "मेट्रो स्टेशनों के पास भोजन, अस्पताल और स्थान खोजें",
    noPlaces: "इस स्टेशन के लिए अभी कोई पर्यटन स्थल सूचीबद्ध नहीं है।",
    favorites: "पसंदीदा",
    quickActions: {
      timings: "मेट्रो समय",
      recharge: "कार्ड रिचार्ज",
      lines: "मेट्रो लाइनें",
      peak: "पीक आवर्स"
    }
  }
};

// Enhanced Knowledge Base
const CHATBOT_KNOWLEDGE = {
  timings: {
    keywords: ['timing', 'time', 'open', 'close', 'schedule', 'hours', 'समय'],
    response: `🕐 Delhi Metro Operating Hours:

Monday to Saturday: 6:00 AM - 11:00 PM
Sunday: 6:00 AM - 10:00 PM

First Train: Around 5:00 AM - 6:00 AM (varies by line)
Last Train: Around 10:30 PM - 11:30 PM (varies by line)

Note: Timings may vary on special occasions and public holidays.`
  },
  recharge: {
    keywords: ['recharge', 'topup', 'top-up', 'reload', 'card', 'रिचार्ज'],
    response: `💳 Metro Card Recharge Methods:

1. At Metro Stations:
   - AFC (Automatic Fare Collection) counters
   - TVM (Ticket Vending Machines)
   - Recharge kiosks

2. Online Methods:
   - Delhi Metro Rail App (DMRC)
   - Paytm, PhonePe, Google Pay
   - Official DMRC website

3. Mobile Wallets:
   - Link your metro card
   - Auto-recharge options available

Minimum recharge: ₹100
Maximum balance: ₹3000`
  },
  lines: {
    keywords: ['line', 'lines', 'color', 'route map', 'लाइन'],
    response: `🗺️ Delhi Metro Lines:

🔴 Red Line: Rithala - Shaheed Sthal (New Bus Adda)
🔵 Blue Line: Dwarka Sector 21 - Noida Electronic City/Vaishali
🟡 Yellow Line: Samaypur Badli - HUDA City Centre
🟢 Green Line: Brigadier Hoshiar Singh - Kirti Nagar
🟣 Violet Line: Kashmere Gate - Raja Nahar Singh (Ballabhgarh)
🟠 Orange Line: AIIMS - New Delhi (Airport Express)
🩷 Pink Line: Majlis Park - Shiv Vihar
🩶 Grey Line: Dwarka - Najafgarh
⚪ Rapid Metro: Sikanderpur - Cyber City

Total: 350+ stations across 390+ km`
  },
  peak: {
    keywords: ['peak', 'rush', 'busy', 'crowd', 'पीक'],
    response: `📊 Peak Hours & Off-Peak Timings:

Morning Peak Hours:
🔺 8:00 AM - 10:00 AM

Evening Peak Hours:
🔺 5:00 PM - 8:00 PM

Off-Peak Hours:
✅ 10:00 AM - 5:00 PM
✅ After 8:00 PM

💡 Tip: Travel during off-peak hours for:
- Less crowded trains
- Discounted fares (10% off on smart cards)
- More comfortable journey`
  },
  fare: {
    keywords: ['fare', 'price', 'cost', 'ticket', 'charge', 'किराया'],
    response: `💰 Delhi Metro Fare Structure:

Distance-based fares:
📍 0-2 km: ₹10
📍 2-5 km: ₹20
📍 5-12 km: ₹30
📍 12-21 km: ₹40
📍 21-32 km: ₹50
📍 32+ km: ₹60

Airport Express Line:
✈️ ₹60 (New Delhi to Airport)

Smart Card Benefits:
💳 10% discount on every journey
💳 Faster entry/exit
💳 No need to buy tokens`
  },
  airport: {
    keywords: ['airport', 'flight', 'terminal', 'igi', 'एयरपोर्ट'],
    response: `✈️ Delhi Airport Metro Connection:

Orange Line (Airport Express):
🔸 New Delhi → IGI Airport T3
🔸 Stations: New Delhi, Shivaji Stadium, Dhaula Kuan, Airport (T3)

Travel Time: ~20 minutes
Frequency: Every 10-15 minutes
Fare: ₹60

💡 Tip: Airport Express is fastest! Luggage space available.`
  },
  wifi: {
    keywords: ['wifi', 'internet', 'connectivity', 'data'],
    response: `📶 Delhi Metro WiFi:

Free WiFi Available at:
✅ All underground stations
✅ Major interchange stations

How to Connect:
1. Search for "DelhiMetro-Wifi"
2. Accept terms & conditions
3. Enter mobile number
4. Receive OTP & login

💡 Tip: Download content before boarding!`
  },
  parking: {
    keywords: ['parking', 'park', 'vehicle', 'car'],
    response: `🅿️ Metro Station Parking:

Available at major stations:
- Noida Sector 16
- Dwarka Sector 21
- Kashmere Gate
- Rajiv Chowk

Charges (approx):
🚗 Cars: ₹40 for first 4 hours
🏍️ Two-wheelers: ₹20 for first 4 hours

💡 Tip: Use Park & Ride to avoid traffic!`
  },
  facilities: {
    keywords: ['facilities', 'amenities', 'washroom', 'atm', 'सुविधा'],
    response: `🏢 Metro Station Facilities:

Available at Most Stations:
✅ Clean Washrooms (paid)
✅ ATMs
✅ Drinking Water
✅ First Aid
✅ Elevators & Escalators
✅ Help Desks

Special Facilities:
♿ Wheelchair assistance
👶 Baby care rooms (select stations)
🛒 Retail shops
☕ Cafes (major stations)`
  },
  rules: {
    keywords: ['rule', 'rules', 'allowed', 'prohibited', 'banned', 'नियम'],
    response: `⚠️ Metro Rules & Regulations:

❌ PROHIBITED:
- Smoking, eating, drinking
- Carrying flammable items
- Pets (except guide dogs)
- Playing music without earphones

✅ ALLOWED:
- 2 pieces of luggage (max 25kg each)
- Laptops, electronics
- Folded bicycles (designated coaches)

⚖️ Penalties: Fine up to ₹500`
  },
  lost: {
    keywords: ['lost', 'found', 'missing', 'forgot', 'खोया'],
    response: `📦 Lost & Found:

Main Office:
📍 Kashmere Gate Metro Station
📞 011-23417910
⏰ 8:00 AM - 8:00 PM (Mon-Sat)

What to do:
1. Report to station manager immediately
2. File written complaint
3. Provide item description
4. Keep contact info updated`
  },
  nearest: {
    keywords: ['nearest', 'closest', 'location', 'gps', 'haversine', 'formula'],
    response: `📍 How I Find Nearest Stations:

I use the **Haversine Formula** to calculate the shortest distance between your GPS coordinates and station coordinates on the Earth's sphere.

The Math:
a = sin²(Δlat/2) + cos(lat1)⋅cos(lat2)⋅sin²(Δlon/2)
c = 2⋅atan2(√a, √(1−a))
d = R⋅c

Where R is Earth's radius (6,371 km).

👉 Use the 'Nearest Station' button in the Route tab to try it!`
  },
  rapid: {
    keywords: ['rapid', 'gurugram', 'cyber city', 'sector 53', 'sector 54', 'sector 55', 'moulsari', 'phase 1 rapid'],
    response: `🟣 Rapid Metro Gurugram

Private metro connecting Gurgaon to DMRC at Sikandarpur.

Phase 1: Sikandarpur ↔ Cyber City ↔ Sector 53-54
Phase 2: Sikandarpur ↔ Sector 55-56

💰 Fare: ₹20 Flat (Separate from DMRC)
💳 Ticket: Buy separate token/card at Sikandarpur
⚠️ Note: DMRC Smart Card is NOT valid for Rapid Metro.`
  },
  smartcard: {
    keywords: ['smart card', 'buy card', 'card validity', 'card cost', 'new card'],
    response: `💳 DMRC Smart Card Info:

• Cost: ₹150 (₹100 balance + ₹50 refundable security)
• Validity: 10 Years from last recharge
• Benefits: 10% discount on fares (20% in off-peak)
• Return: Return anytime to get ₹50 security deposit back (conditions apply).`
  },
  touristcard: {
    keywords: ['tourist card', '1 day card', '3 day card', 'unlimited travel'],
    response: `🎫 Tourist Smart Cards:

1. One-Day Card:
   • Cost: ₹200 (₹150 fare + ₹50 security)
   • Validity: Unlimited travel for 1 day

2. Three-Day Card:
   • Cost: ₹500 (₹450 fare + ₹50 security)
   • Validity: Unlimited travel for 3 days

Refundable security of ₹50 is returned on surrendering the card.`
  },
  token: {
    keywords: ['token', 'single journey', 'qr ticket', 'paper ticket'],
    response: `🎟️ Single Journey Tokens/QR:

• Validity: Valid only on the day of purchase.
• Entry: Must enter within 20 mins of purchase (for station of purchase).
• Exit: Must exit within 170 mins (approx 3 hours) after entry.
• Penalty: Overstaying attracts a fine of ₹10/hour (max ₹50).`
  },
  feeder: {
    keywords: ['feeder bus', 'bus', 'last mile', 'shuttle', 'e-rickshaw'],
    response: `🚌 Last Mile Connectivity:

• Feeder Buses: Available at major stations (06:00 AM - 10:00 PM).
• E-Rickshaws: Available at almost all stations.
• Smart Card: Accepted on DMRC feeder buses.
• Cab/Auto Stands: Designated stands at most Gate 1/2 exits.`
  },
  museum: {
    keywords: ['museum', 'history', 'patel chowk'],
    response: `🏛️ Metro Museum:

• Location: Patel Chowk Metro Station (Yellow Line)
• Timings: 10:00 AM - 4:00 PM (Closed on Monday)
• Entry: Ticket required for station entry.
• Exhibits: History of DMRC, models, photos, and awards.`
  },
  alcohol: {
    keywords: ['alcohol', 'liquor', 'bottle', 'wine', 'beer'],
    response: `🍾 Alcohol Rules:

• Allowed: 2 sealed bottles of alcohol per person.
• Condition: Must be carried securely. Drinking inside metro premises or trains is STRICTLY PROHIBITED.
• Penalty: Fine up to ₹200 and removal from station.`
  },
  women: {
    keywords: ['women', 'ladies', 'coach', 'safety', 'girl'],
    response: `👩 Women Safety & Facilities:

• Reserved Coach: First coach of every train (moving towards engine).
• Reserved Seats: Seats reserved in general coaches.
• Helpline: 155370 (24x7)
• Security: CISF & DMRC staff available for assistance.`
  },
  photography: {
    keywords: ['photo', 'video', 'camera', 'recording', 'reels'],
    response: `📸 Photography Rules:

• Allowed: Photography for personal use (mobile/camera).
• Prohibited: Tripods, professional shoots without permission, and photography in security check areas.
• Note: Do not inconvenience other passengers.`
  },
  luggage: {
    keywords: ['luggage', 'bag', 'weight', 'size', 'suitcase', 'carry'],
    response: `🧳 Luggage Rules:

• Limit: 1 bag up to 25 kg per person.
• Dimensions: Max 80 cm x 50 cm x 30 cm.
• Airport Line: Heavier luggage allowed (check airline rules).
• Prohibited: Gunny sacks, bundles, and items causing obstruction.`
  },
  refund: {
    keywords: ['refund', 'balance', 'return', 'money back'],
    response: `💸 Refund Rules:

• Smart Card: Remaining balance + ₹50 security deposit refunded on surrender.
• Token: Refundable within 60 mins at purchasing station if unused.
• Deductions: Processing fee may apply based on card condition.`
  },
  student: {
    keywords: ['student', 'pass', 'concession', 'discount', 'college'],
    response: `🎓 Student Passes:

• Current Status: DMRC does NOT offer specific student concession passes.
• Recommendation: Use a Smart Card for a flat 10% discount (20% during off-peak hours).
• University Specials: Some university routes have feeder buses.`
  },
  senior: {
    keywords: ['senior', 'citizen', 'elderly', 'aged'],
    response: `👴 Senior Citizen Facilities:

• Fares: No special discount on fares.
• Seats: Reserved seats in every coach.
• Assistance: Wheelchair assistance available at all stations (contact Customer Care).
• Priority: Priority access at elevators and wide AFC gates.`
  },
  bicycle: {
    keywords: ['bicycle', 'cycle', 'bike'],
    response: `🚲 Bicycle Rules:

• Allowed: Only foldable bicycles are allowed.
• Condition: Must be packed/folded properly to not hinder others.
• Non-foldable: Strictly prohibited inside trains and paid areas.`
  },
  pets: {
    keywords: ['pet', 'dog', 'cat', 'animal'],
    response: `🐾 Pet Policy:

• General Rule: Pets are NOT allowed in Delhi Metro.
• Exception: Only trained guide dogs accompanying visually impaired persons are permitted.`
  },
  app: {
    keywords: ['app', 'application', 'mobile', 'download'],
    response: `📱 DMRC Mobile App:

• Name: 'Delhi Metro Rail' (Official).
• Features: Route planner, station info, tour guide, lost & found, and smart card recharge.
• Platforms: Available on Android (Play Store) and iOS (App Store).`
  },
  complaint: {
    keywords: ['complaint', 'complain', 'issue', 'feedback', 'report'],
    response: `📝 File a Complaint:

1. Station Controller: Complaint book available at every station.
2. Helpline: Call 155370 (24x7).
3. Email: helpline@dmrc.org
4. App: Use the 'Feedback' section in DMRC App.`
  },
  jobs: {
    keywords: ['job', 'career', 'vacancy', 'recruitment', 'hiring'],
    response: `💼 DMRC Careers:

• Official Source: Check 'delhimetrorail.com/career'.
• Warning: Beware of fake job offers. DMRC never asks for money for interviews.
• Process: Written exam -> Psycho test -> Interview -> Medical.`
  },
  shooting: {
    keywords: ['shooting', 'film', 'movie', 'recording'],
    response: `🎬 Film Shooting:

• Permission: Required in advance from DMRC PR Department.
• Charges: Commercial shooting is chargeable (approx ₹2-5 Lakhs/hour depending on location).
• Short videos: Personal non-commercial mobile recording is generally tolerated if not obstructing.`
  }
};

// Animated Metro Logo Component
const AnimatedMetroLogo = () => (
  <motion.div
    className="animated-logo"
    animate={{
      x: [0, 10, 0],
      y: [0, -5, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <svg width="60" height="45" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      {/* Train Body */}
      <motion.rect
        className="train-body"
        x="10" y="15" width="60" height="30" rx="5"
        fill="white"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Windows */}
      <motion.rect
        x="20" y="20" width="10" height="12" rx="2"
        fill="#02555B"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <rect x="35" y="20" width="10" height="12" rx="2" fill="#02555B"/>
      <rect x="50" y="20" width="10" height="12" rx="2" fill="#02555B"/>
      
      {/* Wheels */}
      <motion.circle
        cx="25" cy="45" r="5"
        fill="#FFCE00"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="55" cy="45" r="5"
        fill="#FFCE00"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Front Light */}
      <motion.circle
        cx="8" cy="30" r="3"
        fill="#FFCE00"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  </motion.div>
);

// 3D Mascot Component
const Mascot3D = () => (
  <motion.div
    className="mascot-3d"
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, 0, -5, 0]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <motion.div
      className="mascot-sphere"
      whileHover={{ scale: 1.1, rotateY: 180 }}
      transition={{ duration: 0.5 }}
    >
      🚇
    </motion.div>
  </motion.div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon, text, onClick }) => (
  <motion.button
    className="quick-action-btn"
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="quick-action-icon">{icon}</div>
    <div className="quick-action-text">{text}</div>
  </motion.button>
);

// Chat Message Component with Animation
const ChatMessage = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, type: "spring" }}
    className={`chat-message ${isUser ? 'user' : 'bot'}`}
  >
    <div className={`message-content ${isUser ? 'user-content' : 'bot-content'}`}>
      {message.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < message.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  </motion.div>
);

// Route Map Visualization Component
const RouteMap = ({ steps, language, onStationClick }) => (
  <div className="route-map" style={{ margin: '20px 0', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
    <h4 style={{ marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Map size={18} />
      {language === 'en' ? 'Route Map' : 'रूट मैप'}
    </h4>
    <div style={{ position: 'relative', paddingLeft: '10px' }}>
      {steps.map((step, index) => {
        const color = getLineColor(step.line);
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
                <div 
                  style={{ fontWeight: 'bold', fontSize: '1.05em', color: '#334155', cursor: 'pointer' }}
                  onClick={() => onStationClick && onStationClick(step.start)}
                >
                  {step.start}
                </div>
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
                <div 
                  style={{ fontWeight: 'bold', fontSize: '1.05em', color: '#334155', cursor: 'pointer' }}
                  onClick={() => onStationClick && onStationClick(step.end)}
                >
                  {step.end}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// QR Ticket Modal Component (Section 4)
const TicketModal = ({ route, onClose }) => {
  if (!route?.fare) return null;
  const qrData = `DMRC_TICKET:${route.from_station}:${route.to_station}:${route.fare.base_fare}:${Date.now()}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="ticket-modal"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <button className="close-modal-btn" onClick={onClose}><X size={20}/></button>
        <div className="ticket-header">
          <h3>🚇 DMRC E-Ticket</h3>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
        <div className="ticket-body">
          <div className="ticket-route">
            <strong>{route.from_station}</strong>
            <ArrowUpDown size={16} style={{ transform: 'rotate(90deg)' }} />
            <strong>{route.to_station}</strong>
          </div>
          <div className="qr-container">
            <img src={qrUrl} alt="Ticket QR" />
          </div>
          <div className="ticket-fare">Amount Paid: ₹{route.fare.base_fare}</div>
          <p className="ticket-note">Show this QR at the AFC Gate</p>
        </div>
      </motion.div>
    </div>
  );
};

// Route Display Component
const RouteDisplay = ({ route, language, onStationClick }) => {
  const [showTicket, setShowTicket] = useState(false);
  if (!route) return null;

  const savings = route.fare.base_fare - route.fare.smart_card_fare;

  return (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="route-display-3d"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h3 className="route-title" style={{ marginBottom: 0, border: 'none' }}>✅ Route Found!</h3>
      <button className="view-ticket-btn" onClick={() => setShowTicket(true)}>
        <QrCode size={16} /> View Ticket
      </button>
    </div>

    <div className="route-info-card">
      <p><strong>From:</strong> {route.from_station}</p>
      <p><strong>To:</strong> {route.to_station}</p>
      <p><strong>Distance:</strong> {route.distance} stations</p>
      <p><strong><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/> Time:</strong> ~{route.time} mins</p>
    </div>

    {route.steps && <RouteMap steps={route.steps} language={language} onStationClick={onStationClick} />}

    <div className="stations-list-3d">
      <h4>🚇 Journey Path</h4>
      {route.stations.map((station, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="station-item-3d"
          onClick={() => onStationClick && onStationClick(station)}
          style={{ cursor: 'pointer' }}
        >
          <span className="station-number-3d">{index + 1}</span>
          <span className="station-name-3d">{station}</span>
        </motion.div>
      ))}
    </div>

    {route.interchanges.length > 0 && (
      <div className="interchanges-3d">
        <h4>🔄 Interchange Stations</h4>
        {route.interchanges.map((interchange, index) => (
          <div key={index} className="interchange-item-3d">
            <strong>{interchange.station}</strong>
            <span className="lines-badge">{interchange.lines.join(' ↔ ')}</span>
          </div>
        ))}
      </div>
    )}

    <div className="fare-info-3d">
      <h4>💰 Fare Details</h4>
      <div className="fare-row">
        <span>📱 Token / QR:</span>
        <span className="fare-amount">₹{route.fare.base_fare}</span>
      </div>
      <div className="fare-row">
        <span>💳 Smart Card:</span>
        <span className="fare-amount">₹{route.fare.smart_card_fare}</span>
      </div>
      <div className="fare-row">
        <span>📉 Off-Peak Card:</span>
        <span className="fare-amount">₹{route.fare.off_peak_fare}</span>
      </div>

      {savings > 0 && (
        <div className="fare-savings">
          <span>🎉 Smart Card Savings:</span>
          <span className="savings-amount">₹{savings}</span>
        </div>
      )}

      {route.fare.note && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px 12px', 
          background: '#fdf2f8', 
          borderLeft: '3px solid #db2777',
          fontSize: '12px',
          color: '#be185d'
        }}>
          ⚠️ {route.fare.note}
        </div>
      )}
    </div>

    {showTicket && <TicketModal route={route} onClose={() => setShowTicket(false)} />}
  </motion.div>
);
};

// Searchable Dropdown Component
const SearchableDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div
        className="station-select-3d"
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ color: value ? '#333' : '#999' }}>{value || placeholder}</span>
        <span style={{ fontSize: '12px', opacity: 0.6 }}>▼</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              marginTop: '5px',
              maxHeight: '250px',
              overflowY: 'auto',
              border: '1px solid #eee'
            }}
          >
            <div style={{ padding: '10px', position: 'sticky', top: 0, background: 'white', borderBottom: '1px solid #eee' }}>
              <input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: '1px solid #f9f9f9'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0f7ff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  {option}
                </div>
              ))
            ) : (
              <div style={{ padding: '15px', color: '#999', textAlign: 'center', fontSize: '14px' }}>
                No stations found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main App Component
export default function MetroSahayak() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Namaste! All 297 Stations Loaded.\n\nI can help you find routes across all 15 lines including Rapid Metro Gurugram.\n\nTry the Quick Actions below!",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [language] = useState('en');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [stations, setStations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const messagesEndRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);
  const [tourStation, setTourStation] = useState('');
  const [isListening, setIsListening] = useState(false);

  const strings = STRINGS[language];

  useEffect(() => {
    fetchAllStations();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('metroFavorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAllStations = async () => {
    // Load from local LINES object
    setStations(getAllStations());
  };

  const getLocalResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    for (const data of Object.values(CHATBOT_KNOWLEDGE)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }
    
    return null;
  };

  const handleSendMessage = async (messageText = null) => {
    const userMessage = messageText || inputValue.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isUser: true }]);
    setInputValue('');
    setLoading(true);

    // Check local knowledge first
    const localResponse = getLocalResponse(userMessage);
    
    setTimeout(async () => {
      if (localResponse) {
        setMessages(prev => [...prev, { id: Date.now(), text: localResponse, isUser: false }]);
        setLoading(false);
      } else {
        // Try API
        try {
          const response = await axios.post(`${API_BASE_URL}/chat`, {
            message: userMessage,
            language: language
          });
          setMessages(prev => [...prev, { id: Date.now(), text: response.data.response, isUser: false }]);
        } catch (error) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "I can help you with metro routes, timings, fares, and more! Try asking about specific topics.",
            isUser: false
          }]);
        }
        setLoading(false);
      }
    }, 800);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "🎤 Voice input is not supported in this browser. Please use Chrome or Edge.", 
        isUser: false,
        type: 'error'
      }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'hi-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleClearRoute = () => {
    setFromStation('');
    setToStation('');
    setMessages(prev => prev.filter(msg => msg.type !== 'route' && msg.type !== 'error'));
  };

  const handleToggleFavorite = () => {
    if (!fromStation || !toStation) return;
    const exists = favorites.some(f => f.from === fromStation && f.to === toStation);
    let newFavs;
    if (exists) {
      newFavs = favorites.filter(f => f.from !== fromStation || f.to !== toStation);
    } else {
      newFavs = [...favorites, { from: fromStation, to: toStation }];
    }
    setFavorites(newFavs);
    localStorage.setItem('metroFavorites', JSON.stringify(newFavs));
  };

  const handleLoadFavorite = (fav) => {
    setFromStation(fav.from);
    setToStation(fav.to);
    handleFindRoute(null, fav.from, fav.to);
  };

  const handleStationClick = (stationName) => {
    setActiveTab('chat');
    handleSendMessage(`Info about ${stationName}`);
  };

  const handleExternalSearch = (query) => {
    if (!tourStation) return;
    const searchQuery = encodeURIComponent(`${query} near ${tourStation} Metro Station Delhi`);
    window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
  };


  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessages(prev => [...prev, { text: "❌ Geolocation is not supported by your browser", isUser: false, type: 'error' }]);
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Sample coordinates for major stations (In a real app, this would be a full database)
        const stationCoords = {
          "New Delhi": { lat: 28.6139, lon: 77.2090 },
          "Rajiv Chowk": { lat: 28.6328, lon: 77.2197 },
          "Hauz Khas": { lat: 28.5431, lon: 77.2060 },
          "Dwarka Sector 21": { lat: 28.5523, lon: 77.0582 },
          "Noida City Centre": { lat: 28.5747, lon: 77.3560 },
          "Kashmere Gate": { lat: 28.6675, lon: 77.2285 },
          "Huda City Centre": { lat: 28.4594, lon: 77.0726 },
          "Botanical Garden": { lat: 28.5645, lon: 77.3345 },
          "Chandni Chowk": { lat: 28.6579, lon: 77.2300 },
          "Inderlok": { lat: 28.6733, lon: 77.1707 }
        };

        let minDistance = Infinity;
        let nearest = '';
        const R = 6371; // Earth radius in km
        const deg2rad = (deg) => deg * (Math.PI / 180);

        Object.entries(stationCoords).forEach(([name, coords]) => {
          const dLat = deg2rad(coords.lat - latitude);
          const dLon = deg2rad(coords.lon - longitude);
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(latitude)) * Math.cos(deg2rad(coords.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c;
          if (d < minDistance) { minDistance = d; nearest = name; }
        });

        if (nearest && minDistance < 50) {
          setFromStation(nearest);
        } else {
           setMessages(prev => [...prev, { text: "⚠️ You seem to be far from the metro network.", isUser: false, type: 'error' }]);
        }
        setIsLocating(false);
      },
      (error) => { setIsLocating(false); console.error(error); }
    );
  };

  const handleFindRoute = async (e, specificFrom, specificTo) => {
    const source = specificFrom || fromStation;
    const dest = specificTo || toStation;

    if (!source || !dest) {
      setMessages(prev => [...prev, {
        text: "❌ Please select both stations",
        isUser: false,
        type: 'error'
      }]);
      return;
    }

    setLoading(true);

    try {
      // Use Local BFS Logic
      const result = findRoute(source, dest);

      if (!result.found) throw new Error(result.msg);

      // Generate steps for visualization
      const steps = generateSteps(result.path, result.lines);
      const fare = result.fare;

      // Map backend response to frontend structure
      const mappedData = {
        from_station: source,
        to_station: dest,
        distance: result.stops,
        time: result.time,
        stations: result.path,
        steps: steps,
        interchanges: result.ics.map(ic => ({
             station: ic.station,
             lines: [ic.from, ic.to]
        })),
        fare: { 
            base_fare: fare.token, 
            off_peak_fare: Math.round(fare.token * 0.8), 
            smart_card_fare: fare.card,
            note: fare.note
        }
      };

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'route',
        data: mappedData,
        isUser: false
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `❌ ${error.message || 'Route not found'}`,
        isUser: false,
        type: 'error'
      }]);
    }

    setLoading(false);
  };

  const isFavorite = favorites.some(f => f.from === fromStation && f.to === toStation);

  return (
    <div className="metro-app-3d">
      {/* Mascot */}
      <Mascot3D />

      {/* Header */}
      <motion.div
        className="header-3d"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="header-content">
          <AnimatedMetroLogo />
          <div className="header-text">
            <h1>{strings.title}</h1>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="tab-navigation-3d">
        <motion.button
          className={`tab-btn-3d ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={20} />
          <span>{strings.chat}</span>
        </motion.button>

        <motion.button
          className={`tab-btn-3d ${activeTab === 'route' ? 'active' : ''}`}
          onClick={() => setActiveTab('route')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Map size={20} />
          <span>{strings.route}</span>
        </motion.button>

        <motion.button
          className={`tab-btn-3d ${activeTab === 'tour' ? 'active' : ''}`}
          onClick={() => setActiveTab('tour')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera size={20} />
          <span>{strings.tour}</span>
        </motion.button>

        <motion.button
          className={`tab-btn-3d ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlertCircle size={20} />
          <span>{strings.emergency}</span>
        </motion.button>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="chat-container-3d">
          {/* Quick Actions */}
          <div className="quick-actions-grid">
            <QuickActionButton
              icon="⏰"
              text={strings.quickActions.timings}
              onClick={() => handleSendMessage("What are the metro timings?")}
            />
            <QuickActionButton
              icon="💳"
              text={strings.quickActions.recharge}
              onClick={() => handleSendMessage("How to recharge metro card?")}
            />
            <QuickActionButton
              icon="🗺️"
              text={strings.quickActions.lines}
              onClick={() => handleSendMessage("Show me all metro lines")}
            />
            <QuickActionButton
              icon="📊"
              text={strings.quickActions.peak}
              onClick={() => handleSendMessage("What are the peak hours?")}
            />
          </div>

          <div className="messages-container-3d">
            <AnimatePresence>
              {messages.map((msg) => (
                msg.type === 'route' ? (
                  <div key={msg.id}>
                    <RouteDisplay route={msg.data} language={language} onStationClick={handleStationClick} />
                  </div>
                ) : (
                  <ChatMessage
                    key={msg.id}
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
                className="loading-indicator-3d"
              >
                <span></span><span></span><span></span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="input-form-3d">
            <motion.button
              type="button"
              onClick={handleVoiceInput}
              disabled={loading || isListening}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="send-btn-3d"
              style={{ background: isListening ? '#ef4444' : '#667eea', marginRight: '10px' }}
            >
              <Mic size={20} />
            </motion.button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={strings.placeholder}
              className="chat-input-3d"
              disabled={loading}
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="send-btn-3d"
            >
              <Send size={20} />
            </motion.button>
          </form>
        </div>
      )}

      {/* Route Tab */}
      {activeTab === 'route' && (
        <div className="route-container-3d">
          <div className="route-form-3d">
            <div className="form-group-3d">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ marginBottom: 0 }}>📍 {strings.fromStation}</label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  style={{
                    background: 'transparent',
                    border: '1px solid #667eea',
                    borderRadius: '12px',
                    padding: '4px 8px',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                  }}
                >
                  <LocateFixed size={12} />
                  {isLocating ? 'Locating...' : 'Nearest Station'}
                </motion.button>
              </div>
              <SearchableDropdown
                options={stations}
                value={fromStation}
                onChange={setFromStation}
                placeholder={strings.selectStation}
              />
            </div>

            <div className="swap-btn-container">
              <motion.button
                onClick={handleSwapStations}
                className="swap-btn-3d"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUpDown size={20} />
              </motion.button>
            </div>

            <div className="form-group-3d">
              <label>🎯 {strings.toStation}</label>
              <SearchableDropdown
                options={stations}
                value={toStation}
                onChange={setToStation}
                placeholder={strings.selectStation}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                onClick={handleFindRoute}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="search-btn-3d"
                style={{ flex: 1 }}
              >
                🔍 {strings.search}
              </motion.button>

              <motion.button
                onClick={handleClearRoute}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="clear-btn-3d"
                style={{ flex: 1 }}
              >
                <RotateCcw size={18} /> {strings.clear}
              </motion.button>

              <motion.button
                onClick={handleToggleFavorite}
                disabled={!fromStation || !toStation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fav-btn-3d ${isFavorite ? 'active' : ''}`}
                title="Save as Favorite"
              >
                <Star size={18} fill={isFavorite ? "gold" : "none"} color={isFavorite ? "gold" : "currentColor"} />
              </motion.button>
            </div>

            {favorites.length > 0 && (
              <div className="favorites-section">
                <h4>⭐ {strings.favorites}</h4>
                <div className="favorites-list">
                  {favorites.map((fav, index) => (
                    <motion.div
                      key={index}
                      className="favorite-chip"
                      onClick={() => handleLoadFavorite(fav)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {fav.from} ➝ {fav.to}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="route-messages-3d">
            <AnimatePresence>
              {messages
                .filter(msg => msg.type === 'route' || msg.type === 'error')
                .map((msg) => (
                  msg.type === 'route' ? (
                    <div key={msg.id}>
                      <RouteDisplay route={msg.data} language={language} onStationClick={handleStationClick} />
                    </div>
                  ) : (
                    <ChatMessage key={msg.id} message={msg.text} isUser={false} />
                  )
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Emergency Tab */}
      {activeTab === 'emergency' && (
        <motion.div
          className="emergency-container-3d"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="emergency-grid-3d">
            {[
              { title: '📞 Customer Care', number: '155370' },
              { title: '🛡️ Security (CISF)', number: '155655' },
              { title: '📦 Lost & Found', number: 'Kashmere Gate' },
              { title: '🏥 Medical', number: '155370' },
              { title: '👩 Women Safety', number: '155370' },
              { title: '🚨 Police', number: '100' }
            ].map((contact, index) => (
              <motion.div
                key={index}
                className="contact-card-3d"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <h3>{contact.title}</h3>
                <p>{contact.number}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="emergency-tips-3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3>🛡️ Safety Tips</h3>
            <ul>
              <li>Keep your belongings safe and secure</li>
              <li>Use designated women's coaches during peak hours</li>
              <li>Report suspicious activity immediately</li>
              <li>Keep emergency contacts saved</li>
              <li>Stand behind the yellow line on platforms</li>
              <li>Avoid traveling alone late at night</li>
            </ul>
          </motion.div>
        </motion.div>
      )}

      {/* Tour Guide Tab */}
      {activeTab === 'tour' && (
        <motion.div
          className="tour-container-3d"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="tour-header">
            <h3>📸 {strings.tourTitle}</h3>
            <p>{strings.tourSubtitle}</p>
          </div>

          <div className="form-group-3d" style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <SearchableDropdown
              options={stations}
              value={tourStation}
              onChange={setTourStation}
              placeholder={strings.selectStation}
            />
          </div>

          {tourStation && (
            <div className="tour-content">
              {STATION_DETAILS[tourStation] ? (
                <>
                  {/* Tourist Spots */}
                  {STATION_DETAILS[tourStation].tourist && (
                    <div className="category-section">
                      <h4 className="category-header"><Camera size={18} /> Tourist Spots</h4>
                      <div className="places-grid-3d">
                        {STATION_DETAILS[tourStation].tourist.map((place, i) => (
                          <div key={i} className="place-card-3d tourist">📍 {place}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Food */}
                  {STATION_DETAILS[tourStation].food && (
                    <div className="category-section">
                      <h4 className="category-header"><Utensils size={18} /> Food & Dining</h4>
                      <div className="places-grid-3d">
                        {STATION_DETAILS[tourStation].food.map((place, i) => (
                          <div key={i} className="place-card-3d food">🍽️ {place}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Health */}
                  {STATION_DETAILS[tourStation].health && (
                    <div className="category-section">
                      <h4 className="category-header"><Stethoscope size={18} /> Hospitals & Health</h4>
                      <div className="places-grid-3d">
                        {STATION_DETAILS[tourStation].health.map((place, i) => (
                          <div key={i} className="place-card-3d health">🏥 {place}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shopping */}
                  {STATION_DETAILS[tourStation].shopping && (
                    <div className="category-section">
                      <h4 className="category-header"><ShoppingBag size={18} /> Shopping</h4>
                      <div className="places-grid-3d">
                        {STATION_DETAILS[tourStation].shopping.map((place, i) => (
                          <div key={i} className="place-card-3d shopping">🛍️ {place}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-tour-state">
                  <p>{strings.noPlaces}</p>
                  <button className="search-nearby-btn" onClick={() => handleExternalSearch("Restaurants and Tourist places")}>
                    <ExternalLink size={16} /> Search on Google Maps
                  </button>
                </div>
              )}
            </div>
          )}

          {!tourStation && (
              <div className="empty-tour-state">
                <Camera size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>{strings.selectStation}</p>
              </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
