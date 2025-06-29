import React, { useState, useEffect } from 'react';
import { X, Circle, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';

const EvolvingGame = () => {
  const [score, setScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [targets, setTargets] = useState([]);
  const [gameFeatures, setGameFeatures] = useState({
    multipleTargets: false,
    movingTargets: false,
    colorChanging: false,
    powerUps: false,
  });
  const [message, setMessage] = useState('Click the targets to score points!');

  // Initialize game
  useEffect(() => {
    spawnTarget();
  }, []);

  // Check for level progression
  useEffect(() => {
    if (score >= gameLevel * 10) {
      levelUp();
    }
  }, [score, gameLevel]);

  const levelUp = () => {
    setGameLevel(prev => prev + 1);
    setMessage(`Level ${gameLevel + 1}! New feature unlocked!`);
    
    // Unlock new features based on level
    switch(gameLevel) {
      case 1:
        setGameFeatures(prev => ({ ...prev, multipleTargets: true }));
        spawnMultipleTargets();
        break;
      case 2:
        setGameFeatures(prev => ({ ...prev, movingTargets: true }));
        break;
      case 3:
        setGameFeatures(prev => ({ ...prev, colorChanging: true }));
        break;
      case 4:
        setGameFeatures(prev => ({ ...prev, powerUps: true }));
        break;
      default:
        break;
    }
  };

  const spawnTarget = () => {
    const newTarget = {
      id: Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      type: Math.random() > 0.8 && gameFeatures.powerUps ? 'powerUp' : 'normal',
      color: gameFeatures.colorChanging ? 
        `hsl(${Math.random() * 360}, 70%, 50%)` : 
        '#3b82f6',
      direction: Math.random() > 0.5 ? 1 : -1,
    };
    setTargets(prev => [...prev, newTarget]);
  };

  const spawnMultipleTargets = () => {
    for (let i = 0; i < 3; i++) {
      spawnTarget();
    }
  };

  const handleTargetClick = (target) => {
    setTargets(prev => prev.filter(t => t.id !== target.id));
    
    if (target.type === 'powerUp') {
      setScore(prev => prev + 5);
      setMessage('Power-up! +5 points!');
    } else {
      setScore(prev => prev + 1);
    }

    if (gameFeatures.multipleTargets) {
      spawnTarget();
    } else {
      setTimeout(spawnTarget, 500);
    }
  };

  // Move targets if that feature is unlocked
  useEffect(() => {
    if (gameFeatures.movingTargets) {
      const interval = setInterval(() => {
        setTargets(prev => prev.map(target => ({
          ...target,
          y: target.y + (target.direction * 2),
          direction: target.y <= 10 ? 1 : target.y >= 90 ? -1 : target.direction
        })));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gameFeatures.movingTargets]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4 text-center">
        <div className="text-2xl font-bold">Score: {score}</div>
        <div className="text-lg">Level: {gameLevel}</div>
        <div className="text-sm mt-2">{message}</div>
      </div>
      
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        {targets.map(target => (
          <div
            key={target.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
            }}
            onClick={() => handleTargetClick(target)}
          >
            {target.type === 'powerUp' ? (
              <Plus 
                size={32}
                className="text-yellow-500"
              />
            ) : (
              <Circle
                size={24}
                style={{ color: target.color }}
                fill="currentColor"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm">
        <div>Unlocked Features:</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {Object.entries(gameFeatures).map(([feature, unlocked]) => (
            <div 
              key={feature}
              className={`p-2 rounded ${unlocked ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              {feature.replace(/([A-Z])/g, ' $1').trim()}: {unlocked ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvolvingGame;
