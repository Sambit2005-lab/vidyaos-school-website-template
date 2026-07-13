"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Phone, Mail, MapPin, GraduationCap, Users, Award, Trophy,
  ChevronRight, Heart, Star, Quote, Menu, X, Download,
  BookOpen, Shield, TrendingUp, Sparkles, CheckCircle, Clock,
  Building2, Target, Eye, ScrollText, ChevronLeft,
  ArrowUpRight, Medal, Monitor, Music, Library,
  FlaskConical, Dumbbell, Camera, Calendar, DollarSign, ClipboardList, Send, QrCode
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend,
} from "recharts";
import { useApp } from "../../lib/AppContext";
import { fetchSchoolConfig, subscribeNotices, addAdmission } from "../../lib/firestoreService";
import { useStudents, useMarksRecords, useExams, useFeeRecords } from "../../lib/useData";
import { useDynamicSEO } from "../../lib/useDynamicSEO";
import { cn } from "../../lib/cn";
import logoImg from "../../assets/Image 08-06-26 at 22.47.jpg";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { setActiveSchoolConfig } from "../../lib/firebase";



const safeLocalStorage = {
  getItem: (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }
};

const categoryImages: Record<string, string> = {
  Campus: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
  Classroom: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  Sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
  "Saraswati Puja": "https://images.unsplash.com/photo-1561361049-257a075e8dbf?auto=format&fit=crop&w=600&q=80",
  Science: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80",
  "Republic Day": "https://images.unsplash.com/photo-1569974498991-d3c12a504f9f?auto=format&fit=crop&w=600&q=80",
  "Annual Function": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
  "Educational Tours": "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=600&q=80",
};

const studentLifeImages: Record<string, string> = {
  "Morning Prayer": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
  "Classroom Learning": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80",
  "Sports & Games": "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80",
  "Science Experiments": "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=400&q=80",
  "Art & Craft": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=80",
  "Cultural Programs": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80",
  "Educational Tours": "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=400&q=80",
  "Annual Function": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
  "Yoga & Meditation": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80",
  "Tree Plantation": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80",
  "Award Ceremony": "https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&w=400&q=80",
  "Group Photos": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80",
};

const facilityImages: Record<string, string> = {
  "Smart Classrooms": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=500&q=80",
  "Library": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=500&q=80",
  "Science Lab": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&q=80",
  "Computer Lab": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=500&q=80",
  "Playground": "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=500&q=80",
  "Activity Hall": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
};

/* ===== SCHOOL DATA ===== */
const school = {
  name: { en: "Saraswati Sishu Mandir", or: "ସରସ୍ୱତୀ ଶିଶୁ ମନ୍ଦିର" },
  short: "SSM",
  location: { en: "Bhubaneswar, Odisha", or: "ଭୁବନେଶ୍ୱର, ଓଡ଼ିଶା" },
  tagline: { en: "Nurturing Knowledge, Character & Excellence", or: "ଜ୍ଞାନ, ସଂସ୍କାର ଓ ଉତ୍କର୍ଷତାର ବିକାଶ" },
  subTagline: { en: "Providing quality education, discipline, values, and holistic development since 2008.", or: "୨୦୦୮ ଠାରୁ ଗୁଣାତ୍ମକ ଶିକ୍ଷା, ଶୃଙ୍ଖଳା, ସଂସ୍କାର ଏବଂ ସର୍ବାଙ୍ଗୀଣ ବିକାଶ।" },
  phone: "+91-674-2345678",
  email: "principal@ssmbbsr.edu.in",
  address: "Unit-4, Bhubaneswar, Odisha - 751001",
  sansthan: "Bharatiya Siksha Vikash Sansthan",
  sansthanOr: "ଭାରତୀୟ ଶିକ୍ଷା ବିକାଶ ସଂସ୍ଥାନ",
  principal: { en: "Dr. Rajendra Mohapatra", or: "ଡା. ରାଜେନ୍ଦ୍ର ମହାପାତ୍ର" },
  principalMsg: {
    en: "At Saraswati Sishu Mandir, we believe in nurturing not just academic excellence but also strong moral values and character. Our dedicated teachers, supportive parents, and motivated students together create an environment where every child can thrive. We focus on holistic development — preparing students not just for exams, but for life.",
    or: "ସରସ୍ୱତୀ ଶିଶୁ ମନ୍ଦିରରେ, ଆମେ କେବଳ ଶିକ୍ଷାଗତ ଉତ୍କର୍ଷତା ନୁହେଁ, ବରଂ ଦୃଢ଼ ନୈତିକ ମୂଲ୍ୟବୋଧ ଏବଂ ଚରିତ୍ର ଗଠନରେ ବିଶ୍ବାସ କରୁ।",
  },
  established: 2008,
};

/* ===== TRANSLATIONS ===== */
const O = {
  students: { en: "Students", or: "ଛାତ୍ରଛାତ୍ରୀ" },
  teachers: { en: "Teachers", or: "ଶିକ୍ଷକ" },
  years: { en: "Years of Excellence", or: "ଉତ୍କର୍ଷ ବର୍ଷ" },
  result: { en: "Board Results", or: "ପରୀକ୍ଷା ଫଳାଫଳ" },
  home: { en: "Home", or: "ମୂଳପୃଷ୍ଠା" },
  about: { en: "About Us", or: "ଆମ ବିଷୟରେ" },
  achievements: { en: "Achievements", or: "ସଫଳତା" },
  facilities: { en: "Facilities", or: "ସୁବିଧା" },
  gallery: { en: "Gallery", or: "ଗ୍ୟାଲେରୀ" },
  admissions: { en: "Admissions", or: "ଭର୍ତ୍ତି" },
  contact: { en: "Contact", or: "ଯୋଗାଯୋଗ" },
  admissionOpen: { en: "Admission Open", or: "ଭର୍ତ୍ତି ଚାଲିଛି" },
  contactUs: { en: "Contact Us", or: "ଯୋଗାଯୋଗ କରନ୍ତୁ" },
  applyNow: { en: "Apply For Admission", or: "ଭର୍ତ୍ତି ପାଇଁ ଆବେଦନ କରନ୍ତୁ" },
  viewAchievements: { en: "View Achievements", or: "ସଫଳତା ଦେଖନ୍ତୁ" },
  principalMsg: { en: "Principal's Message", or: "ପ୍ରଧାନଶିକ୍ଷକଙ୍କ ବାର୍ତ୍ତା" },
  whyTrust: { en: "Why Parents Trust Us", or: "ଅଭିଭାବକ କାହିଁକି ଆମକୁ ବିଶ୍ବାସ କରନ୍ତି" },
  ourAchievements: { en: "Our Achievements", or: "ଆମର ସଫଳତା" },
  admissionProcess: { en: "Admission Process", or: "ଭର୍ତ୍ତି ପ୍ରକ୍ରିୟା" },
  documentsRequired: { en: "Documents Required", or: "ଆବଶ୍ୟକ ଦଲିଲ" },
  sendMessage: { en: "Send Message", or: "ବାର୍ତ୍ତା ପଠାନ୍ତୁ" },
  quickLinks: { en: "Quick Links", or: "ଶୀଘ୍ର ଲିଙ୍କ୍" },
  schoolTimings: { en: "School Timings", or: "ବିଦ୍ୟାଳୟ ସମୟ" },
  alumSuccess: { en: "Alumni Success Stories", or: "ପୂର୍ବତନ ଛାତ୍ରଙ୍କ ସଫଳତା" },
  backToDashboard: { en: "Back to Dashboard", or: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ" },
  photoGallerySub: { en: "Capturing memories that last a lifetime", or: "ଜୀବନବ୍ୟାପୀ ରହିବା ପାଇଁ ସ୍ମୃତି" },
  scholarshipTitle: { en: "Scholarship & Olympiad", or: "ଛାତ୍ରବୃତ୍ତି ଓ ଅଲିମ୍ପିଆଡ୍" },
  principalTitle: { en: "Principal", or: "ପ୍ରଧାନଶିକ୍ଷକ" },
  aboutSchool: { en: "About Our School", or: "ଆମ ବିଦ୍ୟାଳୟ ବିଷୟରେ" },
  academicDashboard: { en: "Academic Dashboard", or: "ଶିକ୍ଷାଗତ ଡ୍ୟାସବୋର୍ଡ" },
  academicPerf: { en: "Academic Performance", or: "ଶିକ୍ଷାଗତ ପ୍ରଦର୍ଶନ" },
  passPercentage: { en: "Pass Percentage Trend", or: "ପାସ୍ ହାର ପ୍ରବୃତ୍ତି" },
  admissionsGrowth: { en: "Admissions Growth", or: "ନାମଲେଖା ବୃଦ୍ଧି" },
  studentGrowth: { en: "Student Growth", or: "ଛାତ୍ରଛାତ୍ରୀ ବୃଦ୍ଧି" },
  scholarshipGrowth: { en: "Scholarships", or: "ଛାତ୍ରବୃତ୍ତି" },
  olympiadGrowth: { en: "Olympiad Qualifiers", or: "ଅଲିମ୍ପିଆଡ୍ ଯୋਗ୍ୟତା" },
  ourFacilities: { en: "Our Facilities", or: "ଆମର ସୁବିଧା" },
  studentLife: { en: "Student Life", or: "ଛାତ୍ର ଜୀବନ" },
  latestNotices: { en: "Latest Notices", or: "ସଦ୍ୟତମ ବିଜ୍ଞପ୍ତି" },
  viewAll: { en: "View All Notices", or: "ସମସ୍ତ ବିଜ୍ଞପ୍ତି ଦେଖନ୍ତୁ" },
  testimonials: { en: "Parents & Students Speak", or: "ଅଭିଭାବକ ଓ ଛାତ୍ରଛାତ୍ରୀଙ୍କ ମତାମତ" },
  photoGallery: { en: "Photo Gallery", or: "ଫଟୋ ଗ୍ୟାଲେରୀ" },
};

const trustItems = [
  { icon: GraduationCap, label: { en: "Academic Excellence", or: "ଶିକ୍ଷାଗତ ଉତ୍କର୍ଷତା" }, color: "from-blue-600 to-blue-400" },
  { icon: Heart, label: { en: "Value Based Education", or: "ସଂସ୍କାରମୂଳକ ଶିକ୍ษา" }, color: "from-red-500 to-red-400" },
  { icon: Users, label: { en: "Experienced Teachers", or: "ଅଭିଜ୍ଞ ଶିକ୍ଷକ" }, color: "from-[#D4A017] to-amber-400" },
  { icon: Award, label: { en: "Scholarship Success", or: "ଛାତ୍ରବୃତ୍ତି ସଫଳତା" }, color: "from-emerald-600 to-emerald-400" },
  { icon: Trophy, label: { en: "Olympiad Success", or: "ଅଲିମ୍ପିଆଡ୍ ସଫଳତା" }, color: "from-purple-600 to-purple-400" },
  { icon: TrendingUp, label: { en: "Sports Excellence", or: "କ୍ରୀଡା ସଫଳତା" }, color: "from-cyan-600 to-cyan-400" },
  { icon: Star, label: { en: "Holistic Development", or: "ସର୍ବାଙ୍ଗୀଣ ବିକାଶ" }, color: "from-rose-600 to-rose-400" },
  { icon: Shield, label: { en: "Affordable Fees", or: "ସୁଲଭ ଫି" }, color: "from-teal-600 to-teal-400" },
];

const iconMap: Record<string, any> = {
  Monitor,
  Music,
  Library,
  FlaskConical,
  Dumbbell,
  BookOpen,
  Shield,
  Building2,
  GraduationCap,
  Users,
  Award,
  Trophy,
  Star,
  Heart
};

const facilities = [
  { name: { en: "Smart Classrooms", or: "ସ୍ମାର୍ଟ ଶ୍ରେଣୀଗୃହ" }, icon: Monitor, desc: { en: "Interactive digital learning with smart boards", or: "ସ୍ମାର୍ଟ ବୋର୍ଡ ସହ ଡିଜିଟାଲ ଶିକ୍ଷା" }, color: "from-blue-600 to-indigo-400" },
  { name: { en: "Library", or: "ପୁସ୍ତକାଗାର" }, icon: Library, desc: { en: "5000+ books, journals, digital resources", or: "୫୦୦୦+ ପୁସ୍ତକ, ପତ୍ରିକା" }, color: "from-amber-700 to-amber-500" },
  { name: { en: "Science Lab", or: "ବିଜ୍ାନ ପରୀକ୍ଷାଗାର" }, icon: FlaskConical, desc: { en: "Modern physics, chemistry & biology labs", or: "ଆଧୁନିକ ପଦାର୍ଥ, ରସାୟନ, ଜୀବ ବିଜ୍ଞାନ" }, color: "from-emerald-600 to-emerald-400" },
  { name: { en: "Computer Lab", or: "କମ୍ପ୍ୟୁଟର ପରୀକ୍ଷାଗାର" }, icon: Monitor, desc: { en: "30-seat lab with high-speed internet", or: "ହାଇ-ସ୍ପିଡ୍ ଇଣ୍ଟରନେଟ ସହ ୩୦-ସିଟ୍" }, color: "from-cyan-600 to-blue-400" },
  { name: { en: "Playground", or: "ଖେଳ ପଡ଼ିଆ" }, icon: Dumbbell, desc: { en: "Cricket, football & athletics grounds", or: "କ୍ରିକେଟ, ଫୁଟବଲ, ଆଥଲେଟିକ୍ସ" }, color: "from-green-600 to-green-400" },
  { name: { en: "Activity Hall", or: "କାର୍ଯ୍ୟକଳାପ ହଲ୍" }, icon: Music, desc: { en: "Multi-purpose hall for events & assemblies", or: "ବହୁମୁଖୀ ହଲ୍ — କାର୍ଯ୍ୟକ୍ରମ, ସଭା" }, color: "from-purple-600 to-pink-400" },
];

const scholarshipData = [
  { title: { en: "Medhabruti", or: "ମେଧାବୃତ୍ତି" }, count: 24, color: "from-amber-500 to-yellow-400" },
  { title: { en: "NTSE", or: "ଏନଟିଏସଇ" }, count: 8, color: "from-blue-500 to-indigo-400" },
  { title: { en: "Olympiad", or: "ଅଲିମ୍ପିଆଡ୍" }, count: 18, color: "from-emerald-500 to-teal-400" },
  { title: { en: "State Merit", or: "ରାଜ୍ୟ ମେରିଟ୍" }, count: 12, color: "from-purple-500 to-pink-400" },
];

const achievers = [
  { name: { en: "Aarav Mohapatra", or: "ଆରବ ମହାପାତ୍ର" }, achievement: { en: "Medhabruti Scholarship", or: "ମେଧାବୃତ୍ତି" }, emoji: "🏅", color: "from-amber-400 to-yellow-300", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Ananya Das", or: "ଅନନ୍ୟା ଦାସ" }, achievement: { en: "NTSE State Rank 22", or: "NTSE ରାଜ୍ୟ ର୍ୟାଙ୍କ ୨୨" }, emoji: "📜", color: "from-blue-400 to-indigo-300", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Priyanka Patra", or: "ପ୍ରିୟଙ୍କା ପାତ୍ର" }, achievement: { en: "Olympiad State Winner", or: "ଅଲିମ୍ପିଆଡ୍ ରାଜ୍ୟ ବିଜେତା" }, emoji: "🏆", color: "from-emerald-400 to-teal-300", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Ishan Rout", or: "ଈଶାନ ରାଉତ" }, achievement: { en: "District Debate Champion", or: "ଜିଲ୍ଲା ବକୃତା ଚ୍ୟାମ୍ପିୟନ୍" }, emoji: "🎤", color: "from-purple-400 to-pink-300", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Jyoti Patnaik", or: "ଜ୍ୟୋତି ପଟ୍ଟନାୟକ" }, achievement: { en: "Science Fair Winner", or: "ବିଜ୍ଞାନ ମେଳା ବିଜେତା" }, emoji: "🔬", color: "from-cyan-400 to-blue-300", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Satyam Sahoo", or: "ସତ୍ୟମ ସାହୁ" }, achievement: { en: "National Sports Meet", or: "ଜାତୀୟ କ୍ରୀଡା" }, emoji: "⚽", color: "from-rose-400 to-red-300", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Pragyan Mallick", or: "ପ୍ରଜ୍ଞାନ ମଲ୍ଲିକ" }, achievement: { en: "State Topper Class X", or: "ଦଶମ ଶ୍ରେଣୀ ରାଜ୍ୟ ଟପ୍ପର" }, emoji: "📖", color: "from-amber-400 to-orange-300", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Sneha Mishra", or: "ସ୍ନେହା ମିଶ୍ର" }, achievement: { en: "Olympiad National Qualifier", or: "ଅଲିମ୍ପିଆଡ୍ ଜାତୀୟ" }, emoji: "🌍", color: "from-indigo-400 to-purple-300", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
];

