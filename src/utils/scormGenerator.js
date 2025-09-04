/**
 * SCORM Package Generator
 * Automatically generates SCORM 1.2 and SCORM 2004 compliant packages from course materials
 */

import JSZip from 'jszip';

// SCORM version constants
export const SCORM_VERSIONS = {
  SCORM_12: 'scorm_12',
  SCORM_2004: 'scorm_2004'
};

// SCORM template types
export const SCORM_TEMPLATES = {
  BASIC: 'basic',
  INTERACTIVE: 'interactive',
  VIDEO_BASED: 'video_based',
  DOCUMENT_BASED: 'document_based',
  ASSESSMENT: 'assessment'
};

/**
 * Generates SCORM manifest (imsmanifest.xml) for SCORM 1.2
 */
const generateSCORM12Manifest = (courseData, resources) => {
  const manifestId = `course_${courseData.id}_${Date.now()}`;
  const organizationId = `org_${courseData.id}`;
  const itemId = `item_${courseData.id}`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${manifestId}" version="1.0" 
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" 
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd 
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd 
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  
  <organizations default="${organizationId}">
    <organization identifier="${organizationId}">
      <title>${courseData.title}</title>
      <item identifier="${itemId}" identifierref="resource_1">
        <title>${courseData.title}</title>
        <adlcp:masteryscore>${courseData.passingScore || 80}</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      ${resources.map(resource => `<file href="${resource}" />`).join('\n      ')}
    </resource>
  </resources>
</manifest>`;
};

/**
 * Generates SCORM manifest (imsmanifest.xml) for SCORM 2004
 */
const generateSCORM2004Manifest = (courseData, resources) => {
  const manifestId = `course_${courseData.id}_${Date.now()}`;
  const organizationId = `org_${courseData.id}`;
  const itemId = `item_${courseData.id}`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${manifestId}" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd 
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd 
                              http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd 
                              http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd 
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>

  <organizations default="${organizationId}">
    <organization identifier="${organizationId}">
      <title>${courseData.title}</title>
      <item identifier="${itemId}" identifierref="resource_1">
        <title>${courseData.title}</title>
        <adlcp:masteryscore>${courseData.passingScore || 80}</adlcp:masteryscore>
        <imsss:sequencing>
          <imsss:controlMode choice="true" choiceExit="true" flow="true" forwardOnly="false"/>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormType="sco" href="index.html">
      ${resources.map(resource => `<file href="${resource}" />`).join('\n      ')}
    </resource>
  </resources>
</manifest>`;
};

/**
 * Generates the main HTML entry point for SCORM package
 */
