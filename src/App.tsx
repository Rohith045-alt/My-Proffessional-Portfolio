import { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code2, Database, Cpu, Award, User, Mail, 
  Phone, FileText, Download, ExternalLink, ChevronRight, 
  Send, CheckCircle, GraduationCap, Trophy, Sparkles, Layers, ArrowUp, Menu, X, Eye
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorClicked, setCursorClicked] = useState(false);
  
  // Contact Form state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Resume preview modal state
  const [showResumeModal, setShowResumeModal] = useState(false);

  const canvasRef = useRef(null);

  // Loading animation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Custom Cursor & Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setCursorClicked(true);
    const handleMouseUp = () => setCursorClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Interactive Particle Background (Three.js style 60FPS canvas)
  useEffect(() => {
    const canvas = canvasRef.current as any;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId: any;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles setup
    const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
    const particles: any[] = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleCanvasMouseMove = (e: any) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleCanvasMouseMove);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.5 ? '#38BDF8' : '#2563EB',
        shape: Math.floor(Math.random() * 3) // 0: circle, 1: triangle, 2: hexagon
      });
    }

    const drawPolygon = (x: any, y: any, radius: any, sides: any, color: any) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines and particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * 1.5;
          p.y -= Math.sin(angle) * 1.5;
        }

        // Render particle
        ctx.fillStyle = p.color;
        if (p.shape === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 1) {
          drawPolygon(p.x, p.y, p.size * 2, 3, p.color);
        } else {
          drawPolygon(p.x, p.y, p.size * 2, 6, p.color);
        }

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distance < 120) {
            ctx.strokeStyle = `rgba(37, 99, 235, ${1 - distance / 120})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to cursor
        if (dist < 150) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 150})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Typing effect for Hero
  const titles = ["Aspiring Data Analyst", "Machine Learning Developer", "Python Developer", "Problem Solver", "AI Enthusiast"];
  const [titleIdx, setTitleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
    const currentTitle = titles[titleIdx];
    
    // Determine typing speed, pause longer at the end of the word
    let typingSpeed = isDeleting ? 40 : 100;
    if (!isDeleting && charIdx === currentTitle.length) {
      typingSpeed = 1500; // 1.5s pause before deleting
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIdx < currentTitle.length) {
          setTypingText(currentTitle.substring(0, charIdx + 1));
          setCharIdx(prev => prev + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setTypingText(currentTitle.substring(0, charIdx - 1));
          setCharIdx(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setTitleIdx((prev) => (prev + 1) % titles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, titleIdx]);

  // Handle Contact Submit with formsubmit.co
  const handleContactSubmit = async (e: any) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/rohithwilliam2005@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });
      
      if (response.ok) {
        setFormSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setFormSubmitting(false);
      setTimeout(() => setFormSuccess(false), 5000);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0F172A] flex flex-col items-center justify-center z-50 overflow-hidden font-['Inter']">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-blue-600/30 border-t-cyan-400 animate-spin flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
            <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white font-['Poppins'] tracking-wider mb-3 text-center">
            Rohith William G
          </h1>
          <p className="text-cyan-300 tracking-widest text-sm uppercase mb-8 font-mono">
            Initializing Neural Portfolio Matrix...
          </p>
          <div className="w-64 md:w-80 h-2 bg-slate-800 rounded-full overflow-hidden p-[1px] border border-blue-500/30">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full transition-all duration-100 shadow-[0_0_15px_#22d3ee]"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="mt-4 text-slate-400 font-mono text-sm">{loadingProgress}% Complete</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] text-slate-100 min-h-screen relative font-['Inter'] overflow-x-hidden select-none">
      
      {/* Custom Cursor */}
      <div 
        className={`fixed pointer-events-none z-50 rounded-full transition-transform duration-75 ease-out hidden md:block ${cursorClicked ? 'scale-75 bg-cyan-200' : cursorHovered ? 'scale-150 bg-cyan-400/20 border border-cyan-400' : 'scale-100 bg-cyan-400'}`}
        style={{ 
          left: `${cursorPos.x}px`, 
          top: `${cursorPos.y}px`, 
          width: '12px', 
          height: '12px',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px #22d3ee, 0 0 40px #2563EB'
        }}
      ></div>

      {/* Animated Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0F172A]/70 backdrop-blur-md border-b border-blue-500/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a 
            href="#home" 
            onMouseEnter={() => setCursorHovered(true)} 
            onMouseLeave={() => setCursorHovered(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 p-[2px] shadow-[0_0_15px_rgba(37,99,235,0.5)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center font-bold text-cyan-400 font-['Poppins']">
                RW
              </div>
            </div>
            <span className="font-['Poppins'] font-bold text-lg md:text-xl text-white tracking-wide">
              Rohith <span className="text-cyan-400">William G</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Certifications', 'Education', 'Contact'].map((item) => {
              const id = item.toLowerCase();
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                  onClick={() => setActiveNav(id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeNav === id ? 'text-cyan-400 bg-blue-600/10 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}
                >
                  {item}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 border border-blue-500/30 text-cyan-400 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F172A]/95 backdrop-blur-xl border-b border-blue-500/30 px-4 pt-2 pb-6 space-y-2">
            {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Certifications', 'Education', 'Contact'].map((item) => {
              const id = item.toLowerCase();
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  onClick={() => { setMobileMenuOpen(false); setActiveNav(id); }}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-slate-200 hover:bg-blue-600/20 hover:text-cyan-400 transition-colors"
                >
                  {item}
                </a>
              );
            })}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30 text-cyan-400 text-sm font-medium shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Welcome to my Digital Portfolio</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl text-slate-300 font-medium">Hi, I'm</h2>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-['Poppins'] tracking-tight text-white drop-shadow-md">
                Rohith <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">William G</span>
              </h1>
            </div>

            <div className="h-12 flex items-center justify-center lg:justify-start">
              <span className="text-xl sm:text-2xl font-semibold text-cyan-300 font-['Poppins']">
                {typingText}
              </span>
              <span className="w-1 h-7 bg-cyan-400 ml-1 animate-pulse"></span>
            </div>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Aspiring Data Analyst & Machine Learning Developer dedicated to transforming complex raw datasets into actionable intelligence, predictive machine learning models, and impactful automated solutions.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#contact"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-[0_0_25px_rgba(37,99,235,0.5)] transform hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <span>Contact Me</span>
                <ChevronRight className="w-5 h-5" />
              </a>

              <a href={`${import.meta.env.BASE_URL}resume.pdf`} download="Rohith_William_G_Resume.pdf" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)} className="px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-blue-500/40 font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)] transform hover:-translate-y-1 transition-all flex items-center gap-2 backdrop-blur-md">
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </a>
            </div>

            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-slate-400">
              <a href="https://www.linkedin.com/in/rohith-g-william-445425375/" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all shadow-md">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/Rohith045-alt" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all shadow-md">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="mailto:rohithwilliam2005@gmail.com" className="p-3 rounded-full bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all shadow-md">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Hero Profile Graphic */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
              {/* Animated Rotating Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute -inset-4 rounded-full border border-blue-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute -inset-8 rounded-full border border-cyan-500/20 animate-[spin_25s_linear_infinite]"></div>

              {/* Glowing Background Glow */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-400/20 blur-2xl animate-pulse"></div>

              {/* Profile Image Frame */}
              <div className="relative w-64 h-64 sm:w-84 sm:h-84 rounded-full p-2 bg-gradient-to-tr from-blue-600 via-cyan-400 to-blue-700 shadow-[0_0_50px_rgba(37,99,235,0.6)]">
                <img 
                  src={`${import.meta.env.BASE_URL}profile.png`} 
                  alt="Rohith William G" 
                  className="w-full h-full object-cover rounded-full bg-[#0F172A]"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-4 right-4 bg-[#0F172A]/90 backdrop-blur-md border border-cyan-400/50 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-semibold text-white">Open to Opportunities</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Get to Know Me</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">About Me & Timeline</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(15,23,42,0.8)] relative group hover:border-cyan-400/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
              <h4 className="text-2xl font-bold font-['Poppins'] text-white mb-4 flex items-center gap-3">
                <User className="w-6 h-6 text-cyan-400" />
                Professional Overview
              </h4>
              <p className="text-slate-300 leading-relaxed mb-4">
                I am <span className="text-white font-semibold">Rohith William G</span>, an enthusiastic and dedicated Aspiring Data Analyst and Machine Learning Developer. My academic journey and hands-on projects have honed my expertise in extracting deep insights from intricate data structures and architecting intelligent machine learning pipelines.
              </p>
              <p className="text-slate-300 leading-relaxed mb-6">
                With a robust foundation in Python, SQL, and Power BI, coupled with practical ML internship exposure, I bridge the gap between raw data and impactful business decisions.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 text-sm">Primary Focus</span>
                  <p className="text-white font-semibold">Data Analytics & ML</p>
                </div>
                <div>
                  <span className="text-slate-400 text-sm">Location</span>
                  <p className="text-white font-semibold">Chennai, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all flex items-start gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-white font-['Poppins']">Passion for Data Analytics</h5>
                  <p className="text-slate-300 text-sm mt-1">Transforming messy datasets into clear visual dashboards and business metrics using Power BI and advanced SQL queries.</p>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all flex items-start gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-white font-['Poppins']">Machine Learning & AI</h5>
                  <p className="text-slate-300 text-sm mt-1">Building robust predictive models, CNNs for computer vision, and NLP applications utilizing Scikit-Learn and TensorFlow.</p>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all flex items-start gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-white font-['Poppins']">Problem Solving & Real-World Dev</h5>
                  <p className="text-slate-300 text-sm mt-1">Strong algorithmic foundation with active problem-solving on HackerRank & LeetCode, delivering end-to-end full stack ML applications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl text-center shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:scale-105 transition-transform">
            <h4 className="text-4xl font-extrabold text-cyan-400 font-['Poppins'] mb-2">3</h4>
            <p className="text-slate-300 text-sm font-medium">Projects Completed</p>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl text-center shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:scale-105 transition-transform">
            <h4 className="text-4xl font-extrabold text-cyan-400 font-['Poppins'] mb-2">Gold</h4>
            <p className="text-slate-300 text-sm font-medium">HackerRank Problem Solving</p>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl text-center shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:scale-105 transition-transform">
            <h4 className="text-4xl font-extrabold text-cyan-400 font-['Poppins'] mb-2">50+</h4>
            <p className="text-slate-300 text-sm font-medium">LeetCode Problems</p>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl text-center shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:scale-105 transition-transform">
            <h4 className="text-4xl font-extrabold text-cyan-400 font-['Poppins'] mb-2">5+</h4>
            <p className="text-slate-300 text-sm font-medium">Technologies Learned</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/30 rounded-3xl my-12 border border-blue-500/20 backdrop-blur-md">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Core Competencies</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">Technical Skills</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Programming */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-['Poppins']">Programming</h4>
            </div>
            <div className="space-y-4">
              {[{ name: 'Python', level: 95 }, { name: 'Java', level: 80 }, { name: 'SQL', level: 90 }].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-cyan-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Libraries */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-['Poppins']">Libraries</h4>
            </div>
            <div className="space-y-4">
              {[{ name: 'Pandas', level: 92 }, { name: 'NumPy', level: 90 }, { name: 'Matplotlib', level: 85 }, { name: 'Scikit-Learn', level: 88 }].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-cyan-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-['Poppins']">Tools & Ecosystem</h4>
            </div>
            <div className="space-y-4">
              {[{ name: 'Git & GitHub', level: 90 }, { name: 'Power BI', level: 88 }, { name: 'LangChain', level: 82 }].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-cyan-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Concepts */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white font-['Poppins']">Technical</h4>
            </div>
            <div className="space-y-4">
              {[{ name: 'Statistics', level: 88 }, { name: 'OOP', level: 90 }, { name: 'Data Visualization', level: 92 }, { name: 'Machine Learning', level: 89 }].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-cyan-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Portfolio Works</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">Featured Projects</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Project 1: Nature's Early Warning System */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl hover:border-cyan-400/60 transition-all group flex flex-col justify-between">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/40 text-cyan-400 text-xs font-semibold rounded-full">IoT & Machine Learning</span>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-cyan-400 border border-blue-500/30 group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              
              <h4 className="text-2xl font-bold font-['Poppins'] text-white mb-3 group-hover:text-cyan-400 transition-colors">
                Nature's Early Warning System
              </h4>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                An advanced environmental monitoring and early warning solution powered by Arduino sensors and Python machine learning models to detect abnormal climate or ecological changes in real time.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['Arduino', 'Python', 'Machine Learning', 'IoT Sensors', 'Data Analytics'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-8 pb-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 font-semibold text-sm transition-colors">
                <FaGithub className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md transition-all">
                <span>View Details</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Project 2: Plant Disease Prediction */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl hover:border-cyan-400/60 transition-all group flex flex-col justify-between">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/40 text-cyan-400 text-xs font-semibold rounded-full">Deep Learning & React</span>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-cyan-400 border border-blue-500/30 group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              
              <h4 className="text-2xl font-bold font-['Poppins'] text-white mb-3 group-hover:text-cyan-400 transition-colors">
                Plant Disease Prediction
              </h4>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                A full-stack AI web application utilizing Convolutional Neural Networks (CNN) to diagnose plant leaf diseases instantly from uploaded images, helping farmers take early corrective measures.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['CNN', 'React', 'Python', 'TensorFlow', 'Computer Vision'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-8 pb-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 font-semibold text-sm transition-colors">
                <FaGithub className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md transition-all">
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/30 rounded-3xl my-12 border border-blue-500/20 backdrop-blur-md">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Career Journey</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">Professional Experience</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative pl-8 sm:pl-10 border-l-2 border-blue-500/40 space-y-12">
            
            <div className="relative group">
              <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-blue-600 border-4 border-[#0F172A] shadow-[0_0_15px_#22d3ee]"></div>
              
              <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl shadow-xl hover:border-cyan-400 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/40 text-cyan-400 text-xs font-semibold rounded-full">Internship</span>
                  <span className="text-slate-400 text-sm font-medium">One Month</span>
                </div>

                <h4 className="text-2xl font-bold font-['Poppins'] text-white mb-1">Machine Learning Intern</h4>
                <h5 className="text-lg font-semibold text-cyan-300 mb-4">Elevated Labs</h5>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Contributed to practical machine learning pipelines, data preprocessing, feature engineering, and predictive model evaluation under senior data scientists.
                </p>

                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                    <span>Processed and cleansed high-dimensional datasets using Pandas & NumPy.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                    <span>Trained and evaluated Scikit-Learn models to optimize predictive accuracy.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Achievements & Certifications */}
      <section id="achievements" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Milestones & Recognition</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">Achievements & Certifications</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Achievements Column */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold font-['Poppins'] text-white flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-amber-400" />
              Achievements
            </h4>

            <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30 text-2xl">
                🏆
              </div>
              <div>
                <h5 className="text-lg font-bold text-white font-['Poppins']">Gold in HackerRank Problem Solving</h5>
                <p className="text-slate-300 text-sm mt-1">Achieved Gold badge demonstrating superior proficiency in algorithms, data structures, and problem-solving logic.</p>
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30 text-2xl">
                🏆
              </div>
              <div>
                <h5 className="text-lg font-bold text-white font-['Poppins']">Solved 50+ LeetCode Problems</h5>
                <p className="text-slate-300 text-sm mt-1">Consistently solving coding challenges focusing on arrays, strings, dynamic programming, and data analysis algorithms.</p>
              </div>
            </div>
          </div>

          {/* Certifications Column */}
          <div className="space-y-6" id="certifications">
            <h4 className="text-2xl font-bold font-['Poppins'] text-white flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-cyan-400" />
              Certifications
            </h4>

            <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-lg font-bold text-white font-['Poppins']">NPTEL - Python for Data Science</h5>
                <p className="text-slate-300 text-sm mt-1">Comprehensive certification covering advanced data structures, numerical computing with NumPy, and data manipulation with Pandas.</p>
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400 transition-all flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-lg font-bold text-white font-['Poppins']">Elevated Labs ML Internship Certificate</h5>
                <p className="text-slate-300 text-sm mt-1">Successfully completed rigorous Machine Learning internship program with distinction in model training and deployment.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/30 rounded-3xl my-12 border border-blue-500/20 backdrop-blur-md">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Academic Background</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">Education</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-8 sm:p-10 rounded-3xl shadow-2xl relative group hover:border-cyan-400 transition-all">
            <div className="absolute top-8 right-8 p-4 bg-blue-600/20 rounded-2xl text-cyan-400 border border-blue-500/30">
              <GraduationCap className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/40 text-cyan-400 text-xs font-semibold rounded-full">Undergraduate Degree</span>
            
            <h4 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-white mt-4 mb-2">
              St. Joseph's Institute of Technology
            </h4>
            
            <h5 className="text-xl font-semibold text-cyan-300 mb-4">
              Bachelor of Technology in Information Technology
            </h5>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Focused on core computer science fundamentals, data structures, algorithms, database management systems, and specialized coursework in machine learning and data analytics.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
              <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-xs block">Degree</span>
                <span className="text-white font-semibold text-sm">B.Tech Information Technology</span>
              </div>
              <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-xs block">Institution</span>
                <span className="text-white font-semibold text-sm">St. Joseph's Institute of Technology</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Career Credentials</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">Curriculum Vitae</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-8 sm:p-12 rounded-3xl shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent rounded-3xl pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              <FileText className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-bold font-['Poppins'] text-white mb-2">Rohith William G - Resume</h4>
            <p className="text-slate-300 text-sm max-w-lg mb-8">
              Aspiring Data Analyst & Machine Learning Developer. Review the full professional resume or download a copy instantly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/resume.pdf" target="_blank" rel="noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center gap-2 transition-all"
              >
                <Eye className="w-5 h-5" />
                <span>View Resume</span>
              </a>

              <a
                href="/resume.pdf" download="Rohith_William_G_Resume.pdf"
                className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-blue-500/40 font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">Get in Touch</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-white">Contact Me</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl shadow-xl space-y-6">
              <h4 className="text-2xl font-bold font-['Poppins'] text-white">Contact Information</h4>
              <p className="text-slate-300 text-sm">
                Feel free to reach out for opportunities in Data Analytics, Machine Learning, or software engineering.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Phone</span>
                    <span className="text-white font-semibold text-sm">+91 90420 10331</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Email</span>
                    <span className="text-white font-semibold text-sm">rohithwilliam2005@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <div className="p-3 bg-blue-600/20 rounded-xl text-cyan-400 border border-blue-500/30">
                    <FaLinkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">LinkedIn</span>
                    <span className="text-white font-semibold text-sm">linkedin.com/in/rohith-g-william-445425375/</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleContactSubmit} className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/30 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 relative">
              {formSuccess && (
                <div className="absolute inset-0 bg-[#0F172A]/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center rounded-3xl p-6 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white font-['Poppins'] mb-2">Message Sent Successfully!</h4>
                  <p className="text-slate-300 text-sm max-w-sm">
                    Thank you for reaching out. Rohith William G will get back to you shortly.
                  </p>
                </div>
              )}

              <h4 className="text-2xl font-bold font-['Poppins'] text-white">Send a Message</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Recruiter Name"
                    className="w-full bg-slate-800/80 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="recruiter@company.com"
                    className="w-full bg-slate-800/80 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Job Opportunity / Interview Inquiry"
                  className="w-full bg-slate-800/80 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your message here..."
                  className="w-full bg-slate-800/80 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ name: '', email: '', subject: '', message: '' })}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0A0F1D] border-t border-blue-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 p-[2px]">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center font-bold text-cyan-400 font-['Poppins']">
                RW
              </div>
            </div>
            <div>
              <h5 className="font-['Poppins'] font-bold text-white">Rohith William G</h5>
              <p className="text-slate-400 text-xs">Aspiring Data Analyst & ML Developer</p>
            </div>
          </div>

          <div className="text-slate-400 text-sm text-center">
            &copy; {new Date().getFullYear()} Rohith William G. All rights reserved. Designed with Royal Blue Glassmorphism.
          </div>

          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="#home" className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-400 text-slate-300 hover:text-[#0F172A] transition-colors">
              <ArrowUp className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0F172A] border border-blue-500/40 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold font-['Poppins'] text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                Rohith William G - Resume Preview
              </h3>
              <button 
                onClick={() => setShowResumeModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-6 text-slate-300 text-sm">
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/20 space-y-4">
                <div className="border-b border-slate-800 pb-4">
                  <h4 className="text-2xl font-bold text-white">Rohith William G</h4>
                  <p className="text-cyan-400 font-medium">Aspiring Data Analyst & Machine Learning Developer</p>
                  <p className="text-slate-400 text-xs mt-1">St. Joseph's Institute of Technology • Chennai, India</p>
                </div>

                <div>
                  <h5 className="font-bold text-white text-base mb-2">Professional Summary</h5>
                  <p>Enthusiastic Data Analyst and Machine Learning Developer with strong expertise in Python, SQL, Power BI, and predictive modeling. Proven track record in solving complex algorithmic problems and delivering real-world IoT and CNN-based applications.</p>
                </div>

                <div>
                  <h5 className="font-bold text-white text-base mb-2">Core Skills</h5>
                  <p>Python, Java, SQL, Pandas, NumPy, Matplotlib, Scikit-Learn, Git & GitHub, Power BI, LangChain, Statistics, OOP, Data Visualization, Machine Learning.</p>
                </div>

                <div>
                  <h5 className="font-bold text-white text-base mb-2">Experience</h5>
                  <p className="font-semibold text-white">Machine Learning Intern – Elevated Labs</p>
                  <p className="text-xs text-slate-400">One Month</p>
                  <p className="mt-1">Developed and optimized machine learning models, performed data preprocessing, and built predictive analytics pipelines.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-4">
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold transition-colors"
              >
                Close
              </button>
              <a
                href="/resume.pdf"
                download="Rohith_William_G_Resume.pdf"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}