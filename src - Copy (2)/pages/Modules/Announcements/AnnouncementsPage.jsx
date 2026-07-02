import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import './AnnouncementsPage.css';

const ANNOUNCEMENTS = [
  { id: 1, title: 'End of Year Staff Party', category: 'general', date: '2026-06-25', read: false, content: 'All staff are invited to the annual end-of-year party on 15th December 2026 at the Headquarters. Please confirm attendance by 1st December.', author: 'HR Department' },
  { id: 2, title: 'New Leave Policy Effective July 2026', category: 'policy', date: '2026-06-20', read: false, content: 'The updated leave policy includes changes to annual leave accumulation and sick leave documentation requirements. Please review the attached document.', author: 'Policy Unit' },
  { id: 3, title: 'Mandatory Cybersecurity Training', category: 'training', date: '2026-06-18', read: true, content: 'All staff must complete the cybersecurity awareness training by 30th July 2026. Login credentials have been sent to your email.', author: 'ICT Department' },
  { id: 4, title: 'Office Closure - Public Holiday', category: 'general', date: '2026-06-15', read: true, content: 'The office will be closed on 9th July 2026 for the Saba Saba public holiday. Normal operations resume on 10th July.', author: 'Administration' },
  { id: 5, title: 'Emergency: Water Disruption at HQ', category: 'emergency', date: '2026-06-10', read: true, content: 'Water supply at Headquarters will be disrupted on 12th June from 8:00 AM to 2:00 PM due to maintenance works. Please plan accordingly.', author: 'Facilities' },
];

const CATEGORY_STYLES = {
  general:   { bg: '#EAF4FF', color: '#2F80ED', label: 'General' },
  training:  { bg: '#F5F3FF', color: '#7C3AED', label: 'Training' },
  policy:    { bg: '#FFFBEB', color: '#D97706', label: 'Policy' },
  emergency: { bg: '#FFF1F2', color: '#BE123C', label: 'Emergency' },
};

function AnnouncementsPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'all'
    ? ANNOUNCEMENTS
    : ANNOUNCEMENTS.filter(a => a.category === filter);

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Announcements" subtitle="Stay updated with HR news and notices" color="#0B2E59" />

        <div className="filter-bar">
          {['all', 'general', 'training', 'policy', 'emergency'].map(cat => (
            <button
              key={cat}
              className={`filter-pill ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : CATEGORY_STYLES[cat]?.label || cat}
            </button>
          ))}
        </div>

        <div className="announcements-list">
          {filtered.map(a => {
            const style = CATEGORY_STYLES[a.category] || CATEGORY_STYLES.general;
            return (
              <Card key={a.id} className="announcement-card" hover>
                <div className="announcement-header">
                  <div className="announcement-meta">
                    {!a.read && <span className="announcement-unread" />}
                    <span className="badge" style={{ background: style.bg, color: style.color }}>{style.label}</span>
                    <span className="announcement-date">{a.date}</span>
                  </div>
                  <span className="announcement-author">{a.author}</span>
                </div>
                <h4 className="announcement-title">{a.title}</h4>
                <p className="announcement-preview">{a.content.substring(0, 120)}...</p>
                <button className="link-btn" onClick={() => setSelected(a)}>Read more</button>
              </Card>
            );
          })}
        </div>

        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selected.title}</h3>
                <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="announcement-detail-meta">
                  <span className="badge" style={{
                    background: CATEGORY_STYLES[selected.category]?.bg,
                    color: CATEGORY_STYLES[selected.category]?.color
                  }}>{CATEGORY_STYLES[selected.category]?.label}</span>
                  <span>{selected.date}</span>
                  <span>{selected.author}</span>
                </div>
                <p className="announcement-detail-body">{selected.content}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AnnouncementsPage;
