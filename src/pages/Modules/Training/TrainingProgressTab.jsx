import React, { useRef, useState } from 'react';
import DataTable from '../../../components/common/DataTable/DataTable';
import Modal from '../../../components/common/Modal/Modal';
import { notificationService } from '../../../components/Notifications/notificationService';
import { openDocument } from '../../../utils/preview';
import { useAuth } from '../../../context/AuthContext';
import { DEMO_EMPLOYEES } from '../../../data/demoEmployees';

const PROGRESS_STATUS_STYLE = {
  'On Track': { background: '#ECFDF5', color: '#059669' },
  'At Risk': { background: '#FFFBEB', color: '#D97706' },
  'Behind Schedule': { background: '#FFF1F2', color: '#BE123C' },
  'On Hold': { background: '#F3F4F6', color: '#4B5563' },
  'Completed': { background: '#F5F3FF', color: '#7C3AED' },
  'Not Started': { background: '#F3F4F6', color: '#4B5563' },
};

const APPROVED_TRAINING = [
  {
    id: 'TRL-2026-001',
    program: 'Leadership Development Program',
    institution: 'Institute of Public Administration',
    trainingLevel: 'Certificate',
    studyMode: 'Full-time',
    sponsor: 'Immigration Department',
    startDate: '2026-08-01',
    expectedCompletion: '2026-11-15',
    currentAcademicYear: '2026/2027',
    progressUpdates: [
      {
        submissionDate: '2026-09-15',
        reportingPeriod: 'First Semester',
        academicYear: '2026/2027',
        semester: 'Semester 1',
        progressStatus: 'On Track',
        overallPerformance: 'Good',
        currentGpa: '3.5',
        creditsCompleted: '12',
        remarks: 'Completed all coursework and group projects on time.',
        statement: 'This reporting period covered leadership foundations and strategic thinking. I completed all required coursework, participated actively in group projects, and gained practical skills in team management, communication, and conflict resolution. The next period will focus on organisational change and performance management.',
        documents: [
          { name: 'Progress_Report_S1.pdf', type: 'PDF', size: '1.2 MB' },
          { name: 'Transcript_S1.pdf', type: 'PDF', size: '850 KB' },
        ],
        submittedBy: DEMO_EMPLOYEES[0]?.fullName || 'Employee',
      },
    ],
  },
  {
    id: 'TRL-2026-003',
    program: 'Financial Management Diploma',
    institution: 'Institute of Finance Management',
    trainingLevel: 'Diploma',
    studyMode: 'Part-time',
    sponsor: 'Self-sponsored',
    startDate: '2026-09-01',
    expectedCompletion: '2027-06-30',
    currentAcademicYear: '2026/2027',
    progressUpdates: [],
  },
  {
    id: 'TRL-2026-005',
    program: 'Data Analytics & Reporting',
    institution: 'College of Information and Communication Technologies',
    trainingLevel: 'Bachelor Degree',
    studyMode: 'Full-time',
    sponsor: 'Immigration Department',
    startDate: '2026-10-10',
    expectedCompletion: '2027-10-10',
    currentAcademicYear: '2026/2027',
    progressUpdates: [],
  },
];

