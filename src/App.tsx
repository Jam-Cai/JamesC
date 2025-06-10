import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Asteroids from "./pages/Asteroids";
import Contact from "./pages/Contact";

const pageTransition = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -32, transition: { duration: 0.3, ease: "easeIn" } },
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div {...pageTransition} className="min-h-screen">
            <Index />
          </motion.div>
        } />
        <Route path="/experience" element={
          <motion.div {...pageTransition} className="min-h-screen">
            <Experience />
          </motion.div>
        } />
        <Route path="/projects" element={
          <motion.div {...pageTransition} className="min-h-screen">
            <Projects />
          </motion.div>
        } />
        <Route path="/asteroids" element={
          <motion.div {...pageTransition} className="min-h-screen">
            <Asteroids />
          </motion.div>
        } />
        <Route path="/contact" element={
          <motion.div {...pageTransition} className="min-h-screen">
            <Contact />
          </motion.div>
        } />
        <Route path="*" element={
          <motion.div {...pageTransition} className="min-h-screen">
            <NotFound />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
