import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import { notificationService } from '../Notifications/notificationService';

const MOCK_TRANSFER_DATA = {
  'EMP-001': [
    { id: 1, transferDate: '2022-06-01', prevTerritory: 'Dar es Salaam', prevRegion: 'Dar es Salaam', prevStation: 'Ilala Office', prevDepartment: 'Administration', newTerritory: 'Dar es Salaam', newRegion: 'Dar es Salaam', newStation: 'Immigration HQ', newDepartment: 'Human Resource Management', transferType: 'Promotion', transferReason: 'Promotion to HR Officer', approvedBy: 'Director HR', approvalDate: '2022-05-20', status: 'Completed', comments: 'Effective immediately' },
    { id: 2, transferDate: '2019-03-15', prevTerritory: 'Mwanza', prevRegion: 'Mwanza', prevStation: 'Mwanza Regional Office', prevDepartment: 'General Services', newTerritory: 'Dar es Salaam', newRegion: 'Dar es Salaam', newStation: 'Ilala Office', newDepartment: 'Administration', transferType: 'Normal Transfer', transferReason: 'Organizational restructuring', approvedBy: 'Director Administration', approvalDate: '2019-02-28', status: 'Completed', comments: '' },
    { id: 3, transferDate: '2015-01-15', prevTerritory: 'Arusha', prevRegion: 'Arusha', prevStation: 'Arusha Regional Office', prevDepartment: 'Entry Level', newTerritory: 'Mwanza', newRegion: 'Mwanza', newStation: 'Mwanza Regional Office', newDepartment: 'General Services', transferType: 'Deployment', transferReason: 'Initial deployment after recruitment', approvedBy: 'Director General', approvalDate: '2014-12-10', status: 'Completed', comments: 'First appointment' },
  ],
  'EMP-002': [
    { id: 1, transferDate: '2023-01-15', prevTerritory: 'Dar es Salaam', prevRegion: 'Dar es Salaam', prevStation: 'Temeke Office', prevDepartment: 'General Services', newTerritory: 'Dar es Salaam', newRegion: 'Dar es Salaam', newStation: 'Immigration HQ', newDepartment: 'Immigration Services', transferType: 'Promotion', transferReason: 'Promotion to Immigration Officer Grade II', approvedBy: 'Director Immigration', approvalDate: '2022-12-20', status: 'Completed', comments: '' },
    { id: 2, transferDate: '2012-03-01', prevTerritory: 'Kilimanjaro', prevRegion: 'Kilimanjaro', prevStation: 'Moshi Office', prevDepartment: 'Entry Level', newTerritory: 'Dar es Salaam', newRegion: 'Dar es Salaam', newStation: 'Temeke Office', newDepartment: 'General Services', transferType: 'Normal Transfer', transferReason: 'Routine transfer', approvedBy: 'Director General', approvalDate: '2012-02-15', status: 'Completed', comments: 'Initial posting' },
  ],
  'EMP-003': [
    { id: 1, transferDate: '2023-06-01', prevTerritory: 'Dar es Salaam', prevRegion: 'Dar es Salaam', prevStation: 'Immigration HQ', prevDepartment: 'Administration', newTerritory: 'Dodoma', newRegion: 'Dodoma', newStation: 'Immigration HQ', newDepartment: 'Finance', transferType: 'Normal Transfer', transferReason: 'Departmental reassignment', approvedBy: 'Director Finance', approvalDate: '2023-05-15', status: 'Completed', comments: 'Relocation to Dodoma' },
  ],
  'EMP-004': [
    { id: 1, transferDate: '2024-01-15', prevTerritory: 'Dar es Salaam', prevRegion: 'Dar es Salaam', prevStation: 'Immigration HQ', prevDepartment: 'ICT Support', newTerritory: 'Arusha', newRegion: 'Arusha', newStation: 'Arusha Regional Office', newDepartment: 'ICT', transferType: 'Normal Transfer', transferReason: 'Regional ICT support coverage', approvedBy: 'Director ICT', approvalDate: '2023-12-20', status: 'Completed', comments: '' },
    { id: 2, transferDate: '2018-09-01', prevTerritory: 'Arusha', prevRegion: 'Arusha', prevStation: 'Arusha Regional Office', prevDepartment: 'Entry Level', newTerritory: 'Dar es Salaam', newRegion: 'Dar es Salaam', newStation: 'Immigration HQ', newDepartment: 'ICT Support', transferType: 'Deployment', transferReason: 'Initial deployment', approvedBy: 'Director General', approvalDate: '2018-08-10', status: 'Completed', comments: 'First appointment' },
  ],
  'EMP-005': [
    { id: 1, transferDate: '2022-12-01', prevTerritory: 'Dar es Salaam', prevRegion: 'Dar es Salaam', prevStation: 'Immigration HQ', prevDepartment: 'Human Resource Management', newTerritory: 'Mwanza', newRegion: 'Mwanza', newStation: 'Mwanza Regional Office', newDepartment: 'Administration', transferType: 'Normal Transfer', transferReason: 'Regional office strengthening', approvedBy: 'Director Administration', approvalDate: '2022-11-15', status: 'Completed', comments: '' },
    { id: 2, transferDate: '2014-02-01', prevTerritory: 'Mwanza', prevRegion: 'Mwanza', prevStation: 'Mwanza Regional Office', prevDepartment: 'Entry Level', newTerritory: 'Dar es Salaam', newRegion: 'Dar es Salaam', newStation: 'Immigration HQ', newDepartment: 'Human Resource Management', transferType: 'Deployment', transferReason: 'Initial deployment after recruitment', approvedBy: 'Director General', approvalDate: '2014-01-20', status: 'Completed', comments: 'First appointment' },
  ],
};

