import React, { useState, useRef, useMemo } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import { openDocument } from '../../../utils/preview';
import Card from '../../../components/common/Card/Card';
import Modal from '../../../components/common/Modal/Modal';
import DataTable from '../../../components/common/DataTable/DataTable';
import RegionSelect from '../../../components/common/location/RegionSelect';
import DistrictSelect from '../../../components/common/location/DistrictSelect';
import WardSelect from '../../../components/common/location/WardSelect';
import { useAuth } from '../../../context/AuthContext';
import { DEMO_EMPLOYEES } from '../../../data/demoEmployees';
import uhamiajiLogo from '../../../assets/images/uhamiaji_logo.png';
import html2pdf from 'html2pdf.js';
import { notificationService } from '../../../components/Notifications/notificationService';
import './LikizoPage.css';

const LEAVE_HISTORY = [
  // Newest first — current year at the top
  { id: 'LV-2026-001', type: 'Annual Leave', from: '2026-07-01', to: '2026-07-14', days: 14, status: 'Approved', appliedOn: '2026-06-15', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-06-18', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Family vacation and annual rest period', handover: 'Tasks delegated to Assistant HR Officer James Kibonde', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101', hasDocument: true },
  { id: 'LV-2026-002', type: 'Sick Leave', from: '2026-05-10', to: '2026-05-12', days: 3, status: 'Approved', appliedOn: '2026-05-09', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-05-09', region: 'Dar es Salaam', district: 'Ilala', reason: 'Medical treatment at Muhimbili Hospital', handover: 'Duties covered by Senior Officer Peter Lema', contactAddress: 'House 12, Upanga, Dar es Salaam', contactPhone: '+255 789 123 456', hasDocument: true },
  { id: 'LV-2026-004', type: 'Special Leave', from: '2026-02-14', to: '2026-02-16', days: 3, status: 'Approved', appliedOn: '2026-02-10', approvedBy: 'Mr. Joseph Mwangi', approverRole: 'Director General', decisionDate: '2026-02-12', region: 'Mbeya', district: 'Mbeya City', reason: 'Attending national cultural event as representative', handover: 'Responsibilities transferred to Deputy Director Sarah Mkonde', contactAddress: 'Plot 8, Sokoine Road, Mbeya', contactPhone: '+255 767 890 234', hasDocument: true },

  // Historical Annual Leave records — one per year, descending by year
  { id: 'LV-2025-001', type: 'Annual Leave', from: '2025-03-12', to: '2025-03-25', days: 14, status: 'Approved', appliedOn: '2025-03-01', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2025-03-05', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Annual rest and family visit', handover: 'Duties covered by Assistant HR Officer James Kibonde', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101', hasDocument: true },
  { id: 'LV-2024-001', type: 'Annual Leave', from: '2024-04-08', to: '2024-04-21', days: 14, status: 'Approved', appliedOn: '2024-03-25', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2024-03-28', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Annual leave travel to visit relatives', handover: 'Responsibilities assigned to Senior Officer Peter Lema', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101', hasDocument: true },
  { id: 'LV-2023-001', type: 'Annual Leave', from: '2023-04-17', to: '2023-04-30', days: 14, status: 'Approved', appliedOn: '2023-04-05', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2023-04-08', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Family vacation during school break', handover: 'Work handled by Deputy Director Sarah Mkonde', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101', hasDocument: true },
  { id: 'LV-2022-001', type: 'Annual Leave', from: '2022-05-11', to: '2022-05-24', days: 14, status: 'Approved', appliedOn: '2022-04-28', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2022-05-02', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Annual rest period and family obligations', handover: 'Tasks delegated to Assistant HR Officer James Kibonde', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101', hasDocument: true },
];

const CONFIRMATION_LETTERS = [
  { id: 'CL-2026-001', type: 'Annual Leave', period: '01 Jul 2026 - 14 Jul 2026', days: 14, issued: '15 Jun 2026', status: 'Issued', hasDocument: true },
  { id: 'CL-2026-002', type: 'Sick Leave', period: '10 May 2026 - 12 May 2026', days: 3, issued: '16 May 2026', status: 'Issued', hasDocument: true },
  { id: 'CL-2026-003', type: 'Special Leave', period: '05 Aug 2026 - 07 Aug 2026', days: 3, issued: '01 Aug 2026', status: 'Issued', hasDocument: true },
];

const CURRENT_EMPLOYEE = {
  jobTitle: 'Senior Immigration Officer',
  rank: 'SW/5/2',
  workStation: 'Dodoma Regional Immigration Office',
  department: 'Passport Control',
  simu: '+255 22 2850575/6',
  kumb: 'PF',
  office: 'OFISI YA KAMISHNA JENERALI WA UHAMIAJI, S. L. P. 1181, DODOMA.',
};

const STATUS_STYLE = {
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Approved': { background: '#ECFDF5', color: '#059669' },
  'Rejected': { background: '#FFF1F2', color: '#BE123C' },
  'Returned for Correction': { background: '#FEF3C7', color: '#92400E' },
  'Issued': { background: '#ECFDF5', color: '#059669' },
  'Ready': { background: '#EFF6FF', color: '#2563EB' },
};

const PAYMENT_STATUS_STYLE = {
  'PAID': { background: '#ECFDF5', color: '#059669' },
  'NOT PAID': { background: '#FFFBEB', color: '#D97706' },
  'N/A': { background: '#F3F4F6', color: '#6B7280' },
};

const TAB_ICONS = {
  overview: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>,
  history: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  confirmation: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  calendar: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'history', label: 'Leave History' },
  { key: 'confirmation', label: 'Confirmation Letter' },
  { key: 'calendar', label: 'Leave Calendar' },
];

function LikizoPage() {
  const { user } = useAuth();

  const applicant = useMemo(() => {
    if (!user) return null;
    if (user.employeeNumber) {
      const byNumber = DEMO_EMPLOYEES.find(e => e.employeeNumber === user.employeeNumber);
      if (byNumber) return byNumber;
    }
    if (user.email) {
      const byEmail = DEMO_EMPLOYEES.find(e => e.officialEmail === user.email);
      if (byEmail) return byEmail;
    }
    if (user.username) {
      const byUsername = DEMO_EMPLOYEES.find(e => e.officialEmail && e.officialEmail.startsWith(`${user.username}@`));
      if (byUsername) return byUsername;
    }
    return null;
  }, [user]);

  // Derive Region/Station from the employee's work location and compute Payment Status
  // for Annual Leave only, based on the alternating annual-leave payment cycle from
  // the employee's first applicable Annual Leave year. Other leave types are N/A.
  // If the backend already provides a paymentStatus value, that value is displayed as-is.
  const leaveTableData = useMemo(() => {
    if (!LEAVE_HISTORY.length) return [];

    const getYear = (dateStr) => {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
    };

    const annualLeaves = [...LEAVE_HISTORY].filter(r => r.type === 'Annual Leave');
    const baselineYear = annualLeaves.length
      ? Math.min(...annualLeaves.map(r => getYear(r.from)))
      : new Date().getFullYear();

    return LEAVE_HISTORY.map(row => {
      if (row.paymentStatus && String(row.paymentStatus).trim()) {
        return {
          ...row,
          paymentStatus: String(row.paymentStatus).trim(),
          workingRegion: applicant?.workingRegion || row.region,
          workingStation: applicant?.workingStation || row.district,
        };
      }

      let paymentStatus;
      if (row.type === 'Annual Leave') {
        const offset = getYear(row.from) - baselineYear;
        paymentStatus = offset % 2 === 0 ? 'PAID' : 'NOT PAID';
      } else {
        paymentStatus = 'N/A';
      }

      return {
        ...row,
        paymentStatus,
        workingRegion: applicant?.workingRegion || row.region,
        workingStation: applicant?.workingStation || row.district,
      };
    });
  }, [applicant]);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFromDate, setApplyFromDate] = useState('');
  const [applyToDate, setApplyToDate] = useState('');
  const [supportingFiles, setSupportingFiles] = useState([]);
  const [dependants, setDependants] = useState([{ fullName: '', relationship: '', age: '' }]);
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [leaveLocation, setLeaveLocation] = useState({ region: '', district: '', ward: '' });
  const [fileError, setFileError] = useState('');
  const supportFileRef = useRef(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  const computeLeaveDays = (from, to) => {
    if (!from || !to) return '';
    const d1 = new Date(from);
    const d2 = new Date(to);
    if (d2 < d1) return '';
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };
  const leaveDays = computeLeaveDays(applyFromDate, applyToDate);

  const addDependant = () => {
    setDependants(prev => [...prev, { fullName: '', relationship: '', age: '' }]);
  };

  const removeDependant = (index) => {
    setDependants(prev => prev.filter((_, i) => i !== index));
  };

  const updateDependant = (index, field, value) => {
    setDependants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSupportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFileError('Unsupported file format. Please upload PDF, JPG, JPEG, or PNG.');
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File exceeds maximum size of 10MB.');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    if (replaceIndex !== null) {
      setSupportingFiles(prev => {
        const next = [...prev];
        URL.revokeObjectURL(next[replaceIndex].previewUrl);
        next[replaceIndex] = { file, previewUrl };
        return next;
      });
      setReplaceIndex(null);
    } else {
      setSupportingFiles(prev => [...prev, { file, previewUrl }]);
    }
    e.target.value = '';
  };

  const removeSupportFile = (idx) => {
    setSupportingFiles(prev => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].previewUrl);
      next.splice(idx, 1);
      return next;
    });
  };

  const generateMovementOrderHTML = (row, type) => {
    const logoUrl = new URL(uhamiajiLogo, window.location.href).href;
    const employeeName = user?.name || 'Employee Name';
    const fromDate = row.from || (row.period ? row.period.split(' - ')[0] : '-');
    const toDate = row.to || (row.period ? row.period.split(' - ')[1] : '-');
    return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${row.id}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html { background: #fff; overflow: hidden; }
  body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; font-size: 10pt; line-height: 1.3; overflow: hidden; }
  .page { width: 210mm; height: 297mm; margin: 0 auto; padding: 12mm 14mm; background: #fff; overflow: hidden; }
  .hdr-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 9pt; }
  .hdr-table td { vertical-align: top; padding: 0; line-height: 1.2; }
  .hdr-left { text-align: left; }
  .hdr-right { text-align: right; }
  .hdr-center { text-align: center; }
  .hdr-center h1 { font-size: 12pt; font-weight: 700; margin: 0 0 2px; text-transform: uppercase; }
  .hdr-center h2 { font-size: 11pt; font-weight: 700; margin: 0 0 2px; text-transform: uppercase; }
  .hdr-center h3 { font-size: 10pt; font-weight: 700; margin: 0; text-transform: uppercase; }
  .logo-wrap { text-align: center; margin: 4px 0 8px; }
  .logo-wrap img { height: 50px; }
  .doc-title { text-align: center; font-weight: 700; font-size: 12pt; text-transform: uppercase; margin-bottom: 2px; }
  .doc-subtitle { text-align: center; font-weight: 700; font-size: 10pt; margin-bottom: 14px; }
  .section-title { font-weight: 700; font-size: 10pt; margin: 14px 0 6px; text-transform: uppercase; }
  .field-row { display: flex; align-items: baseline; margin-bottom: 10px; }
  .field-label { flex-shrink: 0; font-weight: 500; white-space: nowrap; font-size: 10pt; }
  .field-value { flex: 1; border-bottom: 1px dotted #000; padding-left: 6px; min-height: 1em; font-weight: 600; font-size: 10pt; }
  .field-row.two-col { display: flex; gap: 14px; }
  .field-group { flex: 1; display: flex; align-items: baseline; }
  .dotted-area { min-height: 40px; border-bottom: 1px dotted #000; margin-bottom: 4px; }
  .signature { text-align: right; font-style: italic; margin-bottom: 8px; font-size: 9pt; }
  .footer { margin-top: 16px; font-size: 9pt; color: #555; text-align: center; }
  .section-hint { margin: 0 0 3px; font-size: 9pt; }
  @media print {
    html { background: #fff; }
    body { background: #fff; padding: 0; }
    .page { margin: 0 auto; box-shadow: none; width: 100%; height: 297mm; padding: 12mm 14mm; overflow: hidden; }
  }
</style></head>
<body>
  <div class="page">
    <table class="hdr-table"><tr>
      <td class="hdr-left" style="width:28%">SIMU: ${CURRENT_EMPLOYEE.simu}<br>KUMB: ${CURRENT_EMPLOYEE.kumb}</td>
      <td class="hdr-center" style="width:44%">
        <h1>Jamhuri ya Muungano wa Tanzania</h1>
        <h2>Wizara ya Mambo ya Ndani ya Nchi</h2>
        <h3>Idara ya Uhamiaji</h3>
      </td>
      <td class="hdr-right" style="width:28%">${CURRENT_EMPLOYEE.office}</td>
    </tr></table>
    <div class="logo-wrap"><img src="${logoUrl}" alt="Uhamiaji Logo" /></div>
    <div class="doc-title">Fomu ya Ruhusa ya Kutoka Nje ya Kituo cha Kazi</div>
    <div class="doc-subtitle">(Movement Order)</div>
    <div class="section-title">Sehemu A: (Jazwe na Muombaji)</div>
    <div class="field-row"><span class="field-label">1. Jina la muombaji:</span><span class="field-value">${employeeName}</span></div>
    <div class="field-row two-col">
      <div class="field-group"><span class="field-label">2. Kazi:</span><span class="field-value">${CURRENT_EMPLOYEE.jobTitle}</span></div>
      <div class="field-group"><span class="field-label">Cheo:</span><span class="field-value">${CURRENT_EMPLOYEE.rank}</span></div>
    </div>
    <div class="field-row"><span class="field-label">3. Stesheni:</span><span class="field-value">${CURRENT_EMPLOYEE.workStation}</span></div>
    <div class="field-row"><span class="field-label">4. Siku anazoomba:</span><span class="field-value">${row.days} siku</span></div>
    <div class="field-row two-col">
      <div class="field-group"><span class="field-label">5. Tarehe ya kuondoka:</span><span class="field-value">${fromDate}</span></div>
      <div class="field-group"><span class="field-label">Tarehe ya Kurudi:</span><span class="field-value">${toDate}</span></div>
    </div>
    <div class="field-row"><span class="field-label">6. Sababu ya safari:</span><span class="field-value">${row.reason || row.type || ''}</span></div>
    <div class="field-row"><span class="field-label">7. Anuani anapokwenda:</span><span class="field-value">${row.contactAddress || row.region + ', ' + row.district}</span></div>
    <div class="field-row"><span class="field-label">8. Namba ya simu:</span><span class="field-value">${row.contactPhone || '-'}</span></div>
    <div class="field-row"><span class="field-label">9. Sahihi ya mwombaji:</span><span class="field-value"></span></div>
    <div class="section-title">Sehemu B: (Jazwe na Mkuu wa Kitengo)</div>
    <p class="section-hint">Maoni ya mkuu wa kitengo ofisi anayofanya kazi muombaji</p>
    <div class="dotted-area"></div>
    <div class="signature">Sahihi na muhuri</div>
    <div class="section-title">Sehemu C: (Jazwe na Mkuu wa Utumishi)</div>
    <p class="section-hint">Maoni ya afisa utumishi</p>
    <div class="dotted-area"></div>
    <div class="signature">Sahihi na muhuri</div>
    <div class="section-title">Sehemu D: (Dharura Ndani ya Ruhusa) Jazwe na RIO, DRIO, DIO, au Mkuu wa Kituo Alichofikia Mtumishi</div>
    <div class="field-row two-col">
      <div class="field-group"><span class="field-label">Jina la afisa aliyeripoti:</span><span class="field-value"></span></div>
      <div class="field-group"><span class="field-label">Jina la afisa aliyeripotiwa:</span><span class="field-value"></span></div>
    </div>
    <div class="field-row two-col">
      <div class="field-group"><span class="field-label">Cheo:</span><span class="field-value"></span></div>
      <div class="field-group"><span class="field-label">Siku alizoomba:</span><span class="field-value"></span></div>
    </div>
    <div class="field-row"><span class="field-label">Sababu:</span><span class="field-value"></span></div>
    <div class="dotted-area"></div>
    <div class="signature">Sahihi na muhuri</div>
    <div class="section-title">Sehemu E: (Jazwe Baada ya Kurejea Safarini)</div>
    <div class="field-row two-col">
      <div class="field-group"><span class="field-label">Tarehe aliyorejea kazini:</span><span class="field-value"></span></div>
      <div class="field-group"><span class="field-label">Siku aliyoondoka:</span><span class="field-value"></span></div>
    </div>
    <div class="field-row"><span class="field-label">Sababu ya kuzidisha:</span><span class="field-value"></span></div>
    <div class="dotted-area"></div>
    <div class="signature">Sahihi na muhuri</div>
    <div class="footer">Ref: ${row.id} &middot; ${type === 'leave' ? 'Leave Application' : 'Confirmation / Movement Order'} &middot; Generated by HRMS Staff Portal</div>
  </div>
</body></html>
    `;
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const generateMovementOrderPDF = (row, type, filename) => {
    const html = generateMovementOrderHTML(row, type);
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-9999';
    container.innerHTML = html;
    document.body.appendChild(container);

    const pageEl = container.querySelector('.page');

    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    };

    return html2pdf().set(opt).from(pageEl).outputPdf('blob').then((blob) => {
      document.body.removeChild(container);
      return blob;
    });
  };

  const downloadLeaveDocument = (row) => {
    if (!row.hasDocument) return;
    const employeeName = (user?.name || 'Employee').replace(/\s+/g, '_');
    const dateStr = row.appliedOn ? row.appliedOn.replace(/-/g, '') : '';
    const filename = `Movement_Order_${employeeName}_${dateStr}.pdf`;
    generateMovementOrderPDF(row, 'leave', filename).then((blob) => {
      downloadBlob(blob, filename);
    });
  };

  const downloadConfirmationDocument = (row) => {
    if (!row.hasDocument) return;
    const employeeName = (user?.name || 'Employee').replace(/\s+/g, '_');
    const dateStr = row.issued ? row.issued.replace(/-/g, '') : '';
    const filename = `Movement_Order_${employeeName}_${dateStr}.pdf`;
    generateMovementOrderPDF(row, 'confirmation', filename).then((blob) => {
      downloadBlob(blob, filename);
    });
  };

  const viewDocument = (row, type) => {
    if (!row.hasDocument) return;
    setPreviewLoading(true);
    setPreviewError(false);
    const html = generateMovementOrderHTML(row, type);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewDoc({ url, title: type === 'leave' ? `Leave Application - ${row.id}` : `Confirmation Letter - ${row.id}`, row, type });
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Leave Management"
          subtitle="Manage your leave applications, view history, and download official documents"
          color="#0B2E59"
          ctaLabel="Apply for Leave"
          onCta={() => setShowApplyModal(true)}
        />

        <div className="reg-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`reg-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {TAB_ICONS[tab.key]}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <>
            <svg className="balance-gradient-defs"><defs><linearGradient id="balanceGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0B2E59" /><stop offset="100%" stopColor="#2F80ED" /></linearGradient></defs></svg>
            <div className="leave-overview-summary">
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">22</span><span className="overview-stat-label">Annual Leave Days Left</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value" style={{ fontSize: '17px' }}>10th Sept. 2026</span><span className="overview-stat-label">Date of Leave per Cycle</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">4</span><span className="overview-stat-label">Total Leave Records</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">2</span><span className="overview-stat-label">Available Documents</span></div>
              </Card>
            </div>
            <div className="leave-overview-recent">
              <div className="leave-section-header"><h3 className="leave-section-title">Recent Applications</h3></div>
              <div className="leave-recent-list">
                {LEAVE_HISTORY.slice(0, 3).map(row => (
                  <div key={row.id} className="leave-recent-item">
                    <div className="leave-recent-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div>
                    <div className="leave-recent-body"><span className="leave-recent-title">{row.type}</span><span className="leave-recent-meta">{row.from} &mdash; {row.to} &middot; {row.days} days</span></div>
                    <div className="leave-recent-status"><span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Apply for Leave Modal ── */}
        {showApplyModal && (
          <Modal
            isOpen={showApplyModal}
            onClose={() => setShowApplyModal(false)}
            title="Apply for Leave"
            size="lg"
            className="apply-leave-modal"
            footer={
              <div className="leave-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => notificationService.promise(new Promise(resolve => setTimeout(() => { setShowApplyModal(false); resolve(); }, 1000)), { loading: 'Submitting leave application...', success: 'Leave application submitted successfully.', error: 'Failed to submit leave application.' })}>Submit Application</button>
              </div>
            }
          >
            <form className="leave-form" onSubmit={e => e.preventDefault()}>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Basic Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" value={(applicant && applicant.fullName) || user?.fullName || user?.name || ''} disabled /></div>
                  <div className="form-group"><label className="form-label">Personal File No.</label><input type="text" className="form-input" value={(applicant && applicant.employeeNumber) || user?.employeeNumber || ''} disabled /></div>
                  <div className="form-group"><label className="form-label">Check No.</label><input type="text" className="form-input" value={(applicant && applicant.checkNumber) || user?.checkNumber || ''} disabled /></div>
                  <div className="form-group"><label className="form-label">TSD No.</label><input type="text" className="form-input" value={(applicant && applicant.forceNumber) || user?.forceNumber || ''} disabled /></div>
                  <div className="form-group"><label className="form-label">Designation</label><input type="text" className="form-input" value={(applicant && applicant.designation) || user?.designation || ''} disabled /></div>
                  <div className="form-group"><label className="form-label">Station</label><input type="text" className="form-input" value={(applicant && applicant.workingStation) || user?.workingStation || ''} disabled /></div>
                  <div className="form-group"><label className="form-label">Division / Department</label><input type="text" className="form-input" value={(applicant && applicant.department) || user?.department || ''} disabled /></div>
                  <div className="form-group"><label className="form-label">Date of First Appointment</label><input type="date" className="form-input" value={(applicant && applicant.dateOfFirstAppointment) || user?.dateOfFirstAppointment || ''} disabled /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Leave Details</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Leave Type</label><select className="form-input form-select"><option>Annual Leave</option><option>Sick Leave</option><option>Maternity Leave</option><option>Paternity Leave</option><option>Special Leave</option><option>Studying Leave</option><option>Retirement Leave</option></select></div>
                  <div className="form-group"><label className="form-label">From Date</label><input type="date" className="form-input" value={applyFromDate} onChange={e => setApplyFromDate(e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">To Date</label><input type="date" className="form-input" value={applyToDate} onChange={e => setApplyToDate(e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Leave Days</label><input type="text" className="form-input" value={leaveDays ? `${leaveDays} day${leaveDays !== 1 ? 's' : ''}` : ''} readOnly /></div>
                </div>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">I will travel to</label><input type="text" className="form-input" placeholder="e.g. Dodoma, Dar es Salaam" /></div>
                  <div className="form-group"><label className="form-label">I will stay for (Days)</label><input type="number" className="form-input" placeholder="Enter number of days" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Contact Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Region on Leave</label><RegionSelect value={leaveLocation.region} onChange={(val) => setLeaveLocation({ region: val, district: '', ward: '' })} placeholder="Select Region" /></div>
                  <div className="form-group"><label className="form-label">District on Leave</label><DistrictSelect value={leaveLocation.district} region={leaveLocation.region} onChange={(val) => setLeaveLocation({ ...leaveLocation, district: val, ward: '' })} placeholder="Select District" /></div>
                  <div className="form-group"><label className="form-label">Ward on Leave</label><WardSelect value={leaveLocation.ward} district={leaveLocation.district} onChange={(val) => setLeaveLocation({ ...leaveLocation, ward: val })} placeholder="Select Ward" /></div>
                  <div className="form-group"><label className="form-label">Contact Address While on Leave</label><input type="text" className="form-input" placeholder="Enter your contact address" /></div>
                  <div className="form-group"><label className="form-label">Contact Phone Number</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Additional Information</h4>
                <div className="leave-form-row leave-form-row--two">
                  <div className="form-group"><label className="form-label">Reason for Leave</label><textarea className="form-input" rows="4" placeholder="Provide a clear reason for your leave request..."></textarea></div>
                  <div className="form-group"><label className="form-label">Handover Notes / Acting Arrangements</label><textarea className="form-input" rows="4" placeholder="Describe who will act in your position and any handover details..."></textarea></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Dependants</h4>
                <p className="leave-form-hint">Add dependants who will accompany you on leave.</p>
                <div style={{ overflowX: 'auto' }}>
                  <div className="participant-table participant-table-header" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px', gap: 12, alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 8, marginBottom: 8, fontWeight: 600, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    <div>Full Name</div>
                    <div>Relationship</div>
                    <div>Gender</div>
                    <div>Age</div>
                    <div style={{ textAlign: 'center' }}>Action</div>
                  </div>
                  {dependants.map((dep, index) => (
                    <div key={index} className="participant-table" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                      <div data-label="Full Name">
                        <input type="text" className="form-input" placeholder="Enter full name" value={dep.fullName} onChange={(e) => updateDependant(index, 'fullName', e.target.value)} />
                      </div>
                      <div data-label="Relationship">
                        <select className="form-input form-select" value={dep.relationship} onChange={(e) => updateDependant(index, 'relationship', e.target.value)}>
                          <option value="" disabled>Select</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div data-label="Gender">
                        <select className="form-input form-select" value={dep.gender || ''} onChange={(e) => updateDependant(index, 'gender', e.target.value)}>
                          <option value="" disabled>Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div data-label="Age">
                        <input type="number" className="form-input" placeholder="Age" min="0" max="120" value={dep.age} onChange={(e) => updateDependant(index, 'age', e.target.value)} />
                      </div>
                      <div data-label="Action" style={{ textAlign: 'center' }}>
                        {dependants.length > 1 && (
                          <button type="button" className="btn btn-sm btn-secondary btn-remove-participant" onClick={() => removeDependant(index)} title="Remove dependant" style={{ padding: '4px 8px' }}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary btn-add-participant" onClick={addDependant}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Dependant
                  </button>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Supporting Documents</h4>
                <p className="leave-form-hint">Upload supporting documents if required for your leave application (e.g., medical certificate, approval letter, official invitation, or other supporting documents). Allowed formats: PDF, JPG, PNG (max 10MB each).</p>
                <input type="file" ref={supportFileRef} className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" onChange={handleSupportFile} />
                <div className="support-upload-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setReplaceIndex(null); supportFileRef.current?.click(); }}>Upload Document</button>
                </div>
                {fileError && <p className="form-error" style={{ marginTop: 8 }}>{fileError}</p>}
                {supportingFiles.length > 0 && (
                  <div className="support-attachments-list" style={{ marginTop: 16 }}>
                    {supportingFiles.map((item, idx) => (
                      <div key={idx} className="attachment-row">
                        <div className="attachment-icon">
                          {item.file.type === 'application/pdf' ? (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                          )}
                        </div>
                        <div className="attachment-info">
                          <p className="attachment-name">{item.file.name}</p>
                          <p className="attachment-hint">{(item.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className="attachment-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => openDocument(item.previewUrl, item.file.name)}>Preview</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => { setReplaceIndex(idx); supportFileRef.current?.click(); }}>Replace</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => removeSupportFile(idx)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </Modal>
        )}

        {/* ── Leave History ── */}
        {activeTab === 'history' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'type', header: 'Leave Type', render: row => <span className="leave-type">{row.type}</span> },
                { key: 'from', header: 'From Date' },
                { key: 'paymentStatus', header: 'Payment Status', render: row => <span className="status-pill" style={{ background: PAYMENT_STATUS_STYLE[row.paymentStatus]?.background, color: PAYMENT_STATUS_STYLE[row.paymentStatus]?.color }}>{row.paymentStatus}</span> },
                { key: 'days', header: 'Days', align: 'center', render: row => <span className="leave-days">{row.days}</span> },
                { key: 'workingRegion', header: 'Region' },
                { key: 'workingStation', header: 'Station' },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={leaveTableData}
              title="Leave History"
              searchPlaceholder="Search leave history..."
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(v => !v)}
              filters={[
                { key: 'type', label: 'Leave Type', options: ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Special Leave', 'Studying Leave', 'Retirement Leave'].map(t => ({ value: t, label: t })) },
                { key: 'status', label: 'Status', options: ['Approved', 'Pending', 'Rejected', 'Returned for Correction'].map(s => ({ value: s, label: s })) },
              ]}
              loading={isLoading}
              refreshAction={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }}
              exportAction={() => notificationService.info('Exporting leave history...')}
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => setSelectedLeave(row)} title="View Details">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                  <button
                    className="action-btn action-btn--download"
                    onClick={() => downloadLeaveDocument(row)}
                    title={row.hasDocument ? 'Download Document' : 'Document not available'}
                    disabled={!row.hasDocument}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  </button>
                </div>
              )}
              emptyState={{ title: 'No leave history found', description: 'No records match your search or filter criteria.' }}
            />

            {selectedLeave && (
              <Modal isOpen={!!selectedLeave} onClose={() => setSelectedLeave(null)} title={`Leave Details - ${selectedLeave.id}`} footer={<button className="btn btn-secondary" onClick={() => setSelectedLeave(null)}>Close</button>}>
                <div className="leave-detail-modal">
                  <div className="leave-detail-status-bar">
                    <span className="leave-detail-status-label">Status</span>
                    <span className="status-pill" style={{ background: STATUS_STYLE[selectedLeave.status]?.background, color: STATUS_STYLE[selectedLeave.status]?.color }}>{selectedLeave.status}</span>
                  </div>

                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Leave Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedLeave.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Leave Type</span><span className="leave-detail-value">{selectedLeave.type}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">From Date</span><span className="leave-detail-value">{selectedLeave.from}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">To Date</span><span className="leave-detail-value">{selectedLeave.to}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Total Days</span><span className="leave-detail-value">{selectedLeave.days}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Applied On</span><span className="leave-detail-value">{selectedLeave.appliedOn}</span></div>
                    </div>
                  </div>

                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Contact Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Region</span><span className="leave-detail-value">{selectedLeave.region}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">District</span><span className="leave-detail-value">{selectedLeave.district}</span></div>
                      <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Contact Address</span><span className="leave-detail-value">{selectedLeave.contactAddress}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Contact Phone</span><span className="leave-detail-value">{selectedLeave.contactPhone}</span></div>
                    </div>
                  </div>

                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Additional Details</h5>
                    <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Reason for Leave</span><span className="leave-detail-value">{selectedLeave.reason}</span></div>
                    <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Handover / Acting Arrangements</span><span className="leave-detail-value">{selectedLeave.handover}</span></div>
                  </div>

                  {selectedLeave.status === 'Approved' && (
                    <div className="leave-detail-section leave-detail-decision">
                      <h5 className="leave-detail-section-title">Decision / Approval</h5>
                      <div className="leave-detail-grid">
                        <div className="leave-detail-item"><span className="leave-detail-label">Approved By</span><span className="leave-detail-value">{selectedLeave.approvedBy}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Approver Role</span><span className="leave-detail-value">{selectedLeave.approverRole}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Decision Date</span><span className="leave-detail-value">{selectedLeave.decisionDate}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}

        {/* ── Confirmation Letter ── */}
        {activeTab === 'confirmation' && (
          <>
            <div className="leave-doc-grid leave-doc-grid--3">
              {CONFIRMATION_LETTERS.map(row => (
                <div key={row.id} className="leave-doc-card">
                  <div className="leave-doc-header">
                    <div className="leave-doc-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg></div>
                    <div className="leave-doc-info">
                      <h4 className="leave-doc-title">{row.type} Confirmation</h4>
                      <span className="leave-doc-meta">{row.period} &middot; {row.days} days</span>
                    </div>
                  </div>
                  <div className="leave-doc-tags">
                    <span className="leave-doc-tag">{row.id}</span>
                    <span className="leave-doc-tag">Issued: {row.issued}</span>
                    <span className="leave-doc-tag" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span>
                  </div>
                  <div className="leave-doc-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => viewDocument(row, 'confirmation')} disabled={!row.hasDocument} title={row.hasDocument ? 'View Document' : 'Document not available'}>View Document</button>
                    <button className="btn btn-sm btn-primary" onClick={() => downloadConfirmationDocument(row)} disabled={!row.hasDocument} title={row.hasDocument ? 'Download Document' : 'Document not available'}>Download</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Document Preview Modal ── */}
        {previewDoc && (
          <Modal
            isOpen={!!previewDoc}
            onClose={() => { URL.revokeObjectURL(previewDoc.url); setPreviewDoc(null); }}
            title={(
              <div className="doc-preview-header">
                <div className="doc-preview-header-title">Movement Order</div>
                <div className="doc-preview-header-subtitle">Leave Management</div>
              </div>
            )}
            className="doc-preview-modal"
            footer={(
              <div className="doc-preview-footer">
                <button className="btn btn-secondary" onClick={() => { URL.revokeObjectURL(previewDoc.url); setPreviewDoc(null); }}>Close</button>
                <button className="btn btn-primary" onClick={() => previewDoc.type === 'leave' ? downloadLeaveDocument(previewDoc.row) : downloadConfirmationDocument(previewDoc.row)}>Download</button>
              </div>
            )}
          >
            <div className="doc-preview-canvas">
              {previewLoading && (
                <div className="doc-preview-loading">
                  <div className="doc-preview-spinner" />
                  <span>Loading document...</span>
                </div>
              )}
              {previewError && (
                <div className="doc-preview-error">
                  <div className="doc-preview-error-icon">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  </div>
                  <div className="doc-preview-error-title">Unable to load document</div>
                  <div className="doc-preview-error-text">Please try again later.</div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { URL.revokeObjectURL(previewDoc.url); setPreviewDoc(null); }}>Close</button>
                </div>
              )}
              <div className="doc-preview-frame">
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.title}
                  className="doc-preview-iframe"
                  onLoad={() => setPreviewLoading(false)}
                  onError={() => { setPreviewLoading(false); setPreviewError(true); }}
                />
              </div>
            </div>
          </Modal>
        )}

        {/* ── Leave Calendar ── */}
        {activeTab === 'calendar' && (
          <Card hover={false} className="leave-calendar-card">
            <h3 className="leave-section-title">Leave Calendar 2026</h3>
            <div className="leave-calendar-grid">
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                <div key={month} className="leave-calendar-month">
                  <div className="leave-calendar-month-header"><span className="leave-calendar-month-name">{month}</span></div>
                  <div className="leave-calendar-weekdays">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => <span key={idx} className="leave-calendar-weekday">{d}</span>)}
                  </div>
                  <div className="leave-calendar-days">
                    {Array.from({ length: 31 }, (_, d) => {
                      const day = d + 1;
                      const isLeave = (month === 'July' && day >= 1 && day <= 14) || (month === 'August' && day >= 5 && day <= 7) || (month === 'December' && day >= 20 && day <= 31);
                      const isHoliday = (month === 'July' && day === 7) || (month === 'December' && day === 9) || (month === 'December' && day === 25);
                      const isToday = (month === 'July' && day === 1);
                      let cls = 'leave-calendar-day';
                      if (isLeave) cls += ' leave-day';
                      if (isHoliday) cls += ' holiday-day';
                      if (isToday) cls += ' today-day';
                      if (day > new Date(2026, i + 1, 0).getDate()) cls += ' empty-day';
                      return <span key={d} className={cls}>{day <= new Date(2026, i + 1, 0).getDate() ? day : ''}</span>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="leave-calendar-legend-bar">
              <span className="leave-calendar-legend"><span className="legend-dot leave"></span> Approved Leave</span>
              <span className="leave-calendar-legend"><span className="legend-dot holiday"></span> Public Holiday</span>
              <span className="leave-calendar-legend"><span className="legend-dot today"></span> Today</span>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default LikizoPage;
