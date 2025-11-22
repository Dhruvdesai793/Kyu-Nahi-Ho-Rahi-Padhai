import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  BookOpen, Instagram, Volume2, Zap, 
  CheckCircle, Plus, Trash2, Github, Linkedin, Twitter,
  Terminal, AlertTriangle, GraduationCap, Users, Flame, 
  PhoneCall, Siren, Star, Ghost, X, Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';

const REPO_URL = "https://github.com/Dhruvdesai793/Kyu-Nahi-Ho-Rahi-Padhai";
const BASE_PATH = import.meta.env.BASE_URL;

const SOCIALS = [
  { name: "GitHub", icon: <Github size={18} />, url: "https://github.com/Dhruvdesai793", color: "hover:text-white", bg: "hover:bg-black" },
  { name: "X", icon: <Twitter size={18} />, url: "https://x.com/Noctravellian", color: "hover:text-blue-400", bg: "hover:bg-blue-900/30" },
  { name: "LinkedIn", icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/dhruv-desai-b0779b370/", color: "hover:text-blue-600", bg: "hover:bg-blue-900/30" }
];

const MENTORS = {
  alakh: {
    name: "Alakh Sir",
    bg: "bg-gradient-to-b from-red-950 via-black to-black",
    button: "bg-red-600 hover:bg-red-700 shadow-red-500/30",
    accent: "text-red-500",
    gif: `${BASE_PATH}meme.gif`,
    audio: `${BASE_PATH}scolding.mp3`,
    catchphrase: "KYU NAHI HO RAHI PADHAI?!",
  },
  saleem: {
    name: "Saleem Sir",
    bg: "bg-gradient-to-b from-orange-950 via-black to-black",
    button: "bg-orange-600 hover:bg-orange-700 shadow-orange-500/30",
    accent: "text-yellow-400",
    gif: `${BASE_PATH}saleem.gif`,
    audio: `${BASE_PATH}saleem_audio.mp3`,
    catchphrase: "PADHLE B K L !!!",
  }
};

function App() {
  const [mode, setMode] = useState('roast'); 
  const [mentor, setMentor] = useState('alakh');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [runawayPos, setRunawayPos] = useState({ x: 0, y: 0 });
  const [shameLevel, setShameLevel] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [flashText, setFlashText] = useState(null);
  const [liveWasters, setLiveWasters] = useState(14203);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('studyStreak')) || 0);
  const [agreed, setAgreed] = useState(false);
  const [fakeCall, setFakeCall] = useState(false);
  
  const controls = useAnimation();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "NAHI HOGA SELECTION 😡";
      } else {
        document.title = "Padhai Karo! (Saved You)";
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWasters(prev => prev + Math.floor(Math.random() * 5) - 1);
      if (mode === 'roast' && Math.random() > 0.995) {
        setFakeCall(true);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [mode]);

  const playAudio = () => {
    const audioPath = MENTORS[mentor].audio;
    const audio = new Audio(audioPath);
    audio.volume = 1.0;
    controls.start({ x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } });
    
    const roasts = ["Awara gardi band kardo!", "Future khatre mein hai!", "Selection bhool jao!", "Instagram delete kar de!"];
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    triggerFlashText(randomRoast);
    
    audio.play().catch((e) => console.log("Audio missing at path:", audioPath, e));
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
  };

  const triggerFlashText = (text) => {
    setFlashText(text);
    setTimeout(() => setFlashText(null), 1500);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
      new Audio('https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg').play();
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('studyStreak', newStreak);
      triggerFlashText("YOU SURVIVED!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStartStudy = () => {
      if (!agreed) {
          alert("Sign the contract first! Or are you scared?");
          return;
      }
      setMode('study');
      if (navigator.vibrate) navigator.vibrate(50);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const moveButton = () => {
    const maxWidth = window.innerWidth > 768 ? 400 : 150;
    const x = (Math.random() - 0.5) * maxWidth;
    const y = (Math.random() - 0.5) * maxWidth;
    setRunawayPos({ x, y });
    setShameLevel(prev => prev + 1);
    
    const insults = ["LMAO NOPE", "TRY HARDER", "SLOW HANDS?", "PADH LE BHAI", "NOT TODAY"];
    const randomInsult = insults[Math.floor(Math.random() * insults.length)];
    
    if (shameLevel > 2) triggerFlashText(randomInsult);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div 
      animate={controls}
      className={`min-h-screen transition-colors duration-700 text-white font-sans overflow-x-hidden relative flex flex-col
        ${mode === 'study' ? 'bg-slate-950' : MENTORS[mentor].bg}`}
    >
      <div className="pointer-events-none fixed inset-0 z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="pointer-events-none fixed inset-0 z-40 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] animate-scanline"></div>

      <AnimatePresence>
        {fakeCall && (
            <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-2xl">
                    <Users size={48} className="text-gray-400 md:w-16 md:h-16" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-2">Mummy ❤️</h2>
                <p className="text-lg md:text-xl text-gray-400 mb-12 animate-pulse">Incoming Call...</p>
                
                <div className="flex gap-8 md:gap-16 w-full justify-center">
                    <button onClick={() => setFakeCall(false)} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                            <PhoneCall className="rotate-[135deg] w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <span className="text-xs md:text-sm font-medium">Decline</span>
                    </button>
                    <button onClick={() => { setFakeCall(false); setMode('study'); }} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center animate-shake shadow-lg shadow-green-500/50">
                            <PhoneCall className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <span className="text-xs md:text-sm font-medium">Study</span>
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flashText && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
                exit={{ opacity: 0, scale: 2 }}
                className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none backdrop-blur-sm p-4"
            >
                <h1 className="text-5xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_10px_10px_rgba(0,0,0,1)] text-center leading-tight stroke-black break-words w-full">
                    {flashText}
                </h1>
            </motion.div>
        )}
      </AnimatePresence>

      <nav className="w-full p-4 md:p-6 flex justify-between items-center z-20 border-b border-white/5 bg-black/30 backdrop-blur-lg sticky top-0">
        <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                {mode === 'roast' ? <Siren className="text-red-500 animate-pulse w-5 h-5 md:w-6 md:h-6" /> : <Zap className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" />}
            </div>
            <div>
                <h1 className="text-sm md:text-lg font-black tracking-wider leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {mode === 'roast' ? 'ROAST_OS v4.1' : 'FOCUS_HUB'}
                </h1>
                <p className="text-[8px] md:text-[10px] text-gray-400 tracking-[0.2em] uppercase">
                    {mode === 'roast' ? 'NO MERCY' : 'LOCKED IN'}
                </p>
            </div>
        </div>

        <a 
            href={REPO_URL} 
            target="_blank" 
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 rounded-full text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all animate-bounce shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        >
            <Star size={14} fill="currentColor" />
            STAR REPO
        </a>
        
        <a 
            href={REPO_URL} 
            target="_blank"
            className="md:hidden p-2 bg-yellow-500/10 rounded-full text-yellow-400 border border-yellow-500/50"
        >
            <Star size={16} fill="currentColor" />
        </a>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col items-center relative z-10">
        <AnimatePresence mode="wait">
          
          {mode === 'roast' ? (
            <motion.div 
                key="roast"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                className="w-full flex flex-col items-center gap-6 md:gap-8"
            >
              
              <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-2xl text-xs font-mono text-gray-400 mb-2 bg-black/40 p-3 rounded-lg border border-white/10 gap-2">
                  <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      {liveWasters.toLocaleString()} procrastinating
                  </span>
                  <span className="flex items-center gap-2 text-orange-400">
                      <Flame size={14} />
                      Streak: {streak} Days
                  </span>
              </div>

              <div className="relative group w-full max-w-2xl aspect-video bg-black rounded-xl border-2 border-white/10 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <img 
                  src={MENTORS[mentor].gif} 
                  className="w-full h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4 md:p-6 z-20">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] md:text-xs text-red-500 font-mono mb-1 tracking-widest">/// TARGET LOCKED</p>
                            <h2 className={`text-2xl md:text-5xl font-black italic uppercase ${MENTORS[mentor].accent} drop-shadow-md leading-tight`}>
                                "{MENTORS[mentor].catchphrase}"
                            </h2>
                        </div>
                        <div className="flex flex-col gap-2">
                             {Object.keys(MENTORS).map((key) => (
                                <button 
                                    key={key}
                                    onClick={() => setMentor(key)}
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all text-xs md:text-sm font-bold ${mentor === key ? 'border-white bg-white text-black scale-110' : 'border-gray-600 bg-black text-gray-500'}`}
                                >
                                    {key === 'alakh' ? 'A' : 'S'}
                                </button>
                             ))}
                        </div>
                    </div>
                </div>
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-between backdrop-blur-md gap-4 md:gap-0 hover:bg-white/10 transition-colors"
              >
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-3 rounded-lg text-white shadow-lg">
                        <Terminal size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                            Dhruv Desai <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">DEV</span>
                        </h3>
                        <p className="text-[10px] text-gray-400 font-mono">ENGINEERING CHAOS</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
                    {SOCIALS.map((social) => (
                        <a 
                            key={social.name} 
                            href={social.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`p-2.5 rounded-lg transition-all ${social.color} ${social.bg} border border-white/5 hover:border-white/20`}
                        >
                            {social.icon}
                        </a>
                    ))}
                 </div>
              </motion.div>

              <div className="flex flex-col gap-4 w-full max-w-lg">
                 <div 
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${agreed ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/10 border-red-500/30 hover:bg-red-900/20'}`} 
                    onClick={() => setAgreed(!agreed)}
                 >
                    <div className={`mt-0.5 w-5 h-5 min-w-[1.25rem] rounded border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500'}`}>
                        {agreed && <CheckCircle size={14} className="text-black" />}
                    </div>
                    <p className="text-xs text-gray-300 select-none leading-relaxed">
                        I admit I am wasting time and I agree to <span className="font-bold text-white">lock in</span> immediately.
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={playAudio}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col md:flex-row items-center justify-center gap-2 font-bold text-xs md:text-sm transition-colors"
                    >
                        <Volume2 size={18} /> ROAST ME
                    </motion.button>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartStudy}
                        className={`p-4 rounded-xl ${MENTORS[mentor].button} shadow-lg flex flex-col md:flex-row items-center justify-center gap-2 font-bold text-xs md:text-sm text-white transition-all ${!agreed ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                        <BookOpen size={18} /> START STUDYING
                    </motion.button>
                 </div>
              </div>

              <div className="relative w-full h-24 flex justify-center items-center overflow-hidden">
                <motion.button
                    animate={{ x: runawayPos.x, y: runawayPos.y }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    onTouchStart={moveButton}
                    onMouseEnter={moveButton}
                    className="px-6 py-2 bg-slate-800 rounded-full font-mono text-xs text-gray-500 border border-slate-700 flex items-center gap-2 hover:text-pink-500 hover:border-pink-500 transition-colors cursor-none select-none z-30"
                >
                    <Instagram size={14} /> just_5_mins.exe
                </motion.button>
              </div>

            </motion.div>
          ) : (
            <motion.div 
                key="study"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 items-stretch h-full"
            >
                <div className="w-full lg:w-1/2 bg-slate-900/80 p-6 md:p-10 rounded-3xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-xl min-h-[400px]">
                    
                    <div className="relative z-10">
                        <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                            <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                strokeDasharray="283%"
                                strokeDashoffset={`${(283 * ((1500 - timeLeft) / 1500))} %`}
                                strokeLinecap="round"
                                className="text-blue-500 transition-all duration-1000 ease-linear" 
                                style={{ strokeDasharray: '283% 283%' }}
                            />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                            <span className="text-6xl md:text-8xl font-mono font-bold text-white tracking-tighter">
                                {formatTime(timeLeft)}
                            </span>
                            <div className="flex items-center gap-2 mt-4">
                                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-ping' : 'bg-red-500'}`}></div>
                                <span className="text-xs text-blue-400 uppercase tracking-widest">Session Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-12 z-10 w-full justify-center">
                        <button 
                            onClick={() => setIsActive(!isActive)}
                            className={`px-8 py-4 rounded-full font-bold transition-all transform active:scale-95 border w-40 shadow-lg ${isActive ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500'}`}
                        >
                            {isActive ? "PAUSE" : "START"}
                        </button>
                        <button 
                            onClick={() => {
                                if(window.confirm("Are you sure? Your competition is still studying.")) {
                                    setMode('roast');
                                }
                            }}
                            className="px-6 py-4 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-sm font-bold border border-slate-700"
                        >
                            GIVE UP
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex flex-col backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
                            <GraduationCap /> Tasks
                        </h3>
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
                    </div>
                    
                    <form onSubmit={addTask} className="flex gap-2 mb-6">
                        <input 
                            type="text" 
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add Topic..."
                            className="flex-1 bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white"
                        />
                        <button type="submit" className="p-3 bg-emerald-600 rounded-xl text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20">
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar max-h-[300px] lg:max-h-[500px]">
                        {tasks.length === 0 && (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-slate-800 rounded-xl">
                                <Ghost size={24} className="mb-2 opacity-50" />
                                <p className="text-sm">No tasks? You will fail.</p>
                            </div>
                        )}
                        <AnimatePresence>
                            {tasks.map(task => (
                                <motion.div 
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${task.completed ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-slate-800/50 border-slate-700'}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <button onClick={() => toggleTask(task.id)} className={`flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-500 hover:text-emerald-400'}`}>
                                            <CheckCircle size={20} />
                                        </button>
                                        <span className={`text-sm truncate ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                                            {task.text}
                                        </span>
                                    </div>
                                    <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-800 text-center">
                         <p className="text-xs text-slate-600">Dhruv Desai • Focus OS v4.1</p>
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

export default App;