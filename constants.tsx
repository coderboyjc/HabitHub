import React from 'react';
import {
  Activity, Footprints, Code, Utensils, BookOpen, Droplets, Moon, Sun,
  Dumbbell, Music, Briefcase, Coffee, Heart, Zap, Leaf, PenTool,
  Gamepad2, Headphones, Tent, Terminal, Hammer, Camera, Plane, Wrench,
  Palette, Anchor, Globe, Map, ShoppingCart, Tv, Smartphone, Speaker,
  Battery, Wifi, Database, Server, Cpu, Layers, Layout, Calendar,
  Clock, AlarmClock, User, Users, Home, Building, Car, Bus, Train,
  Bike, Ship, Smile, Star, Flag, Bookmark, Tag, Award, Trophy,
  Apple, Carrot, Pizza, Beer, Wine, Cigarette, Cookie, Cake, IceCream,
  Bed, ShowerHead, Bath, Sofa, Armchair, Lamp, DoorOpen, Key, Lock,
  Brain, Pill, Syringe, Stethoscope, Baby, Calculator, CameraOff,
  WashingMachine, Shirt, Scissors, Mic, Monitor, Mouse, Keyboard,
  TreePine, Flame, Mountain, Flower, Cloud, Umbrella, Wind,
  DollarSign, Wallet, PiggyBank, CreditCard, TrendingUp,
  GraduationCap, FileText, Paperclip, Laptop, Tablet, Watch,
  Gift, Bell, Settings, Search
} from 'lucide-react';
import { HabitColor } from './types';

export const COLORS: Record<HabitColor, string> = {
  green: 'bg-green-500 text-green-50',
  yellow: 'bg-yellow-500 text-yellow-950',
  pink: 'bg-pink-500 text-pink-50',
  blue: 'bg-blue-500 text-blue-50',
  purple: 'bg-purple-500 text-purple-50',
  red: 'bg-red-500 text-red-50',
  orange: 'bg-orange-500 text-orange-50',
  cyan: 'bg-cyan-500 text-cyan-950',
  lime: 'bg-lime-500 text-lime-950',
  emerald: 'bg-emerald-500 text-emerald-50',
  teal: 'bg-teal-500 text-teal-50',
  sky: 'bg-sky-500 text-sky-950',
  indigo: 'bg-indigo-500 text-indigo-50',
  violet: 'bg-violet-500 text-violet-50',
  fuchsia: 'bg-fuchsia-500 text-fuchsia-50',
  rose: 'bg-rose-500 text-rose-50',
  amber: 'bg-amber-500 text-amber-950',
  slate: 'bg-slate-500 text-slate-50',
};

export const COLOR_Hex: Record<HabitColor, string> = {
  green: '#4ade80',
  yellow: '#facc15',
  pink: '#f472b6',
  blue: '#60a5fa',
  purple: '#a855f7',
  red: '#ef4444',
  orange: '#f97316',
  cyan: '#06b6d4',
  lime: '#84cc16',
  emerald: '#10b981',
  teal: '#14b8a6',
  sky: '#0ea5e9',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  fuchsia: '#d946ef',
  rose: '#f43f5e',
  amber: '#f59e0b',
  slate: '#64748b',
};

// Categorization of icons
export const CATEGORY_ICONS: Record<string, string[]> = {
  'Activities': ['activity', 'footprints', 'music', 'camera', 'palette', 'gamepad', 'headphones', 'tent', 'plane', 'anchor', 'globe', 'map', 'shopping', 'tv', 'mic'],
  'Work & Study': ['work', 'code', 'book', 'pen', 'terminal', 'database', 'server', 'cpu', 'layers', 'layout', 'calendar', 'grad-cap', 'file-text', 'paperclip', 'laptop', 'tablet', 'clock', 'alarm', 'calculator', 'monitor', 'keyboard', 'mouse'],
  'Finance': ['dollar', 'wallet', 'piggy-bank', 'credit-card', 'trending-up'],
  'Health & Wellness': ['heart', 'water', 'moon', 'sun', 'dumbbell', 'leaf', 'bed', 'shower', 'bath', 'smile', 'brain', 'pill', 'syringe', 'stethoscope', 'baby'],
  'Food & Drink': ['utensils', 'coffee', 'pizza', 'beer', 'wine', 'cookie', 'cake', 'ice-cream', 'apple', 'carrot', 'cigarette'],
  'Household': ['home', 'building', 'sofa', 'lamp', 'door', 'key', 'lock', 'battery', 'zap', 'hammer', 'wrench', 'wash', 'shirt', 'scissors'],
  'Transport': ['car', 'bus', 'train', 'bike', 'ship'],
  'Nature': ['tree', 'flame', 'mountain', 'flower', 'cloud', 'umbrella', 'wind'],
  'Social & Misc': ['user', 'users', 'gift', 'bell', 'search', 'settings', 'watch', 'star', 'flag', 'bookmark', 'tag', 'award', 'trophy', 'smartphone', 'speaker', 'wifi']
};

