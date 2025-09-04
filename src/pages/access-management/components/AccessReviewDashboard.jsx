import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccessReviewDashboard = ({ reviews, onStartReview, onCompleteReview }) => {
  const getReviewStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'in-progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'overdue': return 'bg-error/10 text-error border-error/20';
      case 'pending': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const calculateProgress = (review) => {
    if (review?.totalUsers === 0) return 0;
    return Math.round((review?.reviewedUsers / review?.totalUsers) * 100);
  };

  const getDaysOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = now - due;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const overallStats = {
    total: reviews?.length,
    completed: reviews?.filter(r => r?.status === 'completed')?.length,
    inProgress: reviews?.filter(r => r?.status === 'in-progress')?.length,
    overdue: reviews?.filter(r => r?.status === 'overdue')?.length,
    pending: reviews?.filter(r => r?.status === 'pending')?.length
  };

  const completionRate = overallStats?.total > 0 
    ? Math.round((overallStats?.completed / overallStats?.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold text-foreground">{overallStats?.total}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="ClipboardList" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-success">{overallStats?.completed}</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-warning">{overallStats?.inProgress}</p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-error">{overallStats?.overdue}</p>
            </div>
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
          </div>
        </div>
      </div>
      {/* Completion Rate */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Overall Completion Rate</h3>
          <span className="text-2xl font-bold text-primary">{completionRate}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {overallStats?.completed} of {overallStats?.total} reviews completed
        </p>
      </div>
      {/* Reviews List */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Access Reviews</h3>
              <p className="text-sm text-muted-foreground">Periodic access attestation status</p>
            </div>
            <Button variant="outline" size="sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Schedule Review
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {reviews?.map((review) => {
            const progress = calculateProgress(review);
            const isOverdue = review?.status === 'overdue';
            const daysOverdue = isOverdue ? getDaysOverdue(review?.dueDate) : 0;

            return (
              <div key={review?.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-foreground">{review?.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getReviewStatusColor(review?.status)}`}>
                        {review?.status?.charAt(0)?.toUpperCase() + review?.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review?.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Manager: {review?.manager}</span>
                      <span>Due: {new Date(review.dueDate)?.toLocaleDateString()}</span>
                      {isOverdue && (
                        <span className="text-error font-medium">
                          {daysOverdue} days overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {review?.status === 'pending' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onStartReview(review?.id)}
                      >
                        <Icon name="Play" size={16} className="mr-1" />
                        Start Review
                      </Button>
                    )}
                    {review?.status === 'in-progress' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onCompleteReview(review?.id)}
                      >
                        <Icon name="Check" size={16} className="mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Icon name="Eye" size={16} className="mr-1" />
                      View
                    </Button>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">
                      {review?.reviewedUsers} / {review?.totalUsers} users reviewed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        review?.status === 'completed' ? 'bg-success' :
                        review?.status === 'overdue' ? 'bg-error' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {/* User Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Approved:</span>
                    <span className="text-success font-medium">{review?.approvedUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Revoked:</span>
                    <span className="text-error font-medium">{review?.revokedUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="text-warning font-medium">{review?.pendingUsers}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {reviews?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="ClipboardList" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No access reviews scheduled</p>
            <Button variant="outline" size="sm" className="mt-2">
              Schedule First Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessReviewDashboard;