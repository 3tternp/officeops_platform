import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import JSZip from 'jszip';

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
  const [iframeContent, setIframeContent] = useState('');
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

      // Convert base64 to Blob
      const binaryString = atob(packageData.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const zipBlob = new Blob([bytes], { type: 'application/zip' });

      // Load ZIP
      const zip = await new JSZip().loadAsync(zipBlob);

      // Determine launch file from manifest or fallback
      let launchPath = 'index.html';
      const manifestFile = zip.file('imsmanifest.xml');
      if (manifestFile) {
        const manifest = await manifestFile.async('string');
        const hrefMatch = manifest.match(/href\s*=\s*"([^"]+)"/i);
        if (hrefMatch && hrefMatch[1]) {
          launchPath = hrefMatch[1].replace(/^\.\//, '');
        }
      }

      // Build object URLs for assets
      const urlMap = {};
      const mimeFromName = (name) => {
        const ext = name.toLowerCase().split('.').pop();
        switch (ext) {
          case 'html': return 'text/html';
          case 'js': return 'application/javascript';
          case 'css': return 'text/css';
          case 'json': return 'application/json';
          case 'svg': return 'image/svg+xml';
          case 'png': return 'image/png';
          case 'jpg':
          case 'jpeg': return 'image/jpeg';
          case 'gif': return 'image/gif';
          case 'mp4': return 'video/mp4';
          case 'webm': return 'video/webm';
          case 'mp3': return 'audio/mpeg';
          case 'wav': return 'audio/wav';
          case 'pdf': return 'application/pdf';
          default: return 'application/octet-stream';
        }
      };

      const files = Object.keys(zip.files);
      for (const name of files) {
        const f = zip.files[name];
        if (!f.dir) {
          const content = await f.async('uint8array');
          const blob = new Blob([content], { type: mimeFromName(name) });
          urlMap[name] = URL.createObjectURL(blob);
        }
      }

      // Patch launch HTML to reference object URLs
      const htmlFile = zip.file(launchPath);
      if (!htmlFile) throw new Error(`Launch file not found: ${launchPath}`);
      const html = await htmlFile.async('string');
      const patchedHtml = html.replace(/(src|href)=["']([^"']+)["']/g, (m, attr, path) => {
        const normalized = path.replace(/^\.\//, '');
        const candidates = [normalized, `content/${normalized}`];
        const replacement = candidates.reduce((acc, key) => acc || urlMap[key], urlMap[normalized]);
        return replacement ? `${attr}="${replacement}"` : m;
      });

      setIframeContent(patchedHtml);
      setPlayerStatus('ready');
      setIsLoading(false);

      // Cleanup on unmount
      return () => {
        Object.values(urlMap).forEach((u) => URL.revokeObjectURL(u));
      };
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

  // Expose a minimal SCORM 1.2 API shim for content to find via parent
  useEffect(() => {
    const lms = {
      initialized: false,
      values: {
        'cmi.core.lesson_status': 'incomplete',
        'cmi.core.score.raw': '0',
        'cmi.core.lesson_location': '',
        'cmi.core.total_time': '0000:00:00',
        'cmi.core.exit': ''
      }
    };

    const API = {
      LMSInitialize: () => {
        lms.initialized = true;
        return 'true';
      },
      LMSFinish: () => {
        return 'true';
      },
      LMSGetValue: (name) => {
        const val = lms.values[name];
        return typeof val === 'undefined' ? '' : String(val);
      },
      LMSSetValue: (name, value) => {
        lms.values[name] = String(value);
        if (name === 'cmi.core.lesson_location') {
          setScormData((prev) => ({ ...prev, location: String(value) }));
          const num = Number(value);
          if (!Number.isNaN(num)) setProgress(Math.max(0, Math.min(100, num)));
        }
        if (name === 'cmi.core.score.raw') {
          const num = Number(value);
          if (!Number.isNaN(num)) setScormData((prev) => ({ ...prev, score: num }));
        }
        if (name === 'cmi.core.lesson_status') {
          setScormData((prev) => ({ ...prev, lessonStatus: String(value) }));
          if (String(value).toLowerCase() === 'completed') {
            setProgress(100);
            onComplete && onComplete({
              packageId: packageData?.id,
              score: Number(lms.values['cmi.core.score.raw']) || 0,
              completed: true,
              sessionTime: scormData.sessionTime
            });
          }
        }
        return 'true';
      },
      LMSCommit: () => {
        try {
          const payload = {
            status: lms.values['cmi.core.lesson_status'],
            score: lms.values['cmi.core.score.raw'],
            location: lms.values['cmi.core.lesson_location'],
            totalTime: lms.values['cmi.core.total_time']
          };
          localStorage.setItem(`scorm_session_${packageData?.id}`, JSON.stringify(payload));
        } catch {}
        return 'true';
      }
    };
    window.API = API;
    return () => { try { delete window.API; } catch {} };
  }, [onComplete, packageData, scormData.sessionTime]);

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
            <div className="h-full">
              <iframe
                ref={iframeRef}
                title="SCORM Content"
                srcDoc={iframeContent}
                className="w-full h-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
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