export const ICONS: Record<string, React.FC<any>> = {
  // Existing
  'activity': Activity,
  'footprints': Footprints,
  'code': Code,
  'utensils': Utensils,
  'book': BookOpen,
  'water': Droplets,
  'moon': Moon,
  'sun': Sun,
  'dumbbell': Dumbbell,
  'music': Music,
  'work': Briefcase,
  'coffee': Coffee,
  'heart': Heart,
  'zap': Zap,
  'leaf': Leaf,
  'pen': PenTool,

  // New
  'gamepad': Gamepad2,
  'headphones': Headphones,
  'tent': Tent,
  'terminal': Terminal,
  'hammer': Hammer,
  'camera': Camera,
  'plane': Plane,
  'wrench': Wrench,
  'palette': Palette,
  'anchor': Anchor,
  'globe': Globe,
  'map': Map,
  'shopping': ShoppingCart,
  'tv': Tv,
  'smartphone': Smartphone,
  'speaker': Speaker,
  'battery': Battery,
  'wifi': Wifi,
  'database': Database,
  'server': Server,
  'cpu': Cpu,
  'layers': Layers,
  'layout': Layout,
  'calendar': Calendar,
  'clock': Clock,
  'alarm': AlarmClock,
  'user': User,
  'users': Users,
  'home': Home,
  'building': Building,
  'car': Car,
  'bus': Bus,
  'train': Train,
  'bike': Bike,
  'ship': Ship,
  'smile': Smile,
  'star': Star,
  'flag': Flag,
  'bookmark': Bookmark,
  'tag': Tag,
  'award': Award,
  'trophy': Trophy,
  'apple': Apple,
  'carrot': Carrot,
  'pizza': Pizza,
  'beer': Beer,
  'wine': Wine,
  'cigarette': Cigarette,
  'cookie': Cookie,
  'cake': Cake,
  'ice-cream': IceCream,
  'bed': Bed,
  'shower': ShowerHead,
  'bath': Bath,
  'sofa': Sofa,
  'lamp': Lamp,
  'door': DoorOpen,
  'key': Key,
  'lock': Lock,
  'brain': Brain,
  'pill': Pill,
  'syringe': Syringe,
  'stethoscope': Stethoscope,
  'baby': Baby,
  'calculator': Calculator,
  'wash': WashingMachine,
  'shirt': Shirt,
  'scissors': Scissors,
  'mic': Mic,
  'monitor': Monitor,
  'mouse': Mouse,
  'keyboard': Keyboard,
  'tree': TreePine,
  'flame': Flame,
  'mountain': Mountain,
  'flower': Flower,
  'cloud': Cloud,
  'umbrella': Umbrella,
  'wind': Wind,
  'dollar': DollarSign,
  'wallet': Wallet,
  'piggy-bank': PiggyBank,
  'credit-card': CreditCard,
  'trending-up': TrendingUp,
  'grad-cap': GraduationCap,
  'file-text': FileText,
  'paperclip': Paperclip,
  'laptop': Laptop,
  'tablet': Tablet,
  'watch': Watch,
  'gift': Gift,
  'bell': Bell,
  'search': Search,
  'settings': Settings
};

export const INITIAL_HABITS: any[] = [
  {
    id: '1',
    name: 'Eating clean',
    description: 'No junk food',
    icon: 'utensils',
    color: 'green',
    completedDates: []
  },
  {
    id: '2',
    name: 'Exercise',
    description: 'Daily workout',
    icon: 'dumbbell',
    color: 'yellow',
    completedDates: []
  }
];

// Helper to generate some dummy history
const generateHistory = (habitId: string) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 100; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    // Random completion based on habit ID to make them look different
    if (Math.random() > 0.4) {
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
};

// Hydrate initial habits with data
INITIAL_HABITS.forEach(h => {
  h.completedDates = generateHistory(h.id);
});