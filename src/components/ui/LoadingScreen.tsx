import React from 'react';

interface LoadingScreenProps {
  text?: string;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ text = 'Loading...', progress = 0 }) => {
  const [internalProgress, setInternalProgress] = React.useState(0);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [typedMessage, setTypedMessage] = React.useState('');

  const welcomeMessage = "Welcome to Justice Ultimate Automobiles!";

  React.useEffect(() => {
    let start = Date.now();
    let animationFrame: number;
    const update = () => {
      const elapsed = (Date.now() - start) / 1000;
      const percent = Math.min(100, Math.round((elapsed / 30) * 100));
      setInternalProgress(percent);
      if (percent < 100) {
        animationFrame = requestAnimationFrame(update);
      } else {
        setTimeout(() => setShowWelcome(true), 500);
      }
    };
    update();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Typewriter effect for welcome message
  React.useEffect(() => {
    if (!showWelcome) return;
    setTypedMessage('');
    let i = 0;
    const interval = setInterval(() => {
      setTypedMessage(welcomeMessage.slice(0, i + 1));
      i++;
      if (i === welcomeMessage.length) clearInterval(interval);
    }, 30 * 1000 / welcomeMessage.length); // Spread typing over 30s
    return () => clearInterval(interval);
  }, [showWelcome]);

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden flex justify-center items-center"
      style={{
        backgroundImage: "url('/images/bg-landing.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Enhanced Background Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50 pointer-events-none"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400/25 rounded-full animate-bounce"></div>
      </div>

      {/* Main Content Container with Enhanced Glass Morphism */}
      <div 
        className="glass-panel rounded-3xl p-12 shadow-2xl border border-white/30 backdrop-blur-xl relative z-10 max-w-md w-full mx-4"
      >
        {/* 3D Car Animation */}
        <div className="relative mb-8 flex flex-col items-center">
          {/* Car Container with 3D Effect */}
          <div className="relative w-32 h-20 mb-4">
            {/* Car Body */}
            <div className="car-body absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-green-500 rounded-xl shadow-2xl transform-gpu perspective-1000">
              {/* Car Details */}
              <div className="absolute top-2 left-4 w-6 h-3 bg-white/30 rounded-sm"></div> {/* Windshield */}
              <div className="absolute top-2 right-4 w-6 h-3 bg-white/30 rounded-sm"></div> {/* Rear Window */}
              <div className="absolute bottom-1 left-2 w-4 h-4 bg-gray-800 rounded-full"></div> {/* Front Wheel */}
              <div className="absolute bottom-1 right-2 w-4 h-4 bg-gray-800 rounded-full"></div> {/* Rear Wheel */}
              {/* Headlights */}
              <div className="absolute top-4 left-0 w-2 h-2 bg-white rounded-full shadow-lg"></div>
              <div className="absolute bottom-4 left-0 w-2 h-2 bg-white rounded-full shadow-lg"></div>
            </div>
            
            {/* Animated Movement Effect */}
            <div className="absolute inset-0 car-move-animation">
              <div className="car-shadow absolute bottom-0 left-0 w-full h-2 bg-black/20 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Enhanced Loading Spinner behind car */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative w-16 h-16 mx-auto">
              <div className="loading-spinner w-full h-full border-4 border-white/20 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        {/* Car Animation Styles */}
        <style jsx>{`
          .car-body {
            animation: carFloat 3s ease-in-out infinite, carMove 8s linear infinite;
          }
          
          .car-move-animation {
            animation: moveHorizontal 6s ease-in-out infinite;
          }
          
          @keyframes carFloat {
            0%, 100% { transform: translateY(0px) rotateX(0deg); }
            50% { transform: translateY(-8px) rotateX(-5deg); }
          }
          
          @keyframes carMove {
            0%, 100% { transform: translateX(0px) perspective(200px) rotateY(0deg); }
            25% { transform: translateX(20px) perspective(200px) rotateY(10deg); }
            50% { transform: translateX(0px) perspective(200px) rotateY(0deg); }
            75% { transform: translateX(-20px) perspective(200px) rotateY(-10deg); }
          }
          
          @keyframes moveHorizontal {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(10px); }
          }
        `}</style>

        {/* Loading Text */}
        <h2 
          className="text-2xl font-bold mb-6 text-center text-white"
        >
          {text}
        </h2>

        {/* Enhanced Progress Bar */}
        <div 
          className="mb-6"
        >
          <div 
            className="progress-bar w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/20"
            role="progressbar" 
            aria-valuenow={internalProgress} 
            aria-valuemin={0} 
            aria-valuemax={100}
          >
            <div 
              className="progress-fill h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
              style={{ width: `${internalProgress}%` }}
            />
          </div>
        </div>

        {/* Progress Percentage */}
        <p 
          className="text-lg font-semibold text-center text-white/90"
        >
          {internalProgress}% Complete
        </p>

        {/* Loading Animation Dots */}
        <div 
          className="flex justify-center space-x-2 mt-6"
        >
          <div 
            className="w-2 h-2 bg-yellow-400 rounded-full"
          />
          <div 
            className="w-2 h-2 bg-green-400 rounded-full"
          />
          <div 
            className="w-2 h-2 bg-blue-400 rounded-full"
          />
        </div>

        {/* Brand Logo */}
        <div 
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">J</span>
            </div>
            <span className="text-white/90 text-sm font-medium">Justice Ultimate Automobiles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 