const STATUS_STYLES = {
  Completed: { bg: '#ECFDF5', color: '#059669' },
  Pending: { bg: '#FFFBEB', color: '#D97706' },
  Cancelled: { bg: '#FEF2F2', color: '#DC2626' },
};

const PER_PAGE = 3;

function TransferHistoryTab({ employeeId }) {
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
      const records = MOCK_TRANSFER_DATA[employeeId] || [];
      setData(records);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [employeeId]);

  const handleDelete = (record) => {
    if (window.confirm(`Are you sure you want to delete transfer record dated ${record.transferDate}?`)) {
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
      transferDate: '',
      prevTerritory: '',
      prevRegion: '',
      prevStation: '',
      prevDepartment: '',
      newTerritory: '',
      newRegion: '',
      newStation: '',
      newDepartment: '',
      transferType: '',
      transferReason: '',
      approvedBy: '',
      approvalDate: '',
      status: 'Completed',
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
        <p>Loading transfer history...</p>
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
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <h4>No Transfer History</h4>
        <p>There are no transfer records for this employee.</p>
      </div>
    );
  }

  return (
    <div className="reg-history-section">
      <div className="reg-history-section-header">
        <h4 className="leave-form-section-title">Transfer History</h4>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddOpen}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Transfer History
        </button>
      </div>

      <div className="reg-history-table-wrap">
        <table className="reg-history-table">
          <thead>
            <tr>
              <th>Transfer Date</th>
              <th>Previous Station</th>
              <th>Previous Department</th>
              <th>New Station</th>
              <th>New Department</th>
              <th>Transfer Type</th>
              <th>Status</th>
              <th className="reg-history-action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record) => {
              const ss = STATUS_STYLES[record.status] || { bg: '#F3F4F6', color: '#4B5563' };
              return (
                <tr key={record.id}>
                  <td>{record.transferDate}</td>
                  <td>{record.prevStation}</td>
                  <td>{record.prevDepartment}</td>
                  <td>{record.newStation}</td>
                  <td>{record.newDepartment}</td>
                  <td>{record.transferType}</td>
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
          title="Transfer History Details"
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
              <h5 className="reg-detail-modal-section-title">Transfer Information</h5>
              <div className="reg-history-detail-grid">
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Transfer Date</span><span className="reg-history-detail-value">{viewRecord.transferDate}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Transfer Type</span><span className="reg-history-detail-value">{viewRecord.transferType}</span></div>
                <div className="reg-history-detail-item reg-history-detail-item--full"><span className="reg-history-detail-label">Transfer Reason</span><span className="reg-history-detail-value">{viewRecord.transferReason}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Status</span><span className="reg-history-detail-value"><span className="reg-history-status" style={{ background: STATUS_STYLES[viewRecord.status]?.bg, color: STATUS_STYLES[viewRecord.status]?.color }}>{viewRecord.status}</span></span></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Previous Assignment</h5>
              <div className="reg-history-detail-grid">
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Previous Territory</span><span className="reg-history-detail-value">{viewRecord.prevTerritory}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Previous Region</span><span className="reg-history-detail-value">{viewRecord.prevRegion}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Previous Working Station</span><span className="reg-history-detail-value">{viewRecord.prevStation}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Previous Department</span><span className="reg-history-detail-value">{viewRecord.prevDepartment}</span></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">New Assignment</h5>
              <div className="reg-history-detail-grid">
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">New Territory</span><span className="reg-history-detail-value">{viewRecord.newTerritory}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">New Region</span><span className="reg-history-detail-value">{viewRecord.newRegion}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">New Working Station</span><span className="reg-history-detail-value">{viewRecord.newStation}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">New Department</span><span className="reg-history-detail-value">{viewRecord.newDepartment}</span></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Approval Information</h5>
              <div className="reg-history-detail-grid">
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Approved By</span><span className="reg-history-detail-value">{viewRecord.approvedBy}</span></div>
                <div className="reg-history-detail-item"><span className="reg-history-detail-label">Approval Date</span><span className="reg-history-detail-value">{viewRecord.approvalDate}</span></div>
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
          title="Edit Transfer Record"
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
              <h5 className="reg-detail-modal-section-title">Transfer Information</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Transfer Date</label><input type="date" name="transferDate" className="form-input" value={editForm.transferDate || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Transfer Type</label><input name="transferType" className="form-input" value={editForm.transferType || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select name="status" className="form-input form-select" value={editForm.status || ''} onChange={handleEditChange}>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Approved By</label><input name="approvedBy" className="form-input" value={editForm.approvedBy || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Approval Date</label><input type="date" name="approvalDate" className="form-input" value={editForm.approvalDate || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Comments</label><input name="comments" className="form-input" value={editForm.comments || ''} onChange={handleEditChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">Transfer Reason</label><input name="transferReason" className="form-input" value={editForm.transferReason || ''} onChange={handleEditChange} /></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Previous Assignment</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Previous Territory</label><input name="prevTerritory" className="form-input" value={editForm.prevTerritory || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Previous Region</label><input name="prevRegion" className="form-input" value={editForm.prevRegion || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">Previous Station</label><input name="prevStation" className="form-input" value={editForm.prevStation || ''} onChange={handleEditChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">Previous Department</label><input name="prevDepartment" className="form-input" value={editForm.prevDepartment || ''} onChange={handleEditChange} /></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">New Assignment</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">New Territory</label><input name="newTerritory" className="form-input" value={editForm.newTerritory || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">New Region</label><input name="newRegion" className="form-input" value={editForm.newRegion || ''} onChange={handleEditChange} /></div>
                <div className="form-group"><label className="form-label">New Station</label><input name="newStation" className="form-input" value={editForm.newStation || ''} onChange={handleEditChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">New Department</label><input name="newDepartment" className="form-input" value={editForm.newDepartment || ''} onChange={handleEditChange} /></div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {addOpen && (
        <Modal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          title="Add Transfer History"
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
              <h5 className="reg-detail-modal-section-title">Transfer Information</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Transfer Date</label><input type="date" name="transferDate" className="form-input" value={addForm.transferDate || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Transfer Type</label><input name="transferType" className="form-input" value={addForm.transferType || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select name="status" className="form-input form-select" value={addForm.status || ''} onChange={handleAddChange}>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Approved By</label><input name="approvedBy" className="form-input" value={addForm.approvedBy || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Approval Date</label><input type="date" name="approvalDate" className="form-input" value={addForm.approvalDate || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Comments</label><input name="comments" className="form-input" value={addForm.comments || ''} onChange={handleAddChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">Transfer Reason</label><input name="transferReason" className="form-input" value={addForm.transferReason || ''} onChange={handleAddChange} /></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">Previous Assignment</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">Previous Territory</label><input name="prevTerritory" className="form-input" value={addForm.prevTerritory || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Previous Region</label><input name="prevRegion" className="form-input" value={addForm.prevRegion || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">Previous Station</label><input name="prevStation" className="form-input" value={addForm.prevStation || ''} onChange={handleAddChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">Previous Department</label><input name="prevDepartment" className="form-input" value={addForm.prevDepartment || ''} onChange={handleAddChange} /></div>
              </div>
            </div>

            <div className="reg-detail-modal-section">
              <h5 className="reg-detail-modal-section-title">New Assignment</h5>
              <div className="leave-form-row">
                <div className="form-group"><label className="form-label">New Territory</label><input name="newTerritory" className="form-input" value={addForm.newTerritory || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">New Region</label><input name="newRegion" className="form-input" value={addForm.newRegion || ''} onChange={handleAddChange} /></div>
                <div className="form-group"><label className="form-label">New Station</label><input name="newStation" className="form-input" value={addForm.newStation || ''} onChange={handleAddChange} /></div>
              </div>
              <div className="leave-form-row">
                <div className="form-group reg-history-detail-item--full"><label className="form-label">New Department</label><input name="newDepartment" className="form-input" value={addForm.newDepartment || ''} onChange={handleAddChange} /></div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TransferHistoryTab;
