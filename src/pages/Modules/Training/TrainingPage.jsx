import React, { useState, useRef, useMemo } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Modal from '../../../components/common/Modal/Modal';
import DataTable from '../../../components/common/DataTable/DataTable';
import TerritorySelect from '../../../components/common/location/TerritorySelect';
import RegionSelect from '../../../components/common/location/RegionSelect';
import DistrictSelect from '../../../components/common/location/DistrictSelect';
import WardSelect from '../../../components/common/location/WardSelect';
import TrainingProgressTab from './TrainingProgressTab';
import html2pdf from 'html2pdf.js';
import { notificationService } from '../../../components/Notifications/notificationService';
import { openDocument, openBrandedHtml } from '../../../utils/preview';
import { useAuth } from '../../../context/AuthContext';
import { DEMO_EMPLOYEES } from '../../../data/demoEmployees';
import './TrainingPage.css';

const PROGRAMS = [
  {
    id: 'TP-2026-001',
    title: 'Cybersecurity Awareness',
    code: 'CS-AW-001',
    category: 'Professional Development Programme',
    provider: 'ICT Department',
    venue: 'Online',
    deliveryMode: 'Virtual / Online',
    duration: '3 days',
    startDate: '2026-07-15',
    endDate: '2026-07-17',
    registrationDeadline: '2026-07-10',
    status: 'Upcoming',
    type: 'Mandatory',
    fee: 'Free',
    cost: { courseFee: 0, accommodation: 0, meals: 0, transport: 0, total: 0 },
    description: 'This programme provides essential knowledge and practical skills to identify, prevent, and respond to cybersecurity threats. Participants will learn about phishing detection, password security, data protection protocols, and best practices for maintaining a secure digital workplace. The course includes hands-on exercises and real-world case studies from the public sector.',
    objectives: [
      'Identify common cybersecurity threats and attack vectors in the workplace',
      'Implement strong password policies and multi-factor authentication',
      'Recognise and respond appropriately to phishing and social engineering attempts',
      'Understand data protection protocols and secure handling of sensitive information'
    ],
    targetParticipants: ['All Staff', 'ICT Officers', 'Data Handlers'],
    eligibility: ['Open to all employees', 'No prior technical knowledge required', 'Basic computer literacy'],
    schedule: [
      { day: 'Day 1', sessions: 'Introduction to Cybersecurity, Threat Landscape, Password Security' },
      { day: 'Day 2', sessions: 'Phishing Detection, Social Engineering, Data Protection' },
      { day: 'Day 3', sessions: 'Incident Response, Security Best Practices, Assessment' }
    ],
    attachments: [
      { name: 'Cybersecurity_Training_Brochure.pdf', type: 'PDF', size: '1.2 MB' },
      { name: 'Training_Agenda_2026.pdf', type: 'PDF', size: '450 KB' }
    ]
  },
  {
    id: 'TP-2026-002',
    title: 'Leadership Development Program',
    code: 'LD-DEV-002',
    category: 'Management & Leadership',
    provider: 'Training Department',
    venue: 'Dodoma HQ',
    deliveryMode: 'In-Person',
    duration: '5 days',
    startDate: '2026-08-01',
    endDate: '2026-08-05',
    registrationDeadline: '2026-07-25',
    status: 'Open for Application',
    type: 'Optional',
    fee: 'Free',
    cost: { courseFee: 0, accommodation: 850000, meals: 375000, transport: 200000, total: 1425000 },
    description: 'A comprehensive leadership programme designed to develop strategic thinking, effective communication, and team management skills. This programme equips participants with the tools to lead diverse teams, manage organisational change, and drive performance improvement. It combines theoretical frameworks with practical workshops and peer learning.',
    objectives: [
      'Develop strategic thinking and decision-making capabilities',
      'Enhance communication and interpersonal leadership skills',
      'Build effective team management and conflict resolution techniques',
      'Understand organisational change management principles'
    ],
    targetParticipants: ['Supervisors', 'Heads of Units', 'Senior Officers', 'Aspiring Leaders'],
    eligibility: ['Minimum 3 years of service', 'Currently in or preparing for a supervisory role', 'Endorsement from Head of Unit'],
    schedule: [
      { day: 'Day 1', sessions: 'Leadership Foundations, Self-Assessment, Strategic Thinking' },
      { day: 'Day 2', sessions: 'Communication Excellence, Emotional Intelligence' },
      { day: 'Day 3', sessions: 'Team Dynamics, Delegation, Performance Management' },
      { day: 'Day 4', sessions: 'Conflict Resolution, Negotiation Skills, Change Management' },
      { day: 'Day 5', sessions: 'Action Planning, Peer Review, Programme Evaluation' }
    ],
    attachments: [
      { name: 'Leadership_Programme_Prospectus.pdf', type: 'PDF', size: '2.1 MB' },
      { name: 'Accommodation_Guidelines.pdf', type: 'PDF', size: '320 KB' }
    ]
  },
  {
    id: 'TP-2026-003',
    title: 'Customer Service Excellence',
    code: 'CS-EX-003',
    category: 'Professional Development Programme',
    provider: 'HR Department',
    venue: 'Dar es Salaam',
    deliveryMode: 'In-Person',
    duration: '3 days',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    registrationDeadline: '2026-06-05',
    status: 'Completed',
    type: 'Mandatory',
    fee: 'Free',
    cost: { courseFee: 0, accommodation: 0, meals: 150000, transport: 0, total: 150000 },
    description: 'This programme focuses on building world-class customer service skills for public-facing officers. Participants learn how to handle enquiries professionally, manage complaints effectively, and create positive client experiences that reflect the values of the Immigration Services Department.',
    objectives: [
      'Understand the principles of excellent customer service in the public sector',
      'Develop active listening and empathy skills for client interactions',
      'Master complaint handling and de-escalation techniques',
      'Apply service quality standards to daily operations'
    ],
    targetParticipants: ['Front Desk Officers', 'Customer Service Staff', 'Registry Officers'],
    eligibility: ['Open to all client-facing staff', 'Completion of orientation programme'],
    schedule: [
      { day: 'Day 1', sessions: 'Customer Service Principles, First Impressions, Communication Skills' },
      { day: 'Day 2', sessions: 'Complaint Handling, Difficult Clients, Problem Solving' },
      { day: 'Day 3', sessions: 'Service Standards, Role Play, Assessment' }
    ],
    attachments: [
      { name: 'Customer_Service_Module.pdf', type: 'PDF', size: '890 KB' }
    ]
  },
  {
    id: 'TP-2026-004',
    title: 'Financial Management Basics',
    code: 'FM-BAS-004',
    category: 'Finance & Administration',
    provider: 'Finance Department',
    venue: 'Online',
    deliveryMode: 'Virtual / Online',
    duration: '3 days',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    registrationDeadline: '2026-08-25',
    status: 'Open for Application',
    type: 'Optional',
    fee: 'Free',
    cost: { courseFee: 0, accommodation: 0, meals: 0, transport: 0, total: 0 },
    description: 'An introductory programme covering the fundamentals of public financial management. Topics include budgeting principles, expenditure tracking, procurement basics, and financial reporting standards. Designed for non-finance staff who need to understand financial processes within government operations.',
    objectives: [
      'Understand government budgeting processes and fiscal discipline',
      'Learn basic financial reporting and documentation standards',
      'Apply procurement regulations and ethical financial practices',
      'Develop skills for monitoring project expenditure against approved budgets'
    ],
    targetParticipants: ['Project Officers', 'Administrative Staff', 'Heads of Units', 'All Staff'],
    eligibility: ['No finance background required', 'Open to all employees'],
    schedule: [
      { day: 'Day 1', sessions: 'Public Financial Management Overview, Budgeting Basics' },
      { day: 'Day 2', sessions: 'Expenditure Tracking, Procurement Regulations, Ethics' },
      { day: 'Day 3', sessions: 'Financial Reporting, Practical Exercises, Assessment' }
    ],
    attachments: [
      { name: 'Financial_Management_Guide.pdf', type: 'PDF', size: '1.5 MB' }
    ]
  },
  {
    id: 'TP-2026-005',
    title: 'Data Analytics & Reporting',
    code: 'DA-RPT-005',
    category: 'ICT & Data Management',
    provider: 'ICT Department',
    venue: 'Arusha Campus',
    deliveryMode: 'Blended (In-Person + Online)',
    duration: '5 days',
    startDate: '2026-10-10',
    endDate: '2026-10-14',
    registrationDeadline: '2026-10-01',
    status: 'Open for Application',
    type: 'Optional',
    fee: 'Free',
    cost: { courseFee: 0, accommodation: 600000, meals: 250000, transport: 150000, total: 1000000 },
    description: 'This advanced programme equips participants with data analytics skills using modern tools and techniques. It covers data collection, cleaning, analysis, and visualisation, with a focus on producing meaningful reports for decision-making. The programme includes practical exercises using real departmental datasets.',
    objectives: [
      'Collect and clean data using best-practice methodologies',
      'Perform statistical analysis and identify trends and patterns',
      'Create compelling data visualisations and dashboards',
      'Produce evidence-based reports for management decision-making'
    ],
    targetParticipants: ['ICT Officers', 'Planning Officers', 'Research Staff', 'M&E Officers'],
    eligibility: ['Basic Excel knowledge required', 'Familiarity with departmental data systems preferred', 'Approval from Head of Unit'],
    schedule: [
      { day: 'Day 1', sessions: 'Data Collection Methods, Data Quality, Cleaning Techniques' },
      { day: 'Day 2', sessions: 'Statistical Analysis, Descriptive and Inferential Methods' },
      { day: 'Day 3', sessions: 'Data Visualisation, Dashboard Design, Tools Overview' },
      { day: 'Day 4', sessions: 'Report Writing, Evidence-Based Recommendations' },
      { day: 'Day 5', sessions: 'Capstone Project, Presentation, Programme Evaluation' }
    ],
    attachments: [
      { name: 'Data_Analytics_Syllabus.pdf', type: 'PDF', size: '1.8 MB' },
      { name: 'Software_Requirements.pdf', type: 'PDF', size: '210 KB' }
    ]
  },
];

