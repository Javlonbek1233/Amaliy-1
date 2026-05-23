/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  Users, 
  Sparkles, 
  Send, 
  CheckCircle, 
  Plus, 
  Camera, 
  Volume2, 
  VolumeX, 
  X, 
  ArrowRight, 
  AlertCircle, 
  Loader, 
  CloudRain, 
  Info, 
  HelpCircle,
  Clock,
  Navigation,
  Globe,
  UtensilsCrossed,
  Eye
} from "lucide-react";
import { Destination, ChatMessage, WeatherInfo } from "./types";

export default function App() {
  // Application Data States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedId, setSelectedId] = useState<string>("whispering-glen");
  const [activeTab, setActiveTab] = useState<"explorer" | "journals" | "maps" | "guides">("explorer");
  
  // Custom interactive user additions
  const [userJournals, setUserJournals] = useState<Record<string, { author: string; content: string; date: string }[]>>({});
  const [journalAuthor, setJournalAuthor] = useState("");
  const [journalContent, setJournalContent] = useState("");

  // Soundscape static simulator
  const [soundscape, setSoundscape] = useState<"none" | "glen" | "waves" | "chasm">("none");
  const [soundVolume, setSoundVolume] = useState(40);
  const audioContextRef = useRef<AudioContext | null>(null);
  const biquadFilterRef = useRef<BiquadFilterNode | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Completed Checklist for active route
  const [completedItems, setCompletedItems] = useState<Record<string, string[]>>({});

  // Chat & AI Assistant Slide Drawer
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "The brass lanterns flicker as the archives expand, traveler. I am The Archivist of these forgotten coordinates. Ask me of the ancient paths, the mountain tides, or which survival provisions you should carry into the mists.",
      timestamp: "12:23 UTC"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Custom Suggestion Generator state
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestionKeyword, setSuggestionKeyword] = useState("");
  const [suggestionCategory, setSuggestionCategory] = useState("ruins");
  const [suggestionAtmosphere, setSuggestionAtmosphere] = useState("Frozen Aurora");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // UI state overlays
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [storytellingMode, setStorytellingMode] = useState(true);
  const [likedList, setLikedList] = useState<string[]>([]);
  const [timeUtc, setTimeUtc] = useState("");
  
  // Interactive Map State Variables
  const [mapScale, setMapScale] = useState(1);
  const [viewportCenter, setViewportCenter] = useState({ lat: 37, lng: -110 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [customMarker, setCustomMarker] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [activeRadarAngle, setActiveRadarAngle] = useState(0);

  // Audio effects synthesizer generator
  const triggerAtmosphericChime = (frequency: number = 220) => {
    try {
      if (!window.AudioContext && !(window as any).webkitAudioContext) return;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 3);
    } catch (e) {
      console.log("Audio API blocked or unsupported");
    }
  };

  // Synthesizing a low hum or water drip soundscape when traveler chooses interactive tones
  const startSynthesizedSoundscape = (type: string) => {
    try {
      if (!window.AudioContext && !(window as any).webkitAudioContext) return;
      
      // Close previous
      stopSynthesizedSoundscape();
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      oscillatorNodeRef.current = osc;
      biquadFilterRef.current = filter;
      gainNodeRef.current = gain;

      // Base atmospheric values
      if (type === "glen") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(65.4, ctx.currentTime); // C2 low drone
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime((soundVolume / 100) * 0.05, ctx.currentTime);
      } else if (type === "waves") {
        // Ocean swell simulation using white noise or multiple sine frequencies
        osc.type = "sine";
        osc.frequency.setValueAtTime(82.4, ctx.currentTime); // E2 low hum
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(100, ctx.currentTime);
        gain.gain.setValueAtTime((soundVolume / 100) * 0.08, ctx.currentTime);
        
        // Modulate bandwidth over time to sound like rhythmic waves
        let modPhase = 0;
        const waveTimer = setInterval(() => {
          if (filter && ctx && modPhase !== undefined) {
            modPhase += 0.05;
            const newFreq = 90 + Math.sin(modPhase) * 60;
            try {
              filter.frequency.setValueAtTime(newFreq, ctx.currentTime);
            } catch (err) {
              clearInterval(waveTimer);
            }
          } else {
            clearInterval(waveTimer);
          }
        }, 80);
      } else if (type === "chasm") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(55, ctx.currentTime); // A1 extreme low obsidian resonance
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(90, ctx.currentTime);
        gain.gain.setValueAtTime((soundVolume / 100) * 0.04, ctx.currentTime);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
    } catch (err) {
      console.error("Synthesizer error:", err);
    }
  };

  const stopSynthesizedSoundscape = () => {
    try {
      if (oscillatorNodeRef.current) {
        oscillatorNodeRef.current.stop();
        oscillatorNodeRef.current.disconnect();
        oscillatorNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (soundscape !== "none") {
      startSynthesizedSoundscape(soundscape);
    } else {
      stopSynthesizedSoundscape();
    }
    return () => stopSynthesizedSoundscape();
  }, [soundscape]);

  // Handle vol adjust
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const multiplier = soundscape === "waves" ? 0.08 : soundscape === "chasm" ? 0.04 : 0.05;
      gainNodeRef.current.gain.setValueAtTime((soundVolume / 100) * multiplier, audioContextRef.current.currentTime);
    }
  }, [soundVolume]);

  // Load Curated Destinations on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/hidden-places/destinations");
        const json = await res.json();
        if (json.success && json.destinations) {
          setDestinations(json.destinations);
        } else {
          // If server fails or offline, fall back to hardcoded mock curated list
          throw new Error("API fallback");
        }
      } catch (err) {
        console.warn("Could not reach API server, loading local backup data.");
        // Fetch Curated data directly from server source structures
        import("../serverCuratedData").then((mod) => {
          if (mod.CURATED_DESTINATIONS) {
            setDestinations(mod.CURATED_DESTINATIONS);
          }
        });
      }
    }
    loadData();
  }, []);

  // Update Dynamic UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = d.getUTCHours().toString().padStart(2, "0");
      const mins = d.getUTCMinutes().toString().padStart(2, "0");
      const secs = d.getUTCSeconds().toString().padStart(2, "0");
      setTimeUtc(`${hrs}:${mins}:${secs}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate simulated map radar line
  useEffect(() => {
    const mapTimer = setInterval(() => {
      setActiveRadarAngle((prev) => (prev + 1.5) % 360);
    }, 40);
    return () => clearInterval(mapTimer);
  }, []);

  // Helper active element
  const activePlace = destinations.find((d) => d.id === selectedId) || destinations[0];

  // Map coordinate center shifting when active place transitions
  useEffect(() => {
    if (activePlace) {
      setViewportCenter({ lat: activePlace.lat, lng: activePlace.lng });
    }
  }, [selectedId, activePlace]);

  // Handle checklist toggles
  const handleToggleChecklist = (placeId: string, item: string) => {
    const current = completedItems[placeId] || [];
    let updated: string[];
    if (current.includes(item)) {
      updated = current.filter((x) => x !== item);
    } else {
      updated = [...current, item];
    }
    setCompletedItems({
      ...completedItems,
      [placeId]: updated
    });
    triggerAtmosphericChime(330);
  };

  // Add customized storytelling log entry
  const handleAddJournal = (e: FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;
    const placeId = activePlace.id;
    const list = userJournals[placeId] || [];
    const newEntry = {
      author: journalAuthor.trim() || "Unlogged Wayfarer",
      content: journalContent.trim(),
      date: new Date().toISOString().substring(0, 10)
    };
    setUserJournals({
      ...userJournals,
      [placeId]: [newEntry, ...list]
    });
    setJournalContent("");
    setJournalAuthor("");
    triggerAtmosphericChime(440);
  };

  // Send message to Archivist Assistant
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    triggerAtmosphericChime(190);

    try {
      const response = await fetch("/api/hidden-places/trip-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, userMsg] })
      });
      const data = await response.json();
      if (data.success && data.content) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `chat-${Date.now()}-reply`,
            role: "assistant",
            content: data.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        triggerAtmosphericChime(260);
      } else {
        throw new Error(data.error || "System is shielded in secrecy");
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `chat-${Date.now()}-err`,
          role: "assistant",
          content: `Our signal failed to pierce the dense mist. (${err.message}). Is your Gemini API key stored in the secrets ledger?`,
          timestamp: "SIGNAL LOST"
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Whisper Suggestion API generator
  const handleWhisperNewPlace = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    triggerAtmosphericChime(110);
    try {
      const response = await fetch("/api/hidden-places/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: suggestionKeyword,
          atmosphere: suggestionAtmosphere,
          category: suggestionCategory
        })
      });
      const data = await response.json();
      if (data.success && data.destination) {
        const place: Destination = data.destination;
        // Prepend so user is instantly locked onto it
        setDestinations((prev) => [place, ...prev]);
        setSelectedId(place.id);
        setActiveTab("explorer");
        setSuggestionOpen(false);
        setSuggestionKeyword("");
        triggerAtmosphericChime(523.25); // high note C5
      } else {
        throw new Error(data.error || "Ancient cartography engines are offline.");
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Failed to parse the mystical script.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Favoriting/locking a spot
  const toggleLike = (id: string) => {
    if (likedList.includes(id)) {
      setLikedList(likedList.filter((x) => x !== id));
      triggerAtmosphericChime(180);
    } else {
      setLikedList([...likedList, id]);
      triggerAtmosphericChime(440);
    }
  };

  // Custom coordinate calculation for map
  const getSimulatedBearing = (p1: {lat: number, lng: number}, p2: {lat: number, lng: number}) => {
    const y = Math.sin((p2.lng - p1.lng) * (Math.PI / 180)) * Math.cos(p2.lat * (Math.PI / 180));
    const x = Math.cos(p1.lat * (Math.PI / 180)) * Math.sin(p2.lat * (Math.PI / 180)) -
              Math.sin(p1.lat * (Math.PI / 180)) * Math.cos(p2.lat * (Math.PI / 180)) * Math.cos((p2.lng - p1.lng) * (Math.PI / 180));
    const brng = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
    return brng.toFixed(1);
  };

  const getSimulatedDistance = (p1: {lat: number, lng: number}, p2: {lat: number, lng: number}) => {
    // simplified distance in nautical metric leagues
    const dLat = p2.lat - p1.lat;
    const dLng = p2.lng - p1.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 60; // rough scale
    return Math.round(dist);
  };

  return (
    <div className="w-full h-screen bg-[#050505] text-[#dcdcdc] font-sans flex overflow-hidden relative selection:bg-emerald-500/30 selection:text-white">
      {/* Cinematic Ambient Radial Blur Spheres (Artistic Flair Requirement) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] bg-blue-900/30 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-20%] right-[-15%] w-[80%] h-[80%] bg-emerald-900/20 rounded-full blur-[160px]"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-[#10b981]/5 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      {/* Screen scanlines static overlay */}
      <div className="absolute inset-0 overlay-grain opacity-25 pointer-events-none z-10"></div>

      {/* =====================================
          1. NAVIGATION RAIL (LEFT - Artistic Flair Layout)
         ===================================== */}
      <nav className="w-24 h-full border-r border-white/10 flex flex-col items-center py-6 z-20 bg-black/80 backdrop-blur-md justify-between select-none">
        
        {/* Navigation Head / Mysterious Icon */}
        <div className="flex flex-col items-center gap-1.5">
          <button 
            id="nav-logo-btn"
            onClick={() => {
              triggerAtmosphericChime(220);
              alert("HiddenPlaces Archive Console loaded.\nLocal coordinates: Verified.\nAI connection: Active.");
            }}
            className="w-12 h-12 border border-white/30 flex items-center justify-center relative hover:border-emerald-500/80 transition-all group duration-500 cursor-pointer"
          >
            {/* Pulsing focal node */}
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping absolute"></span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full relative"></span>
            {/* Hover decorative corners */}
            <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
          <span className="text-[8px] font-mono tracking-tighter opacity-30 uppercase">HP-SYS v4</span>
        </div>

        {/* Rotate vertical text nav items */}
        <div className="flex-1 flex flex-col gap-12 justify-center py-8">
          <button
            id="tab-explorer"
            onClick={() => { setActiveTab("explorer"); triggerAtmosphericChime(400); }}
            className={`vertical-rl transform rotate-180 uppercase tracking-[0.3em] text-[10px] font-mono transition-all duration-300 cursor-pointer relative py-2 ${
              activeTab === "explorer" ? "text-white font-bold tracking-[0.35em]" : "text-white/40 hover:text-white/85"
            }`}
          >
            {activeTab === "explorer" && (
              <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
            Explorer
          </button>

          <button
            id="tab-journals"
            onClick={() => { setActiveTab("journals"); triggerAtmosphericChime(420); }}
            className={`vertical-rl transform rotate-180 uppercase tracking-[0.3em] text-[10px] font-mono transition-all duration-300 cursor-pointer relative py-2 ${
              activeTab === "journals" ? "text-white font-bold tracking-[0.35em]" : "text-white/40 hover:text-white/85"
            }`}
          >
            {activeTab === "journals" && (
              <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
            Journals
          </button>

          <button
            id="tab-maps"
            onClick={() => { setActiveTab("maps"); triggerAtmosphericChime(440); }}
            className={`vertical-rl transform rotate-180 uppercase tracking-[0.3em] text-[10px] font-mono transition-all duration-300 cursor-pointer relative py-2 ${
              activeTab === "maps" ? "text-white font-bold tracking-[0.35em]" : "text-white/40 hover:text-white/85"
            }`}
          >
            {activeTab === "maps" && (
              <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
            Maps
          </button>

          <button
            id="tab-guides"
            onClick={() => { setActiveTab("guides"); triggerAtmosphericChime(460); }}
            className={`vertical-rl transform rotate-180 uppercase tracking-[0.3em] text-[10px] font-mono transition-all duration-300 cursor-pointer relative py-2 ${
              activeTab === "guides" ? "text-white font-bold tracking-[0.35em]" : "text-white/40 hover:text-white/85"
            }`}
          >
            {activeTab === "guides" && (
              <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
            Guides
          </button>
        </div>

        {/* Dynamic Static Hum Controller */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[7px] font-mono opacity-40 uppercase tracking-widest">Acoustic</span>
            <div className="flex flex-col gap-1 items-center">
              <button 
                onClick={() => { setSoundscape(soundscape === "glen" ? "none" : "glen"); }}
                className={`w-6 h-6 rounded flex items-center justify-center border text-[8px] font-bold ${
                  soundscape === "glen" ? "bg-emerald-950/60 border-emerald-500 text-emerald-400" : "border-white/10 text-white/40 hover:text-white/80"
                }`}
                title="Glen Moss Hum"
              >
                G
              </button>
              <button 
                onClick={() => { setSoundscape(soundscape === "waves" ? "none" : "waves"); }}
                className={`w-6 h-6 rounded flex items-center justify-center border text-[8px] font-bold ${
                  soundscape === "waves" ? "bg-emerald-950/60 border-emerald-500 text-emerald-400" : "border-white/10 text-white/40 hover:text-white/80"
                }`}
                title="Tidal Wave Hum"
              >
                W
              </button>
              <button 
                onClick={() => { setSoundscape(soundscape === "chasm" ? "none" : "chasm"); }}
                className={`w-6 h-6 rounded flex items-center justify-center border text-[8px] font-bold ${
                  soundscape === "chasm" ? "bg-emerald-950/60 border-emerald-500 text-emerald-400" : "border-white/10 text-white/40 hover:text-white/80"
                }`}
                title="Sinking Chasm Hum"
              >
                C
              </button>
            </div>
          </div>
          
          {/* Wave indicator elements */}
          {soundscape !== "none" ? (
            <div className="flex items-end gap-0.5 h-6">
              <span className="w-[2px] bg-emerald-400/80 animate-pulse h-2.5"></span>
              <span className="w-[2px] bg-emerald-400/80 animate-pulse h-4 delay-75"></span>
              <span className="w-[2px] bg-emerald-400/80 animate-pulse h-1 delay-150"></span>
              <span className="w-[2px] bg-emerald-400/80 animate-pulse h-3 delay-300"></span>
            </div>
          ) : (
            <div className="flex items-center justify-center text-white/15 h-6">
              <VolumeX size={10} />
            </div>
          )}

          {/* Profile Circle Avatar representation */}
          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center overflow-hidden hover:border-white/50 transition-colors cursor-help" title="Uncharted Wayfarer License Granted">
            <div className="w-full h-full bg-gradient-to-tr from-stone-900 to-indigo-950/80 text-white/40 flex items-center justify-center font-mono text-[9px]">
              WF-X
            </div>
          </div>
        </div>
      </nav>

      {/* =====================================
          2. MAIN STAGE
         ===================================== */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-20">
        
        {/* =====================================
            HEADER (Artistic Flair Layout)
           ===================================== */}
        <header className="h-24 px-10 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-sm uppercase tracking-[0.5em] font-light">HiddenPlaces</h1>
              <span className="px-2 py-0.5 border border-emerald-900/50 bg-emerald-950/20 text-[8px] text-emerald-400/90 tracking-widest uppercase font-mono rounded">
                VERIFIED UNKNOWN
              </span>
            </div>
            <span className="text-[10px] text-stone-500 font-mono tracking-widest mt-1 uppercase">
              Global Cartographer Room &bull; AI Network Active
            </span>
          </div>

          {/* Center Coordinates & Clock HUD */}
          <div className="hidden md:flex items-center gap-12 font-mono">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-stone-500 uppercase tracking-widest">Active Lat / Long</span>
              <span className="text-xs text-white tracking-widest">
                {activePlace ? activePlace.coordinatesText : "0.0000° N, 0.0000° E"}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-stone-500 uppercase tracking-widest">Chrono Clock (UTC)</span>
              <span className="text-xs text-emerald-400/80 tracking-widest flex items-center gap-1">
                <Clock size={11} className="animate-spin-slow text-stone-500" />
                {timeUtc || "12:00:00"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Suggestions trigger */}
            <button
              id="whisper-trigger-btn"
              onClick={() => { setSuggestionOpen(!suggestionOpen); triggerAtmosphericChime(220); }}
              className="px-5 py-2 border border-emerald-500/30 bg-emerald-950/20 text-[9px] uppercase tracking-widest text-[#dcdcdc] hover:bg-emerald-500 hover:text-black transition-colors flex items-center gap-2 cursor-pointer font-bold duration-300"
            >
              <Sparkles size={11} className="text-emerald-400 animate-pulse" />
              Whisper Path Generator
            </button>

            {/* Archivist Chat panel trigger */}
            <button
              id="search-mystery-btn"
              onClick={() => { setChatOpen(true); triggerAtmosphericChime(250); }}
              className="px-5 py-2 border border-white/20 text-[9px] uppercase tracking-widest text-[#dcdcdc] hover:bg-white hover:text-black transition-colors cursor-pointer font-bold duration-300 flex items-center gap-1.5"
            >
              <span>The Archivist</span>
              <ArrowRight size={10} />
            </button>
          </div>
        </header>

        {/* Dynamic Warning if Destinations collection is empty */}
        {destinations.length === 0 && (
          <div className="p-8 m-10 border border-white/10 bg-black/60 backdrop-blur-md max-w-lg mx-auto rounded shadow-xl flex items-start gap-4 flex-col text-center">
            <AlertCircle className="text-emerald-500/80 mx-auto" size={32} />
            <h3 className="font-serif italic text-xl text-white">Archives currently sealed ...</h3>
            <p className="text-xs opacity-60">The cartographic database file is reloading or the service is looking for standard connections. Please stand by while the coordinates populate.</p>
            <div className="w-full flex justify-center py-2">
              <Loader className="animate-spin text-stone-500" size={16} />
            </div>
          </div>
        )}

        {/* =====================================
            TAB CONTENT: EXPLORER
           ===================================== */}
        {activeTab === "explorer" && destinations.length > 0 && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

            {/* Left sidebar info panel (Artistic Flair 400px border grid) */}
            <div className="w-full lg:w-[420px] border-r border-white/5 flex flex-col p-8 justify-between relative overflow-y-auto bg-black/10 backdrop-blur-sm">
              
              {/* Giant absolute watermarked serial number */}
              <div className="absolute top-6 right-8 text-[110px] font-serif italic text-white/[0.03] select-none leading-none pointer-events-none font-black">
                {String(destinations.indexOf(activePlace) + 1).padStart(2, "0")}
              </div>

              <div>
                {/* Visual Category and Secret Tagline badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-500 text-[10px] uppercase tracking-[0.25em] font-mono flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {activePlace.category} &bull; Secret Level {activePlace.mysteryLevel}/5
                  </span>
                  
                  {/* Mark as liked/pinned coordinates trigger */}
                  <button
                    id="trigger-like-btn"
                    onClick={() => toggleLike(activePlace.id)}
                    className={`p-1.5 border rounded transition-colors ${
                      likedList.includes(activePlace.id)
                        ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-400"
                        : "border-white/10 hover:border-white/30 text-stone-400"
                    }`}
                    title="Pin coordinates as saved route"
                  >
                    <MapPin size={12} className={likedList.includes(activePlace.id) ? "fill-emerald-400" : ""} />
                  </button>
                </div>

                {/* Place Name and tagline */}
                <h2 className="text-4xl lg:text-5xl font-serif italic mb-4 leading-tight text-white tracking-wide">
                  {activePlace.name}
                </h2>
                
                <p className="text-xs font-mono italic text-stone-300 font-semibold mb-6 tracking-wide border-l border-emerald-500/30 pl-3 py-1">
                  &ldquo;{activePlace.tagline}&rdquo;
                </p>

                {/* Main geographic cinematic narrative description */}
                <p className="text-xs opacity-70 leading-relaxed text-slate-300 mb-6 font-sans">
                  {activePlace.description}
                </p>

                {/* Immersive checklist interactive module for the adventure */}
                <div className="border border-white/5 bg-white/[0.01] p-5 mb-6">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#dcdcdc] flex items-center gap-2">
                      <Compass size={12} className="text-emerald-500/80" />
                      Adventure Provisions Checklist
                    </h4>
                    <span className="text-[9px] font-mono text-stone-500">
                      {(completedItems[activePlace.id] || []).length} / {activePlace.adventure.checklist.length} Pack
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {activePlace.adventure.checklist.map((item, idx) => {
                      const isDone = (completedItems[activePlace.id] || []).includes(item);
                      return (
                        <button
                          key={idx}
                          id={`item-check-${idx}`}
                          onClick={() => handleToggleChecklist(activePlace.id, item)}
                          className={`flex items-start text-left gap-3 p-1.5 text-[11px] transition-colors hover:bg-white/[0.02] cursor-pointer`}
                        >
                          <div className={`mt-0.5 w-3.5 h-3.5 border flex items-center justify-center transition-all ${
                            isDone ? "border-emerald-500 bg-emerald-950/40 text-emerald-400" : "border-white/20"
                          }`}>
                            {isDone && <span className="w-1.5 h-1.5 bg-emerald-500"></span>}
                          </div>
                          <span className={`${isDone ? "line-through opacity-40 text-stone-500" : "text-stone-300"}`}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Destination Quick Index list drawer - easy navigation */}
                <div className="mb-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 block mb-2">
                    Explore Other Whispering Coordinate Ledger
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {destinations.map((d) => {
                      const isSelected = d.id === selectedId;
                      return (
                        <button
                          key={d.id}
                          id={`quick-select-${d.id}`}
                          onClick={() => { setSelectedId(d.id); triggerAtmosphericChime(220); }}
                          className={`px-2.5 py-1 text-[9px] font-mono border transition-all cursor-pointer ${
                            isSelected 
                              ? "border-emerald-500 bg-emerald-950/30 text-emerald-400" 
                              : "border-white/10 hover:border-white/30 text-white/50"
                          }`}
                        >
                          {d.name.split(" ").slice(-1)[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Local Protective Guide Block */}
              <div className="mt-8 border-t border-white/5 pt-6 flex items-start gap-4">
                <img 
                  src={activePlace.guide.avatar} 
                  alt={activePlace.guide.name} 
                  className="w-12 h-12 grayscale border border-white/10 brightness-90 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-mono uppercase text-white font-bold">{activePlace.guide.name}</h5>
                    <span className="text-[8px] font-mono text-emerald-500/80 bg-emerald-950/10 px-1 border border-emerald-900/30 uppercase tracking-tighter">Local Protector</span>
                  </div>
                  <p className="text-[10px] text-stone-400 italic font-serif leading-relaxed mt-1 mb-2">
                    &ldquo;{activePlace.guide.quote}&rdquo;
                  </p>
                  <span className="text-[8px] font-mono text-stone-500 uppercase tracking-normal">
                    Frequencies: <span className="text-stone-300">{activePlace.guide.contactWhisper}</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Right panel photography & interactive visual elements grid */}
            <div className="flex-1 flex flex-col relative bg-[#090909]">
              
              {/* Photo spotlight section */}
              <div className="flex-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700 group-hover:opacity-20"></div>
                <img 
                  src={activePlace.image} 
                  alt={activePlace.name} 
                  className="w-full h-full object-cover grayscale brightness-75 contrasts-115 absolute top-0 left-0 animate-slow-pan transform transition-all duration-1000"
                />

                {/* Overlay vignette visual gradient mapping */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30 z-20"></div>

                {/* Floating telemetry metrics overlay */}
                <div className="absolute top-6 left-8 z-30 font-mono text-[9px] space-y-1.5 bg-black/50 p-3 border border-white/5 backdrop-blur-md">
                  <div className="text-emerald-500 uppercase tracking-widest font-bold">Atmospheric Telemetry</div>
                  <div>Condition: {activePlace.weather.condition}</div>
                  <div>Temp: {activePlace.weather.temp} &bull; Moist Density: {activePlace.weather.mistDensity}</div>
                  <div>Moon Alignment: {activePlace.weather.moonPhase}</div>
                  <div>Relative Winds: {activePlace.weather.wind}</div>
                </div>

                {/* Floating checkable path overview */}
                <div className="absolute top-6 right-8 z-30 font-mono text-[9px] bg-black/50 p-3 border border-white/5 backdrop-blur-md text-right">
                  <div className="text-stone-400 uppercase tracking-widest">Adventure Path Overview</div>
                  <div className="text-white mt-1 font-semibold">{activePlace.adventure.name}</div>
                  <div className="text-emerald-400/90">{activePlace.adventure.difficulty} &bull; {activePlace.adventure.distance}</div>
                  <div className="text-stone-400 mt-1 uppercase">Approx Duration: {activePlace.adventure.duration}</div>
                </div>

                {/* Immersive Click to expand lightbox indicator */}
                <div className="absolute bottom-6 left-8 z-30">
                  <button
                    id="expand-lightbox-btn"
                    onClick={() => { setLightboxImage(activePlace.image); triggerAtmosphericChime(500); }}
                    className="flex items-center gap-2 group-hover:gap-4 transition-all px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/40 text-[9px] uppercase tracking-widest text-slate-200 cursor-pointer text-bold"
                  >
                    <Camera size={12} className="text-emerald-500 animate-pulse" />
                    Expand Photography Ledger
                  </button>
                </div>

                {/* Quick gallery stripe indicator right side bottom */}
                <div className="absolute bottom-6 right-8 z-30 flex gap-2">
                  {activePlace.gallery && activePlace.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setLightboxImage(img); triggerAtmosphericChime(440); }}
                      className="w-12 h-12 border border-white/10 hover:border-white/50 hover:scale-105 transition-all p-0.5 bg-black/60 cursor-crosshair overflow-hidden grayscale"
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Secret Food Establishments Sub-Section (Artistic Flair Layout Component) */}
              {activePlace.restaurants && activePlace.restaurants.length > 0 && (
                <div className="h-44 border-t border-white/5 bg-black/60 backdrop-blur-md p-6 flex flex-col md:flex-row gap-6 items-center justify-between select-none relative z-20">
                  <div className="flex gap-4 items-center w-full md:w-[60%]">
                    <img 
                      src={activePlace.restaurants[0].image} 
                      alt={activePlace.restaurants[0].name}
                      className="w-20 h-20 grayscale border border-white/10 shrink-0 object-cover"
                    />
                    <div>
                      <span className="text-emerald-500 text-[8px] uppercase tracking-widest font-mono font-bold flex items-center gap-1.5 mb-1">
                        <UtensilsCrossed size={10} />
                        {activePlace.restaurants[0].type} &bull; Local Hideaway
                      </span>
                      <h4 className="text-lg font-serif italic text-white mb-1">
                        {activePlace.restaurants[0].name}
                      </h4>
                      <p className="text-[10px] text-stone-400 leading-normal font-sans">
                        {activePlace.restaurants[0].description}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col md:items-end text-left md:text-right gap-2 border-l border-white/5 pl-4 md:pl-8">
                    <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest">
                      Legendary House Specialty / Beverage
                    </span>
                    <span className="text-stone-200 text-xs italic font-serif">
                      {activePlace.restaurants[0].specialty}
                    </span>
                    <span className="text-[8px] font-mono text-emerald-400">
                      Coordinates offset: {activePlace.restaurants[0].coordinates}
                    </span>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* =====================================
            TAB CONTENT: JOURNALS (Travel Storytelling)
           ===================================== */}
        {activeTab === "journals" && destinations.length > 0 && (
          <div className="flex-1 overflow-y-auto p-10 max-w-5xl mx-auto w-full relative">
            <div className="text-center mb-12">
              <span className="text-emerald-500 text-[10px] uppercase font-mono tracking-[0.3em] font-bold block mb-2">
                Cartographic Log Archives
              </span>
              <h2 className="text-4xl font-serif italic text-white tracking-wide">
                Traveler Journal Chronicles
              </h2>
              <div className="w-16 h-[1px] bg-emerald-500/40 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Write new chronic ledger panel */}
              <div className="lg:col-span-1 border border-white/10 bg-white/[0.01] p-6 rounded relative h-fit self-start">
                <h3 className="font-serif italic text-lg text-white mb-4 flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-500" />
                  Transcribe Your Story
                </h3>
                <p className="text-[10px] text-stone-400 leading-normal mb-6">
                  Log your observation, local guide frequencies, or weather occurrences regarding the current uncharted location. Your script will stand in the library of seekers.
                </p>

                <form onSubmit={handleAddJournal} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="text-[9px] text-[#10b981] uppercase block mb-1">Active Wayfarer Pseudonym</label>
                    <input 
                      type="text"
                      id="journal-author-input"
                      value={journalAuthor}
                      onChange={(e) => setJournalAuthor(e.target.value)}
                      placeholder="e.g., Nomad_V04"
                      className="w-full bg-[#0a0a0a] border border-white/10 px-3 py-2 text-[#dcdcdc] rounded focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-[#10b981] uppercase block mb-1">The Chronicle Content</label>
                    <textarea 
                      id="journal-content-input"
                      rows={5}
                      value={journalContent}
                      onChange={(e) => setJournalContent(e.target.value)}
                      placeholder="e.g., 'At dusk, the third grotto echoed with a high silver ring ...'"
                      className="w-full bg-[#0a0a0a] border border-white/10 px-3 py-2 text-[#dcdcdc] rounded focus:border-emerald-500 outline-none transition-colors resize-none leading-relaxed"
                      required
                    ></textarea>
                  </div>

                  <button
                    id="submit-journal-btn"
                    type="submit"
                    className="w-full py-2 bg-emerald-500 text-black text-[10px] uppercase font-bold tracking-widest hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    Commit Chronicle Log
                  </button>
                </form>
              </div>

              {/* Story scroll */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Ancient Curated Legend */}
                <div className="border border-emerald-950/40 bg-emerald-950/5 p-8 relative">
                  <div className="absolute top-4 right-4 text-[9px] font-mono text-emerald-500/80 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 tracking-tight uppercase">
                    Original Archive Chronicle &bull; {activePlace.coordinatesText}
                  </div>
                  <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest block mb-2">
                    LORE FILE: {activePlace.name}
                  </span>
                  <h3 className="text-2xl font-serif italic text-white mb-4">
                    The Melodic Geometrics of the Lands
                  </h3>
                  <div className="text-xs text-stone-300 leading-relaxed space-y-3 font-serif italic">
                    {activePlace.storytellingText.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Combined Wayfarer logs list */}
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>Traveler Observations List &bull; {activePlace.name}</span>
                    <span className="text-xs text-stone-500 font-normal">{(userJournals[activePlace.id] || []).length + 1} logged</span>
                  </h4>

                  <div className="space-y-4">
                    {/* User submitted additions */}
                    {(userJournals[activePlace.id] || []).map((journal, jIdx) => (
                      <div key={jIdx} className="p-5 border border-white/5 bg-white/[0.01]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-emerald-400 tracking-wider">
                            By Wayfarer: {journal.author}
                          </span>
                          <span className="text-[9px] font-mono text-stone-500">
                            Logged date {journal.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                          {journal.content}
                        </p>
                      </div>
                    ))}

                    {/* Standard First-hand observation logs */}
                    <div className="p-5 border border-white/5 bg-white/[0.01]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-[#dcdcdc]/60">
                          By Wayfarer: Eldon_Grey
                        </span>
                        <span className="text-[9px] font-mono text-stone-500">
                          Logged 2026-04-18
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                        Confirmed the acoustics loop coordinates. Be sure to arrive at the stone columns at low tide with footwear that dampens the gravel rustling of basalt. The cave reflects sound precisely after 6 seconds of static.
                      </p>
                    </div>

                    <div className="p-5 border border-white/5 bg-white/[0.01]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-[#dcdcdc]/60">
                          By Wayfarer: Lyra_Sands
                        </span>
                        <span className="text-[9px] font-mono text-stone-500">
                          Logged 2026-03-02
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                        Spent a night on the ridge, the local guide was incredibly knowledgeable with microclimatic mosses. Followed the loop coordinates safely, highly recommend carrying emergency lighting of high brightness.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* =====================================
            TAB CONTENT: MAPS (Immersive Core Radar Navigation)
           ===================================== */}
        {activeTab === "maps" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden select-none relative bg-[#040404]">
            
            {/* Interactive Grid map stage */}
            <div className="flex-1 relative border-r border-white/5 flex items-center justify-center overflow-hidden">
              
              {/* Outer compass coordinate tags */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/40 uppercase tracking-[0.4em]">0° North Grid line</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/40 uppercase tracking-[0.4em]">180° South Grid line</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-mono text-white/40 uppercase tracking-[0.4em]">270° West Meridian</div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[8px] font-mono text-white/40 uppercase tracking-[0.4em]">90° East Meridian</div>

              {/* Grid backdrop */}
              <div className="absolute inset-0 opacity-[0.06] flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex-1 grid grid-cols-12 grid-rows-12 gap-0 border border-white/10">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white/10"></div>
                  ))}
                </div>
              </div>

              {/* Large ambient circular vectors (Artistic Flair requirement) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] border border-white/10 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-[380px] h-[380px] border border-white/5 rounded-full flex items-center justify-center">
                  <div className="w-[180px] h-[180px] border border-white/5 border-dashed rounded-full"></div>
                </div>
              </div>

              {/* Rotating radar laser scanline */}
              <div 
                className="absolute w-[280px] h-[280px] origin-bottom-right bottom-1/2 right-1/2 pointer-events-none z-10"
                style={{ 
                  transform: `rotate(${activeRadarAngle}deg)`,
                  background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.05) 0%, transparent 80%)',
                  borderRadius: '100% 0 0 0'
                }}
              ></div>

              {/* Dynamic Coordinate Node Mapping wrapper */}
              <div className="w-[600px] h-[450px] relative z-20 border border-white/[0.04]">
                
                {/* Lat Lng Reference axis */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 border-dashed"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 border-dashed"></div>

                {/* Render nodes for all destinations listed */}
                {destinations.map((d, index) => {
                  // Normalize coordinate positioning inside visual container
                  // Center lat=37, lng=-100
                  const latOffset = ((d.lat - 37) * 4) + 50; 
                  const lngOffset = ((d.lng - (-100)) * 2) + 50;

                  // Constrain to percentages
                  const topPct = Math.max(10, Math.min(90, 100 - latOffset));
                  const leftPct = Math.max(10, Math.min(90, lngOffset));

                  const isSelected = d.id === selectedId;
                  const isHovered = hoveredNodeId === d.id;

                  return (
                    <div
                      key={d.id}
                      className="absolute group transition-all duration-500"
                      style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                      onMouseEnter={() => setHoveredNodeId(d.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                    >
                      {/* Interactive click zone anchor */}
                      <button
                        id={`map-node-${d.id}`}
                        onClick={() => { setSelectedId(d.id); triggerAtmosphericChime(320); }}
                        className="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-crosshair"
                      >
                        {/* Ring pulses */}
                        {isSelected && (
                          <div className="absolute w-8 h-8 rounded-full border border-emerald-500/50 animate-scanner"></div>
                        )}
                        
                        {/* Main Dot */}
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                          isSelected 
                            ? "bg-emerald-400/30 border border-emerald-400 scale-125 shadow-lg shadow-emerald-500/50" 
                            : "bg-white/20 border border-white/60 hover:bg-emerald-500/50 hover:border-emerald-400 group-hover:scale-110"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-400" : "bg-white"}`}></div>
                        </div>

                        {/* Text tooltip annotation label */}
                        <div className={`mt-2 bg-black/95 border px-2.5 py-0.5 backdrop-blur-md transition-all whitespace-nowrap pointer-events-none ${
                          isSelected 
                            ? "border-emerald-500/50 text-emerald-400 opacity-100 scale-100" 
                            : "border-white/10 text-white/60 opacity-20 group-hover:opacity-100 scale-95"
                        }`}>
                          <span className="text-[8px] font-mono uppercase tracking-widest block">
                            {d.name}
                          </span>
                        </div>

                        {/* Floating coordinate reading beneath active node */}
                        {isSelected && (
                          <span className="text-[7px] font-mono text-stone-500 mt-1">
                            {d.coordinatesText}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}

                {/* Anchor representing Custom Teleport Waypoint Click placement */}
                {customMarker && (
                  <div 
                    className="absolute"
                    style={{ 
                      top: `${Math.max(10, Math.min(90, 100 - (((customMarker.lat - 37) * 4) + 50)))}%`, 
                      left: `${Math.max(10, Math.min(90, (((customMarker.lng - (-100)) * 2) + 50)))}%`
                    }}
                  >
                    <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                      <div className="w-3 h-3 bg-red-500/30 border border-red-500 rounded-full animate-ping absolute"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="mt-2 bg-black border border-red-500/40 px-2 py-0.5 text-red-400 text-[8px] font-mono whitespace-nowrap">
                        TARGET WAYPOINT DETECTED
                      </div>
                      <button 
                        onClick={() => { setCustomMarker(null); triggerAtmosphericChime(150); }}
                        className="text-[7px] text-red-500 hover:text-white uppercase font-mono tracking-tighter mt-1 hover:underline"
                      >
                        [clear]
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Interactive map prompt instructions */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between text-[9px] font-mono text-stone-500 select-none pointer-events-none">
                <div>[ SCALE: {mapScale}x ] &bull; [ FOCUS: {viewportCenter.lat.toFixed(4)} N, {viewportCenter.lng.toFixed(4)} W ]</div>
                <div>[ CLICK TO SHIFT TARGET GRID OR CHOOSE IN ARCHIVE ]</div>
              </div>

            </div>

            {/* Right lateral sidebar telemetry info */}
            <div className="w-full lg:w-96 p-8 flex flex-col justify-between bg-black/60 backdrop-blur-md border-t lg:border-t-0 border-white/5 overflow-y-auto">
              <div>
                <span className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest block mb-1">
                  Scanner telemetry coordinates
                </span>
                <h3 className="text-xl font-serif italic text-white mb-6">
                  Target Vector Trajectory
                </h3>

                {/* Waypoint details grid */}
                <div className="space-y-6 font-mono text-xs">
                  
                  <div className="p-4 border border-white/5 bg-white/[0.01]">
                    <span className="text-[8px] text-stone-500 uppercase">Selected Coordinates Lock</span>
                    <h5 className="text-sm font-semibold text-white mt-1 uppercase">
                      {activePlace.name}
                    </h5>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-stone-300">
                      <div>LAT: {activePlace.lat.toFixed(4)}°</div>
                      <div>LNG: {activePlace.lng.toFixed(4)}°</div>
                      <div>MYSTERY: {activePlace.mysteryLevel}/5</div>
                      <div>ELEVATION: 120M</div>
                    </div>
                  </div>

                  {/* Calculations offsets */}
                  <div className="space-y-3">
                    <span className="text-[8px] text-stone-500 uppercase tracking-widest block border-b border-white/5 pb-1">
                      Distance calculation (From center meridian point)
                    </span>
                    
                    <div className="space-y-2 text-[10px] text-stone-400">
                      <div className="flex justify-between">
                        <span>Central Base bearing:</span>
                        <span className="text-stone-300 font-semibold">
                          {getSimulatedBearing(viewportCenter, {lat: 37.0, lng: -100.0})}° NE
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Radial distance:</span>
                        <span className="text-emerald-400 font-semibold">
                          {getSimulatedDistance(viewportCenter, {lat: 37.0, lng: -100.0})} leagues
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coordinate sector:</span>
                        <span className="text-stone-300 font-mono">
                          SEC_{String(Math.abs(Math.round(activePlace.lat))).padStart(2, "0")}N_01
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Manual coordinate placement input widget */}
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[8px] text-stone-500 uppercase tracking-widest block mb-2">
                      Place Custom Marker Overlay
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number"
                        id="custom-lat-input"
                        placeholder="Lat (e.g. 35)"
                        className="bg-[#0a0a0a] border border-white/10 p-2 text-[10px] text-white rounded outline-none focus:border-emerald-500"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            setCustomMarker(prev => ({
                              lat: val,
                              lng: prev?.lng || -120,
                              label: "UNIDENTIFIED ANOMALY"
                            }));
                          }
                        }}
                      />
                      <input 
                        type="number"
                        id="custom-lng-input"
                        placeholder="Lng (e.g. -115)"
                        className="bg-[#0a0a0a] border border-white/10 p-2 text-[10px] text-white rounded outline-none focus:border-emerald-500"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            setCustomMarker(prev => ({
                              lat: prev?.lat || 35,
                              lng: val,
                              label: "UNIDENTIFIED ANOMALY"
                            }));
                          }
                        }}
                      />
                    </div>
                    <p className="text-[8px] text-stone-400/80 leading-normal mt-1.5">
                      Input remote GPS boundaries inside the sandbox framework to scan anomalies relative to our archives.
                    </p>
                  </div>

                </div>
              </div>

              <div className="border-t border-white/5 pt-6 mt-6">
                {/* Simulated map scanning speed adjuster */}
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-2">
                  <span>Cartographer Radar Speed:</span>
                  <span className="text-emerald-400">Scan Active</span>
                </div>
                <div className="w-full bg-white/5 h-[1px] relative">
                  <div className="h-full bg-emerald-500 w-3/4 animate-pulse"></div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =====================================
            TAB CONTENT: GUIDES DIRECTORY
           ===================================== */}
        {activeTab === "guides" && (
          <div className="flex-1 overflow-y-auto p-10 max-w-5xl mx-auto w-full select-none">
            <div className="text-center mb-10">
              <span className="text-emerald-500 text-[10px] font-mono uppercase tracking-[0.3em] font-bold block mb-2">
                Protected Frequencies Ledger
              </span>
              <h2 className="text-3xl font-serif italic text-white tracking-wide">
                Pathfinders of the Unmapped Boundaries
              </h2>
              <div className="w-16 h-[1px] bg-emerald-500/40 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {destinations.map((d) => (
                <div key={d.guide.id} className="border border-white/10 bg-white/[0.01] p-6 flex flex-col sm:flex-row gap-6 items-start">
                  <img 
                    src={d.guide.avatar} 
                    alt={d.guide.name} 
                    className="w-20 h-20 grayscale object-cover border border-white/10 brightness-95"
                  />
                  <div className="flex-1 font-mono text-xs">
                    <span className="text-emerald-500 text-[8px] uppercase tracking-widest block mb-1">
                      Assigned to: {d.name}
                    </span>
                    <h4 className="text-base font-serif italic text-white mb-2">
                      {d.guide.name}
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-relaxed font-sans mb-3">
                      {d.guide.bio}
                    </p>
                    <div className="p-3 border border-emerald-900/30 bg-emerald-950/20 text-emerald-400/95 italic font-serif text-[11px] mb-3">
                      &ldquo;{d.guide.quote}&rdquo;
                    </div>
                    <div className="text-[9px] text-[#dcdcdc]/75 flex justify-between items-center bg-[#0a0a0a] p-2 border border-white/5">
                      <span>VHF Channel: {d.guide.contactWhisper}</span>
                      <button
                        onClick={() => {
                          triggerAtmosphericChime(220);
                          alert(`Initiating simulated VHF radio transmission link with ${d.guide.name}...\nSignal ping success. Ch: ${d.guide.contactWhisper}`);
                        }}
                        className="text-emerald-400 hover:text-white uppercase text-[8px] hover:underline cursor-pointer"
                      >
                        [Transmit Signal]
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================
            FOOTER STATUS LEDGER (Artistic Flair Layout)
           ===================================== */}
        <footer className="h-16 border-t border-white/5 flex items-center px-10 justify-between bg-black/80 backdrop-blur-md text-slate-400 text-[10px] font-mono z-25">
          <div className="flex gap-8 items-center">
            <span className="text-[9px] uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <span>Storytelling Mode:</span> 
              <button 
                onClick={() => { setStorytellingMode(!storytellingMode); triggerAtmosphericChime(storytellingMode ? 140 : 280); }}
                className={`px-1.5 py-0.5 border text-[9px] rounded uppercase font-bold transition-colors cursor-pointer ${
                  storytellingMode ? "border-emerald-500 text-emerald-400 bg-emerald-950/10" : "border-white/10 text-stone-500"
                }`}
              >
                {storytellingMode ? "ON" : "OFF"}
              </button>
            </span>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">
              Active Weather: <span className="text-[#dcdcdc] font-normal">
                {activePlace ? `${activePlace.weather.temp} &bull; ${activePlace.weather.condition}` : "Retrieving atmospheric data"}
              </span>
            </span>
          </div>

          <div className="flex gap-8 items-center">
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-widest text-[#dcdcdc]/80">
                {destinations.length} coordinates archived
              </span>
            </div>
            
            <div className="flex gap-6 items-center">
              <div className="flex -space-x-2">
                {destinations.map((d, i) => (
                  <img
                    key={d.id}
                    src={d.guide.avatar}
                    alt="Guide"
                    className="w-5 h-5 rounded-full border border-black grayscale object-cover"
                    title={d.guide.name}
                  />
                ))}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-stone-500">
                {destinations.length} Protectors Online
              </span>
            </div>
          </div>
        </footer>

      </main>

      {/* =====================================
          3. SIDE DRAWER: THE ARCHIVIST CHAT (AI Trip Assistant)
         ===================================== */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex justify-end select-none">
          <div className="w-full max-w-lg bg-[#080808] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl relative">
            
            {/* Ambient dust overlay */}
            <div className="absolute inset-0 overlay-grain opacity-15 pointer-events-none"></div>

            {/* Title room header */}
            <div className="p-6 border-b border-white/5 bg-black/30 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-sm font-mono tracking-[0.3em] uppercase text-white font-bold">The Archivist</h3>
                  <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Cloaked Guardian of Coordinates</span>
                </div>
              </div>
              <button
                id="close-chat-btn"
                onClick={() => { setChatOpen(false); triggerAtmosphericChime(150); }}
                className="p-1.5 border border-white/10 hover:border-white/30 text-stone-400 hover:text-white rounded cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Message thread viewer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 bg-black/40">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <div className={`p-4 rounded text-xs leading-relaxed font-sans ${
                    msg.role === "user" 
                      ? "bg-stone-900 border border-white/15 text-slate-100" 
                      : "bg-[#0b100e] border border-emerald-900/30 text-stone-300"
                  }`}>
                    {/* Preserve and format newlines with simple breaks for cinematic reading */}
                    {msg.content.split("\n\n").map((para, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">
                        {para}
                      </p>
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-stone-500 mt-1 uppercase">
                    {msg.role === "user" ? "Wayfarer" : "Archivist"} &bull; {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Bot thinking state indicator */}
              {chatLoading && (
                <div className="flex flex-col items-start mr-auto max-w-[85%]">
                  <div className="p-4 rounded bg-[#0b100e] border border-emerald-900/30 text-stone-400 text-xs flex items-center gap-3">
                    <Loader className="animate-spin text-emerald-500" size={13} />
                    <span>The Archivist consults old ledger scripts...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat inputs panel */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black z-10">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="chat-input-field"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Inquire of paths, provisions, or hidden legends..."
                  className="flex-1 bg-stone-900/80 border border-white/10 px-4 py-2.5 text-xs text-[#dcdcdc] rounded focus:border-emerald-500 outline-none transition-colors"
                  disabled={chatLoading}
                />
                <button
                  id="send-msg-btn"
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 rounded hover:scale-[1.02] transition-all flex items-center justify-center cursor-pointer"
                  disabled={chatLoading}
                >
                  <Send size={13} />
                </button>
              </div>
              <p className="text-[8px] text-stone-600 mt-2 text-center uppercase tracking-widest leading-relaxed">
                By typing, you query server-side archives backed by Gemini 3.5 Flash artificial intelligence.
              </p>
            </form>

          </div>
        </div>
      )}

      {/* =====================================
          4. MODAL: WHISPER PATH SUGGESTION GENERATOR (AI suggest endpoint wrapper)
         ===================================== */}
      {suggestionOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-lg bg-[#080808] border border-white/15 p-6 rounded relative flex flex-col gap-5 overflow-hidden shadow-2xl">
            
            {/* Glowing active field corner style */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500"></div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400 animate-pulse" />
                <h3 className="font-serif italic text-lg text-white">Whisper Path Generator</h3>
              </div>
              <button
                id="close-whisper-btn"
                onClick={() => { setSuggestionOpen(false); triggerAtmosphericChime(150); }}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] text-stone-400 leading-normal">
              Whisper your atmospheric desire, thematic category, or geographical keywords to the ancient winds. Gemini constructs a majestic uncharted destination complete with local myth, coordinates, guide details, and survival checklists in our files.
            </p>

            <div className="space-y-4 font-mono text-xs">
              
              <div>
                <label className="text-[10px] text-emerald-500 uppercase block mb-1">Atmospheric alignment</label>
                <select 
                  id="preset-atmosphere-select"
                  value={suggestionAtmosphere}
                  onChange={(e) => setSuggestionAtmosphere(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 p-2 text-stone-300 rounded outline-none focus:border-emerald-500"
                >
                  <option value="Bioluminescent Cave and Glowing Moss">Bioluminescent Cave & Glowing Moss</option>
                  <option value="Frozen Aurora Cliffs & Eternal Silence">Frozen Aurora Cliffs & Silence</option>
                  <option value="Sunken Canyon of Subterranean Streams">Sunken Canyon & Streams</option>
                  <option value="Old Desert Ruins & Warm Salt Mist">Old Desert Ruins & Salt Mist</option>
                  <option value="Misty Rainforest Canopy at Mooncrest">Rainforest Canopy at Mooncrest</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-emerald-500 uppercase block mb-1">Thematic Category</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(["ruins", "sanctuary", "shore", "abyss", "forest"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSuggestionCategory(cat)}
                      className={`py-1.5 text-[8px] font-mono border uppercase text-center transition-all cursor-pointer ${
                        suggestionCategory === cat
                          ? "border-emerald-500 bg-emerald-950/40 text-emerald-400"
                          : "border-white/10 text-stone-400 hover:border-white/30"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-emerald-500 uppercase block mb-1">Geographical Keyword (Optional)</label>
                <input 
                  type="text"
                  id="keyword-input"
                  value={suggestionKeyword}
                  onChange={(e) => setSuggestionKeyword(e.target.value)}
                  placeholder="e.g., forgotten lighthouse, obsidian mirror fissure"
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3 py-2 text-[#dcdcdc] rounded focus:border-emerald-500 outline-none transition-colors"
                />
              </div>

              {generationError && (
                <div className="p-3 border border-red-500/30 bg-red-950/10 text-red-400/90 text-[10px] rounded flex gap-2 items-start">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{generationError}</span>
                </div>
              )}

              {isGenerating ? (
                <div className="py-4 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
                  <Loader className="animate-spin text-emerald-500" size={18} />
                  <span className="font-serif italic animate-pulse">Whispering to the cartography maps ledger ...</span>
                </div>
              ) : (
                <button
                  id="submit-whisper-btn"
                  onClick={handleWhisperNewPlace}
                  className="w-full py-3 bg-emerald-500 text-black text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-emerald-400 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  Whisper request to the winds
                </button>
              )}

            </div>

          </div>
        </div>
      )}

      {/* =====================================
          5. MODAL LIGHTBOX: PHOTOGRAPHY LEDGER Full Immersive Theater Mode
         ===================================== */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 cursor-zoom-out select-none"
          onClick={() => { setLightboxImage(null); triggerAtmosphericChime(150); }}
        >
          <div className="absolute top-4 right-4 text-stone-500 font-mono text-[9px] uppercase tracking-widest bg-black/50 px-3 py-1.5 border border-white/5 backdrop-blur-md">
            [ CLICK ANYWHERE TO LEAVE LIGHTROOM ]
          </div>
          
          <div className="relative max-w-4xl max-h-[85vh] border border-white/10 p-1.5 bg-[#030303] flex flex-col">
            <img 
              src={lightboxImage} 
              alt="Cinematic Snapshot" 
              className="max-w-full max-h-[75vh] object-contain grayscale-0 brightness-100 transition-all duration-700 hover:grayscale-[0.5]"
            />
            
            {/* Photographic ledger caption */}
            <div className="p-4 border-t border-white/5 bg-black/40 mt-1 flex justify-between text-[9px] font-mono text-stone-400">
              <div>IMAGE INDEX PIN ID: #{activePlace?.id || "WF_01"}</div>
              <div>GEOMETRY SECTOR COORDINATES: {activePlace?.coordinatesText || "UNMAPPED"}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
