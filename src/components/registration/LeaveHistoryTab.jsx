import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import { notificationService } from '../Notifications/notificationService';

const MOCK_LEAVE_DATA = {
  'EMP-001': [
    { id: 1, leaveType: 'Annual Leave', applicationDate: '2026-06-20', startDate: '2026-07-01', endDate: '2026-07-14', days: 14, leaveReason: 'Family vacation', reportingOfficer: 'Director HR', approvalDate: '2026-06-25', status: 'Approved', comments: 'Approved with handover plan' },
    { id: 2, leaveType: 'Sick Leave', applicationDate: '2026-03-08', startDate: '2026-03-10', endDate: '2026-03-12', days: 3, leaveReason: 'Malaria treatment', reportingOfficer: 'Director HR', approvalDate: '2026-03-09', status: 'Approved', comments: 'Medical report submitted' },
    { id: 3, leaveType: 'Annual Leave', applicationDate: '2025-12-10', startDate: '2025-12-22', endDate: '2026-01-04', days: 14, leaveReason: 'End of year break', reportingOfficer: 'Director HR', approvalDate: '2025-12-15', status: 'Approved', comments: '' },
    { id: 4, leaveType: 'Special Leave', applicationDate: '2025-08-05', startDate: '2025-08-10', endDate: '2025-08-12', days: 3, leaveReason: 'Family emergency', reportingOfficer: 'Director HR', approvalDate: '2025-08-06', status: 'Approved', comments: 'Bereavement leave' },
  ],
  'EMP-002': [
    { id: 1, leaveType: 'Annual Leave', applicationDate: '2026-06-15', startDate: '2026-07-01', endDate: '2026-07-21', days: 21, leaveReason: 'Annual vacation', reportingOfficer: 'Director Immigration', approvalDate: '2026-06-20', status: 'Approved', comments: '' },
    { id: 2, leaveType: 'Sick Leave', applicationDate: '2026-01-10', startDate: '2026-01-12', endDate: '2026-01-14', days: 3, leaveReason: 'Flu', reportingOfficer: 'Director Immigration', approvalDate: '2026-01-11', status: 'Approved', comments: '' },
  ],
  'EMP-003': [
    { id: 1, leaveType: 'Annual Leave', applicationDate: '2026-06-28', startDate: '2026-07-15', endDate: '2026-07-28', days: 14, leaveReason: 'Personal travel', reportingOfficer: 'Director Finance', approvalDate: '', status: 'Pending', comments: 'Awaiting approval' },
    { id: 2, leaveType: 'Sick Leave', applicationDate: '2026-02-18', startDate: '2026-02-20', endDate: '2026-02-22', days: 3, leaveReason: 'Dental procedure', reportingOfficer: 'Director Finance', approvalDate: '2026-02-19', status: 'Approved', comments: '' },
    { id: 3, leaveType: 'Annual Leave', applicationDate: '2025-11-15', startDate: '2025-12-15', endDate: '2025-12-28', days: 14, leaveReason: 'End of year vacation', reportingOfficer: 'Director Finance', approvalDate: '2025-11-20', status: 'Approved', comments: '' },
  ],
  'EMP-004': [
    { id: 1, leaveType: 'Annual Leave', applicationDate: '2026-06-10', startDate: '2026-06-15', endDate: '2026-06-28', days: 14, leaveReason: 'Family visit', reportingOfficer: 'Director ICT', approvalDate: '2026-06-12', status: 'Approved', comments: '' },
  ],
  'EMP-005': [
    { id: 1, leaveType: 'Annual Leave', applicationDate: '2026-06-25', startDate: '2026-07-10', endDate: '2026-07-23', days: 14, leaveReason: 'Family vacation', reportingOfficer: 'Director Administration', approvalDate: '', status: 'Pending', comments: 'Under review' },
    { id: 2, leaveType: 'Sick Leave', applicationDate: '2026-04-05', startDate: '2026-04-06', endDate: '2026-04-08', days: 3, leaveReason: 'Stomach infection', reportingOfficer: 'Director Administration', approvalDate: '2026-04-06', status: 'Approved', comments: 'Medical certificate provided' },
    { id: 3, leaveType: 'Annual Leave', applicationDate: '2025-12-01', startDate: '2025-12-18', endDate: '2026-01-01', days: 15, leaveReason: 'Holiday break', reportingOfficer: 'Director Administration', approvalDate: '2025-12-05', status: 'Approved', comments: '' },
    { id: 4, leaveType: 'Special Leave', applicationDate: '2025-09-10', startDate: '2025-09-15', endDate: '2025-09-17', days: 3, leaveReason: 'Official assignment', reportingOfficer: 'Director Administration', approvalDate: '2025-09-11', status: 'Approved', comments: 'Conference attendance' },
  ],
};

