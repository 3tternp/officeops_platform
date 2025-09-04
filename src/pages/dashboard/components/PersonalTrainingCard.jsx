import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dataService from '../../../services/DataService';

const PersonalTrainingCard = ({ currentUser }) => {
  const [trainingData, setTrainingData] = useState({
    completedCourses: 0,
    totalCourses: 0,
    overallProgress: 0,
    recentCourses: [],
    upcomingDeadlines: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      loadTrainingData();
    }
  }, [currentUser]);

  const loadTrainingData = () => {
    try {
      // Get learning courses data
      const courses = dataService.getModuleData('learningCourses') || [];
      const userProgress = dataService.getModuleData('userProgress') || {};
      
      // Calculate user's training progress
      const userCourseProgress = userProgress[currentUser.id] || {};
      const completedCourses = Object.values(userCourseProgress).filter(
        progress => progress.completed === true || progress.progress >= 100
      ).length;
      
      const totalCourses = courses.length;
      const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
      
      // Get recent completed courses
      const recentCourses = Object.entries(userCourseProgress)
        .filter(([_, progress]) => progress.completed && progress.completedAt)
        .sort((a, b) => new Date(b[1].completedAt) - new Date(a[1].completedAt))
        .slice(0, 3)
        .map(([courseId, progress]) => {
          const course = courses.find(c => c.id === courseId);
          return {
            ...course,
            completedAt: progress.completedAt,
            score: progress.score
          };
        })
        .filter(course => course.title); // Only include courses that exist

      // Get upcoming deadlines (courses with deadlines but not completed)
      const upcomingDeadlines = courses
        .filter(course => {
          const userCourseProgress = userProgress[currentUser.id]?.[course.id];
          const isCompleted = userCourseProgress?.completed;
          const hasDeadline = course.dueDate;
          const isOverdue = hasDeadline && new Date(course.dueDate) > new Date();
          return hasDeadline && !isCompleted && isOverdue;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

      setTrainingData({
        completedCourses,
        totalCourses,
        overallProgress,
        recentCourses,
        upcomingDeadlines
      });
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDeadline = (dueDate) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (days) => {
    if (days <= 3) return 'text-error';
    if (days <= 7) return 'text-warning';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">My Training Progress</h3>
          <div className="w-6 h-6 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="w-32 h-4 bg-muted animate-pulse rounded" />
            <div className="w-24 h-3 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">My Training Progress</h3>
        <Icon name="GraduationCap" size={20} className="text-success" />
      </div>

      {/* Overall Progress */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-20 h-20 relative flex items-center justify-center bg-success/10 border-2 border-success/20 rounded-full">
          <div className="text-center">
            <span className="text-lg font-bold text-success">{trainingData.overallProgress}%</span>
          </div>
          <div 
            className="absolute inset-1 rounded-full border-2 border-success opacity-20"
            style={{
              background: `conic-gradient(#059669 0deg ${(trainingData.overallProgress * 3.6)}deg, transparent ${(trainingData.overallProgress * 3.6)}deg 360deg)`
            }}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-foreground">{trainingData.overallProgress}%</p>
          <p className="text-sm text-muted-foreground">
            {trainingData.completedCourses} of {trainingData.totalCourses} courses completed
          </p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-300" 
              style={{ width: `${trainingData.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Completions */}
      {trainingData.recentCourses.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Recently Completed</h4>
          <div className="space-y-2">
            {trainingData.recentCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-2 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-foreground">{course.title}</span>
                </div>
                <div className="text-right">
                  {course.score && (
                    <span className="text-xs font-medium text-success">{course.score}%</span>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(course.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      {trainingData.upcomingDeadlines.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Upcoming Deadlines</h4>
          <div className="space-y-2">
            {trainingData.upcomingDeadlines.map((course) => {
              const daysLeft = getDaysUntilDeadline(course.dueDate);
              return (
                <div key={course.id} className="flex items-center justify-between p-2 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">{course.title}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${getDeadlineColor(daysLeft)}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Due {new Date(course.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        iconName="ArrowRight"
        iconPosition="right"
        onClick={() => window.location.href = '/learning-management'}
      >
        View All Courses
      </Button>
    </div>
  );
};

export default PersonalTrainingCard;
