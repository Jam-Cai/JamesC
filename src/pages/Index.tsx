import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, Mail, Github, Linkedin, FileText, Download, Eye, Sparkles, GitCommit } from 'lucide-react';
import Button from '@/components/ui/button';
import { FUN_FACTS } from '@/constants';
import { useNavigate } from 'react-router-dom';
import CelestialBackground from '@/components/CelestialBackground';

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits: Array<{
      message: string;
    }>;
  };
}

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [isFactVisible, setIsFactVisible] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [lastCommit, setLastCommit] = useState<{ date: string; message: string } | null>(null);
  const [isLoadingCommit, setIsLoadingCommit] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isNightTime = true; // Since we're only keeping the hero section, we'll set it to night mode
  const navigate = useNavigate();
  const [isProfileImageLoaded, setIsProfileImageLoaded] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToNextSection = useCallback(() => {
    const nextSection = Math.min(currentSection + 1, 4); // Max 4 sections (0-4)
    let targetPosition = nextSection * window.innerHeight;
    
    // Add extra offset for projects section (section 3)
    if (nextSection === 3) {
      targetPosition += window.innerHeight * 0.50; // Add 5% more scroll
    }
    // Add extra offset for contact section (section 4)
    if (nextSection === 4) {
      targetPosition += window.innerHeight * 0.55; // Add 35% more scroll
    }
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }, [currentSection]);


  useEffect(() => {
    const factInterval = setInterval(() => {
      setIsFactVisible(false);
      setTimeout(() => {
        setCurrentFact((prev) => (prev + 1) % FUN_FACTS.length);
        setIsFactVisible(true);
      }, 300); // Wait for fade-out to complete
    }, 4000);
    return () => clearInterval(factInterval);
  }, []);


  useEffect(() => {
    const updateCurrentSection = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSection = Math.floor(scrollPosition / windowHeight);
      setCurrentSection(Math.min(newSection, 4)); // 0-4 for 5 sections
    };

    window.addEventListener('scroll', updateCurrentSection);
    return () => window.removeEventListener('scroll', updateCurrentSection);
  }, []);

  // Fetch last commit
  useEffect(() => {
    const fetchLastCommit = async () => {
      try {
        setIsLoadingCommit(true);
        const response = await fetch('https://api.github.com/users/Jam-Cai/events');
        const events = await response.json() as GitHubEvent[];
        const pushEvent = events.find((event) => event.type === 'PushEvent');
        if (pushEvent) {
          const commit = pushEvent.payload.commits[0];
          setLastCommit({
            date: new Date(pushEvent.created_at).toLocaleString(),
            message: commit.message
          });
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setIsLoadingCommit(false);
      }
    };

    fetchLastCommit();
  }, []);

  // Smoother background transition with radial gradient lighter in center
  const getBackgroundStyle = () => {
    const maxScroll = 2000;
    const progress = Math.min(scrollY / maxScroll, 1);
    
    // Smooth interpolation function
    const smoothStep = (x) => x * x * (3 - 2 * x);
    
    if (progress < 0.35) {
      // Night theme for hero section
      const localProgress = smoothStep(progress / 0.35);
      return {
        background: `radial-gradient(ellipse at center, 
          rgb(${60 + localProgress * 10}, ${70 + localProgress * 5}, ${105 + localProgress * 5}),
          rgb(${35 + localProgress * 20}, ${45 + localProgress * 10}, ${80 + localProgress * 10}) 30%,
          rgb(${28 + localProgress * 30}, ${37 + localProgress * 15}, ${65 + localProgress * 15}) 60%,
          rgb(${20 + localProgress * 40}, ${28 + localProgress * 20}, ${50 + localProgress * 20}) 85%,
          rgb(${15 + localProgress * 50}, ${20 + localProgress * 25}, ${40 + localProgress * 25}))`,
        minHeight: '100vh',
        transition: 'background 0.8s ease-out'
      };
    } else if (progress < 0.65) {
      // Transition from sunrise to day - blend the colors smoothly
      const localProgress = smoothStep((progress - 0.35) / 0.3);
      
      // Sunrise colors (dusk-like)
      const sunriseCenter = [245, 225, 180];
      const sunriseMid = [235, 195, 160];
      const sunriseOuter = [225, 175, 140];
      const sunriseEdge = [215, 155, 120];
      
      // Day colors  
      const dayCenter = [220, 240, 255];
      const dayMid = [175, 220, 250];
      const dayOuter = [150, 200, 240];
      const dayEdge = [120, 180, 220];
      
      // Interpolate between sunrise and day colors
      const centerR = sunriseCenter[0] + (dayCenter[0] - sunriseCenter[0]) * localProgress;
      const centerG = sunriseCenter[1] + (dayCenter[1] - sunriseCenter[1]) * localProgress;
      const centerB = sunriseCenter[2] + (dayCenter[2] - sunriseCenter[2]) * localProgress;
      
      const midR = sunriseMid[0] + (dayMid[0] - sunriseMid[0]) * localProgress;
      const midG = sunriseMid[1] + (dayMid[1] - sunriseMid[1]) * localProgress;
      const midB = sunriseMid[2] + (dayMid[2] - sunriseMid[2]) * localProgress;
      
      const outerR = sunriseOuter[0] + (dayOuter[0] - sunriseOuter[0]) * localProgress;
      const outerG = sunriseOuter[1] + (dayOuter[1] - sunriseOuter[1]) * localProgress;
      const outerB = sunriseOuter[2] + (dayOuter[2] - sunriseOuter[2]) * localProgress;
      
      const edgeR = sunriseEdge[0] + (dayEdge[0] - sunriseEdge[0]) * localProgress;
      const edgeG = sunriseEdge[1] + (dayEdge[1] - sunriseEdge[1]) * localProgress;
      const edgeB = sunriseEdge[2] + (dayEdge[2] - sunriseEdge[2]) * localProgress;
      
      return {
        background: `radial-gradient(ellipse at center, 
          rgb(${centerR}, ${centerG}, ${centerB}),
          rgb(${midR}, ${midG}, ${midB}) 40%,
          rgb(${outerR}, ${outerG}, ${outerB}) 70%,
          rgb(${edgeR}, ${edgeG}, ${edgeB}))`,
        minHeight: '100vh',
        transition: 'background 0.8s ease-out'
      };
    } else {
      // Transition from day to night - blend the colors smoothly
      const localProgress = smoothStep((progress - 0.65) / 0.35);
      
      // Day colors
      const dayCenter = [220, 240, 255];
      const dayMid = [175, 220, 250];
      const dayOuter = [150, 200, 240];
      const dayEdge = [120, 100, 60];
      
      // Night colors
      const nightCenter = [60, 70, 105];
      const nightMid = [35, 45, 80];
      const nightOuter = [28, 37, 65];
      const nightEdge = [20, 28, 50];
      
      // Interpolate between day and night colors
      const centerR = dayCenter[0] + (nightCenter[0] - dayCenter[0]) * localProgress;
      const centerG = dayCenter[1] + (nightCenter[1] - dayCenter[1]) * localProgress;
      const centerB = dayCenter[2] + (nightCenter[2] - dayCenter[2]) * localProgress;
      
      const midR = dayMid[0] + (nightMid[0] - dayMid[0]) * localProgress;
      const midG = dayMid[1] + (nightMid[1] - dayMid[1]) * localProgress;
      const midB = dayMid[2] + (nightMid[2] - dayMid[2]) * localProgress;
      
      const outerR = dayOuter[0] + (nightOuter[0] - dayOuter[0]) * localProgress;
      const outerG = dayOuter[1] + (nightOuter[1] - dayOuter[1]) * localProgress;
      const outerB = dayOuter[2] + (nightOuter[2] - dayOuter[2]) * localProgress;
      
      const edgeR = dayEdge[0] + (nightEdge[0] - dayEdge[0]) * localProgress;
      const edgeG = dayEdge[1] + (nightEdge[1] - dayEdge[1]) * localProgress;
      const edgeB = dayEdge[2] + (nightEdge[2] - dayEdge[2]) * localProgress;
      
      return {
        background: `radial-gradient(ellipse at center, 
          rgb(${centerR}, ${centerG}, ${centerB}),
          rgb(${midR}, ${midG}, ${midB}) 40%,
          rgb(${outerR}, ${outerG}, ${outerB}) 70%,
          rgb(${edgeR}, ${edgeG}, ${edgeB}))`,
        minHeight: '100vh',
        transition: 'background 0.8s ease-out'
      };
    }
  };

  // Resume handling functions
  const handleViewResume = () => {
    // Replace with your actual resume URL or path
    window.open('/resume.pdf', '_blank');
  };

  const handleDownloadResume = () => {
    // Replace with your actual resume URL or path
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'James_Cai_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <CelestialBackground>
      <div className="relative overflow-hidden min-h-screen">
        <style>{`
          @keyframes heroPop {
            0%   { opacity: 0; transform: scale(0.85); }
            60%  { opacity: 1; transform: scale(1.10); }
            80%  { opacity: 1; transform: scale(0.97); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-hero-pop {
            animation: heroPop 1s cubic-bezier(.4,1.4,.6,1) both;
          }
          @keyframes heroPopSoft {
            0%   { opacity: 0; transform: scale(0.998); }
            60%  { opacity: 1; transform: scale(1.001); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-hero-pop-soft {
            animation: heroPopSoft 0.9s cubic-bezier(.4,1.4,.6,1) both;
          }
          @keyframes drawLine {
            0% { stroke-dashoffset: 1000; }
            100% { stroke-dashoffset: 0; }
          }
          .animate-draw-line {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 2.2s ease-in-out forwards;
          }
          .star-label-svg {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            font-weight: 600;
            font-size: clamp(1rem, 2vw, 1.5rem);
            letter-spacing: 0.025em;
            text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5), 0 0 4px rgba(255, 255, 255, 0.3);
            pointer-events: none;
            opacity: 0.85;
            user-select: text;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(to right, #c084fc, #3b82f6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            transform-origin: center;
          }
          .star-label-group:hover .star-label-svg {
            opacity: 1;
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(165, 180, 252, 0.6));
            transform: scale(1.05) rotate(-2deg);
          }
          @keyframes fact-slide {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            20% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fact-slide-out {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-20px);
            }
          }
          .animate-fact-slide {
            animation: fact-slide 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .animate-fact-slide-out {
            animation: fact-slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @media (max-width: 768px) {
            .star-label-svg {
              font-size: 1rem;
            }
          }
          @keyframes mobileMenuSlide {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .mobile-menu-slide {
            animation: mobileMenuSlide 0.3s ease-out forwards;
          }
          @keyframes mobileMenuFade {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .mobile-menu-fade {
            animation: mobileMenuFade 0.3s ease-out forwards;
          }
        `}</style>
        {/* Mobile Navigation Menu */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 mobile-menu-fade" 
              onClick={() => setIsMobileMenuOpen(false)}
              role="presentation"
              aria-hidden="true"
            />
          )}

          {/* Mobile Menu Content */}
          {isMobileMenuOpen && (
            <div
              id="mobile-menu"
              className="fixed right-4 bottom-20 w-64 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-4 z-50 mobile-menu-slide"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <nav className="space-y-3" role="navigation" aria-label="Main navigation">
                <Button
                  onClick={() => {
                    navigate('/asteroids');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-white rounded-xl px-4 py-3 transition-all duration-300 border border-white/10"
                  aria-label="Navigate to About section"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-300" aria-hidden="true" />
                    About
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-white rounded-xl px-4 py-3 transition-all duration-300 border border-white/10"
                  aria-label="Navigate to Experience section"
                >
                  <span className="flex items-center gap-3">
                    <GitCommit className="w-5 h-5 text-cyan-300" aria-hidden="true" />
                    Experience
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    navigate('/projects');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-white rounded-xl px-4 py-3 transition-all duration-300 border border-white/10"
                  aria-label="Navigate to Projects section"
                >
                  <span className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-indigo-300" aria-hidden="true" />
                    Projects
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    navigate('/contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-white rounded-xl px-4 py-3 transition-all duration-300 border border-white/10"
                  aria-label="Navigate to Contact section"
                >
                  <span className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cyan-300" aria-hidden="true" />
                    Contact
                  </span>
                </Button>
              </nav>
            </div>
          )}
        </div>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          {/* Enhanced Animated Stars for Hero */}
          <div className="fixed top-10 left-1/4 w-2 h-2 bg-gradient-to-br from-white to-blue-100 rounded-full animate-twinkle shadow-lg" />
          <div className="fixed top-24 right-1/3 w-1 h-1 bg-gradient-to-br from-yellow-100 to-white rounded-full animate-twinkle-delayed" />
          <div className="fixed top-40 left-1/2 w-2 h-2 bg-gradient-to-br from-white to-purple-100 rounded-full animate-twinkle shadow-md" />
          <div className="fixed top-16 right-1/4 w-1 h-1 bg-gradient-to-br from-blue-100 to-white rounded-full animate-twinkle-delayed" />
          <div className="fixed top-60 left-1/3 w-1 h-1 bg-gradient-to-br from-white to-pink-100 rounded-full animate-twinkle" />
          <div className="fixed top-36 right-1/2 w-2 h-2 bg-gradient-to-br from-white to-indigo-100 rounded-full animate-twinkle-delayed shadow-sm" />
          <div className="fixed top-80 left-1/2 w-1 h-1 bg-gradient-to-br from-white to-blue-100 rounded-full animate-twinkle" />
          <div className="fixed top-20 left-2/3 w-2 h-2 bg-gradient-to-br from-yellow-100 to-white rounded-full animate-twinkle-delayed" />
          <div className="fixed top-50 right-1/3 w-1 h-1 bg-gradient-to-br from-white to-purple-100 rounded-full animate-twinkle" />
          <div className="fixed top-70 left-1/4 w-2 h-2 bg-gradient-to-br from-blue-100 to-white rounded-full animate-twinkle-delayed shadow-sm" />
          
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start min-h-[40vh] gap-6 lg:gap-8 pl-0 lg:pl-6 pt-10 lg:pt-20">
              {/* Profile Picture */}
              <div className="flex-shrink-0 order-1 lg:order-1 animate-hero-pop" style={{ animationDelay: '0ms' }}>
                <div className="relative flex items-center justify-center">
                  {/* Gradient Glow Ring */}
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                    boxShadow: '0 0 32px 8px rgba(168,85,247,0.25), 0 0 64px 16px rgba(59,130,246,0.15)',
                    background: 'conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #3b82f6 100%)',
                    filter: 'blur(8px)',
                    zIndex: 1
                  }} />
                  {/* Profile Image with border, shadow, and reduced size */}
                  <div className="relative">
                    {!isProfileImageLoaded && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
                    )}
                    <img
                      src="/profile.jpg"
                      alt="Profile Picture"
                      loading="eager"
                      fetchPriority="high"
                      className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-cover rounded-full border-4 sm:border-8 border-white/40 shadow-2xl transition-opacity duration-300 ${
                        isProfileImageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        boxShadow: '0 4px 32px 0 rgba(80, 80, 180, 0.25), 0 0 0 8px rgba(168,85,247,0.10)',
                        zIndex: 2
                      }}
                      onLoad={() => setIsProfileImageLoaded(true)}
                    />
                  </div>
                </div>

                {/* Resume Button Section */}
                <div className="mt-4 lg:mt-6 flex flex-col items-center gap-2 lg:gap-3">
                  {/* Main Resume Button */}
                  <div className="group relative">
                    <Button 
                      onClick={handleViewResume}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 text-xs sm:text-sm md:text-base"
                    >
                      <span className="flex flex-row items-center gap-2 whitespace-nowrap font-semibold">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        View Resume
                      </span>
                    </Button>

                    {/* Floating action buttons - hidden on mobile for better UX */}
                    <div className="hidden lg:flex absolute top-1/2 left-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-3 -translate-y-1/2 flex-col gap-2 ml-2">
                      <Button
                        size="sm"
                        onClick={handleViewResume}
                        className="bg-gradient-to-br from-[#c084fc] to-[#3b82f6] hover:from-[#c084fc]/90 hover:to-[#3b82f6]/90 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        title="View Resume"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDownloadResume}
                        className="bg-gradient-to-br from-[#c084fc] to-[#3b82f6] hover:from-[#c084fc]/90 hover:to-[#3b82f6]/90 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        title="Download Resume"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile-friendly download button */}
                  <div className="lg:hidden">
                    <Button
                      size="sm"
                      onClick={handleDownloadResume}
                      className="bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-white rounded-full px-3 py-1 transition-all duration-300 hover:scale-105 text-xs inline-flex items-center justify-center border border-white/10"
                    >
                      <Download className="w-3 h-3 mr-1 text-cyan-300" />
                      Download
                    </Button>
                  </div>

                  {/* Last Commit Indicator */}
                  {!isLoadingCommit && lastCommit && (
                    <div className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm border border-white/20 transition-all duration-700">
                      <GitCommit className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] sm:text-xs text-purple-200 font-medium">Last commit</span>
                        <span className="text-[8px] sm:text-[10px] text-purple-200/80">{lastCommit.date}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Text Content */}
              <div className="text-center lg:text-left flex flex-col order-2 lg:order-2 max-w-full lg:max-w-none animate-hero-pop" style={{ animationDelay: '120ms' }}>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg mb-3 sm:mb-4 lg:mb-6">
                  hey, i'm <span className="text-blue-200 transition-colors duration-700">James</span>
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 lg:mb-8 text-white max-w-full lg:max-w-3xl leading-relaxed drop-shadow-md px-2 lg:px-0 animate-hero-pop-soft" style={{ animationDelay: '240ms' }}>
                  <span className="block mb-2">→ swe intern <span className="font-semibold text-blue-400 transition-colors duration-700">@ Ford Motor Company</span></span>
                  <span className="block">→ cs <span style={{ color: '#FED654' }} className="font-semibold transition-colors duration-700">@ University of Waterloo</span></span>
                </p>
                
                {/* Rotating Fun Fact Box */}
                <div className="relative inline-block px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 rounded-2xl mb-6 sm:mb-8 lg:mb-12 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm transition-all duration-700 shadow-xl self-center lg:self-start min-w-[200px] max-w-[90vw] sm:max-w-[480px] lg:max-w-[600px] animate-hero-pop" style={{ animationDelay: '360ms' }}>
                  {/* Fun Fact Label */}
                  <div className="absolute z-50 -top-2 -left-2 bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium text-white shadow-lg">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-2 h-2 sm:w-3 sm:h-3" />
                      Fun Fact
                    </span>
                  </div>
                  <div className="relative z-10 overflow-hidden rounded-2xl">
                    <p 
                      key={currentFact}
                      className="text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all duration-700 text-white text-left animate-fact-slide"
                    >
                      {FUN_FACTS[currentFact]}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 to-blue-600/15 animate-pulse rounded-2xl" />
                </div>
                
                <div className="flex gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 lg:mb-12 justify-center lg:justify-start animate-hero-pop" style={{ animationDelay: '480ms' }}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-white border-2 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                    onClick={() => window.open('https://github.com/Jam-Cai', '_blank')}
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-white border-2 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                    onClick={() => window.open('https://linkedin.com/in/jam-cai', '_blank')}
                  >
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-white border-2 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                    onClick={() => window.open('mailto:james.caicjm@gmail.com', '_blank')}
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Little Dipper (Ursa Minor) Constellation Navigation - Hide on mobile */}
        <div className="hidden md:block fixed top-1/2 right-0 z-30" style={{ transform: 'translateY(-55%) translateX(22%)' }} aria-label="Little Dipper constellation navigation">
          <svg
            width="800"
            height="800"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#c7d2fe' }} />
                <stop offset="100%" style={{ stopColor: '#f5d0fe' }} />
              </linearGradient>
              {/* A soft cyan–white radial glow */}
              <radialGradient id="polarisGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
                <stop offset="50%" stopColor="#00eaff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00eaff" stopOpacity="0"   />
              </radialGradient>
              {/* Enhanced glow filter for Polaris */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur1" />
                <feGaussianBlur stdDeviation="8" result="blur2" />
                <feFlood floodColor="#00eaff" floodOpacity="0.6" result="color1" />
                <feFlood floodColor="#ffffff" floodOpacity="0.4" result="color2" />
                <feComposite in="color1" in2="blur1" operator="in" result="glow1" />
                <feComposite in="color2" in2="blur2" operator="in" result="glow2" />
                <feMerge>
                  <feMergeNode in="glow2" />
                  <feMergeNode in="glow1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/*
                Coordinates come straight from the screenshot (412x430 px -> 400x400).

                  Polaris (alpha UMi)   : 106,354
                  Yildun  (delta UMi)   : 138,310   - handle star 1
                  Epsilon (epsilon UMi) : 165,254   - handle star 2
                  Zeta    (zeta UMi)    : 160,186   - bowl / handle join (bottom-left bowl corner)
                  Kochab  (beta UMi)    : 196,170   - bottom-right bowl corner
                  Pherkad (gamma UMi)   : 162,102   - top-right bowl corner
                  Eta     (eta UMi)     : 127,130   - top-left bowl corner
              */}

            {/* ───── Little‑Dipper outline ───── */}
            {/* curved handle (broken into three straight segments) */}
            <line className="animate-draw-line" style={{ animationDelay: '1.1s' }} x1="212" y1="708" x2="276" y2="620" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /> {/* Polaris–Yildun */}
            <line className="animate-draw-line" style={{ animationDelay: '1.35s' }} x1="276" y1="620" x2="330" y2="508" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /> {/* Yildun–Epsilon */}
            <line className="animate-draw-line" style={{ animationDelay: '1.6s' }} x1="330" y1="508" x2="320" y2="372" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /> {/* Epsilon–Zeta */}

            {/* diamond‑shaped bowl */}
            <line className="animate-draw-line" style={{ animationDelay: '1.85s' }} x1="320" y1="372" x2="392" y2="340" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /> {/* Zeta–Kochab */}
            <line className="animate-draw-line" style={{ animationDelay: '2.1s' }} x1="392" y1="340" x2="324" y2="204" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /> {/* Kochab–Pherkad */}
            <line className="animate-draw-line" style={{ animationDelay: '2.35s' }} x1="324" y1="204" x2="254" y2="260" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /> {/* Pherkad–Eta */}
            <line className="animate-draw-line" style={{ animationDelay: '2.6s' }} x1="254" y1="260" x2="320" y2="372" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /> {/* Eta–Zeta */}

            {/* ───── stars (4 interactive, 3 static) ───── */}
            {/* Polaris — About */}
            /* defs can live anywhere inside your SVG root -------- */
            <defs>
              {/* A soft cyan–white radial glow */}
              <radialGradient id="polarisGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
                <stop offset="50%" stopColor="#00eaff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00eaff" stopOpacity="0"   />
              </radialGradient>
            </defs>

            {/* --- Polaris group -------------------------------- */}
            <g
              className="star-label-group group cursor-pointer"
              style={{ animationDelay: '2700ms' }}
              onClick={() => navigate('/asteroids')}
            >
              {/* Outer pulsing halo */}
              <circle
                cx="212"
                cy="708"
                r="20"
                fill="none"
                stroke="url(#polarisGlow)"
                strokeWidth="8"
              >
                <animate attributeName="r" values="20;28;20" dur="180s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.9;0.3;0.9" dur="180s" repeatCount="indefinite" />
              </circle>

              {/* Main star body */}
              <circle
                cx="212"
                cy="708"
                r="8"
                fill="#ffffff"
                // filter="url(#glow)"
              >
                <animate attributeName="r" values="8;10;8" dur="120s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.8;1" dur="120s" repeatCount="indefinite" />
              </circle>
            </g>


            {/* Kochab — Experience */}
            <g className="star-label-group animate-fade-in group cursor-pointer" style={{ animationDelay: '2760ms' }} onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}>
              <circle className="animate-twinkle animate-fade-in" style={{ animationDelay: '2760ms' }} cx="392" cy="340" r="15" fill="url(#starGlow)" filter="url(#glow)" />
              <circle className="animate-twinkle animate-fade-in" style={{ animationDelay: '2760ms' }} cx="392" cy="340" r="6" fill="#fff" />
            </g>

            {/* Pherkad — Projects */}
            <g className="star-label-group animate-fade-in group cursor-pointer" style={{ animationDelay: '2820ms' }}>
              <circle className="animate-twinkle animate-fade-in" style={{ animationDelay: '2820ms' }} cx="324" cy="204" r="15" fill="url(#starGlow)" filter="url(#glow)" />
              <circle className="animate-twinkle animate-fade-in" style={{ animationDelay: '2820ms' }} cx="324" cy="204" r="6" fill="#fff" />
            </g>

            {/* Yildun — Contact */}
            <g className="star-label-group animate-fade-in group cursor-pointer" style={{ animationDelay: '2880ms' }} onClick={() => navigate('/contact')}>
              <circle className="animate-twinkle animate-fade-in" style={{ animationDelay: '2880ms' }} cx="276" cy="620" r="13" fill="url(#starGlow)" filter="url(#glow)" />
              <circle className="animate-twinkle animate-fade-in" style={{ animationDelay: '2880ms' }} cx="276" cy="620" r="5" fill="#fff" />
            </g>

            {/* static stars */}
            <g className="star-label-group animate-fade-in group cursor-pointer" style={{ animationDelay: '2940ms' }} onClick={() => navigate('/contact')}>
              <circle className="animate-twinkle-delayed animate-fade-in" cx="330" cy="508" r="12" fill="url(#starGlow)" filter="url(#glow)" />
              <circle className="animate-twinkle animate-fade-in" cx="330" cy="508" r="4" fill="#fff" />
              <text x="310" y="514" className="star-label-svg" textAnchor="end" fill="url(#textGradient)" style={{ pointerEvents: 'auto', cursor: 'pointer', animationDelay: '3400ms' }}>Contact</text>
            </g>
            <g className="star-label-group animate-fade-in group cursor-pointer" style={{ animationDelay: '3000ms' }} onClick={() => navigate('/experience')}>
              <circle className="animate-twinkle animate-fade-in" cx="320" cy="372" r="12" fill="url(#starGlow)" filter="url(#glow)" />
              <circle className="animate-twinkle animate-fade-in" cx="320" cy="372" r="4" fill="#fff" />
              <text x="300" y="378" className="star-label-svg" textAnchor="end" fill="url(#textGradient)" style={{ pointerEvents: 'auto', cursor: 'pointer', animationDelay: '3300ms' }}>Experience</text>
            </g>
            <g className="star-label-group animate-fade-in group cursor-pointer" style={{ animationDelay: '3060ms' }} onClick={() => navigate('/projects')}>
              <circle className="animate-twinkle animate-fade-in" cx="254" cy="260" r="12" fill="url(#starGlow)" filter="url(#glow)" />
              <circle className="animate-twinkle animate-fade-in" cx="254" cy="260" r="4" fill="#fff" />
              <text x="234" y="266" className="star-label-svg" textAnchor="end" fill="url(#textGradient)" style={{ pointerEvents: 'auto', cursor: 'pointer', animationDelay: '3200ms' }}>Projects</text>
            </g>
            <g className="star-label-group animate-fade-in group cursor-pointer" style={{ animationDelay: '3120ms' }}>
              <circle className="animate-twinkle animate-fade-in" cx="276" cy="620" r="13" fill="url(#starGlow)" filter="url(#glow)" />
              <circle className="animate-twinkle animate-fade-in" cx="276" cy="620" r="5" fill="#fff" />
            </g>
          </svg>

          {/* <span className="sr-only">Little Dipper constellation navigation: About, Experience, Projects, Contact</span> */}
        </div>
      </div>
    </CelestialBackground>
  );
};

export default Index;