const generateSCORMHTML = (courseData, template = SCORM_TEMPLATES.BASIC) => {
  const templateContent = getSCORMTemplate(template, courseData);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseData.title}</title>
    <script src="scorm_api_wrapper.js"></script>
    <link rel="stylesheet" href="styles/course.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }
        .course-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .course-header {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .course-content {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin: 16px 0;
        }
        .progress-fill {
            height: 100%;
            background: #3b82f6;
            width: 0%;
            transition: width 0.3s ease;
        }
        .nav-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        .btn-primary:hover {
            background: #2563eb;
        }
        .btn-secondary {
            background: #e2e8f0;
            color: #64748b;
        }
        .btn-secondary:hover {
            background: #cbd5e1;
        }
    </style>
</head>
<body>
    <div class="course-container">
        <div class="course-header">
            <h1>${courseData.title}</h1>
            <p>${courseData.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" id="progressBar"></div>
            </div>
            <p id="progressText">Progress: 0%</p>
        </div>
        
        <div class="course-content" id="courseContent">
            ${templateContent}
        </div>
        
        <div class="nav-buttons">
            <button class="btn btn-secondary" id="prevBtn" onclick="previousSection()" disabled>
                Previous
            </button>
            <button class="btn btn-primary" id="nextBtn" onclick="nextSection()">
                Next
            </button>
            <button class="btn btn-primary" id="completeBtn" onclick="completeCourse()" style="display: none;">
                Complete Course
            </button>
        </div>
    </div>

    <script src="course_logic.js"></script>
</body>
</html>`;
};

/**
 * Generates SCORM API wrapper JavaScript
 */
const generateSCORMAPIWrapper = (version = SCORM_VERSIONS.SCORM_12) => {
  return `/**
 * SCORM API Wrapper
 * Compatible with ${version === SCORM_VERSIONS.SCORM_12 ? 'SCORM 1.2' : 'SCORM 2004'}
 */

var scormAPI = {
    isInitialized: false,
    apiHandle: null,
    
    // Find the SCORM API
    findAPI: function(win) {
        var findAttempts = 0;
        while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
            findAttempts++;
            if (findAttempts > 7) {
                return null;
            }
            win = win.parent;
        }
        return win.API;
    },
    
    // Initialize SCORM session
    initialize: function() {
        if (this.isInitialized) return true;
        
        this.apiHandle = this.findAPI(window);
        if (this.apiHandle == null) {
            console.warn('SCORM API not found - running in standalone mode');
            return false;
        }
        
        var result = this.apiHandle.LMSInitialize('');
        if (result === 'true') {
            this.isInitialized = true;
            this.setValue('cmi.core.lesson_status', 'incomplete');
            this.commit();
        }
        return result === 'true';
    },
    
    // Set a value in the LMS
    setValue: function(name, value) {
        if (!this.apiHandle) return false;
        return this.apiHandle.LMSSetValue(name, value) === 'true';
    },
    
    // Get a value from the LMS
    getValue: function(name) {
        if (!this.apiHandle) return '';
        return this.apiHandle.LMSGetValue(name);
    },
    
    // Commit data to LMS
    commit: function() {
        if (!this.apiHandle) return false;
        return this.apiHandle.LMSCommit('') === 'true';
    },
    
    // Set completion status
    setComplete: function() {
        this.setValue('cmi.core.lesson_status', 'completed');
        this.setValue('cmi.core.exit', 'normal');
        this.commit();
    },
    
    // Set progress
    setProgress: function(progress) {
        this.setValue('cmi.core.lesson_location', progress.toString());
        this.setValue('cmi.core.score.raw', progress.toString());
        this.commit();
    },
    
    // Terminate SCORM session
    terminate: function() {
        if (!this.apiHandle || !this.isInitialized) return false;
        var result = this.apiHandle.LMSFinish('');
        this.isInitialized = false;
        return result === 'true';
    }
};

// Auto-initialize when page loads
window.addEventListener('load', function() {
    scormAPI.initialize();
});

// Auto-terminate when page unloads
window.addEventListener('beforeunload', function() {
    scormAPI.terminate();
});`;
};

/**
 * Generates course logic JavaScript
 */
const generateCourseLogic = (courseData) => {
  return `/**
 * Course Logic and Navigation
 * Handles course flow, progress tracking, and SCORM communication
 */

let currentSection = 0;
let totalSections = 0;
let courseProgress = 0;
let courseCompleted = false;

// Course data
const courseConfig = ${JSON.stringify(courseData, null, 2)};

// Initialize course
function initializeCourse() {
    totalSections = document.querySelectorAll('.course-section').length || 1;
    updateProgress();
    updateNavigationButtons();
    
    // Load previous progress if available
    const savedProgress = scormAPI.getValue('cmi.core.lesson_location');
    if (savedProgress) {
        currentSection = parseInt(savedProgress) || 0;
        showSection(currentSection);
        updateProgress();
    } else {
        showSection(0);
    }
}

// Show specific section
function showSection(sectionIndex) {
    const sections = document.querySelectorAll('.course-section');
    sections.forEach((section, index) => {
        section.style.display = index === sectionIndex ? 'block' : 'none';
    });
    
    currentSection = sectionIndex;
    updateProgress();
    updateNavigationButtons();
    
    // Track section view
    scormAPI.setValue('cmi.core.lesson_location', currentSection.toString());
    scormAPI.commit();
}

// Navigate to next section
function nextSection() {
    if (currentSection < totalSections - 1) {
        currentSection++;
        showSection(currentSection);
    } else {
        // Course completed
        courseCompleted = true;
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('completeBtn').style.display = 'inline-block';
    }
}

// Navigate to previous section
function previousSection() {
    if (currentSection > 0) {
        currentSection--;
        showSection(currentSection);
    }
}

// Update progress bar and text
function updateProgress() {
    const progress = Math.round(((currentSection + 1) / totalSections) * 100);
    courseProgress = progress;
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    if (progressText) {
        progressText.textContent = \`Progress: \${progress}%\`;
    }
    
    // Update SCORM progress
    scormAPI.setProgress(progress);
}

// Update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSection === 0;
    }
    
    if (nextBtn) {
        nextBtn.style.display = currentSection >= totalSections - 1 ? 'none' : 'inline-block';
    }
}

// Complete the course
function completeCourse() {
    courseProgress = 100;
    courseCompleted = true;
    
    // Update SCORM completion
    scormAPI.setComplete();
    scormAPI.setProgress(100);
    
    // Show completion message
    const courseContent = document.getElementById('courseContent');
    if (courseContent) {
        courseContent.innerHTML = \`
            <div class="completion-message" style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; color: #10b981; margin-bottom: 16px;">✓</div>
                <h2 style="color: #1f2937; margin-bottom: 8px;">Course Completed!</h2>
                <p style="color: #6b7280; margin-bottom: 24px;">
                    Congratulations! You have successfully completed "\${courseConfig.title}".
                </p>
                \${courseConfig.certificateEnabled ? 
                    '<p style="color: #3b82f6;">Your certificate will be generated and sent to you shortly.</p>' : 
                    ''
                }
            </div>
        \`;
    }
    
    // Hide navigation buttons
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('completeBtn').style.display = 'none';
}

// Quiz functionality
function submitQuiz(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;
    
    const questions = quiz.querySelectorAll('.quiz-question');
    let correct = 0;
    let total = questions.length;
    
    questions.forEach((question, index) => {
        const selectedAnswer = question.querySelector('input[type="radio"]:checked');
        const correctAnswer = question.querySelector('input[data-correct="true"]');
        
        if (selectedAnswer && selectedAnswer === correctAnswer) {
            correct++;
        }
    });
    
    const score = Math.round((correct / total) * 100);
    const passed = score >= (courseConfig.passingScore || 80);
    
    // Update SCORM score
    scormAPI.setValue('cmi.core.score.raw', score.toString());
    scormAPI.setValue('cmi.core.score.max', '100');
    scormAPI.setValue('cmi.core.score.min', '0');
    scormAPI.setValue('cmi.core.lesson_status', passed ? 'passed' : 'failed');
    scormAPI.commit();
    
    // Show results
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'quiz-results';
    resultsDiv.innerHTML = \`
        <div style="background: \${passed ? '#dcfce7' : '#fef2f2'}; border: 1px solid \${passed ? '#16a34a' : '#dc2626'}; 
                    border-radius: 8px; padding: 16px; margin-top: 16px;">
            <h4 style="margin: 0 0 8px 0; color: \${passed ? '#166534' : '#991b1b'};">
                Quiz \${passed ? 'Passed' : 'Failed'}
            </h4>
            <p style="margin: 0; color: \${passed ? '#166534' : '#991b1b'};">
                Score: \${correct}/\${total} (\${score}%)
            </p>
            \${!passed ? \`<p style="margin: 8px 0 0 0; color: #991b1b;">
                Minimum passing score: \${courseConfig.passingScore || 80}%
            </p>\` : ''}
        </div>
    \`;
    
    quiz.appendChild(resultsDiv);
    
    return passed;
}

// Initialize course when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCourse();
});`;
};

/**
 * Gets SCORM template content based on type
 */
const getSCORMTemplate = (template, courseData) => {
  switch (template) {
    case SCORM_TEMPLATES.VIDEO_BASED:
      return `
        <div class="course-section" id="section-0">
            <h2>Welcome to ${courseData.title}</h2>
            <p>${courseData.description}</p>
            <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                <video controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                    <source src="content/video.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
      `;
      
    case SCORM_TEMPLATES.DOCUMENT_BASED:
      return `
        <div class="course-section" id="section-0">
            <h2>${courseData.title}</h2>
            <p>${courseData.description}</p>
            <div class="document-viewer">
                <iframe src="content/document.pdf" width="100%" height="600px" style="border: none;">
                    <p>Your browser does not support PDF viewing. <a href="content/document.pdf">Download the PDF</a></p>
                </iframe>
            </div>
        </div>
      `;
      
    case SCORM_TEMPLATES.ASSESSMENT:
      return `
        <div class="course-section" id="section-0">
            <h2>${courseData.title} - Assessment</h2>
            <p>${courseData.description}</p>
            <div class="quiz-container" id="mainQuiz">
                <div class="quiz-question" style="margin-bottom: 24px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h4>Sample Question 1</h4>
                    <p>What is the primary purpose of this training?</p>
                    <div style="margin-top: 12px;">
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="q1" value="a"> Option A
                        </label>
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="q1" value="b" data-correct="true"> Correct Answer
                        </label>
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="q1" value="c"> Option C
                        </label>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="submitQuiz('mainQuiz')" style="margin-top: 16px;">
                    Submit Quiz
                </button>
            </div>
        </div>
      `;
      
    case SCORM_TEMPLATES.INTERACTIVE:
      return `
        <div class="course-section" id="section-0">
            <h2>${courseData.title}</h2>
            <p>${courseData.description}</p>
            <div class="interactive-content">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-top: 24px;">
                    <div class="content-card" style="background: #f1f5f9; padding: 20px; border-radius: 8px; cursor: pointer;" onclick="showContentModal('Learning Objectives')">
                        <h4>📚 Learning Objectives</h4>
                        <p>Understand the key goals and outcomes</p>
                    </div>
                    <div class="content-card" style="background: #f1f5f9; padding: 20px; border-radius: 8px; cursor: pointer;" onclick="showContentModal('Key Concepts')">
                        <h4>💡 Key Concepts</h4>
                        <p>Explore fundamental principles</p>
                    </div>
                    <div class="content-card" style="background: #f1f5f9; padding: 20px; border-radius: 8px; cursor: pointer;" onclick="showContentModal('Practical Examples')">
                        <h4>⚡ Practical Examples</h4>
                        <p>See real-world applications</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        function showContentModal(title) {
            alert('Opening: ' + title + '\\n\\nThis would show detailed content in a real implementation.');
        }
        </script>
      `;
      
    default: // BASIC template
      return `
        <div class="course-section" id="section-0">
            <h2>Welcome to ${courseData.title}</h2>
            <p>${courseData.description}</p>
            <div class="content-block" style="margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
                <h3>Course Overview</h3>
                <ul style="margin: 12px 0; padding-left: 20px;">
                    <li>Duration: ${courseData.duration || 'Self-paced'}</li>
                    <li>Difficulty: ${courseData.difficulty || 'Beginner'}</li>
                    <li>Certificate: ${courseData.certificateEnabled ? 'Yes' : 'No'}</li>
                </ul>
            </div>
        </div>
        
        <div class="course-section" id="section-1" style="display: none;">
            <h2>Course Content</h2>
            <p>This section contains the main course materials and learning content.</p>
            <div class="content-placeholder" style="background: #f1f5f9; padding: 40px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <p style="color: #64748b; font-size: 18px;">📚 Course content will be displayed here</p>
                <p style="color: #94a3b8; margin-top: 8px;">Videos, documents, and interactive materials</p>
            </div>
        </div>
        
        <div class="course-section" id="section-2" style="display: none;">
            <h2>Knowledge Check</h2>
            <p>Test your understanding of the material covered in this course.</p>
            <div class="quiz-container" id="finalQuiz" style="margin-top: 24px;">
                <div class="quiz-question" style="margin-bottom: 24px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h4>Knowledge Check Question</h4>
                    <p>Based on the course material, which statement is most accurate?</p>
                    <div style="margin-top: 12px;">
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="final_q" value="a"> This is a sample option
                        </label>
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="final_q" value="b" data-correct="true"> This is the correct answer
                        </label>
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="final_q" value="c"> This is another option
                        </label>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="submitQuiz('finalQuiz')" style="margin-top: 16px;">
                    Submit Assessment
                </button>
            </div>
        </div>
      `;
  }
};

/**
 * Generates CSS styles for SCORM package
 */
const generateSCORMCSS = () => {
  return `/* SCORM Course Styles */

:root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --success-color: #10b981;
    --error-color: #ef4444;
    --warning-color: #f59e0b;
    --background: #f8fafc;
    --card-background: #ffffff;
    --border-color: #e2e8f0;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
}

* {
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--background);
    margin: 0;
    padding: 0;
}

.course-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
}

.course-header {
    background: var(--card-background);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
}

.course-header h1 {
    margin: 0 0 12px 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
}

.course-header p {
    margin: 0 0 16px 0;
    color: var(--text-secondary);
    font-size: 16px;
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
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 4px;
}

#progressText {
    margin: 8px 0 0 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
}

.course-content {
    background: var(--card-background);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    min-height: 400px;
}

.course-section {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.course-section h2 {
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
}

.course-section h3 {
    margin: 20px 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.course-section p {
    margin: 0 0 16px 0;
    color: var(--text-secondary);
    line-height: 1.7;
}

.content-block {
    margin: 24px 0;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.content-card {
    background: #f1f5f9;
    padding: 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--border-color);
}

.content-card:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-card h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.content-card p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
}

.video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    margin: 20px 0;
}

.video-container video,
.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

.document-viewer {
    margin: 20px 0;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
}

.quiz-container {
    margin: 24px 0;
}

.quiz-question {
    margin-bottom: 24px;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--card-background);
}

.quiz-question h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.quiz-question p {
    margin: 0 0 16px 0;
    color: var(--text-secondary);
}

.quiz-question label {
    display: block;
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.quiz-question label:hover {
    background: #f1f5f9;
}

.quiz-question input[type="radio"] {
    margin-right: 8px;
    accent-color: var(--primary-color);
}

.quiz-results {
    margin-top: 16px;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.nav-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--border-color);
    gap: 12px;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.btn-secondary {
    background: var(--border-color);
    color: var(--text-secondary);
}

.btn-secondary:hover:not(:disabled) {
    background: #cbd5e1;
}

.completion-message {
    text-align: center;
    padding: 60px 40px;
}

.completion-message h2 {
    margin: 0 0 12px 0;
    font-size: 24px;
    font-weight: 700;
}

.completion-message p {
    margin: 0 0 24px 0;
    font-size: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .course-container {
        padding: 12px;
    }
    
    .course-header,
    .course-content {
        padding: 16px;
    }
    
    .nav-buttons {
        flex-direction: column;
        gap: 8px;
    }
    
    .btn {
        width: 100%;
    }
}

/* Print Styles */
@media print {
    .nav-buttons,
    .progress-bar,
    #progressText {
        display: none;
    }
    
    .course-container {
        max-width: none;
        padding: 0;
    }
    
    .course-header,
    .course-content {
        box-shadow: none;
        border: 1px solid #ccc;
    }
}`;
};

/**
 * Main SCORM package generation function
 */
export const generateSCORMPackage = async (courseData, materials = [], options = {}) => {
  const {
    version = SCORM_VERSIONS.SCORM_12,
    template = SCORM_TEMPLATES.BASIC,
    includeQuiz = true,
    customCSS = '',
    customJS = ''
  } = options;

  try {
    const zip = new JSZip();
    
    // Create resource list for manifest
    const resources = ['index.html', 'scorm_api_wrapper.js', 'course_logic.js', 'styles/course.css'];
    
    // Add materials to resources
    materials.forEach((material, index) => {
      const fileName = `content/${material.name || `material_${index}`}`;
      resources.push(fileName);
    });

    // Generate manifest
    const manifest = version === SCORM_VERSIONS.SCORM_12 
      ? generateSCORM12Manifest(courseData, resources)
      : generateSCORM2004Manifest(courseData, resources);
    
    // Add manifest to package
    zip.file('imsmanifest.xml', manifest);
    
    // Add main HTML file
    const htmlContent = generateSCORMHTML(courseData, template);
    zip.file('index.html', htmlContent);
    
    // Add JavaScript files
    zip.file('scorm_api_wrapper.js', generateSCORMAPIWrapper(version));
    zip.file('course_logic.js', generateCourseLogic(courseData));
    
    // Add CSS styles
    const stylesFolder = zip.folder('styles');
    stylesFolder.file('course.css', generateSCORMCSS() + '\n\n' + customCSS);
    
    // Add course materials
    const contentFolder = zip.folder('content');
    for (let i = 0; i < materials.length; i++) {
      const material = materials[i];
      if (material.file) {
        contentFolder.file(material.name || `material_${i}`, material.file);
      }
    }
    
    // Add metadata file
    const metadata = {
      course: {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        version: courseData.version || '1.0',
        created: new Date().toISOString(),
        scormVersion: version,
        template: template
      },
      generator: {
        name: 'OfficeOps SCORM Generator',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    };
    
    zip.file('course_metadata.json', JSON.stringify(metadata, null, 2));
    
    // Generate the package
    const packageBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    
    return {
      success: true,
      package: packageBlob,
      metadata: metadata,
      filename: `${courseData.title.replace(/[^a-zA-Z0-9]/g, '_')}_SCORM_${version}.zip`
    };
    
  } catch (error) {
    console.error('SCORM package generation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Validates course data for SCORM generation
 */
export const validateCourseForSCORM = (courseData) => {
  const errors = [];
  
  if (!courseData.title || courseData.title.trim().length === 0) {
    errors.push('Course title is required');
  }
  
  if (!courseData.description || courseData.description.trim().length === 0) {
    errors.push('Course description is required');
  }
  
  if (!courseData.id) {
    errors.push('Course ID is required');
  }
  
  if (courseData.passingScore && (courseData.passingScore < 0 || courseData.passingScore > 100)) {
    errors.push('Passing score must be between 0 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Extracts SCORM package information
 */
export const extractSCORMInfo = async (packageFile) => {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(packageFile);
    
    // Read manifest
    const manifestFile = contents.file('imsmanifest.xml');
    if (!manifestFile) {
      throw new Error('Invalid SCORM package: imsmanifest.xml not found');
    }
    
    const manifestContent = await manifestFile.async('string');
    
    // Parse basic info from manifest
    const titleMatch = manifestContent.match(/<title[^>]*>(.*?)<\/title>/i);
    const versionMatch = manifestContent.match(/schemaversion[^>]*>(.*?)</i);
    
    // Read metadata if available
    let metadata = null;
    const metadataFile = contents.file('course_metadata.json');
    if (metadataFile) {
      const metadataContent = await metadataFile.async('string');
      metadata = JSON.parse(metadataContent);
    }
    
    return {
      success: true,
      info: {
        title: titleMatch ? titleMatch[1] : 'Unknown Course',
        version: versionMatch ? versionMatch[1] : 'Unknown',
        metadata: metadata,
        files: Object.keys(contents.files).length,
        size: packageFile.size
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Auto-generates SCORM package from course materials
 */
export const autoGenerateSCORMFromMaterials = async (courseData, materials) => {
  // Determine best template based on materials
  let template = SCORM_TEMPLATES.BASIC;
  
  const hasVideo = materials.some(m => m.type === 'video');
  const hasDocument = materials.some(m => m.type === 'document');
  const hasQuiz = courseData.includeQuiz || courseData.questions?.length > 0;
  
  if (hasVideo && hasDocument) {
    template = SCORM_TEMPLATES.INTERACTIVE;
  } else if (hasVideo) {
    template = SCORM_TEMPLATES.VIDEO_BASED;
  } else if (hasDocument) {
    template = SCORM_TEMPLATES.DOCUMENT_BASED;
  } else if (hasQuiz) {
    template = SCORM_TEMPLATES.ASSESSMENT;
  }
  
  const options = {
    version: SCORM_VERSIONS.SCORM_12, // Default to SCORM 1.2 for better compatibility
    template: template,
    includeQuiz: hasQuiz
  };
  
  return await generateSCORMPackage(courseData, materials, options);
};

export default {
  generateSCORMPackage,
  validateCourseForSCORM,
  extractSCORMInfo,
  autoGenerateSCORMFromMaterials,
  SCORM_VERSIONS,
  SCORM_TEMPLATES
};