const REQUEST_STATUS = [
  { id: 'TRL-2026-001', program: 'Leadership Development Program', requestedDate: '2026-05-20', fromDate: '2026-08-01', toDate: '2026-08-05', days: 5, status: 'Approved', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-05-28', reason: 'Preparing for management role transition' },
  { id: 'TRL-2026-002', program: 'Data Analytics & Reporting', requestedDate: '2026-06-15', fromDate: '2026-10-10', toDate: '2026-10-14', days: 5, status: 'Pending', approvedBy: null, approverRole: null, decisionDate: null, reason: 'Skill enhancement for quarterly reporting tasks' },
];

const STATUS_STYLE = {
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Approved': { background: '#ECFDF5', color: '#059669' },
  'Rejected': { background: '#FFF1F2', color: '#BE123C' },
  'Upcoming': { background: '#EAF4FF', color: '#2F80ED' },
  'Open for Application': { background: '#ECFDF5', color: '#059669' },
  'Completed': { background: '#F5F3FF', color: '#7C3AED' },
};

const TAB_ICONS = {
  available: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  status: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  progress: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
};

const TABS = [
  { key: 'available', label: 'Available Programs' },
  { key: 'status', label: 'Request Status' },
  { key: 'progress', label: 'Training Progress' },
];

function TrainingPage() {
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

  const [activeTab, setActiveTab] = useState('available');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [supportingFiles, setSupportingFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [replaceIndex, setReplaceIndex] = useState(null);
  const supportFileRef = useRef(null);
  const [courseDuration, setCourseDuration] = useState('');
  const [activeFormTab, setActiveFormTab] = useState('individual');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [trainingDuration, setTrainingDuration] = useState('');
  const [groupCourseDuration, setGroupCourseDuration] = useState('');
  const [groupFromDate, setGroupFromDate] = useState('');
  const [groupToDate, setGroupToDate] = useState('');
  const [groupTrainingDuration, setGroupTrainingDuration] = useState('');
  const [groupParticipants, setGroupParticipants] = useState([{ name: '', employeeId: '', department: '', designation: '' }]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [trainingVenue, setTrainingVenue] = useState({ territory: '', region: '', district: '', ward: '' });
  const [groupTrainingVenue, setGroupTrainingVenue] = useState({ territory: '', region: '', district: '', ward: '' });

  const handleTrainingSubmit = (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    notificationService.promise(new Promise(resolve => setTimeout(() => { setShowRequestModal(false); resolve(); }, 1000)), { loading: 'Submitting training request...', success: 'Training request submitted successfully.', error: 'Failed to submit training request.' });
  };

  const handleApplyNow = (program) => {
    setCourseDuration('Short Term');
    setFromDate(program.startDate);
    setToDate(program.endDate);
    setTrainingDuration(calculateTrainingDuration(program.startDate, program.endDate, 'Short Term'));
    setActiveFormTab('individual');
    setShowRequestModal(true);
  };

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
  };

  const downloadProgramPDF = (program) => {
    const html = generateProgramDetailsHTML(program);
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    const pageEl = container.querySelector('.program-pdf-page');
    const opt = {
      margin: [12, 12, 12, 12],
      filename: `Training_Programme_${program.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    return html2pdf().set(opt).from(pageEl).outputPdf('blob').then((blob) => {
      document.body.removeChild(container);
      return blob;
    }).catch((err) => {
      document.body.removeChild(container);
      throw err;
    });
  };

  const generateProgramDetailsHTML = (program) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1f2937; line-height: 1.5; }
  .program-pdf-page { padding: 24px; }
  .pdf-header { text-align: center; border-bottom: 2px solid #d4a017; padding-bottom: 16px; margin-bottom: 20px; }
  .pdf-title { font-size: 20px; font-weight: 800; color: #0B2E59; margin: 0 0 4px 0; }
  .pdf-subtitle { font-size: 13px; color: #6b7280; margin: 0; }
  .pdf-section { margin-bottom: 16px; }
  .pdf-section-title { font-size: 13px; font-weight: 700; color: #0B2E59; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; }
  .pdf-grid { display: table; width: 100%; }
  .pdf-row { display: table-row; }
  .pdf-label { display: table-cell; width: 35%; font-weight: 600; color: #4b5563; padding: 4px 8px 4px 0; vertical-align: top; }
  .pdf-value { display: table-cell; width: 65%; padding: 4px 0; vertical-align: top; }
  .pdf-list { margin: 0; padding-left: 18px; }
  .pdf-list li { margin-bottom: 3px; }
  .pdf-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .pdf-table th { background: #f3f4f6; text-align: left; font-weight: 700; padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 11px; }
  .pdf-table td { padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 11px; }
  .pdf-cost-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e5e7eb; }
  .pdf-cost-total { display: flex; justify-content: space-between; padding: 6px 0; font-weight: 700; border-top: 2px solid #0B2E59; margin-top: 4px; }
  .pdf-footer { text-align: center; font-size: 10px; color: #9ca3af; margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
</style>
</head>
<body>
<div class="program-pdf-page">
  <div class="pdf-header">
    <div class="pdf-title">${program.title}</div>
    <div class="pdf-subtitle">${program.category} &middot; ${program.code}</div>
  </div>
  <div class="pdf-section">
    <div class="pdf-section-title">Programme Information</div>
    <div class="pdf-grid">
      <div class="pdf-row"><div class="pdf-label">Programme Name</div><div class="pdf-value">${program.title}</div></div>
      <div class="pdf-row"><div class="pdf-label">Programme Code</div><div class="pdf-value">${program.code}</div></div>
      <div class="pdf-row"><div class="pdf-label">Category</div><div class="pdf-value">${program.category}</div></div>
      <div class="pdf-row"><div class="pdf-label">Provider</div><div class="pdf-value">${program.provider}</div></div>
      <div class="pdf-row"><div class="pdf-label">Venue</div><div class="pdf-value">${program.venue}</div></div>
      <div class="pdf-row"><div class="pdf-label">Delivery Mode</div><div class="pdf-value">${program.deliveryMode}</div></div>
      <div class="pdf-row"><div class="pdf-label">Duration</div><div class="pdf-value">${program.duration}</div></div>
      <div class="pdf-row"><div class="pdf-label">Training Dates</div><div class="pdf-value">${program.startDate} &mdash; ${program.endDate}</div></div>
      <div class="pdf-row"><div class="pdf-label">Registration Deadline</div><div class="pdf-value">${program.registrationDeadline}</div></div>
    </div>
  </div>
  <div class="pdf-section">
    <div class="pdf-section-title">Description</div>
    <p>${program.description}</p>
  </div>
  <div class="pdf-section">
    <div class="pdf-section-title">Learning Objectives</div>
    <ul class="pdf-list">
      ${program.objectives.map(o => `<li>${o}</li>`).join('')}
    </ul>
  </div>
  <div class="pdf-section">
    <div class="pdf-section-title">Target Participants</div>
    <ul class="pdf-list">
      ${program.targetParticipants.map(t => `<li>${t}</li>`).join('')}
    </ul>
  </div>
  <div class="pdf-section">
    <div class="pdf-section-title">Eligibility Requirements</div>
    <ul class="pdf-list">
      ${program.eligibility.map(e => `<li>${e}</li>`).join('')}
    </ul>
  </div>
  ${program.schedule && program.schedule.length > 0 ? `
  <div class="pdf-section">
    <div class="pdf-section-title">Programme Schedule</div>
    <table class="pdf-table">
      <tr><th>Day</th><th>Sessions</th></tr>
      ${program.schedule.map(s => `<tr><td>${s.day}</td><td>${s.sessions}</td></tr>`).join('')}
    </table>
  </div>
  ` : ''}
  <div class="pdf-section">
    <div class="pdf-section-title">Cost Information</div>
    <div class="pdf-cost-row"><span>Course Fee</span><span>TZS ${program.cost.courseFee.toLocaleString()}</span></div>
    <div class="pdf-cost-row"><span>Accommodation</span><span>TZS ${program.cost.accommodation.toLocaleString()}</span></div>
    <div class="pdf-cost-row"><span>Meals</span><span>TZS ${program.cost.meals.toLocaleString()}</span></div>
    <div class="pdf-cost-row"><span>Transport</span><span>TZS ${program.cost.transport.toLocaleString()}</span></div>
    <div class="pdf-cost-total"><span>Total Cost</span><span>TZS ${program.cost.total.toLocaleString()}</span></div>
  </div>
  <div class="pdf-footer">Generated by HRMS Staff Portal &middot; ${new Date().toLocaleDateString()}</div>
</div>
</body>
</html>
    `;
  };

  const handlePreviewAttachment = (program, att) => {
    const previewHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${att.name} — Preview</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #e5e7eb; font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; min-height: 100vh; }
  .a4-page {
    width: 210mm;
    min-height: 297mm;
    background: #ffffff;
    margin: 0 auto 24px auto;
    padding: 25mm 20mm;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.6;
    color: #1f2937;
  }
  .a4-header { text-align: center; border-bottom: 2px solid #d4a017; padding-bottom: 16px; margin-bottom: 20px; }
  .a4-title { font-size: 20px; font-weight: 800; color: #0B2E59; margin: 0 0 6px 0; }
  .a4-subtitle { font-size: 13px; color: #6b7280; margin: 0; }
  .a4-section { margin-bottom: 18px; }
  .a4-section-title { font-size: 13px; font-weight: 700; color: #0B2E59; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; }
  .a4-row { display: flex; justify-content: space-between; padding: 4px 0; }
  .a4-label { font-weight: 600; color: #4b5563; }
  .a4-value { color: #1f2937; }
  .a4-footer { text-align: center; font-size: 10px; color: #9ca3af; margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
  .a4-badge { display: inline-block; padding: 4px 10px; background: #f3f4f6; border-radius: 4px; font-size: 11px; font-weight: 600; color: #4b5563; margin-bottom: 16px; }
  @media print {
    body { background: #ffffff; padding: 0; }
    .a4-page { box-shadow: none; margin: 0; width: 100%; border-radius: 0; }
  }
</style>
</head>
<body>
<div class="a4-page">
  <div class="a4-badge">Document Preview</div>
  <div class="a4-header">
    <div class="a4-title">${att.name}</div>
    <div class="a4-subtitle">${program.title} &middot; ${att.type} &middot; ${att.size}</div>
  </div>
  <div class="a4-section">
    <div class="a4-section-title">Programme Information</div>
    <div class="a4-row"><span class="a4-label">Programme Name</span><span class="a4-value">${program.title}</span></div>
    <div class="a4-row"><span class="a4-label">Programme Code</span><span class="a4-value">${program.code}</span></div>
    <div class="a4-row"><span class="a4-label">Category</span><span class="a4-value">${program.category}</span></div>
    <div class="a4-row"><span class="a4-label">Provider</span><span class="a4-value">${program.provider}</span></div>
    <div class="a4-row"><span class="a4-label">Duration</span><span class="a4-value">${program.duration}</span></div>
    <div class="a4-row"><span class="a4-label">Training Dates</span><span class="a4-value">${program.startDate} — ${program.endDate}</span></div>
  </div>
  <div class="a4-section">
    <div class="a4-section-title">Document Information</div>
    <div class="a4-row"><span class="a4-label">File Name</span><span class="a4-value">${att.name}</span></div>
    <div class="a4-row"><span class="a4-label">Document Type</span><span class="a4-value">${att.type}</span></div>
    <div class="a4-row"><span class="a4-label">File Size</span><span class="a4-value">${att.size}</span></div>
  </div>
  <div class="a4-footer">Generated by HRMS Staff Portal &middot; ${new Date().toLocaleDateString()}</div>
</div>
</body>
</html>`;
    openBrandedHtml(previewHTML, att.name);
  };

  const EMPLOYEE_LIST = DEMO_EMPLOYEES.map(emp => ({
    name: emp.fullName,
    employeeId: emp.employeeNumber,
    department: emp.department,
    designation: emp.designation,
  }));

  const addGroupParticipant = () => {
    setGroupParticipants(prev => [...prev, { name: '', employeeId: '', department: '', designation: '' }]);
  };

  const removeGroupParticipant = (index) => {
    setGroupParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const updateGroupParticipant = (index, field, value) => {
    setGroupParticipants(prev => {
      const updated = [...prev];
      if (field === 'name') {
        const emp = EMPLOYEE_LIST.find(e => e.name === value);
        if (emp) {
          updated[index] = { ...emp };
        } else {
          updated[index] = { ...updated[index], name: value };
        }
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const calculateTrainingDuration = (start, end, type) => {
    if (!start || !end) return '';
    const s = new Date(start);
    const e = new Date(end);
    if (e < s) return '';
    let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    if (e.getDate() < s.getDate()) months -= 1;
    if (type === 'Long Term') {
      const years = Math.floor(months / 12);
      return years > 0 ? years : '';
    }
    if (type === 'Detailed') {
      return months > 0 ? months : '';
    }
    const days = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : '';
  };

  const handleFromDate = (val) => {
    setFromDate(val);
    setTrainingDuration('');
    if (val && toDate) {
      setTrainingDuration(calculateTrainingDuration(val, toDate, courseDuration));
    }
  };

  const handleToDate = (val) => {
    setToDate(val);
    setTrainingDuration('');
    if (fromDate && val) {
      setTrainingDuration(calculateTrainingDuration(fromDate, val, courseDuration));
    }
  };

  const handleCourseDuration = (val) => {
    setCourseDuration(val);
    if (fromDate && toDate) {
      setTrainingDuration(calculateTrainingDuration(fromDate, toDate, val));
    } else {
      setTrainingDuration('');
    }
  };

  const handleGroupFromDate = (val) => {
    setGroupFromDate(val);
    setGroupTrainingDuration('');
    if (val && groupToDate) {
      setGroupTrainingDuration(calculateTrainingDuration(val, groupToDate, groupCourseDuration));
    }
  };

  const handleGroupToDate = (val) => {
    setGroupToDate(val);
    setGroupTrainingDuration('');
    if (groupFromDate && val) {
      setGroupTrainingDuration(calculateTrainingDuration(groupFromDate, val, groupCourseDuration));
    }
  };

  const handleGroupCourseDuration = (val) => {
    setGroupCourseDuration(val);
    if (groupFromDate && groupToDate) {
      setGroupTrainingDuration(calculateTrainingDuration(groupFromDate, groupToDate, val));
    } else {
      setGroupTrainingDuration('');
    }
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
      setFileError('File size exceeds 10MB limit.');
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

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Training Management"
          subtitle="Discover, apply, and track your professional development"
          color="#0B2E59"
          ctaLabel="Request for Training"
          onCta={() => setShowRequestModal(true)}
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

        {/* Available Programs */}
        {activeTab === 'available' && (
          <>
            <div className="leave-doc-grid leave-doc-grid--3">
              {PROGRAMS.map(p => (
                <div key={p.id} className="leave-doc-card training-program-card">
                  <div className="leave-doc-header">
                    <div className="leave-doc-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="leave-doc-info">
                      <h4 className="leave-doc-title">{p.title}</h4>
                      <span className="leave-doc-meta">{p.provider} &middot; {p.duration}</span>
                    </div>
                  </div>
                  <div className="leave-doc-tags">
                    <span className="leave-doc-tag">{p.id}</span>
                    <span className="leave-doc-tag" style={{ background: STATUS_STYLE[p.status]?.background, color: STATUS_STYLE[p.status]?.color }}>{p.status}</span>
                    <span className="leave-doc-tag">{p.type}</span>
                    <span className="leave-doc-tag">{p.venue}</span>
                  </div>
                  <div className="training-program-dates">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>{p.startDate} &mdash; {p.endDate}</span>
                  </div>
                  <div className="leave-doc-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => handleApplyNow(p)}>Apply Now</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleViewDetails(p)}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Request for Training Modal */}
        {showRequestModal && (
          <Modal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            title="Request for Training"
            size="lg"
            className="apply-leave-modal"
            footer={
              <div className="leave-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="submit" form="trainingRequestForm" className="btn btn-primary">Submit Application</button>
              </div>
            }
          >
            <form id="trainingRequestForm" className="leave-form" onSubmit={handleTrainingSubmit}>
              <div className="tabs leave-tabs" style={{ marginBottom: 24 }}>
                <button type="button" className={`tab ${activeFormTab === 'individual' ? 'active' : ''}`} onClick={() => setActiveFormTab('individual')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Individual Program
                </button>
                <button type="button" className={`tab ${activeFormTab === 'group' ? 'active' : ''}`} onClick={() => setActiveFormTab('group')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Group Program
                </button>
              </div>

              {activeFormTab === 'individual' && (
                <>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Applicant Information</h4>
                    <div className="leave-form-row">
                      <div className="form-group"><label className="form-label">Employee Name</label><input type="text" className="form-input" value={(applicant && applicant.fullName) || user?.fullName || user?.name || ''} disabled /></div>
                      <div className="form-group"><label className="form-label">Employee ID</label><input type="text" className="form-input" value={(applicant && applicant.employeeNumber) || user?.employeeNumber || ''} disabled /></div>
                      <div className="form-group"><label className="form-label">Department</label><input type="text" className="form-input" value={(applicant && applicant.department) || user?.department || ''} disabled /></div>
                      <div className="form-group"><label className="form-label">Designation</label><input type="text" className="form-input" value={(applicant && applicant.designation) || user?.designation || ''} disabled /></div>
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Training Program Selection</h4>
                    <div className="leave-form-row">
                      <div className="form-group"><label className="form-label">Course Duration</label><select className="form-input form-select" value={courseDuration} onChange={(e) => handleCourseDuration(e.target.value)}><option value="" disabled selected>Select option</option><option value="Short Term">Short Term</option><option value="Detailed">Detailed</option><option value="Long Term">Long Term</option></select></div>
                      {(courseDuration === '' || courseDuration === 'Short Term') && (
                        <>
                          <div className="form-group"><label className="form-label">Provider / Organizer</label><input type="text" className="form-input" placeholder="e.g. Training Department" /></div>
                          <div className="form-group"><label className="form-label">Territory <span className="reg-required">*</span></label><TerritorySelect value={trainingVenue.territory} onChange={(val) => setTrainingVenue({ territory: val, region: '', district: '', ward: '' })} placeholder="Select Territory" required /></div>
                          <div className="form-group"><label className="form-label">Training Region <span className="reg-required">*</span></label><RegionSelect value={trainingVenue.region} territory={trainingVenue.territory} onChange={(val) => setTrainingVenue({ ...trainingVenue, region: val, district: '', ward: '' })} placeholder="Select Region" required /></div>
                          <div className="form-group"><label className="form-label">Training District <span className="reg-required">*</span></label><DistrictSelect value={trainingVenue.district} region={trainingVenue.region} onChange={(val) => setTrainingVenue({ ...trainingVenue, district: val, ward: '' })} placeholder="Select District" required /></div>
                          <div className="form-group"><label className="form-label">Training Ward <span className="reg-required">*</span></label><WardSelect value={trainingVenue.ward} district={trainingVenue.district} onChange={(val) => setTrainingVenue({ ...trainingVenue, ward: val })} placeholder="Select Ward" required /></div>
                          <div className="form-group"><label className="form-label">Training Type</label><select className="form-input form-select"><option>Internal</option><option>External</option><option>Workshop</option><option>Seminar</option><option>Conference</option></select></div>
                        </>
                      )}
                      {(courseDuration === 'Long Term' || courseDuration === 'Detailed') && (
                        <>
                          <div className="form-group"><label className="form-label">Studding Level</label><select className="form-input form-select"><option value="" disabled selected>Select option</option><option>Certificate</option><option>Ordinary Diploma</option><option>Bachelor Degree</option><option>Masters Degree</option><option>PhD</option></select></div>
                          <div className="form-group"><label className="form-label">Program Title</label><select className="form-input form-select"><option value="" disabled selected>Select option</option><option>Leadership Development Programme</option><option>Data Analysis and Reporting</option><option>Financial Management Basics</option><option>Cybersecurity Awareness</option></select></div>
                          <div className="form-group"><label className="form-label">Institution / College</label><input type="text" className="form-input" placeholder="e.g. Training Department" /></div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Training Dates</h4>
                    <div className="leave-form-row">
                      <div className="form-group"><label className="form-label">From Date</label><input type="date" className="form-input" value={fromDate} onChange={(e) => handleFromDate(e.target.value)} /></div>
                      <div className="form-group"><label className="form-label">To Date</label><input type="date" className="form-input" value={toDate} onChange={(e) => handleToDate(e.target.value)} /></div>
                      <div className="form-group"><label className="form-label">Duration {courseDuration === 'Long Term' ? '(Years)' : courseDuration === 'Detailed' ? '(Months)' : '(Days)'}</label><input type="number" className="form-input" value={trainingDuration} placeholder="Auto-calculated" readOnly disabled /></div>
                      <div className="form-group"><label className="form-label">Application Fee</label><select className="form-input form-select"><option>Free</option><option>Paid by Employee</option><option>Paid by Organization</option></select></div>
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Contact Information</h4>
                    <div className="leave-form-row">
                      <div className="form-group"><label className="form-label">Contact Address While on Training</label><input type="text" className="form-input" placeholder="Enter your contact address" /></div>
                      <div className="form-group"><label className="form-label">Contact Phone Number</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                      <div className="form-group"><label className="form-label">Emergency Contact Name</label><input type="text" className="form-input" placeholder="Emergency contact name" /></div>
                      <div className="form-group"><label className="form-label">Emergency Contact Phone</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Additional Information</h4>
                    <div className="leave-form-row leave-form-row--two">
                      <div className="form-group"><label className="form-label">Reason for Training Leave</label><textarea className="form-input" rows="4" placeholder="Explain how this training aligns with your role and career development..."></textarea></div>
                      <div className="form-group"><label className="form-label">Handover Notes / Acting Arrangements</label><textarea className="form-input" rows="4" placeholder="Describe who will act in your position during the training period..."></textarea></div>
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Supporting Documents</h4>
                    <p className="leave-form-hint">Upload supporting documents if required for your training application (e.g., training brochure, approval letter, official invitation, or other supporting documents). Allowed formats: PDF, JPG, PNG (max 10MB each).</p>
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
                </>
              )}

              {activeFormTab === 'group' && (
                <>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Training Program Selection</h4>
                    <div className="leave-form-row">
                      <div className="form-group"><label className="form-label">Course Duration</label><select className="form-input form-select" value={groupCourseDuration} onChange={(e) => handleGroupCourseDuration(e.target.value)}><option value="" disabled selected>Select option</option><option value="Short Term">Short Term</option><option value="Detailed">Detailed</option></select></div>
                      {(groupCourseDuration === '' || groupCourseDuration === 'Short Term') && (
                        <>
                          <div className="form-group"><label className="form-label">Provider / Organizer</label><input type="text" className="form-input" placeholder="e.g. Training Department" /></div>
                          <div className="form-group"><label className="form-label">Territory <span className="reg-required">*</span></label><TerritorySelect value={groupTrainingVenue.territory} onChange={(val) => setGroupTrainingVenue({ territory: val, region: '', district: '', ward: '' })} placeholder="Select Territory" required /></div>
                          <div className="form-group"><label className="form-label">Training Region <span className="reg-required">*</span></label><RegionSelect value={groupTrainingVenue.region} territory={groupTrainingVenue.territory} onChange={(val) => setGroupTrainingVenue({ ...groupTrainingVenue, region: val, district: '', ward: '' })} placeholder="Select Region" required /></div>
                          <div className="form-group"><label className="form-label">Training District <span className="reg-required">*</span></label><DistrictSelect value={groupTrainingVenue.district} region={groupTrainingVenue.region} onChange={(val) => setGroupTrainingVenue({ ...groupTrainingVenue, district: val, ward: '' })} placeholder="Select District" required /></div>
                          <div className="form-group"><label className="form-label">Training Ward <span className="reg-required">*</span></label><WardSelect value={groupTrainingVenue.ward} district={groupTrainingVenue.district} onChange={(val) => setGroupTrainingVenue({ ...groupTrainingVenue, ward: val })} placeholder="Select Ward" required /></div>
                          <div className="form-group"><label className="form-label">Training Type</label><select className="form-input form-select"><option>Internal</option><option>External</option><option>Workshop</option><option>Seminar</option><option>Conference</option></select></div>
                        </>
                      )}
                      {groupCourseDuration === 'Detailed' && (
                        <>
                          <div className="form-group"><label className="form-label">Studding Level</label><select className="form-input form-select"><option value="" disabled selected>Select option</option><option>Certificate</option><option>Ordinary Diploma</option><option>Bachelor Degree</option><option>Masters Degree</option><option>PhD</option></select></div>
                          <div className="form-group"><label className="form-label">Program Title</label><select className="form-input form-select"><option value="" disabled selected>Select option</option><option>Leadership Development Programme</option><option>Data Analysis and Reporting</option><option>Financial Management Basics</option><option>Cybersecurity Awareness</option></select></div>
                          <div className="form-group"><label className="form-label">Institution / College</label><input type="text" className="form-input" placeholder="e.g. Training Department" /></div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Training Dates</h4>
                    <div className="leave-form-row">
                      <div className="form-group"><label className="form-label">From Date</label><input type="date" className="form-input" value={groupFromDate} onChange={(e) => handleGroupFromDate(e.target.value)} /></div>
                      <div className="form-group"><label className="form-label">To Date</label><input type="date" className="form-input" value={groupToDate} onChange={(e) => handleGroupToDate(e.target.value)} /></div>
                      <div className="form-group"><label className="form-label">Duration {groupCourseDuration === 'Detailed' ? '(Months)' : '(Days)'}</label><input type="number" className="form-input" value={groupTrainingDuration} placeholder="Auto-calculated" readOnly disabled /></div>
                      <div className="form-group"><label className="form-label">Application Fee</label><select className="form-input form-select"><option>Free</option><option>Paid by Employee</option><option>Paid by Organization</option></select></div>
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Contact Information</h4>
                    <div className="leave-form-row">
                      <div className="form-group"><label className="form-label">Contact Address While on Training</label><input type="text" className="form-input" placeholder="Enter your contact address" /></div>
                      <div className="form-group"><label className="form-label">Contact Phone Number</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                      <div className="form-group"><label className="form-label">Emergency Contact Name</label><input type="text" className="form-input" placeholder="Emergency contact name" /></div>
                      <div className="form-group"><label className="form-label">Emergency Contact Phone</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Additional Information</h4>
                    <div className="leave-form-row leave-form-row--two">
                      <div className="form-group"><label className="form-label">Reason for Training Leave</label><textarea className="form-input" rows="4" placeholder="Explain how this training aligns with your role and career development..."></textarea></div>
                      <div className="form-group"><label className="form-label">Handover Notes / Acting Arrangements</label><textarea className="form-input" rows="4" placeholder="Describe who will act in your position during the training period..."></textarea></div>
                    </div>
                  </div>
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Supporting Documents</h4>
                    <p className="leave-form-hint">Upload supporting documents if required for your training application (e.g., training brochure, approval letter, official invitation, or other supporting documents). Allowed formats: PDF, JPG, PNG (max 10MB each).</p>
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
                  <div className="leave-form-section">
                    <h4 className="leave-form-section-title">Group Participants</h4>
                    <p className="leave-form-hint">Add all employees who will attend this training programme.</p>
                    <div style={{ overflowX: 'auto' }}>
                      <div className="participant-table participant-table-header" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px', gap: 12, alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 8, marginBottom: 8, fontWeight: 600, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        <div>Employee Name</div>
                        <div>Employee ID</div>
                        <div>Department</div>
                        <div>Designation</div>
                        <div style={{ textAlign: 'center' }}>Action</div>
                      </div>
                      {groupParticipants.map((participant, index) => (
                        <div key={index} className="participant-table" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                          <div data-label="Employee Name">
                            <select className="form-input form-select" value={participant.name} onChange={(e) => updateGroupParticipant(index, 'name', e.target.value)}>
                              <option value="" disabled>Select employee</option>
                              {EMPLOYEE_LIST.map(emp => (
                                <option key={emp.employeeId} value={emp.name}>{emp.name}</option>
                              ))}
                            </select>
                          </div>
                          <div data-label="Employee ID"><input type="text" className="form-input" value={participant.employeeId} disabled /></div>
                          <div data-label="Department"><input type="text" className="form-input" value={participant.department} disabled /></div>
                          <div data-label="Designation"><input type="text" className="form-input" value={participant.designation} disabled /></div>
                          <div data-label="Action" style={{ textAlign: 'center' }}>
                            {groupParticipants.length > 1 && (
                              <button type="button" className="btn btn-sm btn-secondary btn-remove-participant" onClick={() => removeGroupParticipant(index)} title="Remove participant" style={{ padding: '4px 8px' }}>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" className="btn btn-secondary btn-add-participant" onClick={addGroupParticipant}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Participant
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </Modal>
        )}

        {/* Training Program Details Modal */}
        {selectedProgram && (
          <Modal
            isOpen={!!selectedProgram}
            onClose={() => setSelectedProgram(null)}
            title={(
              <div className="doc-preview-header">
                <div className="doc-preview-header-title">{selectedProgram.title}</div>
                <div className="doc-preview-header-subtitle">{selectedProgram.category}</div>
              </div>
            )}
            className="doc-preview-modal"
            footer={(
              <div className="doc-preview-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedProgram(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => {
                  downloadProgramPDF(selectedProgram).then(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Training_Programme_${selectedProgram.title.replace(/\s+/g, '_')}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  });
                }}>Download</button>
              </div>
            )}
          >
            <div className="training-detail-modal">
              <div className="training-detail-section">
                <h5 className="training-detail-section-title">Programme Information</h5>
                <div className="training-detail-grid">
                  <div className="training-detail-item"><span className="training-detail-label">Programme Name</span><span className="training-detail-value">{selectedProgram.title}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Programme Code</span><span className="training-detail-value">{selectedProgram.code}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Category</span><span className="training-detail-value">{selectedProgram.category}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Provider</span><span className="training-detail-value">{selectedProgram.provider}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Venue</span><span className="training-detail-value">{selectedProgram.venue}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Delivery Mode</span><span className="training-detail-value">{selectedProgram.deliveryMode}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Duration</span><span className="training-detail-value">{selectedProgram.duration}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Training Dates</span><span className="training-detail-value">{selectedProgram.startDate} &mdash; {selectedProgram.endDate}</span></div>
                  <div className="training-detail-item"><span className="training-detail-label">Registration Deadline</span><span className="training-detail-value">{selectedProgram.registrationDeadline}</span></div>
                </div>
              </div>

              <div className="training-detail-section">
                <h5 className="training-detail-section-title">Description</h5>
                <p className="training-detail-text">{selectedProgram.description}</p>
              </div>

              <div className="training-detail-section">
                <h5 className="training-detail-section-title">Learning Objectives</h5>
                <ul className="training-detail-list">
                  {selectedProgram.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              </div>

              <div className="training-detail-section">
                <h5 className="training-detail-section-title">Target Participants</h5>
                <ul className="training-detail-list">
                  {selectedProgram.targetParticipants.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>

              <div className="training-detail-section">
                <h5 className="training-detail-section-title">Eligibility Requirements</h5>
                <ul className="training-detail-list">
                  {selectedProgram.eligibility.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>

              {selectedProgram.schedule && selectedProgram.schedule.length > 0 && (
                <div className="training-detail-section">
                  <h5 className="training-detail-section-title">Programme Schedule</h5>
                  <table className="training-detail-table">
                    <thead>
                      <tr><th>Day</th><th>Sessions</th></tr>
                    </thead>
                    <tbody>
                      {selectedProgram.schedule.map((s, i) => (
                        <tr key={i}><td className="training-detail-table-day">{s.day}</td><td>{s.sessions}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="training-detail-section">
                <h5 className="training-detail-section-title">Cost Information</h5>
                <div className="training-detail-cost-row"><span>Course Fee</span><span>TZS {selectedProgram.cost.courseFee.toLocaleString()}</span></div>
                <div className="training-detail-cost-row"><span>Accommodation</span><span>TZS {selectedProgram.cost.accommodation.toLocaleString()}</span></div>
                <div className="training-detail-cost-row"><span>Meals</span><span>TZS {selectedProgram.cost.meals.toLocaleString()}</span></div>
                <div className="training-detail-cost-row"><span>Transport</span><span>TZS {selectedProgram.cost.transport.toLocaleString()}</span></div>
                <div className="training-detail-cost-total"><span>Total Cost</span><span>TZS {selectedProgram.cost.total.toLocaleString()}</span></div>
              </div>

              {selectedProgram.attachments && selectedProgram.attachments.length > 0 && (
                <div className="training-detail-section">
                  <h5 className="training-detail-section-title">Attachments</h5>
                  <div className="training-detail-attachments">
                    {selectedProgram.attachments.map((att, i) => (
                      <div key={i} className="training-detail-attachment">
                        <div className="training-detail-attachment-icon">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <div className="training-detail-attachment-info">
                          <p className="training-detail-attachment-name">{att.name}</p>
                          <p className="training-detail-attachment-meta">{att.type} &middot; {att.size}</p>
                        </div>
                        <button className="btn btn-sm btn-secondary" onClick={() => handlePreviewAttachment(selectedProgram, att)}>Preview</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Request Status */}
        {activeTab === 'status' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'program', header: 'Program', render: row => <span className="leave-type">{row.program}</span> },
                { key: 'requestedDate', header: 'Requested Date' },
                { key: 'fromDate', header: 'From Date' },
                { key: 'toDate', header: 'To Date' },
                { key: 'days', header: 'Days', align: 'center', render: row => <span className="leave-days">{row.days}</span> },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={REQUEST_STATUS}
              title="Training Leave Requests"
              searchPlaceholder="Search by ID, program, or status..."
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => setSelectedRequest(row)} title="View Details">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              )}
              emptyState={{ title: 'No training requests found', description: 'You have not submitted any training leave requests yet.' }}
            />

            {selectedRequest && (
              <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title={`Request Details - ${selectedRequest.id}`} footer={<button className="btn btn-secondary" onClick={() => setSelectedRequest(null)}>Close</button>}>
                <div className="leave-detail-modal">
                  <div className="leave-detail-status-bar">
                    <span className="leave-detail-status-label">Status</span>
                    <span className="status-pill" style={{ background: STATUS_STYLE[selectedRequest.status]?.background, color: STATUS_STYLE[selectedRequest.status]?.color }}>{selectedRequest.status}</span>
                  </div>
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Training Request Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedRequest.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Program</span><span className="leave-detail-value">{selectedRequest.program}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Requested Date</span><span className="leave-detail-value">{selectedRequest.requestedDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">From Date</span><span className="leave-detail-value">{selectedRequest.fromDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">To Date</span><span className="leave-detail-value">{selectedRequest.toDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Duration</span><span className="leave-detail-value">{selectedRequest.days} days</span></div>
                    </div>
                  </div>
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Additional Details</h5>
                    <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Reason for Training Leave</span><span className="leave-detail-value">{selectedRequest.reason}</span></div>
                  </div>
                  {selectedRequest.status === 'Approved' && (
                    <div className="leave-detail-section leave-detail-decision">
                      <h5 className="leave-detail-section-title">Decision / Approval</h5>
                      <div className="leave-detail-grid">
                        <div className="leave-detail-item"><span className="leave-detail-label">Approved By</span><span className="leave-detail-value">{selectedRequest.approvedBy}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Approver Role</span><span className="leave-detail-value">{selectedRequest.approverRole}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Decision Date</span><span className="leave-detail-value">{selectedRequest.decisionDate}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}

        {/* Training Progress */}
        {activeTab === 'progress' && <TrainingProgressTab />}

      </main>
    </div>
  );
}

export default TrainingPage;
