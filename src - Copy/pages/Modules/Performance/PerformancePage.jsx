import React from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import './PerformancePage.css';

const PERFORMANCE_DATA = {
  currentScore: 88,
  previousScore: 82,
  competency: 90,
  behavior: 85,
  attendance: 95,
  teamwork: 88,
  reviews: [
    { year: '2025', score: 88, grade: 'Excellent', reviewer: 'Jane Smith' },
    { year: '2024', score: 82, grade: 'Very Good', reviewer: 'Jane Smith' },
    { year: '2023', score: 79, grade: 'Good', reviewer: 'Robert Brown' },
  ],
};

function ScoreCard({ label, value, color }) {
  return (
    <Card className="score-card" hover>
      <div className="score-label">{label}</div>
      <div className="score-value" style={{ color }}>{value}</div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </Card>
  );
}

function PerformancePage() {
  const { currentScore, previousScore, competency, behavior, attendance, teamwork, reviews } = PERFORMANCE_DATA;

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Performance Reviews" subtitle="Track your performance evaluations and feedback" color="#0B2E59" />

        <div className="performance-summary">
          <Card className="overall-score-card" hover={false}>
            <div className="overall-score-header">
              <h3>Current Performance Score</h3>
              <span className="overall-score-year">2025</span>
            </div>
            <div className="overall-score-value">{currentScore}</div>
            <div className="overall-score-label">Excellent</div>
            <div className="overall-score-change">
              <span className="score-change-positive">+{currentScore - previousScore}</span>
              <span>from last year</span>
            </div>
          </Card>

          <div className="score-grid">
            <ScoreCard label="Competency" value={competency} color="#2F80ED" />
            <ScoreCard label="Behavior" value={behavior} color="#7C3AED" />
            <ScoreCard label="Attendance" value={attendance} color="#059669" />
            <ScoreCard label="Teamwork" value={teamwork} color="#D97706" />
          </div>
        </div>

        <Card hover={false}>
          <div className="review-history-header">
            <h3 className="card-header-title">Appraisal History</h3>
          </div>
          <div className="review-timeline">
            {reviews.map((review, i) => (
              <div key={review.year} className="review-timeline-item">
                <div className="review-timeline-dot" style={{ background: review.score >= 85 ? '#059669' : review.score >= 75 ? '#D97706' : '#DC2626' }} />
                {i < reviews.length - 1 && <div className="review-timeline-line" />}
                <div className="review-timeline-content">
                  <div className="review-year">{review.year}</div>
                  <div className="review-details">
                    <span className="review-score">{review.score}/100</span>
                    <span className="review-grade">{review.grade}</span>
                    <span className="review-reviewer">by {review.reviewer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

export default PerformancePage;