const alumniData = [
  { name: { en: "Sambit Pradhan", or: "ସମ୍ବିତ ପ୍ରଧାନ" }, title: { en: "B.Tech, IIIT Bhubaneswar", or: "B.Tech, IIIT ଭୁବନେଶ୍ବର" }, role: { en: "Founder & CEO, Code-X-Novas", or: "ଫାଉଣ୍ଡର ଓ ସିଇଓ" }, emoji: "👨‍💻", color: "from-blue-600 to-blue-400", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Dr. Smita Behera", or: "ଡା. ସ୍ମିତା ବେହେରା" }, title: { en: "MBBS, MKCG Medical College", or: "MBBS, MKCG" }, role: { en: "Doctor at AIIMS Bhubaneswar", or: "AIIMS ରେ ଡାକ୍ତର" }, emoji: "👩‍⚕️", color: "from-emerald-600 to-emerald-400", image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Rajesh Panda", or: "ରାଜେଶ ପଣ୍ଡା" }, title: { en: "M.Tech, IIT Kharagpur", or: "M.Tech, IIT" }, role: { en: "Software Engineer, Google", or: "Google ରେ ଇଞ୍ଜିନିଅର" }, emoji: "👨‍🔬", color: "from-purple-600 to-purple-400", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Purnima Mohanty", or: "ପୂର୍ଣ୍ଣିମା ମହାନ୍ତି" }, title: { en: "MA, B.Ed", or: "MA, B.Ed" }, role: { en: "Teacher, Govt School", or: "ସରକାରୀ ବିଦ୍ୟାଳୟ ଶିକ୍ଷୟିତ୍ରୀ" }, emoji: "👩‍🏫", color: "from-amber-700 to-amber-500", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Subham Kar", or: "ସୁଭମ କର" }, title: { en: "B.Tech, NIT Rourkela", or: "B.Tech, NIT" }, role: { en: "IAS Officer", or: "IAS ଅଧିକାରୀ" }, emoji: "👨‍💼", color: "from-red-600 to-red-400", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Sakshi Sahoo", or: "ସାକ୍ଷୀ ସାହୁ" }, title: { en: "BBA, XIMB", or: "BBA, XIMB" }, role: { en: "Entrepreneur", or: "ଉଦ୍ୟୋକ୍ତା" }, emoji: "👩‍💼", color: "from-cyan-600 to-blue-400", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Amit Rout", or: "ଅମିତ ରାଉତ" }, title: { en: "B.Tech, IIT Bhubaneswar", or: "B.Tech, IIT" }, role: { en: "SDE, Microsoft", or: "Microsoft ରେ SDE" }, emoji: "👨‍💼", color: "from-indigo-600 to-indigo-400", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
  { name: { en: "Sushree Panda", or: "ସୁଶ୍ରୀ ପଣ୍ଡା" }, title: { en: "B.Ed, OUAT", or: "B.Ed, OUAT" }, role: { en: "Principal, Govt School", or: "ସରକାରୀ ବିଦ୍ୟାଳୟ ପ୍ରଧାନଶିକ୍ଷକ" }, emoji: "👩‍🏫", color: "from-pink-600 to-pink-400", image: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&w=200&q=80" },
];

const performanceData = [
  { year: "2021-22", pass: 88, admissions: 62, scholarships: 8, olympiad: 4, students: 480 },
  { year: "2022-23", pass: 91, admissions: 75, scholarships: 12, olympiad: 7, students: 510 },
  { year: "2023-24", pass: 93, admissions: 88, scholarships: 16, olympiad: 11, students: 545 },
  { year: "2024-25", pass: 95, admissions: 95, scholarships: 20, olympiad: 14, students: 580 },
  { year: "2025-26", pass: 96, admissions: 110, scholarships: 24, olympiad: 18, students: 620 },
];

const notices = [
  { title: { en: "Admission Open for 2026-27", or: "୨୦୨୬-୨୭ ପାଇଁ ଭର୍ତ୍ତି ଆରମ୍ଭ" }, date: "01 Mar 2026", priority: "High" as const, type: "Admission" },
  { title: { en: "Final Exam Timetable Published", or: "ବାର୍ଷିକ ପରୀକ୍ଷା ସୂଚୀ ପ୍ରକାଶିତ" }, date: "10 Mar 2026", priority: "High" as const, type: "Exam" },
  { title: { en: "Summer Vacation Schedule", or: "ଗ୍ରୀଷ୍ମ ଛୁଟି କାର୍ଯ୍ୟକ୍ରମ" }, date: "15 Mar 2026", priority: "Medium" as const, type: "Holiday" },
  { title: { en: "Parent-Teacher Meeting", or: "ଅଭିଭାବକ-ଶିକ୍ଷକ ବୈଠକ" }, date: "25 Feb 2026", priority: "Medium" as const, type: "Meeting" },
  { title: { en: "Maha Shivaratri Holiday", or: "ମହା ଶିବରାତ୍ରି ଛୁଟି" }, date: "18 Feb 2026", priority: "Low" as const, type: "Holiday" },
  { title: { en: "Science Exhibition Results", or: "ବିଜ୍ଞାନ ପ୍ରଦର୍ଶନୀ ଫଳାଫଳ" }, date: "10 Feb 2026", priority: "Medium" as const, type: "Event" },
  { title: { en: "Sports Meet Registration", or: "କ୍ରୀଡା ପ୍ରତିଯୋଗିତା ପଞ୍ଜୀକରଣ" }, date: "05 Feb 2026", priority: "Low" as const, type: "Sports" },
];

const testimonials = [
  { name: { en: "Mr. Srikant Patra", or: "ଶ୍ରୀ. ଶ୍ରୀକାନ୍ତ ପାତ୍ର" }, role: { en: "Parent", or: "ଅଭିଭାବକ" }, text: { en: "My son has grown tremendously both academically and personally. The teachers genuinely care about each child's development.", or: "ମୋ ପୁଅ ଶିକ୍ଷାଗତ ଏବଂ ବ୍ୟକ୍ତିଗତ ଭାବେ ବଢ଼ିଛି।" }, rating: 5, emoji: "👨" },
  { name: { en: "Ananya Das", or: "ଅନନ୍ୟା ଦାସ" }, role: { en: "Student — Class X", or: "ଛାତ୍ରୀ — ଦଶମ" }, text: { en: "I love the science lab and my teachers! The school has given me confidence to pursue my dreams.", or: "ମୁଁ ବିଜ୍ଞାନ ପରୀକ୍ଷାଗାର ଭଲ ପାଏ!" }, rating: 5, emoji: "👧" },
  { name: { en: "Smt. Purnima Mishra", or: "ଶ୍ରୀମତୀ ପୂର୍ଣ୍ଣିମା ମିଶ୍ର" }, role: { en: "Alumni Parent", or: "ପୂର୍ବତନ ଅଭିଭାବକ" }, text: { en: "Both my children studied here. The values they learned shaped their character and future.", or: "ଦୁଇ ସନ୍ତାନ ଏଠାରେ ପଢ଼ିଛନ୍ତି। SSM ର ସଂସ୍କାର ଚରିତ୍ର ଗଠନ କରିଛି।" }, rating: 5, emoji: "👩" },
  { name: { en: "Rajesh Panda", or: "ରାଜେଶ ପଣ୍ଡା" }, role: { en: "Alumni — IIT Kharagpur", or: "ପୂର୍ବତନ — IIT" }, text: { en: "SSM gave me a strong foundation in academics and values. Key to my IIT success.", or: "SSM ମୋତେ ଶିକ୍ଷା ଓ ସଂସ୍କାରରେ ଦୃଢ଼ ଭିତ୍ତି ଦେଇଛି।" }, rating: 5, emoji: "👨‍🎓" },
  { name: { en: "Mrs. Sweta Mishra", or: "ଶ୍ରୀମତୀ ଶ୍ବେତା ମିଶ୍ର" }, role: { en: "Teacher", or: "ଶିକ୍ଷୟିତ୍ରୀ" }, text: { en: "Teaching at SSM is truly rewarding. Supportive management and motivated students make this exceptional.", or: "SSM ରେ ଶିକ୍ଷାଦାନ ଫଳପ୍ରଦ।" }, rating: 5, emoji: "👩‍🏫" },
];

const galleryCategories = [
  { name: { en: "Campus", or: "କ୍ୟାମ୍ପସ୍" }, emoji: "🏫", count: 4 },
  { name: { en: "Classroom", or: "ଶ୍ରେଣୀଗୃହ" }, emoji: "📚", count: 3 },
  { name: { en: "Sports", or: "କ୍ରୀଡା" }, emoji: "⚽", count: 4 },
  { name: { en: "Saraswati Puja", or: "ସରସ୍ବତୀ ପୂଜା" }, emoji: "🌸", count: 3 },
  { name: { en: "Science", or: "ବିଜ୍ଞାନ" }, emoji: "🔬", count: 3 },
  { name: { en: "Republic Day", or: "ଗଣତନ୍ତ୍ର" }, emoji: "🇮🇳", count: 3 },
  { name: { en: "Annual Function", or: "ବାର୍ଷିକ" }, emoji: "🎭", count: 3 },
  { name: { en: "Educational Tours", or: "ଶିକ୍ଷାଭ୍ରମଣ" }, emoji: "🚌", count: 3 },
];

const studentLifePhotos = [
  { emoji: "🚩", label: { en: "Morning Prayer", or: "ପ୍ରାତଃ ପ୍ରାର୍ଥନା" } },
  { emoji: "📖", label: { en: "Classroom Learning", or: "ଶ୍ରେଣୀଗୃହ" } },
  { emoji: "⚽", label: { en: "Sports & Games", or: "ଖେଳକୁଦ" } },
  { emoji: "🔬", label: { en: "Science Experiments", or: "ବିଜ୍ଞାନ ପରୀକ୍ଷା" } },
  { emoji: "🎨", label: { en: "Art & Craft", or: "ଚିତ୍ରାଙ୍କନ" } },
  { emoji: "🎭", label: { en: "Cultural Programs", or: "ସାଂସ୍କୃତିକ" } },
  { emoji: "🚌", label: { en: "Educational Tours", or: "ଭ୍ରମଣ" } },
  { emoji: "🎪", label: { en: "Annual Function", or: "ବାର୍ଷିକ ଉତ୍ସବ" } },
  { emoji: "🧘", label: { en: "Yoga & Meditation", or: "ଯୋଗ" } },
  { emoji: "🌳", label: { en: "Tree Plantation", or: "ବୃକ୍ଷରୋପଣ" } },
  { emoji: "🏆", label: { en: "Award Ceremony", or: "ପୁରସ୍କାର" } },
  { emoji: "📸", label: { en: "Group Photos", or: "ଗ୍ରୁପ୍ ଫଟୋ" } },
];

const galleryPhotos = [
  { emoji: "🏫", category: "Campus", span: "lg:col-span-2 lg:row-span-1" },
  { emoji: "📚", category: "Classroom", span: "" },
  { emoji: "⚽", category: "Sports", span: "lg:row-span-2" },
  { emoji: "🌸", category: "Saraswati Puja", span: "" },
  { emoji: "🔬", category: "Science", span: "" },
  { emoji: "🇮🇳", category: "Republic Day", span: "lg:col-span-2" },
  { emoji: "🎭", category: "Annual Function", span: "" },
  { emoji: "🚌", category: "Educational Tours", span: "" },
  { emoji: "📖", category: "Classroom", span: "" },
  { emoji: "🏆", category: "Sports", span: "" },
  { emoji: "🌸", category: "Saraswati Puja", span: "" },
  { emoji: "🎪", category: "Annual Function", span: "lg:col-span-2" },
  { emoji: "🇮🇳", category: "Republic Day", span: "lg:row-span-2" },
  { emoji: "🔬", category: "Science", span: "" },
  { emoji: "🏫", category: "Campus", span: "" },
  { emoji: "🚌", category: "Educational Tours", span: "" },
  { emoji: "⚽", category: "Sports", span: "" },
  { emoji: "🎭", category: "Annual Function", span: "" },
  { emoji: "🌸", category: "Saraswati Puja", span: "" },
  { emoji: "📚", category: "Classroom", span: "" },
  { emoji: "🏫", category: "Campus", span: "" },
  { emoji: "🇮🇳", category: "Republic Day", span: "" },
  { emoji: "🔬", category: "Science", span: "" },
  { emoji: "⚽", category: "Sports", span: "lg:row-span-2" },
  { emoji: "🎭", category: "Annual Function", span: "" },
  { emoji: "🚌", category: "Educational Tours", span: "lg:col-span-2" },
];

const navLinks = [
  { en: "Home", or: "ମୂଳପୃଷ୍ଠା", id: "home" },
  { en: "About Us", or: "ଆମ ବିଷୟରେ", id: "about" },
  { en: "Achievements", or: "ସଫଳତା", id: "achievements" },
  { en: "Academics", or: "ଶିକ୍ଷା", id: "academics" },
  { en: "Facilities", or: "ସୁବିଧା", id: "facilities" },
  { en: "Gallery", or: "ଗ୍ୟାଲେରୀ", id: "gallery" },
  { en: "Notices", or: "ସୂଚନା", id: "notices" },
  { en: "Admissions", or: "ଭର୍ତ୍ତି", id: "admissions" },
  { en: "Contact", or: "ଯୋଗାଯୋଗ", id: "contact" },
];

const admissionProcess = [
  { en: "Fill Online Application", or: "ଅନଲାଇନ୍ ଆବେଦନ ପୂରଣ କରନ୍ତୁ" },
  { en: "Submit Required Documents", or: "ଆବଶ୍ୟକ ଦଲିଲ ଦାଖଲ କରନ୍ତୁ" },
  { en: "Document Verification", or: "ଦଲିଲ ଯାଞ୍ଚ" },
  { en: "Principal's Interaction", or: "ପ୍ରଧାନଶିକ୍ଷକଙ୍କ ସାକ୍ଷାତକାର" },
  { en: "Fee Payment & Confirmation", or: "ଫି ଦେୟ ଓ ନିଶ୍ଚିତକରଣ" },
];

const docsList = [
  { en: "Birth Certificate", or: "ଜନ୍ମ ପ୍ରମାଣପତ୍ର" },
  { en: "Aadhaar Card", or: "ଆଧାର କାର୍ଡ" },
  { en: "Transfer Certificate", or: "ସ୍ଥାନାନ୍ତର ପ୍ରମାଣପତ୍ର" },
  { en: "Previous Marksheet", or: "ପୂର୍ବତନ ମାର୍କସିଟ୍" },
  { en: "Caste Certificate", or: "ଜାତି ପ୍ରମାଣପତ୍ର" },
  { en: "Passport Photos (4)", or: "ପାସପୋର୍ଟ ଫଟୋ (୪)" },
  { en: "Income Certificate", or: "ଆୟ ପ୍ରମାଣପତ୍ର" },
];

