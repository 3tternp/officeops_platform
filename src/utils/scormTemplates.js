/**
 * SCORM Template Configurations
 * Pre-built templates with different layouts and styling options for automatic package generation
 */

export const SCORM_TEMPLATE_CONFIGS = {
  basic: {
    name: 'Basic Course',
    description: 'Simple text-based course with navigation',
    features: ['Text content', 'Basic navigation', 'Progress tracking', 'Completion status'],
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#f8fafc',
      text: '#1f2937'
    },
    layout: 'single-column',
    navigation: 'linear'
  },
  
  video_based: {
    name: 'Video Course',
    description: 'Video-focused learning experience',
    features: ['Video player', 'Transcript support', 'Video chapters', 'Interactive elements'],
    colors: {
      primary: '#dc2626',
      secondary: '#6b7280',
      background: '#000000',
      text: '#ffffff'
    },
    layout: 'video-centric',
    navigation: 'video-chapters'
  },
  
  document_based: {
    name: 'Document Course',
    description: 'PDF and document-based learning',
    features: ['Document viewer', 'PDF support', 'Reading progress', 'Note taking'],
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      background: '#ffffff',
      text: '#374151'
    },
    layout: 'document-reader',
    navigation: 'page-based'
  },
  
  interactive: {
    name: 'Interactive Course',
    description: 'Mixed media with interactive elements',
    features: ['Interactive widgets', 'Drag & drop', 'Animations', 'Multimedia'],
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      background: '#f3f4f6',
      text: '#111827'
    },
    layout: 'interactive-grid',
    navigation: 'non-linear'
  },
  
  assessment: {
    name: 'Assessment Course',
    description: 'Quiz and assessment focused',
    features: ['Quiz engine', 'Multiple question types', 'Scoring system', 'Feedback'],
    colors: {
      primary: '#ea580c',
      secondary: '#fb923c',
      background: '#fff7ed',
      text: '#9a3412'
    },
    layout: 'assessment-focused',
    navigation: 'quiz-flow'
  }
};

