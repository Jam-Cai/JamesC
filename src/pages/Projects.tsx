import React, { useEffect, useState } from 'react';
import { Github, ExternalLink, Star, Code2, Rocket, Cpu, Sparkles, ArrowUpRight, Zap, Star as StarIcon, ArrowLeft } from 'lucide-react';
import { PROJECTS } from '@/constants';
import Button from '@/components/ui/button';
import CelestialBackground from '@/components/CelestialBackground';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <CelestialBackground>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" onMouseMove={handleMouseMove}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Header Section with Enhanced Animations */}
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse-slow" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 animate-gradient-x">
                  My Projects
                </span>
                <div className="absolute -top-4 -right-4 animate-float">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div className="absolute -bottom-4 -left-4 animate-float-delayed">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-purple-200/80 max-w-2xl mx-auto relative">
              <span className="relative z-10">A collection of my work, from AI-powered applications to full-stack development projects</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-xl" />
            </p>
          </div>

          {/* Projects Grid with Creative Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {PROJECTS.map((project, index) => (
              <div
                key={project.title}
                className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  transform: activeProject === index ? 'scale(1.02) rotate(0.5deg)' : 'scale(1)',
                }}
                onMouseEnter={() => setActiveProject(index)}
                onMouseLeave={() => setActiveProject(null)}
              >
                {/* Project Icon with Enhanced Animation */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl transform rotate-12 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110">
                  <div className="w-full h-full flex items-center justify-center text-white relative">
                    {project.title.toLowerCase().includes('ai') ? (
                      <Cpu className="w-6 h-6" />
                    ) : project.title.toLowerCase().includes('web') ? (
                      <Code2 className="w-6 h-6" />
                    ) : (
                      <Rocket className="w-6 h-6" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-xl animate-pulse" />
                  </div>
                </div>

                {/* Project Content with Enhanced Typography */}
                <div className="space-y-4">
                  {/* Project Image */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group-hover:shadow-lg transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img 
                      src={project.image} 
                      alt={`${project.title} screenshot`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=6366f1&color=fff&size=200`;
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-purple-400/50 group-hover:text-purple-400 transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <p className="text-purple-200/70 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Technologies Used with Interactive Hover */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.split(', ').map((tech, techIndex) => (
                      <span
                        key={tech}
                        className={`px-2 py-1 text-xs font-medium bg-purple-500/10 text-purple-200 rounded-full border border-purple-500/20 transition-all duration-300 cursor-default
                          ${hoveredTech === tech ? 'bg-purple-500/20 border-purple-500/40 scale-105' : ''}`}
                        onMouseEnter={() => setHoveredTech(tech)}
                        onMouseLeave={() => setHoveredTech(null)}
                        style={{
                          transform: hoveredTech === tech ? 'scale(1.05)' : 'scale(1)',
                          transitionDelay: `${techIndex * 50}ms`
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons with Enhanced Hover Effects */}
                  <div className="flex gap-3 pt-4 relative z-10">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 group/btn"
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      <Github className="w-4 h-4 group-hover/btn:animate-bounce" />
                      View Code
                    </Button>
                    {project.demo && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 group/btn"
                        onClick={() => window.open(project.demo, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 group-hover/btn:animate-bounce" />
                        Live Demo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Enhanced Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Animated Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 transform rotate-45 translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
                </div>
                <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 transform rotate-45 -translate-x-4 translate-y-4 group-hover:scale-150 transition-transform duration-500" />
                </div>

                {/* Floating Stars */}
                <div className="absolute -top-2 -left-2 animate-float-slow">
                  <StarIcon className="w-4 h-4 text-purple-400/50" />
                </div>
                <div className="absolute -bottom-2 -right-2 animate-float-slow" style={{ animationDelay: '1s' }}>
                  <StarIcon className="w-4 h-4 text-blue-400/50" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note with Enhanced Animations */}
          <div className={`text-center mt-20 text-purple-200/60 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative inline-block">
              <p className="relative z-10">More projects coming soon...</p>
              <div className="absolute -top-2 -right-2 animate-float-delayed">
                <Sparkles className="w-4 h-4 text-purple-400/50" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-float-delayed" style={{ animationDelay: '0.5s' }}>
                <Zap className="w-4 h-4 text-blue-400/50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-xl" />
            </div>
          </div>
        </div>
  </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </CelestialBackground>
  );
};

export default Projects; 