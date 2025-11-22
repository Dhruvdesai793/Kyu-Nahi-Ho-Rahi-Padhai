import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Instagram, Volume2, Flame, Zap, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';

// Configuration for our Roast Masters
const MENTORS = {
  alakh: {
    name: "Alakh Sir",
    color: "from-red-600 to-red-900",
    accent: "text-red-500",
    gif: "/meme.gif",
    audio: "/scolding.mp3",
    catchphrase: "KYU NAHI HO RAHI PADHAI?!",
    fallbackGif: "https://media.tenor.com/K2qJ9dcF5uUAAAAC/alakh-pandey-physics-wallah.gif"
  },
  saleem: {
    name: "Saleem Sir",
    color: "from-yellow-600 to-orange-900",
    accent: "text-yellow-400",
    gif: "/saleem.gif",
    audio: "/saleem_audio.mp3",
    catchphrase: "B K L !!!",
    fallbackGif: "https://media1.tenor.com/m/8sTm-C0sWqEAAAAd/saleem-sir-pw-pw.gif" // Placeholder GIF
  }
};

function App() {
  const [mode, setMode] = useState('roast'); // 'roast' or 'study'
  const [mentor, setMentor] = useState('alakh'); // 'alakh' or 'saleem'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [runawayPos, setRunawayPos] = useState({ x: 0, y: 0 });
  const [shameLevel, setShameLevel] = useState(0);
  const [flashText, setFlashText] = useState(null);
  
  // Audio Refs
  const audioRef = useRef(null);

  // Function to play audio based on current mentor
  const playAudio = () => {
    const audioPath = MENTORS[mentor].audio;
    const audio = new Audio(audioPath);
    audio.volume = 1.0;
    
    audio.play().catch(e => {
      console.log("Audio file missing, showing visual text instead");
      triggerFlashText(MENTORS[mentor].catchphrase);
    });

    // If Saleem sir, shake the screen violently
    if (mentor === 'saleem') {
        triggerFlashText("B K L !");
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
    }
  };

  const triggerFlashText = (text) => {
    setFlashText(text);
    setTimeout(() => setFlashText(null), 1000);
  };

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(time => time - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      confetti();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const moveButton = () => {
    const x = Math.random() * (window.innerWidth - 200);
    const y = Math.random() * (window.innerHeight - 100);
    setRunawayPos({ x, y });
    setShameLevel(prev => prev + 1);
    
    // If Saleem sir is selected, he abuses you when you try to touch the button
    if (mentor === 'saleem' && Math.random() > 0.5) {
        triggerFlashText("PADHLE BKL!");
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${mode === 'study' ? 'bg-slate-900' : 'bg-neutral-950'} text-white font-sans overflow-hidden relative`}>
      
      {/* FLASH OVERLAY FOR SALEEM SIR */}
      <AnimatePresence>
        {flashText && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
                <h1 className="text-9xl font-black text-red-600 stroke-white drop-shadow-[0_0_30px_rgba(255,0,0,0.8)] rotate-[-10deg]">
                    {flashText}
                </h1>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${mode === 'roast' ? MENTORS[mentor].color : 'from-slate-800 to-slate-900'} opacity-20 pointer-events-none transition-colors duration-1000`} />

      <nav className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-black flex items-center gap-2">
            {mode === 'roast' ? '🔥 ROAST METER' : '🧘‍♂️ ZEN MODE'}
        </h1>
        
        {/* MENTOR SWITCHER */}
        {mode === 'roast' && (
            <div className="flex bg-black/30 rounded-full p-1 border border-white/10">
                <button 
                    onClick={() => setMentor('alakh')}
                    className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${mentor === 'alakh' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Alakh Sir
                </button>
                <button 
                    onClick={() => setMentor('saleem')}
                    className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${mentor === 'saleem' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    Saleem Sir
                </button>
            </div>
        )}
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {mode === 'roast' ? (
            <motion.div 
                key="roast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-3xl text-center"
            >
              {/* MEME DISPLAY */}
              <div className={`relative group mx-auto w-full max-w-lg aspect-video bg-black rounded-2xl border-4 ${mentor === 'saleem' ? 'border-yellow-500/50' : 'border-red-500/50'} overflow-hidden shadow-2xl`}>
                <img 
                  key={mentor} // Force re-render on mentor switch
                  src={MENTORS[mentor].gif}
                  onError={(e) => e.target.src = MENTORS[mentor].fallbackGif}
                  alt="Meme"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 p-4">
                   <p className={`font-black text-3xl italic ${MENTORS[mentor].accent}`}>
                        "{MENTORS[mentor].catchphrase}"
                   </p>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button 
                    onClick={playAudio}
                    className={`p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 font-bold text-xl active:scale-95`}
                >
                    <Volume2 /> 
                    {mentor === 'saleem' ? "TRIGGER BKL" : "SCREAM AT ME"}
                </button>
                
                <button 
                    onClick={() => triggerFlashText(mentor === 'saleem' ? "MAKAAN KHALI KARO!" : "SELECTION HOGA YAHIN SE")}
                    className={`p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 font-bold active:scale-95`}
                >
                    <Zap /> 
                    Damage Control
                </button>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-16 flex flex-col items-center gap-6 relative h-40">
                <button 
                    onClick={() => setMode('study')}
                    className="z-20 px-10 py-5 bg-green-600 hover:bg-green-500 rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center gap-3"
                >
                    <BookOpen size={28} /> PADHNE JA RAHA HU
                </button>

                {/* THE RUNAWAY BUTTON */}
                <motion.button
                    animate={{ x: runawayPos.x, y: runawayPos.y }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onMouseEnter={moveButton}
                    className={`absolute z-10 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600`}
                >
                    <Instagram size={18} /> Reel Scroll Karu?
                </motion.button>
              </div>

              {shameLevel > 3 && (
                <p className="mt-8 text-gray-400 animate-pulse">
                    Attempts to waste time: <span className="text-red-500 font-bold">{shameLevel}</span>
                </p>
              )}

            </motion.div>
          ) : (
            /* STUDY MODE */
            <motion.div 
                key="study"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md text-center pt-10"
            >
                <div className="w-72 h-72 mx-auto rounded-full border-[12px] border-slate-800 flex items-center justify-center bg-slate-900 relative shadow-[0_0_50px_rgba(96,165,250,0.2)]">
                    <span className="text-7xl font-mono font-bold tracking-tighter text-blue-400">
                        {formatTime(timeLeft)}
                    </span>
                    {isActive && <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin duration-3000"></div>}
                </div>

                <div className="mt-10 flex justify-center gap-6">
                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all hover:scale-105"
                    >
                        {isActive ? "PAUSE" : "START FOCUS"}
                    </button>
                </div>

                <button 
                    onClick={() => setMode('roast')} 
                    className="mt-12 text-slate-500 hover:text-red-400 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                    <Flame size={14} /> I'm feeling lazy again (Return to Roast)
                </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;