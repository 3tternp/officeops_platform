import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SCORMPlayer = ({ packageData, onClose, onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [playerStatus, setPlayerStatus] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [scormData, setScormData] = useState({
    lessonStatus: 'incomplete',
    score: 0,
    location: '',
    sessionTime: '00:00:00'
  });
  const iframeRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (packageData) {
      loadSCORMPackage();
    }
    
    // Track session time
    const interval = setInterval(updateSessionTime, 1000);
    return () => clearInterval(interval);
  }, [packageData]);

  const updateSessionTime = () => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    
    setScormData(prev => ({
      ...prev,
      sessionTime: `${hours}:${minutes}:${seconds}`
    }));
  };

  const loadSCORMPackage = async () => {
    try {
      setIsLoading(true);
      setPlayerStatus('loading');

      // Convert base64 data back to blob
      const binaryString = atob(packageData.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/zip' });

      // Create object URL for the package
      const packageUrl = URL.createObjectURL(blob);
      
      // For demo purposes, we'll show a simulated SCORM player
      // In a real implementation, you would extract and serve the SCORM content
      setPlayerStatus('ready');
      setIsLoading(false);
      
      // Clean up URL when component unmounts
      return () => URL.revokeObjectURL(packageUrl);
    } catch (error) {
      console.error('Error loading SCORM package:', error);
      setPlayerStatus('error');
      setIsLoading(false);
    }
  };

  const handlePlayerMessage = (event) => {
    // Handle messages from SCORM content
    const { type, data } = event.data;
    
    switch (type) {
      case 'scorm.progress':
        setProgress(data.progress);
        setScormData(prev => ({
          ...prev,
          location: data.location || prev.location
        }));
        break;
        
      case 'scorm.score':
        setScormData(prev => ({
          ...prev,
          score: data.score
        }));
        break;
        
      case 'scorm.complete':
        setScormData(prev => ({
          ...prev,
          lessonStatus: 'completed'
        }));
        setProgress(100);
        if (onComplete) {
          onComplete({
            packageId: packageData.id,
            score: data.score || scormData.score,
            completed: true,
            sessionTime: scormData.sessionTime
          });
        }
        break;
        
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('message', handlePlayerMessage);
    return () => window.removeEventListener('message', handlePlayerMessage);
  }, [scormData]);

  const mockSCORMPlayer = () => {
    return (
      <div className="h-full flex flex-col">
        {/* SCORM Content Simulation */}
        <div className="flex-1 p-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{packageData.title}</h1>
              <p className="text-gray-600">
                {packageData.metadata?.course?.description || 'SCORM course content'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Simulated Course Content */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded border">
                  <h3 className="font-medium mb-2">📚 Learning Module 1</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Introduction and fundamental concepts
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setProgress(Math.min(progress + 25, 100));
                    }}
                  >
                    Complete Module
                  </Button>
                </div>
                
                <div className="p-4 bg-white rounded border">
                  <h3 className="font-medium mb-2">🎯 Learning Module 2</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Practical applications and examples
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={progress < 25}
                    onClick={() => {
                      setProgress(Math.min(progress + 25, 100));
                    }}
                  >
                    Complete Module
                  </Button>
                </div>
                
                <div className="p-4 bg-white rounded border">
                  <h3 className="font-medium mb-2">✅ Assessment</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Test your knowledge with a quick quiz
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={progress < 50}
                    onClick={() => {
                      const score = Math.floor(Math.random() * 30) + 70; // Random score 70-100
                      setScormData(prev => ({ ...prev, score }));
                      setProgress(100);
                      setScormData(prev => ({ ...prev, lessonStatus: 'completed' }));
                    }}
                  >
                    Take Assessment
                  </Button>
                </div>
              </div>
            </div>

            {/* Completion Message */}
            {scormData.lessonStatus === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-4xl text-green-500 mb-4">🎉</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Course Completed!</h3>
                <p className="text-green-700 mb-4">
                  Congratulations! You have successfully completed this course.
                </p>
                <div className="text-sm text-green-600">
                  <p>Final Score: {scormData.score}%</p>
                  <p>Session Time: {scormData.sessionTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="border-t bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Session Time: {scormData.sessionTime}
            </div>
            
            <div className="flex space-x-3">
              {scormData.lessonStatus === 'completed' ? (
                <Button
                  variant="default"
                  onClick={() => onComplete && onComplete({
                    packageId: packageData.id,
                    score: scormData.score,
                    completed: true,
                    sessionTime: scormData.sessionTime
                  })}
                  iconName="CheckCircle"
                  iconPosition="left"
                >
                  Mark Complete
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setProgress(100);
                    setScormData(prev => ({ ...prev, lessonStatus: 'completed', score: 85 }));
                  }}
                >
                  Simulate Completion
                </Button>
              )}
              
              <Button variant="ghost" onClick={onClose}>
                Close Player
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Play" size={24} className="text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">SCORM Player</h2>
                <p className="text-sm text-muted-foreground">{packageData?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status Indicators */}
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  playerStatus === 'ready' ? 'bg-green-500' :
                  playerStatus === 'loading' ? 'bg-yellow-500' :
                  playerStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-muted-foreground capitalize">{playerStatus}</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Progress: {progress}%
              </div>
              
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Player Content */}
        <div className="flex-1 bg-gray-100">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin mb-4">
                  <Icon name="Loader2" size={48} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Loading SCORM Package</h3>
                <p className="text-muted-foreground">Extracting and initializing course content...</p>
              </div>
            </div>
          ) : playerStatus === 'error' ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Icon name="AlertCircle" size={48} className="text-error mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Package</h3>
                <p className="text-muted-foreground mb-6">
                  Unable to load the SCORM package. Please check the package format.
                </p>
                <Button variant="outline" onClick={onClose}>
                  Close Player
                </Button>
              </div>
            </div>
          ) : (
            mockSCORMPlayer()
          )}
        </div>

        {/* Footer */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-muted-foreground">Status: </span>
                <span className={`font-medium ${
                  scormData.lessonStatus === 'completed' ? 'text-success' :
                  scormData.lessonStatus === 'incomplete' ? 'text-warning' : 'text-muted-foreground'
                }`}>
                  {scormData.lessonStatus}
                </span>
              </div>
              
              {scormData.score > 0 && (
                <div>
                  <span className="text-muted-foreground">Score: </span>
                  <span className="font-medium text-foreground">{scormData.score}%</span>
                </div>
              )}
              
              <div>
                <span className="text-muted-foreground">Time: </span>
                <span className="font-medium text-foreground">{scormData.sessionTime}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Reset progress for testing
                  setProgress(0);
                  setScormData(prev => ({
                    ...prev,
                    lessonStatus: 'incomplete',
                    score: 0,
                    location: ''
                  }));
                  startTimeRef.current = Date.now();
                }}
                iconName="RotateCcw"
                title="Reset Progress"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const info = `
SCORM Package Information:
- Title: ${packageData.title}
- Version: ${packageData.version}
- Files: ${packageData.fileCount}
- Size: ${(packageData.size / 1024 / 1024).toFixed(2)} MB
- Status: ${scormData.lessonStatus}
- Progress: ${progress}%
- Score: ${scormData.score}%
- Session Time: ${scormData.sessionTime}
                  `;
                  alert(info);
                }}
                iconName="Info"
                title="Package Info"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCORMPlayer;