/* ===== ANIMATED COUNTER ===== */
function AnimatedCounter({ value, suffix = "", duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ===== BILINGUAL TEXT COMPONENTS ===== */
function T({ en, or }: { en: string; or: string }) {
  return (
    <span>
      <span>{en}</span>
      <span className="block text-[9px] sm:text-xs opacity-70 leading-tight" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{or}</span>
    </span>
  );
}

function NavT({ en, or }: { en: string; or: string }) {
  return (
    <span className="flex flex-col items-center leading-tight gap-0">
      <span className="text-[11px]">{en}</span>
      <span className="text-[7px] opacity-60" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{or}</span>
    </span>
  );
}

/* ===== MAIN COMPONENT ===== */
export function SchoolWebsiteView({ onBack, schoolId: propSchoolId }: { onBack?: () => void; schoolId?: string }) {
  const { demoMode, tenantId } = useApp();
  const students = useStudents();
  const exams = useExams();
  const feeRecords = useFeeRecords();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [liveSchoolData, setLiveSchoolData] = useState<Record<string, unknown> | null>(null);

  // Online Admission Form states
  const [admStep, setAdmStep] = useState(1);
  const [admForm, setAdmForm] = useState({
    // 1. Student Basic
    studentName: "",
    dob: "",
    gender: "Male",
    bloodGroup: "A+",
    motherTongue: "Odia",
    category: "General",
    
    // 2. Parent Information
    fatherName: "",
    motherName: "",
    guardianName: "",
    mobileNumber: "",
    emailId: "",
    occupation: "",
    
    // 3. Address Information
    houseNo: "",
    streetArea: "",
    city: "",
    state: "Odisha",
    pincode: "",
    
    // 4. Previous School
    prevSchoolName: "",
    tcNumber: "",
    lastClass: "",
    marksObtained: "",
    
    // 5. Academic Details
    classApplied: "1st",
    session: "2026-27",
    electives: "Sanskrit",
    
    // 6. Fee Information
    paymentPreference: "UPI",
    
    // 7. Medical Information
    allergies: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    
    // 8. Documents Upload
    birthCertUrl: "",
    prevTcUrl: "",
    aadhaarUrl: "",
    photoUrl: ""
  });
  const [admSubmitting, setAdmSubmitting] = useState(false);
  const [admSuccess, setAdmSuccess] = useState(false);

  // Online Fee Payment states
  const [payStudentName, setPayStudentName] = useState("");
  const [payParentName, setPayParentName] = useState("");
  const [payClass, setPayClass] = useState("1st");
  const [paySelectedMonths, setPaySelectedMonths] = useState<string[]>([]);
  const [payAmount, setPayAmount] = useState(1000);
  const [payUtr, setPayUtr] = useState("");
  const [payScreenshot, setPayScreenshot] = useState("");
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Parent Student Report Portal states
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchParentName, setSearchParentName] = useState("");
  const [searchClass, setSearchClass] = useState("1st");
  const [searchDob, setSearchDob] = useState("");
  const [selectedStudentResult, setSelectedStudentResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState("");
  const [reportLang, setReportLang] = useState<"en" | "or">("en");

  const triggerNotification = (title: string, desc: string) => {
    const sid = propSchoolId || "1";
    const key = `vidyaos_global_notifications_${sid}`;
    const cached = safeLocalStorage.getItem(key);
    const list = cached ? JSON.parse(cached) : [
      { title: "New School Registration", desc: "Saraswati Sishu Mandir, Balasore", time: "2 min ago" },
      { title: "Payment Received", desc: "Subscription fee for 50 schools", time: "1 hour ago" },
      { title: "Circular Published", desc: "Academic Calendar 2025-26", time: "3 hours ago" }
    ];
    list.unshift({ title, desc, time: "Just now" });
    safeLocalStorage.setItem(key, JSON.stringify(list));
  };

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admForm.studentName.trim() || !admForm.fatherName.trim() || !admForm.mobileNumber.trim()) {
      alert("Please fill in Student Name, Father Name and Mobile Number.");
      return;
    }
    setAdmSubmitting(true);
    const sid = propSchoolId || "1";
    const newAdmission = {
      name: admForm.studentName,
      parentName: admForm.fatherName,
      class: admForm.classApplied,
      phone: admForm.mobileNumber,
      email: admForm.emailId || "N/A",
      address: `${admForm.houseNo}, ${admForm.streetArea}, ${admForm.city}, ${admForm.state} - ${admForm.pincode}`,
      schoolId: Number(sid),
      admissionNo: `ADM-${Date.now().toString().slice(-5)}`,
      submittedDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "New" as const,
      details: admForm, // Save complete multi-step form data
    };

    if (demoMode) {
      const cachedAdmissions = safeLocalStorage.getItem(`vidyaos_admissions_${sid}`);
      const list = cachedAdmissions ? JSON.parse(cachedAdmissions) : [];
      list.unshift({ ...newAdmission, id: Date.now() });
      safeLocalStorage.setItem(`vidyaos_admissions_${sid}`, JSON.stringify(list));
    } else {
      try {
        await addAdmission(tenantId, newAdmission as any);
      } catch (err) {
        console.error(err);
      }
    }
    // Push Notification
    triggerNotification("New Admission Application", `${admForm.studentName} has applied for admission in ${admForm.classApplied} Class.`);
    setAdmSubmitting(false);
    setAdmSuccess(true);
    setAdmStep(1);
    setAdmForm({
      studentName: "", dob: "", gender: "Male", bloodGroup: "A+", motherTongue: "Odia", category: "General",
      fatherName: "", motherName: "", guardianName: "", mobileNumber: "", emailId: "", occupation: "",
      houseNo: "", streetArea: "", city: "", state: "Odisha", pincode: "",
      prevSchoolName: "", tcNumber: "", lastClass: "", marksObtained: "",
      classApplied: "1st", session: "2026-27", electives: "Sanskrit",
      paymentPreference: "UPI",
      allergies: "", medicalConditions: "", emergencyContactName: "", emergencyContactPhone: "",
      birthCertUrl: "", prevTcUrl: "", aadhaarUrl: "", photoUrl: ""
    });
  };

  const handleFeePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStudentName || !payParentName || !payUtr || !payScreenshot) {
      alert("Please fill all fields and upload a screenshot.");
      return;
    }
    setPaySubmitting(true);
    const sid = propSchoolId || "1";

    // Upload proof dynamically to Cloudinary
    let uploadedUrl = payScreenshot;
    if (payScreenshot && payScreenshot.startsWith("data:")) {
      try {
        const cloudUrl = await uploadToCloudinary(payScreenshot, tenantId, sid);
        if (cloudUrl) uploadedUrl = cloudUrl;
      } catch (err) {
        console.error("Failed to upload screenshot to Cloudinary, fallback to base64:", err);
      }
    }

    const newPayment = {
      id: `fp_${Date.now()}`,
      parentName: payParentName,
      studentName: payStudentName,
      class: payClass,
      amount: Number(payAmount),
      utr: payUtr,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Pending Verification",
      screenshotUrl: uploadedUrl,
      months: paySelectedMonths,
    };

    const cached = safeLocalStorage.getItem(`vidyaos_fee_payments_${sid}`);
    const list = cached ? JSON.parse(cached) : (demoMode ? [
      { id: "fp_1", parentName: "Bishnu Prasad Patra", studentName: "Rakesh Patra", class: "5th", amount: 1500, utr: "UTI8394829384", date: "02 Jul 2026", status: "Pending Verification", screenshotUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=600&q=80", months: ["June 2026"] },
      { id: "fp_2", parentName: "Meenakshi Das", studentName: "Swati Das", class: "3rd", amount: 2000, utr: "UPI9849204922", date: "01 Jul 2026", status: "Verified", screenshotUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=600&q=80", months: ["June 2026", "July 2026"] }
    ] : []);
    list.unshift(newPayment);
    safeLocalStorage.setItem(`vidyaos_fee_payments_${sid}`, JSON.stringify(list));

    // Push Notification
    triggerNotification("Fee Payment Uploaded", `₹${payAmount.toLocaleString()} fee payment proof submitted by ${payStudentName} for ${paySelectedMonths.join(", ")}.`);

    setPaySubmitting(false);
    setPaySuccess(true);
    setPayStudentName("");
    setPayParentName("");
    setPayUtr("");
    setPayScreenshot("");
    setPaySelectedMonths([]);
  };

  useEffect(() => {
    const feeStructure = (liveSchoolData as any)?.feeStructure || [
      { class: "1st", admissionFee: 2000, tuitionFee: 800, examFee: 500 },
      { class: "2nd", admissionFee: 2000, tuitionFee: 800, examFee: 500 },
      { class: "3rd", admissionFee: 2000, tuitionFee: 900, examFee: 500 },
      { class: "4th", admissionFee: 2200, tuitionFee: 900, examFee: 600 },
      { class: "5th", admissionFee: 2200, tuitionFee: 1000, examFee: 600 },
      { class: "6th", admissionFee: 2500, tuitionFee: 1100, examFee: 700 },
      { class: "7th", admissionFee: 2500, tuitionFee: 1200, examFee: 700 },
      { class: "8th", admissionFee: 3000, tuitionFee: 1300, examFee: 800 },
      { class: "9th", admissionFee: 3000, tuitionFee: 1400, examFee: 800 },
      { class: "10th", admissionFee: 3500, tuitionFee: 1500, examFee: 1000 },
    ];
    const match = feeStructure.find((f: any) => f.class === payClass);
    if (match) {
      const tuitionFee = match.tuitionFee || 800;
      setPayAmount(tuitionFee * (paySelectedMonths.length || 1));
    }
  }, [payClass, paySelectedMonths, liveSchoolData]);

  const handleParentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchStudentName || !searchParentName || !searchDob) {
      setSearchError("Please enter Student Name, Parent Name, and Date of Birth.");
      setSelectedStudentResult(null);
      return;
    }

    const formatInputDateToDb = (dateStr: string) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };

    const sid = propSchoolId || "1";
    const dbDob = formatInputDateToDb(searchDob);

    const match = students.find((s: any) => 
      s.name.toLowerCase().trim() === searchStudentName.toLowerCase().trim() &&
      s.parent.toLowerCase().trim() === searchParentName.toLowerCase().trim() &&
      s.class === searchClass &&
      String(s.schoolId || 1) === String(sid) &&
      (s.dob === dbDob || s.dob === searchDob)
    );

    if (match) {
      setSelectedStudentResult(match);
      setSearchError("");
    } else {
      setSelectedStudentResult(null);
      setSearchError("No student record matches the entered credentials.");
    }
  };

  const localMarks = useMemo(() => {
    const cached = safeLocalStorage.getItem("vidyaos_marks_data");
    if (cached) return JSON.parse(cached);
    return [];
  }, [selectedStudentResult]);

  const dbMarks = useMarksRecords(
    !demoMode && selectedStudentResult
      ? { studentId: selectedStudentResult.id, schoolId: selectedStudentResult.schoolId || propSchoolId || "1" }
      : undefined
  );

  const studentMarks = useMemo(() => {
    if (!selectedStudentResult) return [];
    const baseList = demoMode ? localMarks : dbMarks;
    return baseList.filter((r: any) => String(r.studentId) === String(selectedStudentResult.id));
  }, [selectedStudentResult, demoMode, localMarks, dbMarks]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vidyaos_active_school_id");
      localStorage.removeItem("vidyaos_active_school_config");
    }

    const sid = propSchoolId || "1";
    // Check localStorage first for instant sandbox changes
    const cacheKey = "vidyaos_school_website_" + sid;
    const cacheTimeKey = "vidyaos_school_website_time_" + sid;
    
    const localData = safeLocalStorage.getItem(cacheKey);
    const localTime = safeLocalStorage.getItem(cacheTimeKey);
    
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setLiveSchoolData(parsed);
        if (parsed.firebaseConfig) {
          setActiveSchoolConfig(sid, parsed.firebaseConfig);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (!demoMode) {
      const now = Date.now();
      const cacheDuration = 0; // Disable cache for instant updates
      
      const shouldFetch = !localData || !localTime || (now - Number(localTime)) > cacheDuration;
      
      if (shouldFetch) {
        fetchSchoolConfig(tenantId, sid).then((data) => {
          if (data) {
            setLiveSchoolData(data);
            if (data.firebaseConfig) {
              setActiveSchoolConfig(sid, data.firebaseConfig);
            }
            safeLocalStorage.setItem(cacheKey, JSON.stringify(data));
            safeLocalStorage.setItem(cacheTimeKey, String(now));
          }
        }).catch(() => {});
      }
    }

    return () => {
      // Clear active config when navigating away or unmounting
      setActiveSchoolConfig(null, null);
    };
  }, [demoMode, tenantId, propSchoolId]);

  const school = useMemo(() => {
    const activeData = liveSchoolData || {};
    return {
      name: {
        en: (activeData.nameEn as string) || "Saraswati Sishu Mandir",
        or: (activeData.nameOr as string) || "ସରସ୍ୱତୀ ଶିଶୁ ମନ୍ଦିର",
      },
      short: (activeData.shortName as string) || "SSM",
      location: {
        en: (activeData.address as string)
          ? (activeData.address as string).split(",").slice(-2).join(",").trim()
          : "Bhubaneswar, Odisha",
        or: (activeData.address as string)
          ? (activeData.address as string).split(",").slice(-2).join(",").trim()
          : "ଭୁବନେଶ୍ୱର, ଓଡ଼ିଶା",
      },
      tagline: {
        en: (activeData.taglineEn as string) || "Nurturing Knowledge, Character & Excellence",
        or: (activeData.taglineOr as string) || "ଜ୍ଞាន, ସଂସ୍କାର ଓ ଉତ୍କର୍ଷତାର ବିକାଶ",
      },
      subTagline: {
        en: (activeData.subTaglineEn as string) || "Providing quality education, discipline, values, and holistic development since 2008.",
        or: (activeData.subTaglineOr as string) || "୨୦୦୮ ଠାରୁ ଗୁଣାତ୍ମକ ଶିକ୍ଷା, ଶୃଙ୍ଖଳା, ସଂସ୍କାର ଏବଂ ସର୍ବାଙ୍ଗୀଣ ବିକାଶ।",
      },
      phone: (activeData.phone as string) || "+91-674-2345678",
      email: (activeData.email as string) || "principal@ssmbbsr.edu.in",
      address: (activeData.address as string) || "Unit-4, Bhubaneswar, Odisha - 751001",
      sansthan: (activeData.sansthan as string) || "Bharatiya Siksha Vikash Sansthan",
      sansthanOr: (activeData.sansthanOr as string) || "ଭାରତୀୟ ଶିକ୍ଷା ବିକାଶ ସଂସ୍ଥାନ",
      principal: {
        en: (activeData.principalNameEn as string) || "Dr. Rajendra Mohapatra",
        or: (activeData.principalNameOr as string) || "ଡା. ରାଜେନ୍ଦ୍ର ମହାପାତ୍ର",
      },
      principalMsg: {
        en: (activeData.principalMsgEn as string) || "At Saraswati Sishu Mandir, we believe in nurturing not just academic excellence but also strong moral values and character. Our dedicated teachers, supportive parents, and motivated students together create an environment where every child can thrive. We focus on holistic development — preparing students not just for exams, but for life.",
        or: (activeData.principalMsgOr as string) || "ସରସ୍ୱତୀ ଶିଶୁ ମନ୍ଦିରରେ, ଆମେ କେବଳ ଶିକ୍ଷାଗତ ଉତ୍କର୍ଷତା ନୁହେଁ, ବରଂ ଦୃଢ଼ ନୈତିକ ମୂଲ୍ୟବୋଧ ଏବଂ ଚରିତ୍ର ଗଠନରେ ବିଶ୍ବାସ କରୁ। ଆମର ଶିକ୍ଷକମାନେ ପ୍ରତ୍ୟେକ ଶିଶୁକୁ ସର୍ବାଙ୍ଗୀଣ ମାର୍ଗଦର୍ଶନ ଦେଇଥାନ୍ତି।",
      },
      principalPhotoUrl: (activeData.principalPhotoUrl as string) || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80",
      established: Number(activeData.established) || 2008,
      logoUrl: (activeData.logoUrl as string) || "",
      bannerUrl: (activeData.bannerUrl as string) || "",
      gallery: (activeData.gallery as string[]) || [],

      // Stats
      stats: (activeData.stats as any[]) || [
        { value: 500, suffix: "+", label: { en: "Students", or: "ଛାତ୍ରଛାତ୍ରୀ" } },
        { value: 25, suffix: "+", label: { en: "Teachers", or: "ଶିକ୍ଷକ" } },
        { value: 15, suffix: "+", label: { en: "Years of Excellence", or: "ଉତ୍କର୍ଷ ବର୍ଷ" } },
        { value: 95, suffix: "%", label: { en: "Board Results", or: "ପରୀକ୍ଷା ଫଳାଫଳ" } }
      ],

      // About
      aboutPhotoUrl: (activeData.aboutPhotoUrl as string) || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
      aboutTextEn: (activeData.aboutTextEn as string) || "Founded in 2008 under the aegis of Bharatiya Siksha Vikash Sansthan, Saraswati Sishu Mandir has been a beacon of quality education in Bhubaneswar. With a strong focus on value-based education, we have produced thousands of responsible citizens who excel in diverse fields.",
      aboutTextOr: (activeData.aboutTextOr as string) || "୨୦୦୮ ମସିହାରେ ଭାରତୀୟ ଶିକ୍ଷା ବିକାଶ ସଂସ୍ଥାନ ଅଧୀନରେ ପ୍ରତିଷ୍ଠିତ ସରସ୍ୱତୀ ଶିଶୁ ମନ୍ଦିର ଭୁବନେଶ୍ୱରରେ ଗୁଣାତ୍ମକ ଶିକ୍ଷାର ଏକ ଆଲୋକବର୍ତ୍ତିକା ହୋଇ ରହିଆସିଛି। ସଂସ୍କାରମୂଳକ ଶିକ୍ଷା ଉପରେ ଏକ ଦୃଢ଼ ଧ୍ୟାନ ସହିତ, ଆମେ ହଜାର ହଜାର ଦାୟିତ୍ୱସମ୍ପନ୍ନ ନାଗରିକ ସୃଷ୍ଟି କରିଛୁ ଯେଉଁମାନେ ବିଭିନ୍ନ କ୍ଷେତ୍ରରେ ଉତ୍କର୍ଷତା ହାସଲ କରନ୍ତି।",
      missionEn: (activeData.missionEn as string) || "To provide affordable, value-based education that nurtures academic excellence, character, and cultural roots.",
      missionOr: (activeData.missionOr as string) || "ଶୈକ୍ଷିକ ଉତ୍କର୍ଷତା, ଚରିତ୍ର ଏବଂ ସାଂସୃତିକ ଚେରକୁ ପ୍ରୋତ୍ସାହିତ କରୁଥିବା ସୁଲଭ, ସଂସ୍କାରଭିତ୍ତିକ ଶିକ୍ଷା ପ୍ରଦାନ କରିବା।",
      visionEn: (activeData.visionEn as string) || "To be a leading institution shaping future leaders rooted in Bharatiya values.",
      visionOr: (activeData.visionOr as string) || "ଭାରତୀୟ ମୂଲ୍ୟବୋଧରେ ପ୍ରତିଷ୍ଠିତ ଭବିଷ୍ୟତର ନେତାମାନଙ୍କୁ ଗଢ଼ିତୋଳିବାରେ ଏକ ଅଗ୍ରଣୀ ଅନୁଷ୍ଠାନ ହେବା।",
      badges: (activeData.badges as string[]) || ["BSE Odisha Affiliated", "CBSE Recognized", "ISO 9001:2024"],

      // Achievements Counters
      achievementsCounters: (activeData.achievementsCounters as any[]) || [
        { value: 96, suffix: "%", label: { en: "Board Result", or: "ଫଳାଫଳ" } },
        { value: 24, suffix: "+", label: { en: "Scholarship", or: "ଛାତ୍ରବୃତ୍ତି" } },
        { value: 18, suffix: "+", label: { en: "Olympiad", or: "ଅଲିମ୍ପିଆଡ୍" } },
        { value: 32, suffix: "+", label: { en: "District Toppers", or: "ଜିଲ୍ଲା ଟପ୍ପର" } },
        { value: 15, suffix: "+", label: { en: "State Rank", or: "ରାଜ୍ୟ ର୍ୟାଙ୍କ" } },
        { value: 45, suffix: "+", label: { en: "Sports Winners", or: "କ୍ରୀଡା" } }
      ],

      // Lists
      achievers: (activeData.achievers as any[]) || achievers,
      alumni: (activeData.alumni as any[]) || alumniData,
      testimonials: (activeData.testimonials as any[]) || testimonials,
      performanceData: (activeData.performanceData as any[]) || performanceData,
      notices: (activeData.notices as any[]) || notices,
      facilities: (activeData.facilities as any[]) || facilities,
      studentLife: (activeData.studentLife as any[]) || studentLifePhotos,
    };
  }, [liveSchoolData]);

  const activePerformanceData = school.performanceData;
  const activeNotices = school.notices;
  const activeTestimonials = school.testimonials;
  const activeAchievers = school.achievers;
  const activeAlumni = school.alumni;

  useDynamicSEO({
    title: `${school.name.en} (${school.short}) - Admissions & Portal`,
    description: `Official website of ${school.name.en} in ${school.location.en}. View exam results, submit online admissions, pay school fees, and check homework online.`,
    keywords: `${school.name.en}, ${school.short}, Shishu Mandir, School Admission, Odisha Schools, Student Portal`,
    ogImage: school.logoUrl || undefined,
  });

  const rawLogo = school.logoUrl || logoImg;
  const activeLogo = typeof rawLogo === "object" && rawLogo !== null && "src" in rawLogo ? (rawLogo as any).src : rawLogo;

  const activeGallery = useMemo(() => {
    if (school.gallery && school.gallery.length > 0) {
      return school.gallery.map((item: any, i) => {
        const isObj = typeof item === "object" && item !== null;
        const url = isObj ? item.url : item;
        const category = isObj ? item.category : null;
        const emoji = isObj ? item.emoji || "📸" : "📸";

        const fallbackCategories = ["Campus", "Classroom", "Sports", "Science", "Annual Function", "Educational Tours"];
        const finalCategory = category || fallbackCategories[i % fallbackCategories.length];

        return {
          emoji,
          category: finalCategory,
          span: i % 5 === 0 ? "lg:col-span-2" : i % 7 === 0 ? "lg:row-span-2" : "",
          url,
        };
      });
    }
    return null;
  }, [school.gallery]);

  const dynamicGalleryCategories = useMemo(() => {
    const defaultCats = [
      { name: { en: "Campus", or: "କ୍ୟାମ୍ପସ୍" }, emoji: "🏫" },
      { name: { en: "Classroom", or: "ଶ୍ରେଣୀଗୃହ" }, emoji: "📚" },
      { name: { en: "Sports", or: "କ୍ରୀଡା" }, emoji: "⚽" },
      { name: { en: "Saraswati Puja", or: "ସରସ୍ବତୀ ପୂଜା" }, emoji: "🌸" },
      { name: { en: "Science", or: "ବିଜ୍ଞାନ" }, emoji: "🔬" },
      { name: { en: "Republic Day", or: "ଗଣତନ୍ତ୍ର" }, emoji: "🇮🇳" },
      { name: { en: "Annual Function", or: "ବାର୍ଷିକ" }, emoji: "🎭" },
      { name: { en: "Educational Tours", or: "ଶିକ୍ଷାଭ୍ରମଣ" }, emoji: "🚌" },
    ];
    
    const photos = activeGallery || galleryPhotos;
    const existingEnNames = new Set(defaultCats.map(c => c.name.en));
    const extraCats: { name: { en: string; or: string }; emoji: string }[] = [];
    
    photos.forEach((p: any) => {
      if (p.category && !existingEnNames.has(p.category)) {
        existingEnNames.add(p.category);
        extraCats.push({
          name: { en: p.category, or: p.category },
          emoji: p.emoji || "📸"
        });
      }
    });
    
    return [...defaultCats, ...extraCats];
  }, [activeGallery]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const obsVal = entry.target.getAttribute("data-observe");
            if (obsVal) {
              setVisible((p) => new Set(p).add(obsVal));
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-observe]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isVis = (id: string) => visible.has(id);
  const filteredGallery = activeFilter
    ? (activeGallery || galleryPhotos).filter((p) => p.category === activeFilter)
    : (activeGallery || galleryPhotos);

  return (
    <div className="website-page min-h-screen bg-[#F8F9FA] text-[#1E1E1E] overflow-x-hidden">
      {/* ===== BACK BUTTON ===== */}
      {onBack && (
        <button onClick={onBack} className="fixed bottom-6 left-6 z-[100] bg-[#1D2D7A] text-white px-5 py-2.5 rounded-2xl shadow-2xl text-sm font-bold hover:bg-[#15205E] hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/10">
          <ChevronLeft size={16} /> <T en={O.backToDashboard.en} or={O.backToDashboard.or} />
        </button>
      )}

      {/* ===== TOP HEADER ===== */}
      <div className="bg-[#1D2D7A] text-white relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <img src={activeLogo} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-white/20 bg-white" />
              <div className="hidden sm:block">
                <p className="text-xs text-blue-200" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{school.sansthanOr}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-5 text-xs">
              <span className="hidden md:flex items-center gap-1.5 text-blue-200"><Phone size={12} className="text-[#D4A017]" /> {school.phone}</span>
              <span className="hidden md:flex items-center gap-1.5 text-blue-200"><Mail size={12} className="text-[#D4A017]" /> {school.email}</span>
              <button onClick={() => scrollTo("admissions")} className="bg-[#D4A017] text-[#1D2D7A] px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold hover:bg-[#C49B16] transition-all">{O.admissionOpen.en}</button>
              <button className="border border-white/30 text-white px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium hover:bg-white/10 transition-all hidden sm:flex items-center gap-1"><Phone size={10} /> {O.contactUs.en}</button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-900/10" : "bg-white/90 backdrop-blur-md"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <img src={activeLogo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-all bg-white" />
              <div>
                <h1 className="text-sm sm:text-lg font-bold text-[#1D2D7A] leading-tight">{school.name.en}</h1>
                <p className="text-[9px] sm:text-[11px] text-[#1D2D7A]/60" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{school.name.or} | {school.location.en}</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="px-3 xl:px-3.5 py-2 font-medium text-[#1D2D7A]/70 hover:text-[#1D2D7A] hover:bg-blue-50/50 rounded-xl transition-all"><NavT en={l.en} or={l.or} /></button>
              ))}
              <button onClick={() => scrollTo("admissions")} className="ml-2 bg-[#D4A017] text-[#1D2D7A] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#C49B16] shadow-lg shadow-[#D4A017]/30 transition-all flex items-center gap-1">{O.admissionOpen.en} <ChevronRight size={14} /></button>
            </nav>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-50 text-[#1D2D7A]">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-blue-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-xl max-h-[80vh] overflow-y-auto">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-[#1D2D7A]/70 hover:text-[#1D2D7A] hover:bg-blue-50 rounded-xl"><T en={l.en} or={l.or} /></button>
            ))}
            <button onClick={() => scrollTo("admissions")} className="w-full bg-[#D4A017] text-[#1D2D7A] px-4 py-3 rounded-xl text-sm font-bold mt-2"><T en={O.admissionOpen.en} or={O.admissionOpen.or} /></button>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#1D2D7A]">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#1D2D7A] via-[#1D2D7A]/95 to-[#15205E]" 
          style={school.bannerUrl ? { backgroundImage: `linear-gradient(rgba(29, 45, 122, 0.8), rgba(21, 32, 94, 0.85)), url(${school.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,160,23,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.04)_0%,transparent_50%)]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#D4A017]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 opacity-5 text-white text-[200px] font-extrabold select-none pointer-events-none">{school.short}</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles size={14} className="text-[#D4A017]" /> {school.sansthan}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-3">
              {school.name.en.split(" ").map((word, i) => (
                <span key={i}>{i === 1 ? <span className="text-[#D4A017]">{word}</span> : word} </span>
              ))}
            </h1>
            <p className="text-lg sm:text-2xl text-blue-200/80 mb-6" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{school.name.or}</p>
            <p className="text-xl sm:text-2xl text-blue-100/90 mb-2 font-light">&ldquo;{school.tagline.en}&rdquo;</p>
            <p className="text-sm sm:text-base text-blue-200/70 mb-8" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>&ldquo;{school.tagline.or}&rdquo;</p>
            <p className="text-base sm:text-lg text-blue-200/80 mb-8 max-w-2xl">{school.subTagline.en}</p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button onClick={() => scrollTo("admissions")} className="group inline-flex items-center gap-2 bg-[#D4A017] text-[#1D2D7A] px-7 py-3.5 rounded-2xl font-bold hover:bg-[#C49B16] shadow-2xl shadow-[#D4A017]/40 hover:shadow-[#D4A017]/50 transition-all duration-300 text-sm sm:text-base">
                <T en={O.applyNow.en} or={O.applyNow.or} /> <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo("achievements")} className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-7 py-3.5 rounded-2xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm text-sm sm:text-base">
                <T en={O.viewAchievements.en} or={O.viewAchievements.or} />
              </button>
              <button onClick={() => scrollTo("principalMsg")} className="inline-flex items-center gap-2 border-2 border-white/10 text-blue-200 px-6 py-3.5 rounded-2xl font-medium hover:bg-white/5 transition-all backdrop-blur-sm text-sm sm:text-base">
                <T en={O.principalMsg.en} or={O.principalMsg.or} />
              </button>
            </div>

            {/* Floating stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16">
              {school.stats.map((s: any, idx: number) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 sm:p-5 text-center hover:bg-white/15 transition-all">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#D4A017]"><AnimatedCounter value={s.value} suffix={s.suffix} /></div>
                  <div className="mt-1">
                    <p className="text-white text-xs sm:text-sm font-medium">{s.label.en}</p>
                    <p className="text-blue-200/70 text-[10px]" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{s.label.or}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8F9FA] to-transparent" />
      </section>

      {/* ===== WHY PARENTS TRUST US ===== */}
      <section id="about" data-observe="about" className="py-6 sm:py-8 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVis("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D2D7A]/10 border border-[#1D2D7A]/20 text-[#1D2D7A] text-xs font-medium mb-3">❤️ <T en={O.whyTrust.en} or={O.whyTrust.or} /></span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D2D7A] mb-3"><T en={O.whyTrust.en} or={O.whyTrust.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{O.whyTrust.en} — what makes us the preferred choice for thousands of parents</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 transition-all duration-700 delay-100 ${isVis("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label.en} className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                  <div className={`absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}><Icon size={26} /></div>
                  <h3 className="text-base font-bold text-[#1D2D7A] mb-1">{item.label.en}</h3>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{item.label.or}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SCHOOL ===== */}
      <section id="aboutSchool" data-observe="aboutSchool" className="py-6 sm:py-8 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D2D7A]/[0.02] rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 transition-all duration-700 ${isVis("aboutSchool") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="lg:w-2/5 relative w-full">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-[#1D2D7A]/20 relative group">
                <img
                  src={school.aboutPhotoUrl}
                  alt="School Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D2D7A]/90 via-[#1D2D7A]/30 to-transparent flex flex-col justify-end p-6" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <p className="text-[#D4A017] text-xs font-bold uppercase tracking-wider">Our Campus</p>
                  <h4 className="text-lg font-bold">{school.short} Main Building</h4>
                  <p className="text-white/70 text-xs mt-0.5">Established in {school.established}</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-[#D4A017] flex items-center justify-center shadow-xl shadow-[#D4A017]/30 z-20">
                <div className="text-center"><p className="text-[#1D2D7A] font-extrabold text-lg">{new Date().getFullYear() - school.established}</p><p className="text-[#1D2D7A] text-[8px] font-bold">YEARS</p></div>
              </div>
            </div>
            <div className="lg:w-3/5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D2D7A]/10 border border-[#1D2D7A]/20 text-[#1D2D7A] text-xs font-medium mb-4"><GraduationCap size={14} /> <T en={O.aboutSchool.en} or={O.aboutSchool.or} /></span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-4 leading-tight">{school.name.en}</h2>
              <p className="text-base text-[#1D2D7A]/80 mb-4 font-medium" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{school.name.or}</p>
              <p className="text-gray-600 leading-relaxed mb-6"><T en={school.aboutTextEn} or={school.aboutTextOr} /></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100"><Target size={18} className="text-[#1D2D7A] mt-0.5 shrink-0" /><div><h4 className="font-bold text-[#1D2D7A] text-sm mb-0.5"><T en="Our Mission" or="ଆମ ଲକ୍ଷ୍ୟ" /></h4><p className="text-xs text-gray-500"><T en={school.missionEn} or={school.missionOr} /></p></div></div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-100"><Eye size={18} className="text-[#D4A017] mt-0.5 shrink-0" /><div><h4 className="font-bold text-[#1D2D7A] text-sm mb-0.5"><T en="Our Vision" or="ଆମ ଦୃଷ୍տିକୋଣ" /></h4><p className="text-xs text-gray-500"><T en={school.visionEn} or={school.visionOr} /></p></div></div>
              </div>
              <div className="flex flex-wrap gap-3">
                {school.badges.map((badge: string, idx: number) => (
                  <span key={idx} className="px-4 py-2 rounded-xl bg-blue-50/70 border border-blue-100 text-[#1D2D7A] text-sm font-medium flex items-center gap-2">
                    <CheckCircle size={14} className={idx % 2 === 0 ? "text-[#D4A017]" : "text-emerald-500"} />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRINCIPAL MESSAGE ===== */}
      <section id="principalMsg" data-observe="principalMsg" className="py-6 sm:py-8 bg-[#1D2D7A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D2D7A] to-[#15205E]" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#D4A017]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 transition-all duration-700 ${isVis("principalMsg") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="lg:w-1/3 flex flex-col items-center w-full">
              <div className="relative mb-5">
                <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-[#D4A017]/30 shadow-2xl shadow-[#D4A017]/20 bg-white/5">
                  <img
                    src={school.principalPhotoUrl}
                    alt="Principal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-xl bg-[#D4A017] flex items-center justify-center shadow-xl"><Quote size={24} className="text-[#1D2D7A]" /></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white text-center">{school.principal.en}</h3>
              <p className="text-sm text-[#D4A017] font-medium text-center" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{school.principal.or}</p>
              <p className="text-xs text-blue-300 mt-1 text-center">{O.principalTitle.en}</p>
            </div>
            <div className="lg:w-2/3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#D4A017] text-xs font-medium mb-4 backdrop-blur-sm"><Quote size={12} /> <T en={O.principalMsg.en} or={O.principalMsg.or} /></span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"><T en={O.principalMsg.en} or={O.principalMsg.or} /></h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8">
                <p className="text-blue-100 leading-relaxed text-base sm:text-lg italic border-l-4 border-[#D4A017] pl-5 mb-4">&ldquo;{school.principalMsg.en}&rdquo;</p>
                <p className="text-blue-200/80 leading-relaxed text-sm sm:text-base italic border-l-4 border-[#D4A017]/50 pl-5" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>&ldquo;{school.principalMsg.or}&rdquo;</p>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["🏆", "📚", "⭐", "🎓"].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A017] to-amber-400 border-2 border-[#1D2D7A] flex items-center justify-center text-[10px]">{e}</div>
                  ))}
                </div>
                <p className="text-xs text-blue-300">25+ years of educational excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS ===== */}
      <section id="achievements" data-observe="achievements" className="py-6 sm:py-8 bg-[#F8F9FA] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#D4A017]/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVis("achievements") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/20 text-[#D4A017] text-xs font-medium mb-3">🏆 <T en={O.ourAchievements.en} or={O.ourAchievements.or} /></span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D2D7A] mb-3"><T en={O.ourAchievements.en} or={O.ourAchievements.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Celebrating excellence in academics, scholarships, sports, and beyond</p>
          </div>
          {/* Counters */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-12 sm:mb-16 transition-all duration-700 delay-100 ${isVis("achievements") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {school.achievementsCounters.map((a: any, idx: number) => {
              const counterColors = [
                "from-blue-600 to-blue-400",
                "from-[#D4A017] to-amber-400",
                "from-emerald-600 to-emerald-400",
                "from-purple-600 to-purple-400",
                "from-rose-600 to-rose-400",
                "from-cyan-600 to-cyan-400"
              ];
              const colorClass = counterColors[idx % counterColors.length];
              return (
                <div key={idx} className="group bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 sm:p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all border border-gray-100">
                  <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}><span className="text-white font-bold text-lg"><AnimatedCounter value={a.value} suffix="" /></span></div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1D2D7A]"><AnimatedCounter value={a.value} suffix={a.suffix} /></p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{a.label.en}</p>
                  <p className="text-[10px] text-gray-400" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{a.label.or}</p>
                </div>
              );
            })}
          </div>
          {/* Achievers */}
          <div className={`transition-all duration-700 delay-200 ${isVis("achievements") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D2D7A]"><T en="Top Achievers" or="ଶ୍ରେଷ୍ଠ ସଫଳତା" /></h3>
              <span className="text-xs text-gray-400">2025-26</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {activeAchievers.map((a: any) => (
                <div key={a.name.en} className="group bg-white rounded-2xl shadow-md shadow-gray-200/50 p-4 sm:p-5 text-center hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer border border-gray-50 relative overflow-hidden">
                  <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${a.color} opacity-10`} />
                  <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden mb-3 group-hover:scale-110 transition-transform shadow-lg relative border-2 border-white">
                    {a.image ? (
                      <img src={a.image} alt={a.name.en} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${a.color} flex items-center justify-center text-3xl`}>{a.emoji}</div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#1D2D7A]">{a.name.en}</p>
                  <p className="text-[10px] text-[#D4A017] font-medium" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{a.name.or}</p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{a.achievement.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ALUMNI ===== */}
      <section id="alumni" data-observe="alumni" className="py-6 sm:py-8 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4A017]/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVis("alumni") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D2D7A]/10 border border-[#1D2D7A]/20 text-[#1D2D7A] text-xs font-medium mb-3">🎓 <T en={O.alumSuccess.en} or={O.alumSuccess.or} /></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3"><T en={O.alumSuccess.en} or={O.alumSuccess.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our alumni are making a mark across diverse fields globally</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 transition-all duration-700 delay-100 ${isVis("alumni") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {activeAlumni.map((a: any) => (
              <div key={a.name.en} className="group bg-white rounded-2xl shadow-lg shadow-gray-200/40 p-5 sm:p-6 hover:-translate-y-1.5 hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${a.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg mb-3 group-hover:scale-110 transition-transform relative border-2 border-white">
                    {a.image ? (
                      <img src={a.image} alt={a.name.en} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${a.color} flex items-center justify-center text-3xl`}>{a.emoji}</div>
                    )}
                  </div>
                  <h4 className="font-bold text-[#1D2D7A] text-base">{a.name.en}</h4>
                  <p className="text-xs text-[#D4A017] font-medium" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{a.name.or}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.title.en}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.role.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCHOLARSHIP ===== */}
      <section data-observe="scholarship" className="py-6 sm:py-8 bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVis("scholarship") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/20 text-[#D4A017] text-xs font-medium mb-3">🎓 <T en={O.scholarshipTitle.en} or={O.scholarshipTitle.or} /></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3"><T en={O.scholarshipTitle.en} or={O.scholarshipTitle.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our students excel at state and national level competitive examinations</p>
          </div>
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700 delay-100 ${isVis("scholarship") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {scholarshipData.map((s) => (
              <div key={s.title.en} className="group relative rounded-2xl bg-white border border-gray-100 p-6 sm:p-7 text-center hover:-translate-y-1.5 hover:shadow-2xl transition-all shadow-lg shadow-gray-200/30 overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <p className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${s.color}`}><AnimatedCounter value={s.count} suffix="+" /></p>
                <h4 className="text-base font-bold text-[#1D2D7A] mt-2">{s.title.en}</h4>
                <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{s.title.or}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACADEMIC PERFORMANCE ===== */}
      <section id="academics" data-observe="academics" className="py-6 sm:py-8 bg-white relative overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 transition-all duration-700 ${isVis("academics") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D2D7A]/10 border border-[#1D2D7A]/20 text-[#1D2D7A] text-xs font-medium mb-3">📊 <T en={O.academicDashboard.en} or={O.academicDashboard.or} /></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3"><T en={O.academicPerf.en} or={O.academicPerf.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Consistent growth in academics, admissions, and student achievements over the last 5 years</p>
          </div>
          <div className={`transition-all duration-700 delay-100 ${isVis("academics") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100 p-5 sm:p-6">
                <h4 className="font-bold text-[#1D2D7A] text-sm mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1D2D7A]" /> {O.passPercentage.en} ({O.passPercentage.or})</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={activePerformanceData}>
                     <defs><linearGradient id="passG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1D2D7A" stopOpacity={0.3} /><stop offset="95%" stopColor="#1D2D7A" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#999" />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} stroke="#999" />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Area type="monotone" dataKey="pass" stroke="#1D2D7A" strokeWidth={3} fill="url(#passG)" dot={{ fill: "#1D2D7A", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100 p-5 sm:p-6">
                <h4 className="font-bold text-[#1D2D7A] text-sm mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#D4A017]" /> {O.admissionsGrowth.en} &amp; {O.studentGrowth.en}</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#999" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#999" />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="admissions" fill="#D4A017" radius={[4, 4, 0, 0]} name={O.admissionsGrowth.en} />
                    <Bar dataKey="students" fill="#1D2D7A" radius={[4, 4, 0, 0]} name={O.studentGrowth.en} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100 p-5 sm:p-6">
                <h4 className="font-bold text-[#1D2D7A] text-sm mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> {O.scholarshipGrowth.en} &amp; {O.olympiadGrowth.en}</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={activePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#999" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#999" />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="scholarships" stroke="#D4A017" strokeWidth={3} dot={{ fill: "#D4A017", r: 4 }} name={O.scholarshipGrowth.en} />
                    <Line type="monotone" dataKey="olympiad" stroke="#059669" strokeWidth={3} dot={{ fill: "#059669", r: 4 }} name={O.olympiadGrowth.en} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: { en: "Highest Pass %", or: "ସର୍ବୋଚ୍ଚ ପାସ୍ %" }, value: "96%", year: "2025-26", color: "bg-blue-50 border-blue-100 text-[#1D2D7A]" },
                  { label: { en: "Total Students", or: "ମୋଟ ଛାତ୍ର" }, value: "620+", year: "2025-26", color: "bg-amber-50 border-amber-100 text-[#D4A017]" },
                  { label: { en: "Scholarships", or: "ଛାତ୍ରବୃତ୍ତି" }, value: "24", year: "All-time high", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                  { label: { en: "Olympiad", or: "ଅଲିମ୍ପିଆଡ୍" }, value: "18", year: "All-time high", color: "bg-purple-50 border-purple-100 text-purple-700" },
                ].map((c) => (
                  <div key={c.label.en} className={`rounded-2xl ${c.color} border p-4 sm:p-5 hover:shadow-lg transition-all`}>
                    <p className="text-xs font-medium opacity-80">{c.label.en}</p>
                    <p className="text-xl sm:text-2xl font-extrabold mt-1">{c.value}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">{c.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FACILITIES ===== */}
      <section id="facilities" data-observe="facilities" className="py-6 sm:py-8 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVis("facilities") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D2D7A]/10 border border-[#1D2D7A]/20 text-[#1D2D7A] text-xs font-medium mb-3">🏗️ <T en={O.ourFacilities.en} or={O.ourFacilities.or} /></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3"><T en={O.ourFacilities.en} or={O.ourFacilities.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">State-of-the-art infrastructure designed for holistic learning and development</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 transition-all duration-700 delay-100 ${isVis("facilities") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {school.facilities.map((f: any) => {
              const Icon = typeof f.icon === "string" ? (iconMap[f.icon] || Monitor) : (f.icon || Monitor);
              const imageUrl = f.imageUrl || facilityImages[f.name.en] || "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=500&q=80";
              return (
                <div key={f.name.en} className="group relative rounded-2xl overflow-hidden bg-white shadow-lg shadow-gray-200/30 border border-gray-100 hover:-translate-y-1.5 hover:shadow-2xl transition-all">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={imageUrl}
                      alt={f.name.en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center text-[#1D2D7A] shadow-md z-10">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h4 className="font-bold text-[#1D2D7A] text-base mb-1">{f.name.en}</h4>
                    <p className="text-xs text-[#D4A017] font-medium mb-2" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{f.name.or}</p>
                    <p className="text-sm text-gray-500">{f.desc.en}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STUDENT LIFE ===== */}
      <section data-observe="studentLife" className="py-6 sm:py-8 bg-white relative overflow-hidden">
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVis("studentLife") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-medium mb-3">🌟 <T en={O.studentLife.en} or={O.studentLife.or} /></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3"><T en={O.studentLife.en} or={O.studentLife.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Beyond academics — a vibrant campus life that shapes well-rounded personalities</p>
          </div>
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 delay-100 ${isVis("studentLife") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {school.studentLife.map((photo: any) => {
              const imageUrl = photo.imageUrl || studentLifeImages[photo.label.en] || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80";
              return (
                <div key={photo.label.en} className="group aspect-square rounded-2xl overflow-hidden border border-blue-100/50 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl transition-all relative">
                  <img src={imageUrl} alt={photo.label.en} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-between p-3.5 sm:p-4">
                    <span className="w-8 h-8 rounded-xl bg-white/95 flex items-center justify-center text-lg shadow-md self-end z-10">{photo.emoji}</span>
                    <div className="z-10">
                      <p className="text-white font-bold text-xs sm:text-sm">{photo.label.en}</p>
                      <p className="text-white/80 text-[10px]" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{photo.label.or}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== NOTICES + TESTIMONIALS ===== */}
      <section id="notices" data-observe="notices" className="py-6 sm:py-8 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 transition-all duration-700 ${isVis("notices") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="lg:w-1/2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C62828]/10 border border-[#C62828]/20 text-[#C62828] text-xs font-medium mb-3">📢 <T en={O.latestNotices.en} or={O.latestNotices.or} /></span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D2D7A] mb-6"><T en={O.latestNotices.en} or={O.latestNotices.or} /></h2>
              <div className="space-y-2.5">
                {activeNotices.map((n: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#1D2D7A]/20 hover:shadow-md transition-all cursor-pointer group">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.priority === "High" ? "bg-[#C62828]" : n.priority === "Medium" ? "bg-[#D4A017]" : "bg-gray-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1D2D7A] group-hover:text-[#D4A017] transition-colors">{n.title.en}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{n.title.or}</p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Calendar size={10} /> {n.date}</p>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-blue-50 transition-colors shrink-0"><Download size={14} className="text-gray-300 group-hover:text-[#1D2D7A] transition-colors" /></button>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-[#1D2D7A] font-medium hover:text-[#D4A017] transition-colors flex items-center gap-1"><ScrollText size={14} /> <T en={O.viewAll.en} or={O.viewAll.or} /></button>
            </div>
            <div className="lg:w-1/2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/20 text-[#D4A017] text-xs font-medium mb-3">💬 <T en={O.testimonials.en} or={O.testimonials.or} /></span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1D2D7A] mb-6"><T en={O.testimonials.en} or={O.testimonials.or} /></h2>
              <div className="space-y-3">
                {activeTestimonials.map((t: any, idx: number) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-[#D4A017]/20 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1D2D7A] flex items-center justify-center text-white text-base shadow-lg">{t.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1D2D7A]">{t.name.en}</p>
                        <p className="text-[10px] text-[#D4A017] font-medium" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{t.name.or}</p>
                        <p className="text-[10px] text-gray-400">{t.role.en}</p>
                      </div>
                      <div className="flex shrink-0">{[...Array(t.rating)].map((_, i) => <span key={i} className="text-[#D4A017] text-sm">★</span>)}</div>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{t.text.en}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" data-observe="gallery" className="py-6 sm:py-8 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-8 sm:mb-10 transition-all duration-700 ${isVis("gallery") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-medium mb-3">📸 <T en={O.photoGallery.en} or={O.photoGallery.or} /></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3"><T en={O.photoGallery.en} or={O.photoGallery.or} /></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{O.photoGallerySub.en}</p>
          </div>
          <div className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700 delay-100 ${isVis("gallery") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <button onClick={() => setActiveFilter(null)} className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${!activeFilter ? "bg-[#1D2D7A] text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
            {dynamicGalleryCategories.map((cat) => (
              <button key={cat.name.en} onClick={() => setActiveFilter(cat.name.en)} className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${activeFilter === cat.name.en ? "bg-[#D4A017] text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{cat.emoji} {cat.name.en}</button>
            ))}
          </div>
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-700 delay-200 ${isVis("gallery") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {filteredGallery.map((photo: any, i: number) => {
              const imageUrl = categoryImages[photo.category] || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80";
              const unsplashImagesByCategory: Record<string, string[]> = {
                Campus: [
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80"
                ],
                Classroom: [
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"
                ],
                Sports: [
                  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80"
                ],
                "Saraswati Puja": [
                  "https://images.unsplash.com/photo-1561361049-257a075e8dbf?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1609137144813-2dbe4889ed1c?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1532375811409-905115e3b5a9?auto=format&fit=crop&w=600&q=80"
                ],
                Science: [
                  "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1607988795691-3d0147b43231?auto=format&fit=crop&w=600&q=80"
                ],
                "Republic Day": [
                  "https://images.unsplash.com/photo-1569974498991-d3c12a504f9f?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1599840842225-ee89bc700a0b?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=600&q=80"
                ],
                "Annual Function": [
                  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80"
                ],
                "Educational Tours": [
                  "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                ]
              };
              const imagesList = unsplashImagesByCategory[photo.category] || [imageUrl];
              const selectedImg = photo.url || imagesList[i % imagesList.length];
              return (
                <div key={i} className={`group relative rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl transition-all ${photo.span}`} style={{ aspectRatio: photo.span?.includes("row-span-2") ? "3/4" : "4/3" }}>
                  <img src={selectedImg} alt={photo.category} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3 sm:p-4">
                    <span className="w-8 h-8 rounded-xl bg-white/95 flex items-center justify-center text-lg shadow-md self-end z-10">{photo.emoji}</span>
                    <p className="text-white font-bold text-xs sm:text-sm z-10">{photo.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1D2D7A] text-white text-sm font-bold hover:bg-[#15205E] transition-all shadow-lg"><Camera size={16} /> <T en="View Full Gallery" or="ସମ୍ପୂର୍ଣ୍ଣ ଗ୍ୟାଲେରୀ" /></button>
          </div>
        </div>
      </section>

      {/* ===== ADMISSIONS ===== */}
      <section id="admissions" data-observe="admissions" className="relative py-6 sm:py-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D2D7A] via-[#1D2D7A]/95 to-[#15205E]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.08)_0%,transparent_50%)]" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#D4A017]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/30 text-[#D4A017] text-xs font-medium mb-3 backdrop-blur-sm">📋 2026-27</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3"><T en={O.admissionOpen.en} or={O.admissionOpen.or} /></h2>
            <p className="text-blue-200/80 max-w-2xl mx-auto">Join our family — Applications now being accepted for the academic year 2026-27</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-5">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-[#D4A017] mb-4"><T en="Classes Available" or="ଉପଲବ୍ଧ ଶ୍ରେଣୀ" /></h3>
                <div className="flex flex-wrap gap-2">
                  {((liveSchoolData as any)?.activeClasses || ["Nursery","LKG","UKG","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"]).map((c: string) => (
                    <span key={c} className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs sm:text-sm hover:bg-white/20 transition-colors cursor-pointer">{c}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-[#D4A017] mb-4"><T en={O.admissionProcess.en} or={O.admissionProcess.or} /></h3>
                <ol className="space-y-3">
                  {admissionProcess.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="w-7 h-7 rounded-full bg-[#D4A017] flex items-center justify-center text-xs font-bold text-[#1D2D7A] shrink-0">{i + 1}</span>
                      <div><span>{step.en}</span><p className="text-[10px] text-blue-200/60" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{step.or}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-[#D4A017] mb-4"><T en={O.documentsRequired.en} or={O.documentsRequired.or} /></h3>
                <div className="grid grid-cols-2 gap-2">
                  {docsList.map((d) => (
                    <div key={d.en} className="flex items-start gap-2 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A017] shrink-0 mt-1.5" />
                      <div><span>{d.en}</span><p className="text-[9px] text-blue-200/50" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{d.or}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white"><T en="Online Admission Portal" or="ଅନଲାଇନ୍ ଆଡମିଶନ ପୋର୍ଟାଲ" /></h3>
                  <p className="text-xs text-blue-200/60 mt-0.5">Step {admStep} of 8: {
                    admStep === 1 ? "Student Basic" :
                    admStep === 2 ? "Parent Information" :
                    admStep === 3 ? "Address Information" :
                    admStep === 4 ? "Previous School" :
                    admStep === 5 ? "Academic Details" :
                    admStep === 6 ? "Fee Information" :
                    admStep === 7 ? "Medical Information" : "Documents Upload"
                  }</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#D4A017]/20 text-[#D4A017] px-2.5 py-1 rounded-lg">
                  {Math.round((admStep / 8) * 100)}% Done
                </span>
              </div>

              {/* Step indicator dot bar */}
              <div className="flex gap-1.5 mb-6">
                {[1,2,3,4,5,6,7,8].map(s => (
                  <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-all duration-300", s <= admStep ? "bg-[#D4A017]" : "bg-white/10")} />
                ))}
              </div>

              {admSuccess ? (
                <div className="p-6 bg-emerald-500/20 border border-emerald-500/30 text-white rounded-2xl text-center space-y-3">
                  <CheckCircle className="mx-auto text-emerald-400" size={40} />
                  <p className="text-base font-bold">Admission Application Submitted Successfully!</p>
                  <p className="text-xs text-blue-200/80">The school administration office has received all details and will call you for document verification.</p>
                  <button type="button" onClick={() => { setAdmSuccess(false); setAdmStep(1); }} className="mt-2 text-xs text-[#D4A017] underline font-bold">Apply for Another Student</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* STEP 1: STUDENT BASIC */}
                  {admStep === 1 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Student Full Name *</label>
                        <input required placeholder="Aarav Mohapatra" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.studentName} onChange={e => setAdmForm({...admForm, studentName: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Date of Birth *</label>
                          <input required type="date" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.dob} onChange={e => setAdmForm({...admForm, dob: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Gender *</label>
                          <select className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none text-dark-900" value={admForm.gender} onChange={e => setAdmForm({...admForm, gender: e.target.value})}>
                            <option value="Male" className="text-dark-900">Male</option>
                            <option value="Female" className="text-dark-900">Female</option>
                            <option value="Other" className="text-dark-900">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Blood Group</label>
                          <input placeholder="O+" className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.bloodGroup} onChange={e => setAdmForm({...admForm, bloodGroup: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Mother Tongue</label>
                          <input placeholder="Odia" className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.motherTongue} onChange={e => setAdmForm({...admForm, motherTongue: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Category</label>
                          <select className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none text-dark-900" value={admForm.category} onChange={e => setAdmForm({...admForm, category: e.target.value})}>
                            <option value="General" className="text-dark-900">General</option>
                            <option value="OBC" className="text-dark-900">OBC</option>
                            <option value="SC" className="text-dark-900">SC</option>
                            <option value="ST" className="text-dark-900">ST</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PARENT INFORMATION */}
                  {admStep === 2 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Father's Name *</label>
                        <input required placeholder="Father Name" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.fatherName} onChange={e => setAdmForm({...admForm, fatherName: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Mother's Name *</label>
                        <input required placeholder="Mother Name" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.motherName} onChange={e => setAdmForm({...admForm, motherName: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Mobile Number *</label>
                          <input required placeholder="+91-XXXXX" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.mobileNumber} onChange={e => setAdmForm({...admForm, mobileNumber: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Email ID</label>
                          <input placeholder="parent@mail.com" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.emailId} onChange={e => setAdmForm({...admForm, emailId: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Father's Occupation</label>
                        <input placeholder="Business / Service" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.occupation} onChange={e => setAdmForm({...admForm, occupation: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ADDRESS INFORMATION */}
                  {admStep === 3 && (
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="block text-xs text-blue-200/80 mb-1">House/Plot No *</label>
                          <input required placeholder="Plot-12" className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.houseNo} onChange={e => setAdmForm({...admForm, houseNo: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-blue-200/80 mb-1">Street / Area *</label>
                          <input required placeholder="Unit-4, Near Temple" className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.streetArea} onChange={e => setAdmForm({...admForm, streetArea: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">City *</label>
                          <input required placeholder="Bhubaneswar" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.city} onChange={e => setAdmForm({...admForm, city: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Pincode *</label>
                          <input required placeholder="751001" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.pincode} onChange={e => setAdmForm({...admForm, pincode: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">State *</label>
                        <input required placeholder="Odisha" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.state} onChange={e => setAdmForm({...admForm, state: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PREVIOUS SCHOOL */}
                  {admStep === 4 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Previous School Name</label>
                        <input placeholder="KV Public School, BBSR" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.prevSchoolName} onChange={e => setAdmForm({...admForm, prevSchoolName: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Transfer Certificate (TC) No</label>
                          <input placeholder="TC-8392" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.tcNumber} onChange={e => setAdmForm({...admForm, tcNumber: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Last Class Attended</label>
                          <input placeholder="UKG Class" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.lastClass} onChange={e => setAdmForm({...admForm, lastClass: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Marks / Percentage Obtained (%)</label>
                        <input placeholder="88%" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.marksObtained} onChange={e => setAdmForm({...admForm, marksObtained: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {/* STEP 5: ACADEMIC DETAILS */}
                  {admStep === 5 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Class Applied For *</label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none text-dark-900" value={admForm.classApplied} onChange={e => setAdmForm({...admForm, classApplied: e.target.value})}>
                          {((liveSchoolData as any)?.activeClasses || ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"]).map((c: string) => (
                            <option key={c} value={c} className="text-dark-900">{c} Class</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Academic Session *</label>
                          <select className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none text-dark-900" value={admForm.session} onChange={e => setAdmForm({...admForm, session: e.target.value})}>
                            <option value="2026-27" className="text-dark-900">2026-27</option>
                            <option value="2027-28" className="text-dark-900">2027-28</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Subject Elective Preference</label>
                          <select className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none text-dark-900" value={admForm.electives} onChange={e => setAdmForm({...admForm, electives: e.target.value})}>
                            <option value="Sanskrit" className="text-dark-900">Sanskrit</option>
                            <option value="Hindi" className="text-dark-900">Hindi</option>
                            <option value="Odia Advance" className="text-dark-900">Odia Advance</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: FEE INFORMATION */}
                  {admStep === 6 && (
                    <div className="space-y-4">
                      <div className="bg-white/10 border border-white/10 rounded-xl p-4 space-y-2.5 text-sm text-blue-100">
                        <h4 className="font-bold text-[#D4A017] mb-2 uppercase text-xs tracking-wider">Fee Structure for {admForm.classApplied} Class</h4>
                        <div className="flex justify-between">
                          <span>Admission Fee:</span>
                          <span className="font-bold text-white">
                            ₹{((((liveSchoolData as any)?.feeStructure || [
                              { class: "1st", admissionFee: 2000, tuitionFee: 800 },
                              { class: "2nd", admissionFee: 2000, tuitionFee: 800 },
                              { class: "3rd", admissionFee: 2000, tuitionFee: 900 },
                              { class: "4th", admissionFee: 2200, tuitionFee: 900 },
                              { class: "5th", admissionFee: 2200, tuitionFee: 1000 },
                              { class: "6th", admissionFee: 2500, tuitionFee: 1100 },
                              { class: "7th", admissionFee: 2500, tuitionFee: 1200 },
                              { class: "8th", admissionFee: 3000, tuitionFee: 1300 },
                              { class: "9th", admissionFee: 3000, tuitionFee: 1400 },
                              { class: "10th", admissionFee: 3500, tuitionFee: 1500 },
                            ]).find((f: any) => f.class === admForm.classApplied)?.admissionFee || 2000)).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tuition Fee (Monthly):</span>
                          <span className="font-bold text-white">
                            ₹{((((liveSchoolData as any)?.feeStructure || [
                              { class: "1st", tuitionFee: 800 },
                              { class: "2nd", tuitionFee: 800 },
                              { class: "3rd", tuitionFee: 900 },
                              { class: "4th", tuitionFee: 900 },
                              { class: "5th", tuitionFee: 1000 },
                              { class: "6th", tuitionFee: 1100 },
                              { class: "7th", tuitionFee: 1200 },
                              { class: "8th", tuitionFee: 1300 },
                              { class: "9th", tuitionFee: 1400 },
                              { class: "10th", tuitionFee: 1500 },
                            ]).find((f: any) => f.class === admForm.classApplied)?.tuitionFee || 800)).toLocaleString()} / Month
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Fee Payment Preference *</label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none text-dark-900" value={admForm.paymentPreference} onChange={e => setAdmForm({...admForm, paymentPreference: e.target.value})}>
                          <option value="UPI" className="text-dark-900">UPI / QR Code (Recommended)</option>
                          <option value="Cash" className="text-dark-900">Cash Dues at School Desk</option>
                          <option value="Bank" className="text-dark-900">Bank Draft / Cheque</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 7: MEDICAL INFORMATION */}
                  {admStep === 7 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Known Allergies (if any)</label>
                        <input placeholder="Dust, peanuts etc." className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.allergies} onChange={e => setAdmForm({...admForm, allergies: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Pre-existing Medical Conditions</label>
                        <input placeholder="Asthma, etc. or write None" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.medicalConditions} onChange={e => setAdmForm({...admForm, medicalConditions: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Emergency Contact Person</label>
                          <input placeholder="Uncle / Aunt Name" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.emergencyContactName} onChange={e => setAdmForm({...admForm, emergencyContactName: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-200/80 mb-1">Emergency Mobile Number</label>
                          <input placeholder="+91-XXXXX" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.emergencyContactPhone} onChange={e => setAdmForm({...admForm, emergencyContactPhone: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 8: DOCUMENTS UPLOAD */}
                  {admStep === 8 && (
                    <div className="space-y-3.5">
                      <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-2">Paste file links or URLs below</p>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Birth Certificate Link *</label>
                        <input required placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.birthCertUrl} onChange={e => setAdmForm({...admForm, birthCertUrl: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Previous Class TC / Report Card Link</label>
                        <input placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none" value={admForm.prevTcUrl} onChange={e => setAdmForm({...admForm, prevTcUrl: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Student Aadhaar Card Link *</label>
                        <input required placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.aadhaarUrl} onChange={e => setAdmForm({...admForm, aadhaarUrl: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-200/80 mb-1">Student Passport Photo Link *</label>
                        <input required placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4A017]" value={admForm.photoUrl} onChange={e => setAdmForm({...admForm, photoUrl: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button
                      type="button"
                      disabled={admStep === 1}
                      onClick={() => setAdmStep(prev => prev - 1)}
                      className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-all", admStep === 1 ? "text-white/20 bg-white/5 cursor-not-allowed" : "text-white bg-white/10 hover:bg-white/15")}
                    >
                      Back
                    </button>

                    {admStep < 8 ? (
                      <button
                        type="button"
                        onClick={() => {
                          // Simple client validations per step
                          if (admStep === 1 && !admForm.studentName.trim()) {
                            alert("Student Name is required!"); return;
                          }
                          if (admStep === 2 && (!admForm.fatherName.trim() || !admForm.mobileNumber.trim())) {
                            alert("Father Name and Mobile Number are required!"); return;
                          }
                          if (admStep === 3 && (!admForm.houseNo.trim() || !admForm.city.trim() || !admForm.pincode.trim())) {
                            alert("Address fields (House No, City, Pincode) are required!"); return;
                          }
                          setAdmStep(prev => prev + 1);
                        }}
                        className="px-6 py-2.5 bg-[#D4A017] text-[#1D2D7A] rounded-xl text-sm font-bold hover:bg-[#C49B16] transition-all shadow-md"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAdmissionSubmit}
                        disabled={admSubmitting}
                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md flex items-center gap-1.5"
                      >
                        {admSubmitting ? "Submitting..." : "Submit Form"} <ArrowUpRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEE STRUCTURE & PAYMENTS ===== */}
      <section id="fees" className="py-12 sm:py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D2D7A]/10 border border-[#1D2D7A]/20 text-[#1D2D7A] text-xs font-medium mb-3">
              <DollarSign size={14} /> <T en="Fees & Online Payments" or="ଫି ଏବଂ ଅନଲାଇନ୍ ପେମେଣ୍ଟ୍" />
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3">
              <T en="Fee Structure & Payment Center" or="ଫି ବିବରଣୀ ଏବଂ ପେମେଣ୍ଟ୍ କେନ୍ଦ୍ର" />
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              <T en="View class-wise fee structure and securely pay online using UPI QR Code." or="ଶ୍ରେଣୀ ଅନୁଯାୟୀ ଫି ବିବରଣୀ ଦେଖନ୍ତୁ ଏବଂ UPI QR କୋଡ୍ ବ୍ୟବହାର କରି ଅନଲାଇନରେ ସୁରକ୍ଷିତ ଭାବରେ ଦେୟ ଦିଅନ୍ତୁ।" />
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fee Table */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1D2D7A] mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-[#D4A017]" />
                <T en="Standard School Fee Structure" or="ମାନକ ବିଦ୍ୟାଳୟ ଫି ବିବରଣୀ" />
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="px-3 py-2.5">Class</th>
                      <th className="px-3 py-2.5">Admission Fee</th>
                      <th className="px-3 py-2.5">Tuition Fee (Monthly)</th>
                      <th className="px-3 py-2.5">Exam Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {((liveSchoolData as any)?.feeStructure || [
                      { class: "1st", admissionFee: 2000, tuitionFee: 800, examFee: 500 },
                      { class: "2nd", admissionFee: 2000, tuitionFee: 800, examFee: 500 },
                      { class: "3rd", admissionFee: 2000, tuitionFee: 900, examFee: 500 },
                      { class: "4th", admissionFee: 2200, tuitionFee: 900, examFee: 600 },
                      { class: "5th", admissionFee: 2200, tuitionFee: 1000, examFee: 600 },
                      { class: "6th", admissionFee: 2500, tuitionFee: 1100, examFee: 700 },
                      { class: "7th", admissionFee: 2500, tuitionFee: 1200, examFee: 700 },
                      { class: "8th", admissionFee: 3000, tuitionFee: 1300, examFee: 800 },
                      { class: "9th", admissionFee: 3000, tuitionFee: 1400, examFee: 800 },
                      { class: "10th", admissionFee: 3500, tuitionFee: 1500, examFee: 1000 },
                    ]).filter((fee: any) => ((liveSchoolData as any)?.activeClasses || ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"]).includes(fee.class)).map((fee: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2.5 font-semibold text-gray-800">{fee.class}</td>
                        <td className="px-3 py-2.5">₹{fee.admissionFee.toLocaleString()}</td>
                        <td className="px-3 py-2.5">₹{fee.tuitionFee.toLocaleString()}</td>
                        <td className="px-3 py-2.5">₹{fee.examFee.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Portal QR Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1D2D7A] mb-2 flex items-center gap-2">
                  <QrCode size={18} className="text-[#D4A017]" />
                  <T en="Pay Fees & Submit Screenshot" or="ଫି ଦିଅନ୍ତୁ ଏବଂ ରସିଦ୍ ଅପଲୋଡ୍ କରନ୍ତୁ" />
                </h3>
                <p className="text-xs text-gray-400 mb-6">Scan the UPI QR below, pay the due fee and submit UTR with screenshot.</p>
                
                {paySuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-center space-y-2">
                    <CheckCircle className="mx-auto text-emerald-500 animate-bounce" size={32} />
                    <p className="text-sm font-bold">Payment Receipt Submitted!</p>
                    <p className="text-xs opacity-90">The school principal will review and verify your transaction shortly.</p>
                    <button type="button" onClick={() => setPaySuccess(false)} className="mt-2 text-xs text-[#D4A017] underline font-bold">Submit Another Payment</button>
                  </div>
                ) : (
                  <form onSubmit={handleFeePaymentSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Student Name *</label>
                        <input required placeholder="Student Name" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1D2D7A]" value={payStudentName} onChange={e => setPayStudentName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Parent Name *</label>
                        <input required placeholder="Parent Name" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1D2D7A]" value={payParentName} onChange={e => setPayParentName(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Months to Pay (Tuition Fee auto-accumulates)</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 max-h-[110px] overflow-y-auto">
                        {["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"].map(m => {
                          const isChecked = paySelectedMonths.includes(m);
                          return (
                            <label key={m} className={cn("flex items-center gap-1.5 p-1.5 rounded-lg border text-[10px] cursor-pointer transition-all select-none", isChecked ? "bg-[#1D2D7A]/5 border-[#1D2D7A]/20 text-[#1D2D7A] font-bold" : "bg-white border-gray-200 text-gray-600")}>
                              <input
                                type="checkbox"
                                className="accent-[#1D2D7A] h-3 w-3"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setPaySelectedMonths(paySelectedMonths.filter(x => x !== m));
                                  } else {
                                    setPaySelectedMonths([...paySelectedMonths, m]);
                                  }
                                }}
                              />
                              {m}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Class *</label>
                        <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" value={payClass} onChange={e => setPayClass(e.target.value)}>
                          {((liveSchoolData as any)?.activeClasses || ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"]).map((c: string) => (
                            <option key={c} value={c}>{c} Class</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (₹) *</label>
                        <input required type="number" placeholder="1000" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-gray-50 font-semibold" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-center">
                      <div className="border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center bg-gray-50/50">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">School UPI QR Code</span>
                        <div className="w-28 h-28 bg-white border border-gray-200 rounded-xl flex items-center justify-center relative p-1 shadow-sm overflow-hidden">
                          {(liveSchoolData as any)?.qrCodeUrl ? (
                            <img src={(liveSchoolData as any).qrCodeUrl} alt="School UPI QR Code" className="w-full h-full object-contain" />
                          ) : (
                            <>
                              <QrCode size={90} className="text-gray-800" />
                              <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-xl" />
                            </>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 mt-2">pay.vidyaos@ybl</span>
                        <span className="text-[8px] text-gray-400">VidyaOS Solutions</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">UTR / Trans. ID *</label>
                          <input required placeholder="UTR1294829384" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1D2D7A]" value={payUtr} onChange={e => setPayUtr(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Receipt Screenshot *</label>
                          <input required placeholder="Paste Screenshot URL / Link" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1D2D7A]" value={payScreenshot} onChange={e => setPayScreenshot(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={paySubmitting} className="w-full bg-[#1D2D7A] hover:bg-[#15205E] text-white font-bold py-3 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2">
                      {paySubmitting ? "Uploading Proof..." : <><T en="Submit Fee Receipt" or="ଫି ରସିଦ୍ ଦାଖଲ କରନ୍ତୁ" /> <Send size={14} /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARENT STUDENT PORTAL ===== */}
      <section id="parentPortal" className="py-12 sm:py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A017]/10 border border-[#D4A017]/20 text-[#D4A017] text-xs font-medium mb-3">
              🎓 <T en="Bilingual Parent Portal" or="ଦ୍ୱିଭାଷୀ ଅଭିଭାବକ ପୋର୍ଟାଲ" />
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3">
              <T en="Student Academic & Fee Report Card" or="ଛାତ୍ର ଶୈକ୍ଷିକ ଏବଂ ଫି ପ୍ରଗତି ପତ୍ର" />
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              <T en="Enter details to access your child's attendance, test report, fees details, and general remark cards." or="ଆପଣଙ୍କ ସନ୍ତାନର ଉପସ୍ଥାନ, ପରୀକ୍ଷା ରିପୋର୍ଟ ଏବଂ ଶିକ୍ଷକଙ୍କ ମନ୍ତବ୍ୟ ଦେଖିବା ପାଇଁ ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ।" />
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleParentSearch} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end mb-6">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Class *</label>
                <select className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={searchClass} onChange={e => setSearchClass(e.target.value)}>
                  {["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"].map(c => (
                    <option key={c} value={c}>{c} Class</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Student Name *</label>
                <input required placeholder="e.g. Rakesh Patra" className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={searchStudentName} onChange={e => setSearchStudentName(e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Parent Name *</label>
                <input required placeholder="Parent Name" className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none" value={searchParentName} onChange={e => setSearchParentName(e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth *</label>
                <input required type="date" className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none text-gray-500" value={searchDob} onChange={e => setSearchDob(e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <button type="submit" className="w-full bg-[#1D2D7A] hover:bg-[#15205E] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md">
                  Search
                </button>
              </div>
            </form>

            {searchError && (
              <p className="text-center text-red-500 text-xs font-medium mb-4">{searchError}</p>
            )}

            {selectedStudentResult && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm relative">
                {/* Language Switcher for Child Report */}
                <div className="absolute top-4 right-4 flex gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200 z-10">
                  <button type="button" onClick={() => setReportLang("en")} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${reportLang === "en" ? "bg-[#1D2D7A] text-white" : "text-gray-500"}`}>EN</button>
                  <button type="button" onClick={() => setReportLang("or")} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${reportLang === "or" ? "bg-[#1D2D7A] text-white font-odia" : "text-gray-500 font-odia"}`}>ଓଡ଼ିଆ</button>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-[#1D2D7A]">
                    {reportLang === "en" ? "Student Roster Profile" : "ଛାତ୍ର ପ୍ରୋଫାଇଲ୍"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-400">{reportLang === "en" ? "Student Name:" : "ଛାତ୍ରଙ୍କ ନାମ:"}</p>
                      <p className="font-bold text-gray-800">{selectedStudentResult.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{reportLang === "en" ? "Parent Name:" : "ଅଭିଭาବକଙ୍କ ନାମ:"}</p>
                      <p className="font-bold text-gray-800">{selectedStudentResult.parent}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{reportLang === "en" ? "Class / Roster:" : "ଶ୍ରେଣୀ:"}</p>
                      <p className="font-bold text-gray-800">{selectedStudentResult.class} Class</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{reportLang === "en" ? "Contact Phone:" : "ଯୋଗାଯୋଗ ଫୋନ୍:"}</p>
                      <p className="font-bold text-gray-800">{selectedStudentResult.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">
                    {reportLang === "en" ? "Attendance Record" : "ଉପସ୍ଥାନ ବିବରଣୀ"}
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#D4A017] h-full" style={{ width: `${selectedStudentResult.attendancePercent || 0}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-800">{selectedStudentResult.attendancePercent || 0}%</span>
                  </div>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1">
                    {reportLang === "en" 
                      ? `Present: ${selectedStudentResult.presentDays || 0} days | Absent: ${selectedStudentResult.absentDays || 0} days | Leaves: ${selectedStudentResult.leaveDays || 0} days`
                      : `ଉପସ୍ଥିତ: ${selectedStudentResult.presentDays || 0} ଦିନ | ଅନୁପସ୍ଥିତ: ${selectedStudentResult.absentDays || 0} ଦିନ | ଛୁଟି: ${selectedStudentResult.leaveDays || 0} ଦିନ`
                    }
                  </p>
                </div>

                {/* Exam scorecard */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">
                    {reportLang === "en" ? "Academic Exams Scorecard" : "ପରୀକ୍ଷା ରିପୋର୍ଟ କାର୍ଡ"}
                  </h4>
                  {studentMarks.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      {reportLang === "en" ? "No exam records found for this student yet." : "ଏହି ଛାତ୍ରଙ୍କ ପାଇଁ କୌଣସି ପରୀକ୍ଷା ବିବରଣୀ ମିଳିଲା ନାହିଁ।"}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {studentMarks.map((examRecord: any) => {
                        const examObj = exams.find((e: any) => e.id === examRecord.examId);
                        const examName = examObj ? examObj.examName : "Academic Test";

                        return (
                          <div key={examRecord.id} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl text-left">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold text-gray-800">{examName}</span>
                              {examRecord.rank && (
                                <span className="text-[10px] bg-golden-500/10 text-golden-700 font-extrabold px-2 py-0.5 rounded-full border border-golden-500/20 flex items-center gap-1">
                                  🏆 {reportLang === "en" ? `Rank #${examRecord.rank}` : `କ୍ରମ #${examRecord.rank}`}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {Object.keys(examRecord.subjectMarks).map((sub: string) => {
                                const score = examRecord.subjectMarks[sub];
                                return (
                                  <div key={sub} className="p-2 bg-white border border-gray-100 rounded-xl text-center shadow-sm">
                                    <p className="text-[10px] text-gray-500 font-bold">{sub}</p>
                                    <p className="text-xs font-bold text-[#D4A017] mt-0.5">{score} Marks</p>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-between items-center text-[10px] mt-3 pt-2 border-t border-gray-200/50 text-gray-400">
                              <span>{reportLang === "en" ? `Percentage: ${examRecord.percentage}%` : `ପ୍ରତିଶତ: ${examRecord.percentage}%`}</span>
                              <span>{reportLang === "en" ? `Remarks: ${examRecord.remarks || "Keep it up"}` : `ମନ୍ତବ୍ୟ: ${examRecord.remarks || "ଚେଷ୍ଟା ଜାରି ରଖିବା"}`}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Fees report */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">
                    {reportLang === "en" ? "Fees Dues & Monthly Payment Status" : "ମାସିକ ଦେୟ ବିବରଣୀ ଏବଂ ସ୍ଥିତି"}
                  </h4>
                  {(() => {
                    const annual = Number(selectedStudentResult.annualFee || 0);
                    const paid = Number(selectedStudentResult.paidAmount || 0);
                    const due = annual - paid;
                    const isPaid = due <= 0;

                    // Academic months list starting from April
                    const academicMonths = [
                      { nameEn: "April", nameOr: "ଅପ୍ରେଲ୍", id: 4 },
                      { nameEn: "May", nameOr: "ମେ", id: 5 },
                      { nameEn: "June", nameOr: "ଜୁନ୍", id: 6 },
                      { nameEn: "July", nameOr: "ଜୁଲାଇ", id: 7 },
                      { nameEn: "August", nameOr: "ଅଗଷ୍ଟ", id: 8 },
                      { nameEn: "September", nameOr: "ସେପ୍ଟେମ୍ବର", id: 9 },
                      { nameEn: "October", nameOr: "ଅକ୍ଟୋବର", id: 10 },
                      { nameEn: "November", nameOr: "ନଭେମ୍ବର", id: 11 },
                      { nameEn: "December", nameOr: "ଡିସେମ୍ବର", id: 12 },
                      { nameEn: "January", nameOr: "ଜାନୁୟାରୀ", id: 1 },
                      { nameEn: "February", nameOr: "ଫେବୃୟାରୀ", id: 2 },
                      { nameEn: "March", nameOr: "ମାର୍ଚ୍ଚ", id: 3 }
                    ];

                    // Filter student paid fee records from database
                    const studentFeeRecords = feeRecords.filter((r: any) => 
                      String(r.studentId) === String(selectedStudentResult.id) &&
                      String(r.status).toLowerCase() === "paid"
                    );

                    const paidMonthNames = new Set(
                      studentFeeRecords.map((r: any) => {
                        return r.month ? r.month.split(" ")[0].trim() : "";
                      })
                    );

                    // Find latest paid month index in academic cycle
                    const monthOrder = [
                      "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"
                    ];

                    let maxPaidIndex = -1;
                    monthOrder.forEach((mName, index) => {
                      if (paidMonthNames.has(mName)) {
                        maxPaidIndex = Math.max(maxPaidIndex, index);
                      }
                    });

                    // Resolve monthly fee matching student class
                    const feeStructure = (liveSchoolData as any)?.feeStructure || [
                      { class: "1st", admissionFee: 2000, tuitionFee: 800, examFee: 500 },
                      { class: "2nd", admissionFee: 2000, tuitionFee: 800, examFee: 500 },
                      { class: "3rd", admissionFee: 2000, tuitionFee: 900, examFee: 500 },
                      { class: "4th", admissionFee: 2200, tuitionFee: 900, examFee: 600 },
                      { class: "5th", admissionFee: 2200, tuitionFee: 1000, examFee: 600 },
                      { class: "6th", admissionFee: 2500, tuitionFee: 1100, examFee: 700 },
                      { class: "7th", admissionFee: 2500, tuitionFee: 1200, examFee: 700 },
                      { class: "8th", admissionFee: 3000, tuitionFee: 1300, examFee: 800 },
                      { class: "9th", admissionFee: 3000, tuitionFee: 1400, examFee: 800 },
                      { class: "10th", admissionFee: 3500, tuitionFee: 1500, examFee: 1000 },
                    ];
                    
                    const sClass = selectedStudentResult.class || "1st";
                    const feeMatch = feeStructure.find((f: any) => f.class === sClass) || { admissionFee: 2000, tuitionFee: 800, examFee: 500 };
                    const tuitionFee = feeMatch.tuitionFee || 800;
                    const admissionFee = feeMatch.admissionFee || 2000;
                    const examFee = feeMatch.examFee || 500;

                    // Fallback allocation if no explicit records exist in database but paidAmount > 0
                    if (maxPaidIndex === -1 && paid > 0) {
                      let tempPaid = paid;
                      if (tempPaid >= admissionFee) tempPaid -= admissionFee;
                      if (tempPaid >= examFee) tempPaid -= examFee;
                      monthOrder.forEach((mName, index) => {
                        if (tempPaid >= tuitionFee) {
                          maxPaidIndex = index;
                          tempPaid -= tuitionFee;
                        }
                      });
                    }

                    const isAdmissionPaid = paid >= admissionFee || maxPaidIndex >= 0;
                    const isExamPaid = paid >= (admissionFee + examFee) || maxPaidIndex >= 0;

                    // Get current month index (1-12) to identify overdue months
                    // (Simulated environment year is 2026, month is July/7)
                    const today = new Date();
                    const currentYear = today.getFullYear();
                    const currentMonth = today.getMonth() + 1;

                    // Resolve academic year start year (default 2025 based on January 2026 record)
                    let acadStartYear = 2025;
                    if (studentFeeRecords.length > 0) {
                      const latestRec = studentFeeRecords[0];
                      if (latestRec.month) {
                        const parts = latestRec.month.split(" ");
                        if (parts.length === 2) {
                          const yr = Number(parts[1]);
                          const mName = parts[0];
                          const isNewYearMonth = ["January", "February", "March"].includes(mName);
                          acadStartYear = isNewYearMonth ? yr - 1 : yr;
                        }
                      }
                    }

                    // Map status for each academic month
                    let foundFirstUnpaidMonth: any = null;
                    const monthsWithStatus = academicMonths.map((m, idx) => {
                      const isMonthPaid = idx <= maxPaidIndex;

                      if (!isMonthPaid && !foundFirstUnpaidMonth) {
                        foundFirstUnpaidMonth = m;
                      }

                      // Check if month is current/past in the calendar year compared to current date
                      const mYear = (m.id >= 4) ? acadStartYear : acadStartYear + 1;
                      const isPastOrCurrent = (mYear < currentYear) || (mYear === currentYear && m.id <= currentMonth);

                      let status: "PAID" | "OVERDUE" | "UPCOMING" = "UPCOMING";
                      if (isMonthPaid) {
                        status = "PAID";
                      } else if (isPastOrCurrent) {
                        status = "OVERDUE";
                      }

                      return { ...m, tuitionFee, status, mYear };
                    });

                    // Next payment due date is 1st of the first unpaid month
                    const resolvedDueDateStr = foundFirstUnpaidMonth
                      ? `01-${foundFirstUnpaidMonth.nameEn}-${(foundFirstUnpaidMonth.id >= 4) ? acadStartYear : acadStartYear + 1}`
                      : null;

                    const overdueMonthsCount = monthsWithStatus.filter(m => m.status === "OVERDUE").length;
                    let totalOverdueDues = overdueMonthsCount * tuitionFee;
                    if (!isAdmissionPaid) totalOverdueDues += admissionFee;
                    if (!isExamPaid) totalOverdueDues += examFee;

                    const billingDateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

                    return (
                      <div className="space-y-4">
                        {/* Summary Header */}
                        <div className={`p-4 border rounded-2xl ${isPaid ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-800"}`}>
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-xs font-bold flex items-center gap-1.5">
                              💳 {reportLang === "en" ? "School Fee Status" : "ବିଦ୍ୟାଳୟ ଫି ସ୍ଥିତି"}
                            </p>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isPaid ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                              {isPaid 
                                ? (reportLang === "en" ? "FULLY PAID" : "ସମସ୍ତ ପରିଶୋଧିତ")
                                : (reportLang === "en" ? "PENDING DUES" : "ଦେୟ ବାକି ଅଛି")
                              }
                            </span>
                          </div>

                          {/* Billing Statement Date */}
                          <div className="flex justify-between text-[10px] text-gray-500 font-medium mb-2">
                            <span>{reportLang === "en" ? "Billing Statement Date:" : "ବିଲ୍ ଷ୍ଟେଟମେଣ୍ଟ ତାରିଖ:"}</span>
                            <span className="font-bold text-gray-700">{billingDateStr}</span>
                          </div>

                          {overdueMonthsCount > 0 && (
                            <div className="mb-3 p-2.5 bg-red-100/50 border border-red-200 text-red-800 rounded-xl text-[10px] font-bold flex justify-between items-center">
                              <span>⚠️ {reportLang === "en" ? `${overdueMonthsCount} Months Overdue:` : `${overdueMonthsCount} ମାସର ବାକି:`}</span>
                              <span>₹{totalOverdueDues.toLocaleString()}</span>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-3 gap-2 text-center text-xs pb-1">
                            <div className="bg-white/60 p-2 rounded-xl">
                              <p className="text-[10px] text-gray-400 font-medium">{reportLang === "en" ? "Total Fee" : "ମୋଟ ଫି"}</p>
                              <p className="font-bold text-gray-800 mt-0.5">₹{annual.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/60 p-2 rounded-xl">
                              <p className="text-[10px] text-gray-400 font-medium">{reportLang === "en" ? "Paid" : "ପରିଶୋଧିତ"}</p>
                              <p className="font-bold text-emerald-600 mt-0.5">₹{paid.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/60 p-2 rounded-xl">
                              <p className="text-[10px] text-gray-400 font-medium">{reportLang === "en" ? "Remaining" : "ବାକି ଫି"}</p>
                              <p className={`font-bold mt-0.5 ${due > 0 ? "text-red-500" : "text-gray-800"}`}>₹{due.toLocaleString()}</p>
                            </div>
                          </div>

                          {resolvedDueDateStr && due > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-200/50 flex justify-between items-center text-[10px] text-gray-500 font-medium">
                              <span>📅 {reportLang === "en" ? "Next Due Date (1st of month):" : "ପରବର୍ତ୍ତୀ ଦେୟ ତାରିଖ (୧ ତାରିଖ):"}</span>
                              <span className="font-bold text-red-500">{resolvedDueDateStr}</span>
                            </div>
                          )}
                        </div>

                        {/* Extra Charges Section (Admission & Exam) */}
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className={`p-2.5 rounded-xl border flex justify-between items-center ${isAdmissionPaid ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-800" : "bg-red-50/50 border-red-100/50 text-red-800"}`}>
                            <span>🏫 {reportLang === "en" ? "Admission Fee" : "ନାମଲେଖା ଫି"} (₹{admissionFee})</span>
                            <span className="font-bold">{isAdmissionPaid ? "✓ PAID" : "✗ DUE"}</span>
                          </div>
                          <div className={`p-2.5 rounded-xl border flex justify-between items-center ${isExamPaid ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-800" : "bg-red-50/50 border-red-100/50 text-red-800"}`}>
                            <span>📝 {reportLang === "en" ? "Exam Fee" : "ପରୀକ୍ଷା ଫି"} (₹{examFee})</span>
                            <span className="font-bold">{isExamPaid ? "✓ PAID" : "✗ DUE"}</span>
                          </div>
                        </div>

                        {/* Monthly Breakdown Grid */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                            {reportLang === "en" ? "Month-wise Tuition Fees Breakdown" : "ମାସିକ ଟ୍ୟୁସନ ଫି ବିବରଣୀ"}
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-left">
                            {monthsWithStatus.map((m) => {
                              let statusBg = "bg-gray-50 border-gray-100 text-gray-400";
                              let statusLabel = reportLang === "en" ? "Upcoming" : "ଆସନ୍ତା";
                              if (m.status === "PAID") {
                                statusBg = "bg-emerald-50/70 border-emerald-100/60 text-emerald-800";
                                statusLabel = reportLang === "en" ? "Paid" : "ପରିଶୋଧିତ";
                              } else if (m.status === "OVERDUE") {
                                statusBg = "bg-red-50/70 border-red-100/60 text-red-800 font-semibold";
                                statusLabel = reportLang === "en" ? "OVERDUE" : "ବାକି ଅଛି";
                              }

                              return (
                                <div key={m.nameEn} className={`p-2.5 border rounded-xl flex flex-col justify-between ${statusBg}`}>
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">
                                      {reportLang === "en" ? m.nameEn : m.nameOr}
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">₹{m.tuitionFee}</p>
                                  </div>
                                  <div className="mt-2 pt-1 border-t border-black/5 flex justify-between items-center text-[9px]">
                                    <span className="font-bold uppercase tracking-wide">{statusLabel}</span>
                                    {m.status === "PAID" && <span>✓</span>}
                                    {m.status === "OVERDUE" && <span className="text-red-600 font-extrabold">!</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Teacher remarks */}
                <div className="p-4 bg-[#1D2D7A]/5 border border-[#1D2D7A]/10 rounded-2xl">
                  <span className="text-xs font-bold text-[#1D2D7A] block mb-1">
                    {reportLang === "en" ? "Class Teacher Feedback & Remarks:" : "ଶ୍ରେଣୀ ଶିକ୍ଷକଙ୍କ ମନ୍ତବ୍ୟ:"}
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed font-light italic">
                    {selectedStudentResult.remarks || (reportLang === "en" 
                      ? `${selectedStudentResult.name} is a very attentive student. Shows keen interest in problem solving.`
                      : `${selectedStudentResult.name} ଜଣେ ଅତି ମନୋଯୋଗୀ ଛାତ୍ର ଅଟନ୍ତି |`)
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" data-observe="contact" className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D2D7A]/10 border border-[#1D2D7A]/20 text-[#1D2D7A] text-xs font-medium mb-3">📞 <T en={O.contact.en} or={O.contact.or} /></span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2D7A] mb-3"><T en={O.contact.en} or={O.contact.or} /></h2>
            <p className="text-gray-500 max-w-xl mx-auto">We'd love to hear from you. Reach out through any channel below.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { icon: Phone, label: { en: "Phone", or: "ଫୋନ୍" }, value: school.phone, color: "from-[#1D2D7A] to-blue-400" },
                { icon: Mail, label: { en: "Email", or: "ଇମେଲ୍" }, value: school.email, color: "from-[#D4A017] to-amber-400" },
                { icon: MapPin, label: { en: "Address", or: "ଠିକଣା" }, value: school.address, color: "from-emerald-600 to-emerald-400" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label.en} className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:shadow-lg hover:bg-white transition-all group">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0`}><Icon size={22} /></div>
                    <div>
                      <h4 className="font-semibold text-[#1D2D7A] text-sm">{c.label.en}</h4>
                      <p className="text-[10px] text-[#D4A017] font-medium" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{c.label.or}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{c.value}</p>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-2xl overflow-hidden border border-gray-100 h-48 bg-gradient-to-br from-[#F8F9FA] to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={36} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">{school.address}</p>
                  <p className="text-xs text-[#D4A017] mt-1 font-medium">📍 View on Google Maps</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8F9FA] rounded-2xl border border-gray-100 p-5 sm:p-8">
              <h3 className="text-xl font-bold text-[#1D2D7A] mb-2"><T en={O.sendMessage.en} or={O.sendMessage.or} /></h3>
              <p className="text-xs text-gray-400 mb-6">We typically respond within 24 hours</p>
              <div className="space-y-3.5">
                <input placeholder="Your Name *" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10 transition-all bg-white" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="email" placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10 transition-all bg-white" />
                  <input placeholder="Phone" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10 transition-all bg-white" />
                </div>
                <input placeholder="Subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10 transition-all bg-white" />
                <textarea placeholder="Your Message *" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/10 transition-all bg-white resize-none" />
                <button className="w-full bg-[#D4A017] text-[#1D2D7A] font-bold py-3.5 rounded-xl hover:bg-[#C49B16] transition-all shadow-lg shadow-[#D4A017]/20 text-sm flex items-center justify-center gap-2">
                  <T en={O.sendMessage.en} or={O.sendMessage.or} /> <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1D2D7A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D2D7A] via-[#1D2D7A]/95 to-[#15205E]" />
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-[#D4A017]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <img src={activeLogo} alt="Logo" className="w-14 h-14 rounded-2xl object-cover shadow-xl mb-4 bg-white" />
              <h3 className="text-lg font-bold text-white mb-1">{school.name.en}</h3>
              <p className="text-sm text-blue-200/80 mb-1" style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}>{school.name.or}</p>
              <p className="text-xs text-blue-300/60">Part of {school.sansthan}</p>
              <div className="flex gap-2 mt-4">
                {[{ e: "📘", l: "Facebook" }, { e: "📷", l: "Instagram" }, { e: "🐦", l: "Twitter" }, { e: "▶️", l: "YouTube" }, { e: "💼", l: "LinkedIn" }].map((s) => (
                  <button key={s.l} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-[#D4A017] hover:text-[#1D2D7A] hover:scale-110 transition-all border border-white/10" title={s.l}>{s.e}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#D4A017] mb-4 text-sm tracking-wider uppercase"><T en={O.quickLinks.en} or={O.quickLinks.or} /></h4>
              <div className="space-y-2.5 text-sm">
                {navLinks.map((l) => (
                  <button key={l.id} onClick={() => scrollTo(l.id)} className="block text-blue-200/70 hover:text-[#D4A017] hover:translate-x-1 transition-all text-left w-full"><T en={l.en} or={l.or} /></button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#D4A017] mb-4 text-sm tracking-wider uppercase"><T en={O.schoolTimings.en} or={O.schoolTimings.or} /></h4>
              <div className="space-y-2.5 text-sm text-blue-200/70">
                <p className="flex items-center gap-2"><Clock size={12} className="text-[#D4A017] shrink-0" /> Mon - Fri: <span className="text-white">8:00 AM - 2:30 PM</span></p>
                <p className="flex items-center gap-2"><Clock size={12} className="text-[#D4A017] shrink-0" /> Sat: <span className="text-white">8:00 AM - 12:00 PM</span></p>
                <p className="text-xs text-blue-300/50 mt-3">Office: 9:00 AM - 4:00 PM</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#D4A017] mb-4 text-sm tracking-wider uppercase"><T en="Contact" or="ଯୋଗାଯୋଗ" /></h4>
              <div className="space-y-2.5 text-sm text-blue-200/70">
                <p className="flex items-center gap-2"><Phone size={12} className="text-[#D4A017] shrink-0" /> {school.phone}</p>
                <p className="flex items-center gap-2"><Mail size={12} className="text-[#D4A017] shrink-0" /> {school.email}</p>
                <p className="flex items-start gap-2"><MapPin size={12} className="text-[#D4A017] mt-0.5 shrink-0" /> {school.address}</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300/60">
            <p>© 2026 {school.name.en}. All rights reserved.</p>
            <p>
              Made with ❤️ by{" "}
              <a
                href="https://www.codexnovas.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4A017] hover:underline font-bold"
              >
                Code-X-Novas
              </a>
            </p>
            <p>Managed by {school.sansthan}</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
