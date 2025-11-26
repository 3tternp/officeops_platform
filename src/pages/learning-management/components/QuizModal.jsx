import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dataService from '../../../services/DataService';
import { useUser } from '../../../contexts/UserContext';
import { hasPermission, PERMISSIONS } from '../../../utils/permissions';

const QuizModal = ({ course, moduleIndex, isOpen, onClose }) => {
  const { currentUser } = useUser();

  if (!isOpen || !course) return null;

  const moduleDefinition = typeof moduleIndex === 'number'
    ? course?.content?.modules?.[moduleIndex]
    : null;

  const questions = Array.isArray(moduleDefinition?.quiz?.questions) && moduleDefinition.quiz.questions.length
    ? moduleDefinition.quiz.questions
    : Array.isArray(course?.content?.quizzes)
      ? course.content.quizzes
      : [];
  const passingScore = course?.settings?.passingScore ?? 80;
  const allowRetakes = course?.settings?.allowRetakes ?? true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [resultSaved, setResultSaved] = useState(false);

  const canTakeQuiz = hasPermission(currentUser?.role, PERMISSIONS.LMS_TAKE_QUIZ);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const progressPercent = useMemo(() => {
    if (totalQuestions === 0) return 0;
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answers, totalQuestions]);

  const handleSelectOption = (optionIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handlePrev = () => {
    setCurrentIndex(i => Math.max(0, i - 1));
  };

  const handleNext = () => {
    setCurrentIndex(i => Math.min(totalQuestions - 1, i + 1));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct += 1;
    });
    const pct = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    return pct;
  };

  const saveResult = (pct) => {
    try {
      const progress = dataService.getUserProgress(currentUser?.id);
      const result = {
        id: `qr_${Date.now()}`,
        courseId: course.id,
        courseTitle: course.title,
        userId: currentUser?.id,
        userName: currentUser?.name,
        timestamp: new Date().toISOString(),
        score: pct,
        passed: pct >= passingScore,
        totalQuestions,
        answers
      };
      const updated = {
        ...progress,
        quizResults: [...(progress.quizResults || []), result]
      };
      dataService.saveUserProgress(currentUser?.id, updated);
      // Update per-module gating
      dataService.recordQuizResultForModule(
        currentUser?.id,
        course.id,
        typeof moduleIndex === 'number' ? moduleIndex : 0,
        pct
      );
      setResultSaved(true);
    } catch (e) {
      console.error('Failed to save quiz result:', e);
    }
  };

  const handleSubmit = () => {
    const pct = calculateScore();
    setScore(pct);
    setSubmitted(true);
    saveResult(pct);
  };

  const handleRetake = () => {
    setSubmitted(false);
    setScore(0);
    setAnswers({});
    setCurrentIndex(0);
    setResultSaved(false);
  };

  // Guard: show friendly message if no questions
  const isEmpty = questions.length === 0;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Assessment — {moduleDefinition?.title || `Module ${typeof moduleIndex === 'number' ? moduleIndex + 1 : 'N/A'}`}</h2>
            <p className="text-sm text-muted-foreground mt-1">{course.title} — Multiple Choice Quiz</p>
            {moduleDefinition?.aiGenerated && (
              <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                <Icon name="Sparkles" size={14} /> AI-generated training pathway
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Permission warning */}
        {!canTakeQuiz && (
          <div className="p-6">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning">
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertTriangle" size={18} />
                <span className="font-medium">You do not have permission to take quizzes.</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Contact your administrator to enable access.</p>
            </div>
          </div>
        )}

        {/* Body */}
        {canTakeQuiz && (
          <div className="p-6">
            {(moduleDefinition?.aiGeneratedSummary || moduleDefinition?.objective) && (
              <div className="p-4 mb-4 rounded-lg bg-muted border border-border">
                <p className="text-sm text-foreground font-medium">{moduleDefinition?.aiGeneratedSummary || 'Module objective'}</p>
                {moduleDefinition?.objective && (
                  <p className="text-sm text-muted-foreground mt-1">{moduleDefinition.objective}</p>
                )}
              </div>
            )}
            {isEmpty ? (
              <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                <Icon name="HelpCircle" size={40} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">This course does not include any quiz questions yet.</p>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {/* Question */}
                {!submitted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Question {currentIndex + 1} of {totalQuestions}</span>
                      <BadgeLike passed={undefined} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{currentQuestion?.question}</h3>
                    <div className="space-y-2">
                      {currentQuestion?.options?.map((opt, idx) => {
                        const selected = answers[currentQuestion.id] === idx;
                        return (
                          <button
                            key={idx}
                            className={`w-full text-left p-3 rounded-md border transition ${selected ? 'border-primary bg-primary/10 text-foreground' : 'border-border hover:bg-muted text-muted-foreground'}`}
                            onClick={() => handleSelectOption(idx)}
                          >
                            <div className="flex items-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{String.fromCharCode(65 + idx)}</span>
                              <span className="text-sm">{opt}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-4">
                      <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
                        Previous
                      </Button>
                      {currentIndex < totalQuestions - 1 ? (
                        <Button variant="default" size="sm" onClick={handleNext} disabled={answers[currentQuestion.id] == null}>
                          Next
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" onClick={handleSubmit} disabled={answers[currentQuestion.id] == null}>
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Results
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name={score >= passingScore ? 'CheckCircle' : 'AlertTriangle'} size={20} className={score >= passingScore ? 'text-success' : 'text-warning'} />
                        <span className="font-medium text-foreground">{score >= passingScore ? 'Passed' : 'Try Again'}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Score</span>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-background">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Your Score</p>
                          <p className="text-2xl font-bold text-foreground">{score}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Passing Score</p>
                          <p className="text-xl font-semibold text-foreground">{passingScore}%</p>
                        </div>
                      </div>
                      {resultSaved && (
                        <p className="text-xs text-muted-foreground mt-2">Result saved to your progress.</p>
                      )}
                    </div>

                    {allowRetakes && (
                      <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button variant="default" onClick={handleRetake} iconName="RotateCcw">Retake</Button>
                      </div>
                    )}
                    {!allowRetakes && (
                      <div className="text-right">
                        <Button variant="default" onClick={onClose}>Close</Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Minimal badge-like helper for header spacing; can be extended later
const BadgeLike = ({ passed }) => (
  <div className="text-xs text-muted-foreground"></div>
);

export default QuizModal;