import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import './DocumentsPage.css';

const DOCUMENTS = [
  { id: 1, name: 'Payslip - June 2026', type: 'Payslip', category: 'payslip', date: '2026-06-30', size: '245 KB' },
  { id: 2, name: 'Payslip - May 2026', type: 'Payslip', category: 'payslip', date: '2026-05-31', size: '240 KB' },
  { id: 3, name: 'Appointment Letter', type: 'Letter', category: 'letter', date: '2010-06-01', size: '1.2 MB' },
  { id: 4, name: 'Employment Contract', type: 'Contract', category: 'contract', date: '2010-06-01', size: '850 KB' },
  { id: 5, name: 'Cybersecurity Certificate', type: 'Certificate', category: 'certificate', date: '2025-11-20', size: '320 KB' },
  { id: 6, name: 'Performance Review 2025', type: 'Review', category: 'review', date: '2025-12-20', size: '500 KB' },
];

const CATEGORIES = [
  { key: 'all', label: 'All Documents' },
  { key: 'payslip', label: 'Payslips' },
  { key: 'letter', label: 'Letters' },
  { key: 'contract', label: 'Contracts' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'review', label: 'Reviews' },
];

const TYPE_ICONS = {
  Payslip: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
  Letter: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Contract: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Certificate: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  Review: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
};

function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? DOCUMENTS
    : DOCUMENTS.filter(d => d.category === activeCategory);

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Documents Center" subtitle="Access and download your official documents" color="#0B2E59" />

        <div className="doc-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`doc-category-card ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span className="doc-category-label">{cat.label}</span>
              <span className="doc-category-count">
                {cat.key === 'all' ? DOCUMENTS.length : DOCUMENTS.filter(d => d.category === cat.key).length}
              </span>
            </button>
          ))}
        </div>

        <Card hover={false}>
          <div className="documents-table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-name-cell">
                        <div className="doc-type-icon">{TYPE_ICONS[doc.type] || TYPE_ICONS.Letter}</div>
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{doc.type}</span></td>
                    <td>{doc.date}</td>
                    <td>{doc.size}</td>
                    <td><button className="btn btn-sm btn-secondary">Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default DocumentsPage;