const STATUS_STYLES = {
  Approved: { bg: '#ECFDF5', color: '#059669' },
  Pending: { bg: '#FFFBEB', color: '#D97706' },
  Rejected: { bg: '#FEF2F2', color: '#DC2626' },
  Cancelled: { bg: '#F3F4F6', color: '#6B7280' },
};

const PER_PAGE = 3;

function LeaveHistoryTab({ employeeId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({});

  useEffect(() => {
    if (!employeeId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      const records = MOCK_LEAVE_DATA[employeeId] || [];
      setData(records);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [employeeId]);

  const handleDelete = (record) => {
    if (window.confirm(`Are you sure you want to delete leave record for ${record.leaveType} (${record.startDate} - ${record.endDate})?`)) {
      setData(prev => prev.filter(r => r.id !== record.id));
      notificationService.success('Record deleted successfully.');
    }
  };

  const handleEditOpen = (record) => {
    setEditRecord(record);
    setEditForm({ ...record });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (!editRecord) return;
    setData(prev => prev.map(r => r.id === editRecord.id ? { ...editForm } : r));
    setEditRecord(null);
    setViewRecord(null);
  };

  const handleAddOpen = () => {
    setAddForm({
      leaveType: '',
      applicationDate: '',
      startDate: '',
      endDate: '',
      days: '',
      leaveReason: '',
      reportingOfficer: '',
      approvalDate: '',
      status: 'Pending',
      comments: ''
    });
    setAddOpen(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSave = () => {
    const newId = data.length > 0 ? Math.max(...data.map(r => r.id)) + 1 : 1;
    setData(prev => [{ ...addForm, id: newId }, ...prev]);
    setAddOpen(false);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startEntry = data.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1;
  const endEntry = Math.min(safePage * PER_PAGE, data.length);
  const paginatedData = data.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const pageNumbers = [];
  const maxVisible = 5;
  let pageStart = Math.max(1, safePage - Math.floor(maxVisible / 2));
  let pageEnd = Math.min(totalPages, pageStart + maxVisible - 1);
  if (pageEnd - pageStart + 1 < maxVisible) pageStart = Math.max(1, pageEnd - maxVisible + 1);
  for (let i = pageStart; i <= pageEnd; i++) pageNumbers.push(i);

  if (loading) {
    return (
      <div className="reg-history-loading">
        <div className="reg-history-spinner" />
        <p>Loading leave history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reg-history-empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h4>Unable to Load Data</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="reg-history-empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <h4>No Leave History</h4>
        <p>There are no leave records for this employee.</p>
      </div>
    );
  }

  return (
    <div className="reg-history-section">
      <div className="reg-history-section-header">
        <h4 className="leave-form-section-title">Leave History</h4>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddOpen}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Leave History
        </button>
      </div>

      <div className="reg-history-table-wrap">
        <table className="reg-history-table">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Application Date</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Number of Days</th>
              <th>Leave Reason</th>
              <th>Reporting Officer</th>
              <th>Status</th>
              <th className="reg-history-action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record) => {
              const ss = STATUS_STYLES[record.status] || { bg: '#F3F4F6', color: '#4B5563' };
              return (
                <tr key={record.id}>
                  <td>{record.leaveType}</td>
                  <td>{record.applicationDate}</td>
                  <td>{record.startDate}</td>
                  <td>{record.endDate}</td>
                  <td className="reg-history-table-center">{record.days}</td>
                  <td>{record.leaveReason}</td>
                  <td>{record.reportingOfficer}</td>
                  <td><span className="reg-history-status" style={{ background: ss.bg, color: ss.color }}>{record.status}</span></td>
                  <td className="reg-history-action-cell">
                    <button className="reg-history-action-btn" title="View" onClick={() => setViewRecord(record)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="reg-history-action-btn" title="Edit" onClick={() => handleEditOpen(record)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="reg-history-action-btn reg-history-action-btn--danger" title="Delete" onClick={() => handleDelete(record)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length > PER_PAGE && (
        <div className="reg-history-pagination">
          <div className="reg-history-pagination-left">
            <span className="reg-history-pagination-info">Showing <b>{startEntry}</b> to <b>{endEntry}</b> of <b>{data.length}</b> entries</span>
          </div>
          <div className="reg-history-pagination-right">
            <button className="reg-history-page-btn" disabled={safePage === 1} onClick={() => setCurrentPage(1)} title="First">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
            </button>
            <button className="reg-history-page-btn" disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)} title="Previous">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="reg-history-page-numbers">
              {pageNumbers.map(p => (
                <button key={p} className={`reg-history-page-num ${p === safePage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
            </div>
            <button className="reg-history-page-btn" disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)} title="Next">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="reg-history-page-btn" disabled={safePage === totalPages} onClick={() => setCurrentPage(totalPages)} title="Last">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
            </button>
          </div>
        </div>
      )}

      {viewRecord && (
        <Modal
          isOpen={!!viewRecord}
          onClose={() => setViewRecord(null)}
          title="Leave History Details"
          size="md"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setViewRecord(null)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => { setViewRecord(null); handleEditOpen(viewRecord); }}>Edit</button>
            </>
          }
        >
          <div className="reg-detail-modal-body">
            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Leave Information</h5>
              <div className="reg-history-detail-grid">
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Leave Type</span><span className="reg-history-detail-value">{viewRecord.leaveType}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Application Date</span><span className="reg-history-detail-value">{viewRecord.applicationDate}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Start Date</span><span className="reg-history-detail-value">{viewRecord.startDate}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">End Date</span><span className="reg-history-detail-value">{viewRecord.endDate}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Number of Days</span><span className="reg-history-detail-value">{viewRecord.days}</span></div>
                <div className="reg-history-detail-item reg-history-detail-item--full"><span className="reg-history-detail-label">Leave Reason</span><span className="reg-history-detail-value">{viewRecord.leaveReason}</span></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Approval Information</h5>
              <div className="reg-history-detail-grid">
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Reporting Officer</span><span className="reg-history-detail-value">{viewRecord.reportingOfficer}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Approval Date</span><span className="reg-history-detail-value">{viewRecord.approvalDate || '—'}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Approval Status</span><span className="reg-history-detail-value"><span className="reg-history-status" style={{ background: STATUS_STYLES[viewRecord.status]?.bg, color: STATUS_STYLES[viewRecord.status]?.color }}>{viewRecord.status}</span></span></div>
                {viewRecord.comments && <div className="reg-history-detail-item reg-history-detail-item--full"><span className="reg-history-detail-label">Comments</span><span className="reg-history-detail-value">{viewRecord.comments}</span></div>}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {editRecord && (
        <Modal
          isOpen={!!editRecord}
          onClose={() => setEditRecord(null)}
          title="Edit Leave Record"
          size="lg"
          className="reg-history-modal"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setEditRecord(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
            </>
          }
        >
          <div className="reg-detail-modal-body">
            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Leave Information</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Leave Type</label><input name="leaveType" className="form-input" value={editForm.leaveType || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Application Date</label><input type="date" name="applicationDate" className="form-input" value={editForm.applicationDate || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Start Date</label><input type="date" name="startDate" className="form-input" value={editForm.startDate || ''} onChange={handleEditChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">End Date</label><input type="date" name="endDate" className="form-input" value={editForm.endDate || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Number of Days</label><input type="number" name="days" className="form-input" value={editForm.days || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Reporting Officer</label><input name="reportingOfficer" className="form-input" value={editForm.reportingOfficer || ''} onChange={handleEditChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Status</label>
                  <select name="status" className="form-input form-select" value={editForm.status || ''} onChange={handleEditChange}>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Approval Date</label><input type="date" name="approvalDate" className="form-input" value={editForm.approvalDate || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Comments</label><input name="comments" className="form-input" value={editForm.comments || ''} onChange={handleEditChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">Leave Reason</label><input name="leaveReason" className="form-input" value={editForm.leaveReason || ''} onChange={handleEditChange} /></div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {addOpen && (
        <Modal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          title="Add Leave History"
          size="lg"
          className="reg-history-modal"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleAddSave}>Save Record</button>
            </>
          }
        >
          <div className="reg-detail-modal-body">
            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Leave Information</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Leave Type</label><input name="leaveType" className="form-input" value={addForm.leaveType || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Application Date</label><input type="date" name="applicationDate" className="form-input" value={addForm.applicationDate || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Start Date</label><input type="date" name="startDate" className="form-input" value={addForm.startDate || ''} onChange={handleAddChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">End Date</label><input type="date" name="endDate" className="form-input" value={addForm.endDate || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Number of Days</label><input type="number" name="days" className="form-input" value={addForm.days || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Reporting Officer</label><input name="reportingOfficer" className="form-input" value={addForm.reportingOfficer || ''} onChange={handleAddChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Status</label>
                  <select name="status" className="form-input form-select" value={addForm.status || ''} onChange={handleAddChange}>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Approval Date</label><input type="date" name="approvalDate" className="form-input" value={addForm.approvalDate || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Comments</label><input name="comments" className="form-input" value={addForm.comments || ''} onChange={handleAddChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">Leave Reason</label><input name="leaveReason" className="form-input" value={addForm.leaveReason || ''} onChange={handleAddChange} /></div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default LeaveHistoryTab;