export const SCORM_ASSETS = {
  icons: {
    play: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>`,
    next: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>`,
    prev: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>`
  },
  
  styles: {
    basic: `
      :root {
        --primary-color: #3b82f6;
        --secondary-color: #64748b;
        --background-color: #f8fafc;
        --text-color: #1f2937;
        --border-color: #e2e8f0;
        --success-color: #10b981;
        --error-color: #ef4444;
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--background-color);
        color: var(--text-color);
        line-height: 1.6;
      }
      
      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .header {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .content {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin-bottom: 24px;
      }
      
      .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
        margin: 16px 0;
      }
      
      .progress-fill {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s ease;
        border-radius: 4px;
      }
      
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }
      
      .btn-primary {
        background: var(--primary-color);
        color: white;
      }
      
      .btn-primary:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }
      
      .btn-secondary {
        background: var(--border-color);
        color: var(--text-color);
      }
      
      .btn-secondary:hover {
        background: #cbd5e1;
      }
      
      .nav-buttons {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        border-top: 1px solid var(--border-color);
      }
      
      @media (max-width: 768px) {
        .container {
          padding: 12px;
        }
        
        .header,
        .content {
          padding: 16px;
        }
        
        .nav-buttons {
          flex-direction: column;
          gap: 12px;
        }
        
        .btn {
          width: 100%;
        }
      }
    `,
    
    video_based: `
      :root {
        --primary-color: #dc2626;
        --secondary-color: #6b7280;
        --background-color: #000000;
        --text-color: #ffffff;
        --border-color: #374151;
      }
      
      body {
        background: var(--background-color);
        color: var(--text-color);
      }
      
      .video-container {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;
        background: #1a1a1a;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .video-player {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .video-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.8));
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .play-button {
        background: var(--primary-color);
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .play-button:hover {
        background: #b91c1c;
        transform: scale(1.05);
      }
    `,
    
    document_based: `
      :root {
        --primary-color: #059669;
        --secondary-color: #6b7280;
        --background-color: #ffffff;
        --text-color: #374151;
        --border-color: #d1d5db;
      }
      
      .document-viewer {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        background: white;
      }
      
      .document-toolbar {
        background: #f9fafb;
        border-bottom: 1px solid var(--border-color);
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .page-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .page-input {
        width: 60px;
        padding: 4px 8px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        text-align: center;
      }
      
      .zoom-controls {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    `,
    
    interactive: `
      :root {
        --primary-color: #7c3aed;
        --secondary-color: #8b5cf6;
        --background-color: #f3f4f6;
        --text-color: #111827;
        --border-color: #d1d5db;
        --accent-color: #a855f7;
      }
      
      .interactive-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin: 24px 0;
      }
      
      .interactive-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .interactive-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        border-color: var(--primary-color);
      }
      
      .interactive-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .interactive-card:hover::before {
        transform: translateX(0);
      }
      
      .drag-drop-zone {
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        transition: all 0.3s ease;
      }
      
      .drag-drop-zone.drag-over {
        border-color: var(--primary-color);
        background: rgba(124, 58, 237, 0.05);
      }
    `,
    
    assessment: `
      :root {
        --primary-color: #ea580c;
        --secondary-color: #fb923c;
        --background-color: #fff7ed;
        --text-color: #9a3412;
        --border-color: #fed7aa;
        --success-color: #16a34a;
        --error-color: #dc2626;
      }
      
      .quiz-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        overflow: hidden;
      }
      
      .quiz-header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 24px;
        text-align: center;
      }
      
      .quiz-content {
        padding: 24px;
      }
      
      .question {
        margin-bottom: 32px;
        padding: 20px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: #fefcf9;
      }
      
      .question-number {
        background: var(--primary-color);
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-bottom: 12px;
      }
      
      .question-text {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 16px;
        line-height: 1.6;
      }
      
      .answers {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .answer-option {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: white;
      }
      
      .answer-option:hover {
        background: #fef3e2;
        border-color: var(--primary-color);
      }
      
      .answer-option.selected {
        background: #fef3e2;
        border-color: var(--primary-color);
        border-width: 2px;
      }
      
      .answer-option.correct {
        background: #dcfce7;
        border-color: var(--success-color);
      }
      
      .answer-option.incorrect {
        background: #fef2f2;
        border-color: var(--error-color);
      }
      
      .quiz-results {
        background: white;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        margin-top: 24px;
        border: 1px solid var(--border-color);
      }
      
      .score-display {
        font-size: 48px;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 16px;
      }
      
      .feedback {
        padding: 16px;
        border-radius: 8px;
        margin-top: 16px;
      }
      
      .feedback.pass {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #22c55e;
      }
      
      .feedback.fail {
        background: #fef2f2;
        color: #991b1b;
        border: 1px solid #ef4444;
      }
    `
  },
  
  javascript: {
    basic: `
      // Basic template JavaScript functionality
      let currentSlide = 0;
      let totalSlides = 0;
      let courseProgress = 0;
      
      function initializeCourse() {
        totalSlides = document.querySelectorAll('.slide').length;
        if (totalSlides === 0) totalSlides = 1;
        updateProgress();
        updateNavigation();
      }
      
      function nextSlide() {
        if (currentSlide < totalSlides - 1) {
          currentSlide++;
          showSlide(currentSlide);
          updateProgress();
          updateNavigation();
        } else {
          completeCourse();
        }
      }
      
      function previousSlide() {
        if (currentSlide > 0) {
          currentSlide--;
          showSlide(currentSlide);
          updateProgress();
          updateNavigation();
        }
      }
      
      function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? 'block' : 'none';
        });
      }
      
      function updateProgress() {
        const progress = Math.round(((currentSlide + 1) / totalSlides) * 100);
        courseProgress = progress;
        
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
        
        if (progressText) {
          progressText.textContent = progress + '%';
        }
        
        // Update SCORM progress
        if (typeof scormAPI !== 'undefined') {
          scormAPI.setProgress(progress);
        }
      }
      
      function updateNavigation() {
        const prevBtn = document.querySelector('.btn-previous');
        const nextBtn = document.querySelector('.btn-next');
        const completeBtn = document.querySelector('.btn-complete');
        
        if (prevBtn) {
          prevBtn.disabled = currentSlide === 0;
          prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        }
        
        if (nextBtn && completeBtn) {
          if (currentSlide >= totalSlides - 1) {
            nextBtn.style.display = 'none';
            completeBtn.style.display = 'inline-flex';
          } else {
            nextBtn.style.display = 'inline-flex';
            completeBtn.style.display = 'none';
          }
        }
      }
      
      function completeCourse() {
        courseProgress = 100;
        
        // Update SCORM completion
        if (typeof scormAPI !== 'undefined') {
          scormAPI.setComplete();
          scormAPI.setProgress(100);
        }
        
        // Show completion message
        const contentArea = document.querySelector('.content');
        if (contentArea) {
          contentArea.innerHTML = \`
            <div style="text-align: center; padding: 60px 40px;">
              <div style="font-size: 64px; color: var(--success-color); margin-bottom: 24px;">✓</div>
              <h2 style="color: var(--text-color); margin-bottom: 12px; font-size: 24px;">Course Completed!</h2>
              <p style="color: var(--secondary-color); font-size: 16px;">
                Congratulations! You have successfully completed this course.
              </p>
            </div>
          \`;
        }
        
        // Hide navigation
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
          navButtons.style.display = 'none';
        }
      }
      
      // Initialize when DOM is ready
      document.addEventListener('DOMContentLoaded', function() {
        initializeCourse();
        
        // Bind navigation events
        const prevBtn = document.querySelector('.btn-previous');
        const nextBtn = document.querySelector('.btn-next');
        const completeBtn = document.querySelector('.btn-complete');
        
        if (prevBtn) prevBtn.addEventListener('click', previousSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (completeBtn) completeBtn.addEventListener('click', completeCourse);
      });
    `,
    
    video_based: `
      // Video-based template functionality
      let videoPlayer = null;
      let videoDuration = 0;
      let videoProgress = 0;
      let videoCompleted = false;
      
      function initializeVideo() {
        videoPlayer = document.querySelector('video');
        if (videoPlayer) {
          videoPlayer.addEventListener('loadedmetadata', function() {
            videoDuration = videoPlayer.duration;
          });
          
          videoPlayer.addEventListener('timeupdate', function() {
            const progress = (videoPlayer.currentTime / videoDuration) * 100;
            videoProgress = progress;
            updateVideoProgress(progress);
            
            // Mark as completed when 90% watched
            if (progress >= 90 && !videoCompleted) {
              videoCompleted = true;
              enableCompletion();
            }
          });
          
          videoPlayer.addEventListener('ended', function() {
            videoCompleted = true;
            enableCompletion();
          });
        }
      }
      
      function updateVideoProgress(progress) {
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
        
        // Update SCORM progress
        if (typeof scormAPI !== 'undefined') {
          scormAPI.setProgress(Math.round(progress));
        }
      }
      
      function enableCompletion() {
        const completeBtn = document.querySelector('.btn-complete');
        if (completeBtn) {
          completeBtn.disabled = false;
          completeBtn.style.opacity = '1';
        }
      }
      
      function toggleVideo() {
        if (videoPlayer) {
          if (videoPlayer.paused) {
            videoPlayer.play();
          } else {
            videoPlayer.pause();
          }
        }
      }
      
      document.addEventListener('DOMContentLoaded', function() {
        initializeVideo();
        
        const playButton = document.querySelector('.play-button');
        if (playButton) {
          playButton.addEventListener('click', toggleVideo);
        }
      });
    `,
    
    assessment: `
      // Assessment template functionality
      let questions = [];
      let currentQuestion = 0;
      let userAnswers = {};
      let quizCompleted = false;
      let finalScore = 0;
      
      function initializeQuiz() {
        questions = Array.from(document.querySelectorAll('.question'));
        
        questions.forEach((question, index) => {
          const options = question.querySelectorAll('.answer-option');
          options.forEach(option => {
            option.addEventListener('click', () => selectAnswer(index, option));
          });
        });
        
        showQuestion(0);
      }
      
      function selectAnswer(questionIndex, selectedOption) {
        const question = questions[questionIndex];
        const options = question.querySelectorAll('.answer-option');
        
        // Clear previous selections
        options.forEach(option => option.classList.remove('selected'));
        
        // Mark selected answer
        selectedOption.classList.add('selected');
        userAnswers[questionIndex] = selectedOption.dataset.value;
        
        // Enable next button
        const nextBtn = document.querySelector('.btn-next');
        if (nextBtn) {
          nextBtn.disabled = false;
        }
      }
      
      function showQuestion(index) {
        questions.forEach((question, i) => {
          question.style.display = i === index ? 'block' : 'none';
        });
        
        currentQuestion = index;
        updateQuizProgress();
      }
      
      function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
          currentQuestion++;
          showQuestion(currentQuestion);
        } else {
          submitQuiz();
        }
      }
      
      function updateQuizProgress() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        const progressBar = document.querySelector('.progress-fill');
        
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
        
        // Update question counter
        const counter = document.querySelector('.question-counter');
        if (counter) {
          counter.textContent = \`Question \${currentQuestion + 1} of \${questions.length}\`;
        }
        
        // Update navigation
        const nextBtn = document.querySelector('.btn-next');
        const submitBtn = document.querySelector('.btn-submit');
        
        if (currentQuestion >= questions.length - 1) {
          if (nextBtn) nextBtn.style.display = 'none';
          if (submitBtn) submitBtn.style.display = 'inline-flex';
        }
      }
      
      function submitQuiz() {
        let correctAnswers = 0;
        
        questions.forEach((question, index) => {
          const correctOption = question.querySelector('[data-correct="true"]');
          const userAnswer = userAnswers[index];
          const selectedOption = question.querySelector(\`[data-value="\${userAnswer}"]\`);
          
          if (correctOption && selectedOption) {
            if (correctOption === selectedOption) {
              correctAnswers++;
              selectedOption.classList.add('correct');
            } else {
              selectedOption.classList.add('incorrect');
              correctOption.classList.add('correct');
            }
          }
        });
        
        finalScore = Math.round((correctAnswers / questions.length) * 100);
        const passed = finalScore >= 80; // Default passing score
        
        showResults(finalScore, passed, correctAnswers, questions.length);
        
        // Update SCORM
        if (typeof scormAPI !== 'undefined') {
          scormAPI.setValue('cmi.core.score.raw', finalScore.toString());
          scormAPI.setValue('cmi.core.lesson_status', passed ? 'passed' : 'failed');
          scormAPI.setProgress(100);
        }
        
        quizCompleted = true;
      }
      
      function showResults(score, passed, correct, total) {
        const resultsHTML = \`
          <div class="quiz-results">
            <div class="score-display">\${score}%</div>
            <h3>Quiz \${passed ? 'Passed' : 'Failed'}</h3>
            <p>You answered \${correct} out of \${total} questions correctly.</p>
            <div class="feedback \${passed ? 'pass' : 'fail'}">
              \${passed ? 
                'Congratulations! You have successfully completed this assessment.' :
                'Please review the material and try again. You need 80% to pass.'
              }
            </div>
          </div>
        \`;
        
        const contentArea = document.querySelector('.quiz-content');
        if (contentArea) {
          contentArea.innerHTML = resultsHTML;
        }
        
        // Hide navigation
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
          navButtons.innerHTML = passed ? 
            '<button class="btn btn-primary" onclick="completeCourse()">Complete Course</button>' :
            '<button class="btn btn-secondary" onclick="retakeQuiz()">Retake Quiz</button>';
        }
      }
      
      function retakeQuiz() {
        // Reset quiz state
        currentQuestion = 0;
        userAnswers = {};
        quizCompleted = false;
        finalScore = 0;
        
        // Reset question display
        questions.forEach(question => {
          const options = question.querySelectorAll('.answer-option');
          options.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
          });
        });
        
        // Reinitialize
        initializeQuiz();
      }
      
      document.addEventListener('DOMContentLoaded', function() {
        initializeQuiz();
        
        const nextBtn = document.querySelector('.btn-next');
        const submitBtn = document.querySelector('.btn-submit');
        
        if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
        if (submitBtn) submitBtn.addEventListener('click', submitQuiz);
      });
    `
  }
};

export const generateTemplateAssets = (templateType) => {
  const config = SCORM_TEMPLATE_CONFIGS[templateType];
  if (!config) return null;
  
  return {
    config,
    css: SCORM_ASSETS.styles[templateType],
    javascript: SCORM_ASSETS.javascript[templateType],
    icons: SCORM_ASSETS.icons
  };
};

export const getAvailableTemplates = () => {
  return Object.keys(SCORM_TEMPLATE_CONFIGS).map(key => ({
    value: key,
    label: SCORM_TEMPLATE_CONFIGS[key].name,
    description: SCORM_TEMPLATE_CONFIGS[key].description,
    features: SCORM_TEMPLATE_CONFIGS[key].features
  }));
};

export default {
  SCORM_TEMPLATE_CONFIGS,
  SCORM_ASSETS,
  generateTemplateAssets,
  getAvailableTemplates
};
