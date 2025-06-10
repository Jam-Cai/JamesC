import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, MapPin, ChevronRight, Sparkles, Zap, Star as StarIcon, ArrowLeft } from 'lucide-react';
import CelestialBackground from '@/components/CelestialBackground';
import { useNavigate } from 'react-router-dom';

interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
  logo: string;
}

const experiences: Experience[] = [
  {
    company: 'Ford Motor Company',
    role: 'Software Developer Intern',
    location: 'Waterloo, ON',
    period: 'May 2025 - Present',
    description: [
      'Contributing to the development of next-gen vehicle infotainment systems, focusing on user interface and system performance optimization',
    ],
    technologies: ['Kotlin', 'C++', 'AOSP', 'Android'],
    logo: '/logos/ford.png'
  },
  {
    company: 'Mysti.ai',
    role: 'Software Engineering Intern',
    location: 'Toronto, ON',
    period: 'Feb 2025 - May 2025',
    description: [
      'Developed key features for Mysti AI, a health tracking app that helps users manage their medical data and get personalized health insights',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL'],
    logo: '/logos/logoLight.svg'
  },
  {
    company: 'Temerty Faculty of Medicine',
    role: 'Student Researcher',
    location: 'Toronto, ON',
    period: 'Jul 2023 – June 2024',
    description: [
      'Conducted research on biopolymers and 3D-printed models from medical imaging'
      ],
    technologies: ["Academic Research", "3D Printing", "Medical Imaging"],
    logo: '/logos/uoft.png'
  },
];

const CompanyLogo = ({ src, company }: { src: string; company: string }) => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 group-hover:border-purple-500/40 transition-all duration-500">
    <img 
      src={src} 
      alt={`${company} logo`}
      className="w-full h-full object-contain p-2 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-2xl"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
  </div>
);

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeExperience, setActiveExperience] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <CelestialBackground>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
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
          {/* Header Section */}
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse-slow" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 animate-gradient-x">
                  Experience
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
              <span className="relative z-10">My professional journey and achievements</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-xl" />
            </p>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div
                key={experience.company}
                className={`transform transition-all duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div 
                  className={`group relative bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] ${
                    activeExperience === index ? 'scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setActiveExperience(index)}
                  onMouseLeave={() => setActiveExperience(null)}
                >
                  {/* Company Icon */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl transform rotate-12 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110">
                    <div className="w-full h-full flex items-center justify-center text-white relative">
                      <Briefcase className="w-6 h-6" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-xl animate-pulse" />
                    </div>
                  </div>

                  {/* Experience Content */}
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <CompanyLogo src={experience.logo} company={experience.company} />
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
                            {experience.role}
                          </h3>
                          <p className="text-lg text-purple-200/80">{experience.company}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{experience.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{experience.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <ul className="space-y-2">
                        {experience.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300">
                            <ChevronRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2 pt-4">
                        {experience.technologies.map((tech, techIndex) => (
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
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
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
              </div>
            ))}
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

export default Experience; 