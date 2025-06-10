import React, { useState, useEffect, useCallback, useRef } from 'react';
import CelestialBackground from '@/components/CelestialBackground';
import { Sparkles } from 'lucide-react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SHIP_SIZE = 10;
const BULLET_SIZE = 2;
const BULLET_SPEED = 8;
const SHIP_ACCELERATION = 0.3;
const SHIP_MAX_SPEED = 8;
const SHIP_FRICTION = 0.98;
const SHIP_ROTATION_SPEED = 0.15;

const AsteroidsGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  
  const [gameState, setGameState] = useState({
    ship: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      angle: 0,
      vx: 0,
      vy: 0,
      thrust: false
    },
    bullets: [],
    asteroids: [],
    score: 0,
    lives: 3,
    gameOver: false
  });

  // Initialize asteroids
  const createAsteroid = (x, y, size = 'large') => {
    const sizes = {
      large: { radius: 40, points: 100 },
      medium: { radius: 25, points: 200 },
      small: { radius: 15, points: 400 }
    };
    
    return {
      x: x || Math.random() * CANVAS_WIDTH,
      y: y || Math.random() * CANVAS_HEIGHT,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      angle: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.1,
      size,
      radius: sizes[size].radius,
      points: sizes[size].points
    };
  };

  const initializeGame = useCallback(() => {
    const asteroids = [];
    for (let i = 0; i < 5; i++) {
      let asteroid;
      do {
        asteroid = createAsteroid();
      } while (
        Math.abs(asteroid.x - CANVAS_WIDTH / 2) < 100 &&
        Math.abs(asteroid.y - CANVAS_HEIGHT / 2) < 100
      );
      asteroids.push(asteroid);
    }

    setGameState({
      ship: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        angle: 0,
        vx: 0,
        vy: 0,
        thrust: false
      },
      bullets: [],
      asteroids,
      score: 0,
      lives: 3,
      gameOver: false
    });
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = true;
    };

    const handleKeyUp = (e) => {
      // Prevent default behavior for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Wrap position around screen edges
  const wrapPosition = (x, y) => {
    return {
      x: ((x % CANVAS_WIDTH) + CANVAS_WIDTH) % CANVAS_WIDTH,
      y: ((y % CANVAS_HEIGHT) + CANVAS_HEIGHT) % CANVAS_HEIGHT
    };
  };

  // Check collision between two circular objects
  const checkCollision = (obj1, obj2, radius1, radius2) => {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (radius1 + radius2);
  };

  // Game update logic
  const updateGame = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver) return prevState;

      const newState = { ...prevState };
      const keys = keysRef.current;

      // Update ship
      let ship = { ...newState.ship };
      
      // Rotation
      if (keys['ArrowLeft']) {
        ship.angle -= SHIP_ROTATION_SPEED;
      }
      if (keys['ArrowRight']) {
        ship.angle += SHIP_ROTATION_SPEED;
      }

      // Thrust
      ship.thrust = keys['ArrowUp'];
      if (ship.thrust) {
        ship.vx += Math.cos(ship.angle) * SHIP_ACCELERATION;
        ship.vy += Math.sin(ship.angle) * SHIP_ACCELERATION;
        
        // Limit max speed
        const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
        if (speed > SHIP_MAX_SPEED) {
          ship.vx = (ship.vx / speed) * SHIP_MAX_SPEED;
          ship.vy = (ship.vy / speed) * SHIP_MAX_SPEED;
        }
      }

      // Apply friction
      ship.vx *= SHIP_FRICTION;
      ship.vy *= SHIP_FRICTION;

      // Update position
      ship.x += ship.vx;
      ship.y += ship.vy;

      // Wrap around screen
      const wrappedPos = wrapPosition(ship.x, ship.y);
      ship.x = wrappedPos.x;
      ship.y = wrappedPos.y;

      newState.ship = ship;

      // Shooting
      if (keys['Space'] && (!keys.spacePressed)) {
        keys.spacePressed = true;
        newState.bullets.push({
          x: ship.x + Math.cos(ship.angle) * SHIP_SIZE,
          y: ship.y + Math.sin(ship.angle) * SHIP_SIZE,
          vx: Math.cos(ship.angle) * BULLET_SPEED + ship.vx,
          vy: Math.sin(ship.angle) * BULLET_SPEED + ship.vy,
          life: 60
        });
      }
      if (!keys['Space']) {
        keys.spacePressed = false;
      }

      // Update bullets
      newState.bullets = newState.bullets
        .map(bullet => ({
          ...bullet,
          x: bullet.x + bullet.vx,
          y: bullet.y + bullet.vy,
          life: bullet.life - 1
        }))
        .map(bullet => {
          const wrapped = wrapPosition(bullet.x, bullet.y);
          return { ...bullet, x: wrapped.x, y: wrapped.y };
        })
        .filter(bullet => bullet.life > 0);

      // Update asteroids
      newState.asteroids = newState.asteroids.map(asteroid => {
        const newAsteroid = {
          ...asteroid,
          x: asteroid.x + asteroid.vx,
          y: asteroid.y + asteroid.vy,
          angle: asteroid.angle + asteroid.rotation
        };
        const wrapped = wrapPosition(newAsteroid.x, newAsteroid.y);
        return { ...newAsteroid, x: wrapped.x, y: wrapped.y };
      });

      // Check bullet-asteroid collisions
      const remainingBullets = [];
      const remainingAsteroids = [...newState.asteroids];
      let scoreIncrease = 0;

      for (const bullet of newState.bullets) {
        let bulletHit = false;
        
        for (let i = remainingAsteroids.length - 1; i >= 0; i--) {
          const asteroid = remainingAsteroids[i];
          
          if (checkCollision(bullet, asteroid, BULLET_SIZE, asteroid.radius)) {
            bulletHit = true;
            scoreIncrease += asteroid.points;
            
            // Remove asteroid
            const hitAsteroid = remainingAsteroids.splice(i, 1)[0];
            
            // Break asteroid into smaller pieces
            if (hitAsteroid.size === 'large') {
              for (let j = 0; j < 2; j++) {
                remainingAsteroids.push(createAsteroid(hitAsteroid.x, hitAsteroid.y, 'medium'));
              }
            } else if (hitAsteroid.size === 'medium') {
              for (let j = 0; j < 2; j++) {
                remainingAsteroids.push(createAsteroid(hitAsteroid.x, hitAsteroid.y, 'small'));
              }
            }
            break;
          }
        }
        
        if (!bulletHit) {
          remainingBullets.push(bullet);
        }
      }

      newState.bullets = remainingBullets;
      newState.asteroids = remainingAsteroids;
      newState.score += scoreIncrease;

      // Check ship-asteroid collisions
      for (const asteroid of newState.asteroids) {
        if (checkCollision(ship, asteroid, SHIP_SIZE, asteroid.radius)) {
          newState.lives -= 1;
          
          if (newState.lives <= 0) {
            newState.gameOver = true;
          } else {
            // Reset ship position
            newState.ship = {
              x: CANVAS_WIDTH / 2,
              y: CANVAS_HEIGHT / 2,
              angle: 0,
              vx: 0,
              vy: 0,
              thrust: false
            };
          }
          break;
        }
      }

      // Check if all asteroids destroyed
      if (newState.asteroids.length === 0 && !newState.gameOver) {
        // Spawn new wave
        const newAsteroids = [];
        for (let i = 0; i < 5 + Math.floor(newState.score / 10000); i++) {
          let asteroid;
          do {
            asteroid = createAsteroid();
          } while (
            Math.abs(asteroid.x - ship.x) < 100 &&
            Math.abs(asteroid.y - ship.y) < 100
          );
          newAsteroids.push(asteroid);
        }
        newState.asteroids = newAsteroids;
      }

      return newState;
    });
  }, []);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, '#1a1a2e');
    bgGradient.addColorStop(1, '#16213e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw ship with gradient and glow
    const ship = gameState.ship;
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);

    // Ship glow
    const shipGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, SHIP_SIZE * 2);
    shipGlow.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
    shipGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = shipGlow;
    ctx.beginPath();
    ctx.arc(0, 0, SHIP_SIZE * 2, 0, Math.PI * 2);
    ctx.fill();

    // Ship body
    const shipGradient = ctx.createLinearGradient(-SHIP_SIZE, -SHIP_SIZE/2, SHIP_SIZE, SHIP_SIZE/2);
    shipGradient.addColorStop(0, '#a855f7');
    shipGradient.addColorStop(1, '#3b82f6');
    ctx.strokeStyle = shipGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(SHIP_SIZE, 0);
    ctx.lineTo(-SHIP_SIZE, -SHIP_SIZE/2);
    ctx.lineTo(-SHIP_SIZE/2, 0);
    ctx.lineTo(-SHIP_SIZE, SHIP_SIZE/2);
    ctx.closePath();
    ctx.stroke();

    // Draw thrust with gradient and glow
    if (ship.thrust) {
      const thrustGradient = ctx.createLinearGradient(-SHIP_SIZE, -SHIP_SIZE/3, -SHIP_SIZE * 1.5, 0);
      thrustGradient.addColorStop(0, '#f97316');
      thrustGradient.addColorStop(1, '#fbbf24');
      
      // Thrust glow
      const thrustGlow = ctx.createRadialGradient(-SHIP_SIZE * 1.5, 0, 0, -SHIP_SIZE * 1.5, 0, SHIP_SIZE);
      thrustGlow.addColorStop(0, 'rgba(249, 115, 22, 0.5)');
      thrustGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = thrustGlow;
      ctx.beginPath();
      ctx.arc(-SHIP_SIZE * 1.5, 0, SHIP_SIZE, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = thrustGradient;
      ctx.beginPath();
      ctx.moveTo(-SHIP_SIZE, -SHIP_SIZE/3);
      ctx.lineTo(-SHIP_SIZE * 1.5, 0);
      ctx.lineTo(-SHIP_SIZE, SHIP_SIZE/3);
      ctx.stroke();
    }
    ctx.restore();

    // Draw bullets with glow
    gameState.bullets.forEach(bullet => {
      const bulletGlow = ctx.createRadialGradient(bullet.x, bullet.y, 0, bullet.x, bullet.y, BULLET_SIZE * 2);
      bulletGlow.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
      bulletGlow.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = bulletGlow;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, BULLET_SIZE * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, BULLET_SIZE, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw asteroids with gradient and glow
    gameState.asteroids.forEach(asteroid => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(asteroid.angle);

      // Asteroid glow
      const asteroidGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, asteroid.radius * 1.2);
      asteroidGlow.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
      asteroidGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = asteroidGlow;
      ctx.beginPath();
      ctx.arc(0, 0, asteroid.radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Asteroid body
      const asteroidGradient = ctx.createLinearGradient(-asteroid.radius, -asteroid.radius, asteroid.radius, asteroid.radius);
      asteroidGradient.addColorStop(0, '#a855f7');
      asteroidGradient.addColorStop(1, '#3b82f6');
      ctx.strokeStyle = asteroidGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const sides = 8;
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const radius = asteroid.radius * (0.8 + Math.sin(angle * 3) * 0.2);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    // Draw UI with gradient text
    const textGradient = ctx.createLinearGradient(20, 20, 200, 60);
    textGradient.addColorStop(0, '#a855f7');
    textGradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = textGradient;
    ctx.font = '20px monospace';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, 20, 60);

    if (gameState.gameOver) {
      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Game over text with gradient
      const gameOverGradient = ctx.createLinearGradient(
        CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 - 50,
        CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2 + 50
      );
      gameOverGradient.addColorStop(0, '#a855f7');
      gameOverGradient.addColorStop(1, '#3b82f6');
      
      ctx.fillStyle = gameOverGradient;
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
      
      ctx.font = '24px monospace';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
      ctx.textAlign = 'left';
    }
  }, [gameState]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      render();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [updateGame, render]);

  // Handle restart
  useEffect(() => {
    const handleRestart = (e) => {
      if (e.code === 'KeyR' && gameState.gameOver) {
        initializeGame();
      }
    };

    window.addEventListener('keydown', handleRestart);
    return () => window.removeEventListener('keydown', handleRestart);
  }, [gameState.gameOver, initializeGame]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <CelestialBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="mb-4 text-center relative">
          <div className="absolute -top-4 -right-4 animate-float">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div className="absolute -bottom-4 -left-4 animate-float-delayed">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 animate-gradient-x relative">
            Asteroids
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl" />
          </h1>
        </div>
        
        <div className="relative mb-8">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded-xl border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            tabIndex={0}
          />
          <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-purple-200">Controls</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-purple-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <span className="text-purple-200">↑</span>
                  </div>
                  <span>Thrust</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <span className="text-purple-200">←</span>
                  </div>
                  <span>Rotate Left</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <span className="text-purple-200">→</span>
                  </div>
                  <span>Rotate Right</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <span className="text-purple-200">Space</span>
                  </div>
                  <span>Shoot</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-purple-500/20">
              <p className="text-sm text-purple-200/80">Avoid asteroids and destroy them all!</p>
            </div>
          </div>
        </div>
        
        {gameState.gameOver && (
          <div className="mt-4 text-center">
            <p className="text-lg text-purple-200/80">Press R to restart</p>
          </div>
        )}
      </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </CelestialBackground>
  );
};

export default AsteroidsGame;