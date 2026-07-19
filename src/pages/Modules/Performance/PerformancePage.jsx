import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import DataTable from '../../../components/common/DataTable/DataTable';
import Modal from '../../../components/common/Modal/Modal';
import { notificationService } from '../../../components/Notifications/notificationService';
import './PerformancePage.css';

const PERFORMANCE_DATA = {
  currentScore: 88,
  previousScore: 82,
  competency: 90,
  behavior: 85,
  attendance: 95,
  teamwork: 88,
  initiative: 86,
  communication: 92,
};

const REVIEWS = [
  { id: 'APR-2025-001', year: '2025', cycle: 'Annual', score: 88, grade: 'Excellent', reviewer: 'Dr. Jane Smith', reviewerRole: 'Director General', reviewDate: '2026-01-15', status: 'Completed', feedback: 'Outstanding performance in project management and team leadership. Consistently exceeds expectations.' },
  { id: 'APR-2024-001', year: '2024', cycle: 'Annual', score: 82, grade: 'Very Good', reviewer: 'Dr. Jane Smith', reviewerRole: 'Director General', reviewDate: '2025-01-20', status: 'Completed', feedback: 'Strong performance overall. Areas for improvement include strategic planning and cross-departmental collaboration.' },
  { id: 'APR-2023-001', year: '2023', cycle: 'Annual', score: 79, grade: 'Good', reviewer: 'Mr. Robert Brown', reviewerRole: 'Head of HR', reviewDate: '2024-01-18', status: 'Completed', feedback: 'Meets expectations. Demonstrated good technical skills. Recommended focus on leadership development.' },
  { id: 'APR-2025-M1', year: '2025', cycle: 'Mid-Year', score: 85, grade: 'Very Good', reviewer: 'Dr. Jane Smith', reviewerRole: 'Director General', reviewDate: '2025-07-10', status: 'Completed', feedback: 'On track to meet annual targets. Excellent client engagement scores.' },
  { id: 'APR-2026-M1', year: '2026', cycle: 'Mid-Year', score: null, grade: '—', reviewer: 'Dr. Jane Smith', reviewerRole: 'Director General', reviewDate: null, status: 'Pending', feedback: null },
];

const GOALS = [
  { id: 'G-2026-001', title: 'Complete Leadership Development Program', category: 'Professional Development', targetDate: '2026-09-30', progress: 65, status: 'In Progress' },
  { id: 'G-2026-002', title: 'Improve Cross-Departmental Collaboration Score', category: 'Teamwork', targetDate: '2026-12-31', progress: 40, status: 'In Progress' },
  { id: 'G-2026-003', title: 'Obtain Project Management Certification', category: 'Certification', targetDate: '2026-08-15', progress: 90, status: 'In Progress' },
  { id: 'G-2026-004', title: 'Mentor 2 Junior Staff Members', category: 'Leadership', targetDate: '2026-06-30', progress: 100, status: 'Completed' },
  { id: 'G-2025-005', title: 'Reduce Report Processing Time by 30%', category: 'Efficiency', targetDate: '2025-12-31', progress: 100, status: 'Completed' },
];

const STATUS_STYLE = {
  'Completed': { background: '#ECFDF5', color: '#059669' },
  'In Progress': { background: '#F0F9FF', color: '#0284C7' },
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Overdue': { background: '#FFF1F2', color: '#BE123C' },
  'Excellent': { background: '#ECFDF5', color: '#059669' },
  'Very Good': { background: '#EFF6FF', color: '#2563EB' },
  'Good': { background: '#FFFBEB', color: '#D97706' },
};

const TAB_ICONS = {
  overview: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  appraisals: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  goals: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'appraisals', label: 'Appraisal History' },
  { key: 'goals', label: 'Goals & Development' },
];

function ScoreCard({ label, value, color }) {
  return (
    <Card className="perf-score-card" hover>
      <div className="perf-score-label">{label}</div>
      <div className="perf-score-value" style={{ color }}>{value}</div>
      <div className="perf-score-bar">
        <div className="perf-score-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </Card>
  );
}

function PerformancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { currentScore, previousScore, competency, behavior, attendance, teamwork, initiative, communication } = PERFORMANCE_DATA;

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Performance Management"
          subtitle="Track your evaluations, feedback, and professional development goals"
          color="#C026D3"
        />

        <div className="tabs leave-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {TAB_ICONS[tab.key]}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="perf-overview">
              <Card className="perf-overall-card" hover={false}>
                <div className="perf-overall-header">
                  <h3>Current Performance Score</h3>
                  <span className="perf-overall-year">2025/2026</span>
                </div>
                <div className="perf-overall-score-ring">
                  <div className="perf-overall-value">{currentScore}</div>
                  <div className="perf-overall-grade">Excellent</div>
                </div>
                <div className="perf-overall-change">
                  <span className="perf-change-positive">+{currentScore - previousScore}</span>
                  <span>from previous cycle</span>
                </div>
              </Card>

              <div className="perf-score-grid">
                <ScoreCard label="Competency" value={competency} color="#2F80ED" />
                <ScoreCard label="Behavior" value={behavior} color="#7C3AED" />
                <ScoreCard label="Attendance" value={attendance} color="#059669" />
                <ScoreCard label="Teamwork" value={teamwork} color="#D97706" />
                <ScoreCard label="Initiative" value={initiative} color="#DC2626" />
                <ScoreCard label="Communication" value={communication} color="#0D9488" />
              </div>
            </div>

            <Card hover={false}>
              <div className="leave-section-header">
                <h3 className="leave-section-title">Current Goals</h3>
              </div>
              <div className="perf-goals-list">
                {GOALS.filter(g => g.status === 'In Progress').slice(0, 4).map(goal => (
                  <div key={goal.id} className="perf-goal-item">
                    <div className="perf-goal-info">
                      <span className="perf-goal-title">{goal.title}</span>
                      <span className="perf-goal-meta">{goal.category} &middot; Due: {goal.targetDate}</span>
                    </div>
                    <div className="perf-goal-track">
                      <div className="perf-goal-progress">
                        <div className="perf-goal-progress-bar">
                          <div className="perf-goal-progress-fill" style={{ width: `${goal.progress}%` }} />
                        </div>
                        <span className="perf-goal-progress-text">{goal.progress}%</span>
                      </div>
                      <span className="status-pill" style={{ background: STATUS_STYLE[goal.status]?.background, color: STATUS_STYLE[goal.status]?.color }}>{goal.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === 'appraisals' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'year', header: 'Year' },
                { key: 'cycle', header: 'Cycle' },
                { key: 'reviewDate', header: 'Review Date', render: row => <span>{row.reviewDate || '—'}</span> },
                { key: 'score', header: 'Score', render: row => <span className="perf-table-score">{row.score !== null ? `${row.score}/100` : '—'}</span> },
                { key: 'grade', header: 'Grade', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.grade]?.background || '#EAF4FF', color: STATUS_STYLE[row.grade]?.color || '#2F80ED' }}>{row.grade}</span> },
                { key: 'reviewer', header: 'Reviewer' },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={REVIEWS}
              title="Appraisal History"
              searchPlaceholder="Search by year, cycle, or reviewer..."
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(v => !v)}
              filters={[
                { key: 'cycle', label: 'Cycle', options: ['Annual', 'Mid-Year'].map(c => ({ value: c, label: c })) },
                { key: 'status', label: 'Status', options: ['Completed', 'Pending'].map(s => ({ value: s, label: s })) },
              ]}
              loading={isLoading}
              refreshAction={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }}
              exportAction={() => notificationService.info('Exporting appraisal history...')}
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => setSelectedReview(row)} title="View Details">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button className="action-btn action-btn--download" onClick={() => notificationService.info('Downloading ' + row.id)} title="Download">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              )}
              emptyState={{ title: 'No appraisal records found', description: 'No records match your search or filter criteria.' }}
            />

            {selectedReview && (
              <Modal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} title={`Appraisal Details - ${selectedReview.id}`} size="md" footer={<button className="btn btn-secondary" onClick={() => setSelectedReview(null)}>Close</button>}>
                <div className="leave-detail-modal">
                  <div className="leave-detail-section">
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedReview.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Year</span><span className="leave-detail-value">{selectedReview.year}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Cycle</span><span className="leave-detail-value">{selectedReview.cycle}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Review Date</span><span className="leave-detail-value">{selectedReview.reviewDate || 'Pending'}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Score</span><span className="leave-detail-value perf-table-score">{selectedReview.score !== null ? `${selectedReview.score}/100` : '—'}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Grade</span><span className="leave-detail-value"><span className="status-pill" style={{ background: STATUS_STYLE[selectedReview.grade]?.background || '#EAF4FF', color: STATUS_STYLE[selectedReview.grade]?.color || '#2F80ED' }}>{selectedReview.grade}</span></span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Reviewer</span><span className="leave-detail-value">{selectedReview.reviewer}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Reviewer Role</span><span className="leave-detail-value">{selectedReview.reviewerRole}</span></div>
                    </div>
                  </div>
                  {selectedReview.feedback && (
                    <div className="leave-detail-section">
                      <h5 className="leave-detail-section-title">Feedback</h5>
                      <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-value" style={{ lineHeight: 1.6 }}>{selectedReview.feedback}</span></div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}

        {activeTab === 'goals' && (
          <>
            <Card hover={false}>
              <div className="leave-section-header">
                <h3 className="leave-section-title">Performance Goals & Development Plan</h3>
                <p className="leave-section-desc">Track your professional development and performance targets</p>
              </div>
              <div className="perf-goals-full-list">
                {GOALS.map(goal => (
                  <div key={goal.id} className="perf-goal-full-item">
                    <div className="perf-goal-full-header">
                      <div className="perf-goal-full-info">
                        <span className="perf-goal-full-title">{goal.title}</span>
                        <div className="perf-goal-full-tags">
                          <span className="leave-doc-tag">{goal.category}</span>
                          <span className="leave-doc-tag">Due: {goal.targetDate}</span>
                          <span className="status-pill" style={{ background: STATUS_STYLE[goal.status]?.background, color: STATUS_STYLE[goal.status]?.color }}>{goal.status}</span>
                        </div>
                      </div>
                      <span className="perf-goal-full-percent">{goal.progress}%</span>
                    </div>
                    <div className="perf-goal-full-bar">
                      <div className="perf-goal-full-fill" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

export default PerformancePage;
