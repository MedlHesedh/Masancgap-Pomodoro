/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX,
  Coffee,
  Brain,
  Timer,
  Upload,
  Music,
  Cat,
  MessageCircle,
  Sparkles,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const KitsuneSprite = ({ energy, isPetting }: { energy: number; isPetting: boolean }) => {
  const isHungry = energy < 30;
  const isSleeping = energy === 0;
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Tail */}
      <motion.div
        animate={{ 
          rotate: isSleeping ? 0 : isHungry ? [0, 5, 0] : [0, 15, 0],
          scale: isSleeping ? 0.9 : [1, 1.05, 1]
        }}
        transition={{ duration: isHungry ? 1 : 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 right-4 w-16 h-10 bg-orange-400 rounded-full origin-left blur-[1px]"
        style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full opacity-40 blur-sm" />
      </motion.div>

      {/* Body */}
      <motion.div
        animate={{ 
          scaleY: isSleeping ? 0.8 : [1, 1.02, 1],
          y: isPetting ? [0, -5, 0] : isSleeping ? 5 : 0
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20 bg-orange-500 rounded-3xl shadow-lg border-b-4 border-orange-700 flex items-center justify-center"
      >
        {/* Ears */}
        <motion.div 
          animate={{ rotate: isSleeping ? -30 : isHungry ? [-5, 5, -5] : 0 }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute -top-6 -left-2 w-8 h-10 bg-orange-500 rounded-t-full rotate-[-15deg] border-t-2 border-orange-300" 
        />
        <motion.div 
          animate={{ rotate: isSleeping ? 30 : isHungry ? [5, -5, 5] : 0 }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute -top-6 -right-2 w-8 h-10 bg-orange-500 rounded-t-full rotate-[15deg] border-t-2 border-orange-300" 
        />
        
        {/* Face */}
        <div className="relative w-full h-full flex flex-col items-center justify-center pt-2">
          {/* Eyes */}
          <div className="flex gap-6">
            {isSleeping ? (
              <>
                <div className="w-3 h-1 bg-gray-900/50 rounded-full" />
                <div className="w-3 h-1 bg-gray-900/50 rounded-full" />
              </>
            ) : (
              <>
                <motion.div 
                  animate={{ height: isHungry ? [2, 2, 2] : [6, 6, 1, 6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-2 bg-gray-900 rounded-full" 
                />
                <motion.div 
                  animate={{ height: isHungry ? [2, 2, 2] : [6, 6, 1, 6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-2 bg-gray-900 rounded-full" 
                />
              </>
            )}
          </div>
          
          {/* Blush */}
          <AnimatePresence>
            {isPetting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="absolute top-10 flex gap-10"
              >
                <div className="w-3 h-2 bg-rose-400 rounded-full blur-[2px]" />
                <div className="w-3 h-2 bg-rose-400 rounded-full blur-[2px]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nose & Mouth */}
          <div className="mt-2 w-2 h-1 bg-gray-900 rounded-full" />
          <motion.div 
            animate={{ scaleX: isHungry ? 1.2 : 1 }}
            className="mt-1 w-4 h-1 border-b-2 border-gray-900/30 rounded-full" 
          />
        </div>

        {/* Belly */}
        <div className="absolute bottom-2 w-10 h-6 bg-orange-100/50 rounded-full blur-[1px]" />
      </motion.div>

      {/* Paws */}
      <div className="absolute bottom-2 left-6 w-4 h-3 bg-orange-600 rounded-full" />
      <div className="absolute bottom-2 right-6 w-4 h-3 bg-orange-600 rounded-full" />

      {/* Sleep Zzz */}
      <AnimatePresence>
        {isSleeping && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-4 -right-4 flex flex-col gap-2"
          >
            <motion.span animate={{ y: [-5, 5, -5], x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-white font-bold text-lg">Z</motion.span>
            <motion.span animate={{ y: [5, -5, 5], x: [5, 0, 5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="text-white/70 font-bold text-sm">z</motion.span>
            <motion.span animate={{ y: [-5, 5, -5], x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="text-white/40 font-bold text-xs">z</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type TimerMode = 'work' | 'shortBreak' | 'longBreak';
type SoundType = 'beep' | 'bell' | 'digital' | 'custom';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Settings {
  work: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  soundType: SoundType;
  customSoundUrl: string | null;
}

const DEFAULT_SETTINGS: Settings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  soundType: 'beep',
  customSoundUrl: null,
};

export default function App() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [energy, setEnergy] = useState(50); // 100 = full, 0 = starving
  const [isPetting, setIsPetting] = useState(false);
  const [kitsuneMessage, setKitsuneMessage] = useState("Hi! I'm Kitsu. Let's focus together!");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playNotification = useCallback(() => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;

    if (settings.soundType === 'custom' && settings.customSoundUrl) {
      const audio = new Audio(settings.customSoundUrl);
      audio.play().catch(e => console.error("Error playing custom sound:", e));
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    switch (settings.soundType) {
      case 'bell':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
        break;
      case 'digital':
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        break;
      case 'beep':
      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        break;
    }
    
    osc.connect(gain);
    gain.connect(ctx.destination);
  }, [settings.soundEnabled, settings.soundType, settings.customSoundUrl]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
    setIsActive(false);
  }, [settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playNotification();
      
      if (mode === 'work') {
        switchMode('shortBreak');
        if (settings.autoStartBreaks) setIsActive(true);
      } else {
        switchMode('work');
        if (settings.autoStartWork) setIsActive(true);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, settings, switchMode, playNotification]);

  useEffect(() => {
    const energyInterval = setInterval(() => {
      setEnergy(prev => {
        // Energy decreases faster if timer is not active during work mode
        const decrease = (!isActive && mode === 'work') ? 2 : 0.5;
        const next = Math.max(0, prev - decrease);
        
        // Update message based on energy and state
        if (next < 20) setKitsuneMessage("I'm starving... please complete a task!");
        else if (next < 50) setKitsuneMessage("I'm getting a bit hungry. Time to study?");
        else if (isActive) setKitsuneMessage("You're doing great! Keep focusing!");
        else setKitsuneMessage("I'm full and happy! Ready for the next one?");
        
        return next;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(energyInterval);
  }, [isActive, mode]);

  const toggleTimer = () => {
    initAudio();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id && !t.completed) {
        // Feed the kitsune when a task is completed
        setEnergy(prev => Math.min(100, prev + 25));
        setKitsuneMessage("Yum! That task was delicious!");
        setTimeout(() => {
          if (isActive) setKitsuneMessage("You're doing great! Keep focusing!");
          else setKitsuneMessage("I'm full and happy! Ready for the next one?");
        }, 3000);
      }
      return t.id === id ? { ...t, completed: !t.completed } : t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (!isActive) {
      setTimeLeft(updated[mode] * 60);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      updateSettings({ 
        customSoundUrl: url,
        soundType: 'custom'
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePetKitsune = () => {
    setIsPetting(true);
    setEnergy(prev => Math.min(100, prev + 5));
    setKitsuneMessage("Purr... I love attention! ❤️");
    setTimeout(() => {
      setIsPetting(false);
      if (isActive) setKitsuneMessage("You're doing great! Keep focusing!");
      else setKitsuneMessage("I'm full and happy! Ready for the next one?");
    }, 3000);
  };

  const getThemeColor = () => {
    switch (mode) {
      case 'work': return 'bg-rose-500';
      case 'shortBreak': return 'bg-teal-500';
      case 'longBreak': return 'bg-indigo-500';
    }
  };

  const getThemeText = () => {
    switch (mode) {
      case 'work': return 'text-rose-500';
      case 'shortBreak': return 'text-teal-500';
      case 'longBreak': return 'text-indigo-500';
    }
  };

  const getThemeBorder = () => {
    switch (mode) {
      case 'work': return 'border-rose-200';
      case 'shortBreak': return 'border-teal-200';
      case 'longBreak': return 'border-indigo-200';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getThemeColor()} flex flex-col items-center py-12 px-4 font-sans text-white`}>
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Timer className="w-8 h-8" />
          <span>FocusFlow</span>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
      </header>

      <main className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-8">
          {/* Timer Card */}
          <motion.div 
            layout
            className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center shadow-2xl border border-white/20"
          >
            <div className="flex gap-4 mb-8">
              {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    mode === m 
                      ? 'bg-white text-gray-900 shadow-lg' 
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </button>
              ))}
            </div>

            <motion.div 
              key={timeLeft}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl md:text-9xl font-black mb-12 tabular-nums tracking-tighter"
            >
              {formatTime(timeLeft)}
            </motion.div>

            <div className="flex items-center gap-6">
              <button
                onClick={toggleTimer}
                className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-xl hover:scale-105 active:scale-95 transition-transform"
              >
                {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
              </button>
              <button
                onClick={resetTimer}
                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* Current Focus */}
          <div className="text-center">
            <p className="text-white/60 text-sm uppercase tracking-widest font-bold mb-2">
              {mode === 'work' ? 'Time to focus!' : 'Time for a break!'}
            </p>
            <h2 className="text-2xl font-medium">
              {tasks.find(t => !t.completed)?.text || (mode === 'work' ? 'What are you working on?' : 'Relax and recharge')}
            </h2>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          {/* Tasks Section */}
          <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Tasks
              </h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {tasks.filter(t => t.completed).length}/{tasks.length}
              </span>
            </div>

            <form onSubmit={addTask} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-white/40 placeholder:text-white/40"
              />
              <button 
                type="submit"
                className="p-2 bg-white text-gray-900 rounded-xl hover:bg-white/90 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group ${task.completed ? 'opacity-50' : ''}`}
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed ? 'bg-white border-white' : 'border-white/30 hover:border-white'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4 text-gray-900" />}
                    </button>
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through' : ''}`}>
                      {task.text}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-300 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks.length === 0 && (
                <p className="text-center text-white/30 py-4 text-sm italic">No tasks yet. Add one to stay focused!</p>
              )}
            </div>
          </div>

          {/* Kitsune Pet */}
          <motion.div 
            className="relative flex flex-col items-center mt-8 w-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <AnimatePresence>
              {kitsuneMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-12 bg-white text-gray-900 px-4 py-2 rounded-2xl text-xs font-bold shadow-xl whitespace-nowrap border-2 border-rose-100 z-10"
                >
                  {kitsuneMessage}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-rose-100 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-4 w-full">
              <div 
                onClick={handlePetKitsune}
                className="cursor-pointer relative group"
              >
                <KitsuneSprite energy={energy} isPetting={isPetting} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Heart className="w-12 h-12 text-rose-400 fill-current animate-ping" />
                </div>
                {energy > 80 && <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-pulse" />}
                {energy < 20 && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl">💢</div>}
              </div>
              
              {/* Energy Bar UI */}
              <div className="w-full max-w-[200px] space-y-1">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1">
                    <Heart className={`w-3 h-3 ${energy < 20 ? 'animate-pulse text-rose-400' : 'text-rose-300'}`} fill="currentColor" />
                    Energy
                  </span>
                  <span className="text-[10px] font-black text-white/60">{Math.round(energy)}%</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/10 p-[2px]">
                  <motion.div 
                    initial={{ width: '50%' }}
                    animate={{ width: `${energy}%` }}
                    className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                      energy < 20 ? 'bg-rose-500' : energy < 50 ? 'bg-orange-400' : 'bg-emerald-400'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                  </motion.div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Click to pet Kitsu</p>
          </motion.div>
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 text-gray-900 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <SettingsIcon className="w-6 h-6" />
                  Settings
                </h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Time (minutes)</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['work', 'shortBreak', 'longBreak'] as const).map((m) => (
                      <div key={m}>
                        <span className="text-[10px] text-gray-500 block mb-1 capitalize">{m.replace('Break', ' Break')}</span>
                        <input
                          type="number"
                          value={settings[m]}
                          onChange={(e) => updateSettings({ [m]: parseInt(e.target.value) || 1 })}
                          className="w-full bg-gray-100 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Automation</label>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Auto-start Breaks</span>
                    <button 
                      onClick={() => updateSettings({ autoStartBreaks: !settings.autoStartBreaks })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoStartBreaks ? 'bg-rose-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoStartBreaks ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Auto-start Focus</span>
                    <button 
                      onClick={() => updateSettings({ autoStartWork: !settings.autoStartWork })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoStartWork ? 'bg-rose-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoStartWork ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    Sound Notification
                  </span>
                  <button 
                    onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-rose-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {settings.soundEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4"
                  >
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Sound Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['beep', 'bell', 'digital'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => updateSettings({ soundType: type })}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            settings.soundType === type 
                              ? 'bg-rose-50 border-rose-200 text-rose-600' 
                              : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                      <label className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                        settings.soundType === 'custom' 
                          ? 'bg-rose-50 border-rose-200 text-rose-600' 
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                      }`}>
                        <input 
                          type="file" 
                          accept="audio/*" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                        <Upload className="w-3 h-3" />
                        {settings.customSoundUrl ? 'Customized' : 'Upload'}
                      </label>
                    </div>
                    {settings.soundType === 'custom' && settings.customSoundUrl && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                        <Music className="w-4 h-4 text-rose-500" />
                        <span className="text-[10px] text-gray-500 truncate flex-1">Custom audio loaded</span>
                        <button 
                          onClick={() => updateSettings({ customSoundUrl: null, soundType: 'beep' })}
                          className="text-[10px] text-rose-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={playNotification}
                      className="w-full py-2 text-xs font-bold text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                    >
                      Test Sound
                    </button>
                  </motion.div>
                )}
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-auto pt-12 text-white/40 text-xs font-medium tracking-widest uppercase">
        Stay Focused • Stay Productive
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
