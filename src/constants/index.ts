// Scroll positions and timing constants
export const SCROLL_POSITIONS = {
  SUN_TRANSFORM_START: 2.2, // window.innerHeight multiplier
  MOON_START: 2.0,
  NIGHT_START: 2.5,
  EXPERIENCE_START: 2.0,
  CLOUDS_FADE_START: 3.0,
  CONTACT_SECTION: 4.0,
} as const;

export const ANIMATION_TIMINGS = {
  BACKGROUND_TRANSITION: 0.8, // seconds
  SCROLL_THROTTLE: 16, // ms
  FACT_ROTATION: 3000, // ms
  TRANSITION_DURATION: 700, // ms
} as const;

export const SECTION_OFFSETS = {
  PROJECTS: 0.35,
  CONTACT: 0.35,
} as const;

export const VIEWPORT_HEIGHTS = {
  ABOUT_TRIGGER: 0.8,
  EXPERIENCE_TRIGGER: 1.8,
  CONTACT_TRIGGER: 3.8,
} as const;

// Project data
export const PROJECTS = [
  {
    title: "MeetCode",
    description: "Real-Time AI Mock Interview Platform featuring in-app code execution and AI voice feedback",
    tech: "React, JavaScript, Socket.io, Express, Redis, MongoDB, OpenAI",
    image: "/images/projects/meetcode.png",
    github: "https://github.com/Jam-Cai/meetcode",
    demo: "https://meetcode.world"
  },
  {
    title: "Replate",
    description: "GenAI Genesis Winner - AI Food Sustainability & Delivery Platform using multi-agent AI system to match user preferences to surplus food",
    tech: "JavaScript, Next.js, Express.js, Flask, GCP, Gemini, Cohere",
    image: "/images/projects/replate.png",
    github: "https://github.com/Jam-Cai/replate",
  },
  {
    title: "FairFi",
    description: "DeltaHacks Winner - A tool to detect bias in financial services with real-time sentiment analysis and AI-driven customer call simulation",
    tech: "JavaScript, Next.js, Express.js, MongoDB, Twilio, Cohere",
    image: "/images/projects/fairfi.png",
    github: "https://github.com/Jam-Cai/fairfi",
  },
];

export const FUN_FACTS = [
  "I have a cat named Jordon",
  "I wanted to become an engineer, then a doctor, and now I'm here",
  "I once ate subway everyday for two months (not sponsored)",
  "I've learnt and forgotten how to play three instruments",
  "Now I play Minecraft more than any other game",
  "The constellation on the right is the Little Dipper",
  "I can solve a Rubik's cube in ~25 seconds",
  "I've never broken a bone (yet!)"

];  