function getLatestUpdate(request) {
  if (!request.progressUpdates || request.progressUpdates.length === 0) return null;
  return request.progressUpdates[request.progressUpdates.length - 1];
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function TrainingProgressTab() {
  const { user } = useAuth();
  const [approvedTraining, setApprovedTraining] = useState(APPROVED_TRAINING);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [form, setForm] = useState({
    reportingPeriod: '',
    academicYear: '',
    semester: '',
    progressStatus: '',
    overallPerformance: '',
    currentGpa: '',
    creditsCompleted: '',
    remarks: '',
    statement: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [replaceIndex, setReplaceIndex] = useState(null);
  const fileRef = useRef(null);

  const resetForm = () => {
    setForm({
      reportingPeriod: '',
      academicYear: '',
      semester: '',
      progressStatus: '',
      overallPerformance: '',
      currentGpa: '',
      creditsCompleted: '',
      remarks: '',
      statement: '',
    });
    setFormErrors({});
    setFiles([]);
    setFileError('');
    setReplaceIndex(null);
  };

  const openModal = (request, historyOnly = false) => {
    setSelectedRequest(request);
    setShowHistory(historyOnly);
    resetForm();
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setShowHistory(false);
    resetForm();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFileError('Unsupported file format. Please upload PDF, JPG, JPEG, or PNG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit.');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    if (replaceIndex !== null) {
      setFiles((prev) => {
        const next = [...prev];
        URL.revokeObjectURL(next[replaceIndex].previewUrl);
        next[replaceIndex] = { file, previewUrl };
        return next;
      });
      setReplaceIndex(null);
    } else {
      setFiles((prev) => [...prev, { file, previewUrl }]);
    }
    e.target.value = '';
  };

  const removeFile = (idx) => {
    setFiles((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].previewUrl);
      next.splice(idx, 1);
      return next;
    });
  };

  const validate = () => {
    const errors = {};
    if (!form.reportingPeriod.trim()) errors.reportingPeriod = 'Reporting period is required';
    if (!form.academicYear.trim()) errors.academicYear = 'Academic year is required';
    if (!form.semester.trim()) errors.semester = 'Semester / term is required';
    if (!form.progressStatus) errors.progressStatus = 'Progress status is required';
    if (!form.statement.trim()) errors.statement = 'Progress statement is required';
    if (files.length === 0) {
      setFileError('At least one supporting document is required');
    } else {
      setFileError('');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0 && files.length > 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newUpdate = {
      submissionDate: new Date().toISOString().split('T')[0],
      reportingPeriod: form.reportingPeriod,
      academicYear: form.academicYear,
      semester: form.semester,
      progressStatus: form.progressStatus,
      overallPerformance: form.overallPerformance,
      currentGpa: form.currentGpa,
      creditsCompleted: form.creditsCompleted,
      remarks: form.remarks,
      statement: form.statement,
      documents: files.map((f) => ({
        name: f.file.name,
        type: f.file.type === 'application/pdf' ? 'PDF' : 'Image',
        size: formatFileSize(f.file.size),
      })),
      submittedBy: user?.fullName || user?.name || '',
    };

    setApprovedTraining((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, progressUpdates: [...req.progressUpdates, newUpdate] }
          : req
      )
    );

    notificationService.promise(
      new Promise((resolve) => setTimeout(() => resolve(), 1000)),
      {
        loading: 'Submitting progress update...',
        success: 'Progress update submitted successfully.',
        error: 'Failed to submit progress update.',
      }
    );

    handleClose();
  };

  const statusBadge = (request) => {
    const latest = getLatestUpdate(request);
    const status = latest ? latest.progressStatus : 'Not Started';
    const style = PROGRESS_STATUS_STYLE[status] || PROGRESS_STATUS_STYLE['Not Started'];
    return (
      <span className="status-pill" style={{ background: style.background, color: style.color }}>
        {status}
      </span>
    );
  };

  const columns = [
    { key: 'id', header: 'Reference ID', render: (row) => <span className="id-badge">{row.id}</span> },
    { key: 'program', header: 'Training Program' },
    { key: 'institution', header: 'Institution' },
    { key: 'trainingLevel', header: 'Training Level' },
    { key: 'studyMode', header: 'Study Mode' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'expectedCompletion', header: 'Completion Date' },
    { key: 'currentProgressStatus', header: 'Progress Status', render: (row) => statusBadge(row), searchable: false, sortable: false },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={approvedTraining}
        title="Approved Training Programs"
        searchPlaceholder="Search by reference, program, institution, or status..."
        actionColumn={(row) => (
          <div className="dt-actions">
            <button
              className="action-btn action-btn--view"
              onClick={() => openModal(row, true)}
              title="View History"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button
              className="action-btn action-btn--edit"
              onClick={() => openModal(row, false)}
              title="Progress Update"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        )}
        emptyState={{
          title: 'No approved training requests found',
          description: 'You have no approved training programs eligible for progress reporting.',
        }}
      />

      {showModal && selectedRequest && (
        <Modal
          isOpen={showModal}
          onClose={handleClose}
          title={showHistory ? `Progress History - ${selectedRequest.id}` : `Progress Update - ${selectedRequest.id}`}
          className="training-progress-modal"
          footer={
            <div className="leave-form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                {showHistory ? 'Close' : 'Cancel'}
              </button>
              {!showHistory && (
                <button type="submit" form="trainingProgressForm" className="btn btn-primary">
                  Submit Progress Update
                </button>
              )}
            </div>
          }
        >
          <div className="training-detail-modal">
            <div className="training-detail-section">
              <h5 className="training-detail-section-title">Training Information</h5>
              <div className="training-detail-grid">
                <div className="training-detail-item">
                  <span className="training-detail-label">Training Reference Number</span>
                  <span className="training-detail-value">{selectedRequest.id}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Training Program</span>
                  <span className="training-detail-value">{selectedRequest.program}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Institution</span>
                  <span className="training-detail-value">{selectedRequest.institution}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Study Level</span>
                  <span className="training-detail-value">{selectedRequest.trainingLevel}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Study Mode</span>
                  <span className="training-detail-value">{selectedRequest.studyMode}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Sponsor</span>
                  <span className="training-detail-value">{selectedRequest.sponsor}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Start Date</span>
                  <span className="training-detail-value">{selectedRequest.startDate}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Expected Completion Date</span>
                  <span className="training-detail-value">{selectedRequest.expectedCompletion}</span>
                </div>
                <div className="training-detail-item">
                  <span className="training-detail-label">Current Academic Year</span>
                  <span className="training-detail-value">{selectedRequest.currentAcademicYear}</span>
                </div>
              </div>
            </div>

            {!showHistory && (
              <form id="trainingProgressForm" className="leave-form" onSubmit={handleSubmit}>
                <div className="leave-form-section">
                  <h4 className="leave-form-section-title">Progress Information</h4>
                  <div className="leave-form-row">
                    <div className="form-group">
                      <label className="form-label">Reporting Period <span className="reg-required">*</span></label>
                      <input
                        type="text"
                        className={`form-input ${formErrors.reportingPeriod ? 'form-input--error' : ''}`}
                        placeholder="e.g. First Semester 2026"
                        value={form.reportingPeriod}
                        onChange={(e) => setForm({ ...form, reportingPeriod: e.target.value })}
                      />
                      {formErrors.reportingPeriod && <span className="form-error">{formErrors.reportingPeriod}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Academic Year <span className="reg-required">*</span></label>
                      <input
                        type="text"
                        className={`form-input ${formErrors.academicYear ? 'form-input--error' : ''}`}
                        placeholder="e.g. 2026/2027"
                        value={form.academicYear}
                        onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                      />
                      {formErrors.academicYear && <span className="form-error">{formErrors.academicYear}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Semester / Term <span className="reg-required">*</span></label>
                      <input
                        type="text"
                        className={`form-input ${formErrors.semester ? 'form-input--error' : ''}`}
                        placeholder="e.g. Semester 1"
                        value={form.semester}
                        onChange={(e) => setForm({ ...form, semester: e.target.value })}
                      />
                      {formErrors.semester && <span className="form-error">{formErrors.semester}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Progress Status <span className="reg-required">*</span></label>
                      <select
                        className={`form-input form-select ${formErrors.progressStatus ? 'form-input--error' : ''}`}
                        value={form.progressStatus}
                        onChange={(e) => setForm({ ...form, progressStatus: e.target.value })}
                      >
                        <option value="">Select status</option>
                        <option value="On Track">On Track</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Behind Schedule">Behind Schedule</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {formErrors.progressStatus && <span className="form-error">{formErrors.progressStatus}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Overall Performance</label>
                      <select
                        className="form-input form-select"
                        value={form.overallPerformance}
                        onChange={(e) => setForm({ ...form, overallPerformance: e.target.value })}
                      >
                        <option value="">Select performance</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Satisfactory">Satisfactory</option>
                        <option value="Needs Improvement">Needs Improvement</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Current GPA / Average Score</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 3.5 / 75%"
                        value={form.currentGpa}
                        onChange={(e) => setForm({ ...form, currentGpa: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Credits Completed</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 12"
                        value={form.creditsCompleted}
                        onChange={(e) => setForm({ ...form, creditsCompleted: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Remarks / Summary</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Brief summary of the reporting period"
                        value={form.remarks}
                        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="leave-form-section">
                  <h4 className="leave-form-section-title">Management Statement <span className="reg-required">*</span></h4>
                  <div className="form-group">
                    <textarea
                      className={`form-input ${formErrors.statement ? 'form-input--error' : ''}`}
                      rows={5}
                      placeholder="Provide a comprehensive progress statement describing academic achievements, skills gained, completed coursework, challenges encountered, and planned activities for the next reporting period."
                      value={form.statement}
                      onChange={(e) => setForm({ ...form, statement: e.target.value })}
                    />
                    {formErrors.statement && <span className="form-error">{formErrors.statement}</span>}
                  </div>
                </div>

                <div className="leave-form-section">
                  <h4 className="leave-form-section-title">Supporting Documents</h4>
                  <p className="leave-form-hint">
                    Upload at least one supporting document (e.g. progress report, transcript, exam results, attendance report, supervisor report, or institution letter). Allowed formats: PDF, JPG, PNG (max 10MB each).
                  </p>
                  <input
                    type="file"
                    ref={fileRef}
                    className="file-upload-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFile}
                  />
                  <div className="support-upload-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setReplaceIndex(null);
                        fileRef.current?.click();
                      }}
                    >
                      Upload Document
                    </button>
                  </div>
                  {fileError && <p className="form-error" style={{ marginTop: 8 }}>{fileError}</p>}
                  {files.length > 0 && (
                    <div className="support-attachments-list" style={{ marginTop: 16 }}>
                      {files.map((item, idx) => (
                        <div key={idx} className="attachment-row">
                          <div className="attachment-icon">
                            {item.file.type === 'application/pdf' ? (
                              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            )}
                          </div>
                          <div className="attachment-info">
                            <span className="attachment-name">{item.file.name}</span>
                            <span className="attachment-meta">{formatFileSize(item.file.size)}</span>
                          </div>
                          <div className="attachment-actions">
                            <button type="button" className="btn btn-sm btn-primary" onClick={() => openDocument(item.previewUrl, item.file.name)}>
                              Preview
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setReplaceIndex(idx);
                                fileRef.current?.click();
                              }}
                            >
                              Replace
                            </button>
                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => removeFile(idx)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            )}

            {selectedRequest.progressUpdates && selectedRequest.progressUpdates.length > 0 && (
              <div className="training-detail-section training-progress-history">
                <h5 className="training-detail-section-title">Progress History</h5>
                <div className="training-progress-list">
                  {selectedRequest.progressUpdates.map((update, i) => (
                    <div key={i} className="training-progress-card">
                      <div className="training-progress-card-header">
                        <div className="training-progress-card-meta">
                          <span className="training-progress-date">{update.submissionDate}</span>
                          <span className="training-progress-period">{update.reportingPeriod} &middot; {update.semester}</span>
                        </div>
                        <span className="status-pill" style={{ background: PROGRESS_STATUS_STYLE[update.progressStatus]?.background, color: PROGRESS_STATUS_STYLE[update.progressStatus]?.color }}>
                          {update.progressStatus}
                        </span>
                      </div>
                      <div className="training-progress-card-body">
                        {update.overallPerformance && (
                          <div className="training-progress-detail">
                            <span className="training-detail-label">Overall Performance</span>
                            <span className="training-detail-value">{update.overallPerformance}</span>
                          </div>
                        )}
                        {update.currentGpa && (
                          <div className="training-progress-detail">
                            <span className="training-detail-label">GPA / Average</span>
                            <span className="training-detail-value">{update.currentGpa}</span>
                          </div>
                        )}
                        {update.creditsCompleted && (
                          <div className="training-progress-detail">
                            <span className="training-detail-label">Credits Completed</span>
                            <span className="training-detail-value">{update.creditsCompleted}</span>
                          </div>
                        )}
                        {update.remarks && (
                          <div className="training-progress-detail training-progress-detail--full">
                            <span className="training-detail-label">Remarks</span>
                            <span className="training-detail-value">{update.remarks}</span>
                          </div>
                        )}
                        {update.statement && (
                          <div className="training-progress-detail training-progress-detail--full">
                            <span className="training-detail-label">Management Statement</span>
                            <p className="training-detail-text">{update.statement}</p>
                          </div>
                        )}
                        {update.documents && update.documents.length > 0 && (
                          <div className="training-progress-detail training-progress-detail--full">
                            <span className="training-detail-label">Supporting Documents</span>
                            <div className="training-progress-doc-list">
                              {update.documents.map((doc, d) => (
                                <span key={d} className="training-progress-doc-chip">{doc.name}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="training-progress-card-footer">
                        <span className="training-detail-label">Submitted By</span>
                        <span className="training-detail-value">{update.submittedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default TrainingProgressTab;
