import React, { useState, useRef, useEffect, useCallback } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Modal from '../../../components/common/Modal/Modal';
import DataTable from '../../../components/common/DataTable/DataTable';
import { notificationService } from '../../../components/Notifications/notificationService';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { openBrandedHtml } from '../../../utils/preview';
import { useAuth } from '../../../context/AuthContext';
import { searchEmployee } from '../../../services/employeeApi';
import coatOfArms from '../../../assets/images/coat_of_arms.png';
import immigrationLogo from '../../../assets/images/uhamiaji_logo.png';
import defaultUserPhoto from '../../../assets/images/photo.png';
import './StaffIdPage.css';

const ID_CARD = {
  name: 'GOODLUCK EDWIN MSUYA',
  employeeNo: 'EMP-2026-00125',
  staffIdNumber: '3917',
  givenNames: 'GOODLUCK EDWIN',
  surname: 'MSUYA',
  sex: 'M',
  rank: 'ASSISTANT SUPERINTENDENT',
  bloodGroup: 'AB+',
  department: 'Immigration Services',
  workStation: 'Dar es Salaam HQ',
  issued: '2025-01-15',
  expires: '2030-01-15',
  status: 'Active',
  photo: null,
};

const APPLICATIONS = [
  { id: 'SID-2026-001', type: 'New Staff ID', reason: 'New Staff ID', submittedDate: '2026-06-15', status: 'Issued', lastUpdated: '2026-06-20', hrResponse: 'Approved', remarks: 'ID card printed and issued', correctionStatus: 'No Action Required', fullName: 'GOODLUCK EDWIN MSUYA', givenNames: 'GOODLUCK EDWIN', surname: 'MSUYA', sex: 'M', rank: 'ASSISTANT SUPERINTENDENT', employeeNumber: 'EMP-2026-00125', staffIdNumber: '3917', department: 'Immigration Services', workingStation: 'Dar es Salaam HQ', mobile: '+255712345678', email: 'goodluck.msuya@immigration.go.tz', bloodGroup: 'AB+', territory: 'Tanzania Mainland', workingRegion: 'Dar es Salaam', photo: defaultUserPhoto, photoUploaded: true, supportingDoc: 'passport_photo.jpg', comments: 'New employee ID request.', declaration: true },
  { id: 'SID-2026-002', type: 'Replacement', reason: 'Lost ID', submittedDate: '2026-05-20', status: 'Ready for Collection', lastUpdated: '2026-06-28', hrResponse: 'Approved', remarks: 'Collect at HR Office, Block B', correctionStatus: 'No Action Required', fullName: 'John Michael Doe', givenNames: 'John Michael', surname: 'Doe', sex: 'M', rank: 'Senior HR Officer', employeeNumber: 'EMP-2024-00542', staffIdNumber: '4521', department: 'Human Resources', workingStation: 'Dar es Salaam HQ', mobile: '+255712345678', email: 'john.doe@immigration.go.tz', bloodGroup: 'A+', territory: 'Tanzania Mainland', workingRegion: 'Dar es Salaam', photo: defaultUserPhoto, photoUploaded: true, supportingDoc: 'police_loss_report.pdf', comments: 'Lost ID reported and police report attached.', declaration: true },
  { id: 'SID-2026-003', type: 'Renewal', reason: 'Renewal', submittedDate: '2026-06-01', status: 'Under Review', lastUpdated: '2026-06-05', hrResponse: 'Pending', remarks: 'Awaiting document verification', correctionStatus: 'No Action Required', fullName: 'Asha Hamisi Juma', givenNames: 'Asha Hamisi', surname: 'Juma', sex: 'F', rank: 'Immigration Officer', employeeNumber: 'EMP-2024-00543', staffIdNumber: '4522', department: 'Immigration Services', workingStation: 'Dar es Salaam HQ', mobile: '+255722334455', email: 'asha.juma@immigration.go.tz', bloodGroup: 'B+', territory: 'Tanzania Mainland', workingRegion: 'Dar es Salaam', photo: defaultUserPhoto, photoUploaded: true, supportingDoc: 'existing_staff_id_scan.pdf', comments: 'Renewal of expired staff ID.', declaration: true },
  { id: 'SID-2026-004', type: 'Replacement', reason: 'Damaged ID', submittedDate: '2026-04-10', status: 'Approved', lastUpdated: '2026-04-25', hrResponse: 'Approved', remarks: 'Application approved for printing', correctionStatus: 'No Action Required', fullName: 'Peter Emmanuel Mwita', givenNames: 'Peter Emmanuel', surname: 'Mwita', sex: 'M', rank: 'Finance Officer', employeeNumber: 'EMP-2024-00544', staffIdNumber: '4523', department: 'Finance', workingStation: 'Dodoma Regional Office', mobile: '+255733445566', email: 'peter.mwita@immigration.go.tz', bloodGroup: 'O+', territory: 'Tanzania Mainland', workingRegion: 'Dodoma', photo: defaultUserPhoto, photoUploaded: true, supportingDoc: 'damaged_id_scan.pdf', comments: 'ID card damaged during daily use.', declaration: true },
  { id: 'SID-2026-005', type: 'New Staff ID', reason: 'New Staff ID', submittedDate: '2026-06-10', status: 'Returned for Correction', lastUpdated: '2026-06-12', hrResponse: 'Returned for Correction', remarks: 'Please upload a clearer passport photograph and update your work station address.', correctionStatus: 'Pending Correction', returnedDate: '2026-06-12', returnedBy: 'Grace Mbelwa', fullName: 'Neema Joseph Mollel', givenNames: 'Neema Joseph', surname: 'Mollel', sex: 'F', rank: 'Systems Analyst', employeeNumber: 'EMP-2024-00545', staffIdNumber: '4524', department: 'ICT', workingStation: 'Arusha Regional Office', mobile: '+255744556677', email: 'neema.mollel@immigration.go.tz', bloodGroup: 'AB+', territory: 'Tanzania Mainland', workingRegion: 'Arusha', photo: null, photoUploaded: false, supportingDoc: 'passport_photo.jpg', comments: 'Please upload a clearer passport photograph and update your work station address.', declaration: false },
];

const TIMELINE = [
  { stage: 'Application Submitted', date: '2026-05-20', time: '09:30 AM', officer: 'John Doe', status: 'Completed', comment: 'Application received' },
  { stage: 'Received by HR', date: '2026-05-20', time: '10:15 AM', officer: 'Grace Mbelwa', status: 'Completed', comment: 'Document verification started' },
  { stage: 'Verification', date: '2026-05-22', time: '02:00 PM', officer: 'Dr. Amina Hassan', status: 'Completed', comment: 'All documents verified' },
  { stage: 'Returned for Correction', date: '2026-06-12', time: '02:30 PM', officer: 'Grace Mbelwa', status: 'Completed', comment: 'Please upload a clearer passport photograph and update your work station address' },
  { stage: 'Correction Submitted', date: '2026-06-15', time: '10:00 AM', officer: 'John Doe', status: 'Current', comment: 'Updated documents and address resubmitted' },
  { stage: 'Re-evaluation by HR', date: '2026-06-15', time: '11:00 AM', officer: 'Grace Mbelwa', status: 'Pending', comment: 'Under re-review after correction' },
  { stage: 'Approved', date: '2026-05-28', time: '11:45 AM', officer: 'Dr. Amina Hassan', status: 'Completed', comment: 'Application approved for printing' },
  { stage: 'Printing', date: '2026-06-05', time: '08:00 AM', officer: 'ICT Print Unit', status: 'Completed', comment: 'Card printed successfully' },
  { stage: 'Quality Verification', date: '2026-06-10', time: '03:30 PM', officer: 'Quality Team', status: 'Completed', comment: 'Quality check passed' },
  { stage: 'Ready for Collection', date: '2026-06-28', time: '09:00 AM', officer: 'HR Office', status: 'Current', comment: 'Collect at HR Office, Block B, Ground Floor' },
];

const REASON_ATTACHMENTS = {
  'New Staff ID': [{ name: 'Passport-size Photograph', required: true }],
  'Lost ID': [{ name: 'Police Loss Report', required: true }, { name: 'Introduction Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Damaged ID': [{ name: 'Scanned Damaged Staff ID', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Renewal': [{ name: 'Existing Staff ID', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Change of Name': [{ name: 'Name Change Document', required: true }, { name: 'National ID', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Promotion': [{ name: 'Promotion Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Change of Department': [{ name: 'Transfer Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Change of Designation': [{ name: 'Re-designation Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Replacement': [{ name: 'Supporting Document', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Other': [{ name: 'Relevant Supporting Document', required: true }],
};

const STATUS_STYLE = {
  Active: { background: '#ECFDF5', color: '#065F46' },
  Expired: { background: '#FEF2F2', color: '#991B1B' },
  Pending: { background: '#FFFBEB', color: '#92400E' },
  Approved: { background: '#EAF4FF', color: '#0B2E59' },
  Rejected: { background: '#FFF1F2', color: '#BE123C' },
  'Under Review': { background: '#EAF4FF', color: '#2F80ED' },
  'Ready for Collection': { background: '#ECFDF5', color: '#059669' },
  Issued: { background: '#F5F3FF', color: '#7C3AED' },
  Draft: { background: '#F3F4F6', color: '#6B7280' },
  Completed: { background: '#ECFDF5', color: '#059669' },
  Printing: { background: '#FFFBEB', color: '#D97706' },
  'Returned for Correction': { background: '#FEF3C7', color: '#92400E' },
  Resubmitted: { background: '#EEF2FF', color: '#4F46E5' },
  Submitted: { background: '#EAF4FF', color: '#2F80ED' },
};

const TAB_ICONS = {
  my: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  status: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

const TABS = [
  { key: 'my', label: 'My Applications' },
  { key: 'status', label: 'Request Status' },
];

const STEPS = ['Employee Verification', 'Personal Information', 'Request New ID', 'ID Preview', 'Declaration'];

function StaffIdPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my');
  const [step, setStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalTab, setModalTab] = useState('info');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [trackingApp, setTrackingApp] = useState(APPLICATIONS[4]);

  const [verifyForm, setVerifyForm] = useState({ checkNumber: '', nin: '' });
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [employeeRecord, setEmployeeRecord] = useState({
    employeeId: '', employeeNumber: '', checkNumber: '', nin: '',
    fullName: '', givenNames: '', surname: '', gender: '', dob: '',
    nationality: '', maritalStatus: '', photo: '',
    territory: '', workingRegion: '', workingStation: '', department: '',
    designation: '', employmentType: '', appointmentDate: '', dutyStation: '',
    region: '', district: '', position: '',
    mobileNumber: '', emailAddress: '', officialEmail: '', phoneNumber: '',
    ward: '', physicalAddress: '', postalAddress: '',
    bloodGroup: '',
  });
  const [idPhoto, setIdPhoto] = useState(null);
  const photoInputRef = useRef(null);

  const hasIdentifiers = Boolean(user?.checkNumber && user?.nin);

  useEffect(() => {
    if (showRequestModal && !hasIdentifiers) {
      notificationService.error('Employee verification information is incomplete. Please contact HR support.');
    }
  }, [showRequestModal, hasIdentifiers]);

  const [requestDetails, setRequestDetails] = useState({
    idType: 'New Staff ID', comments: '', supportingDoc: null,
  });
  const docInputRef = useRef(null);

  const [declared, setDeclared] = useState(false);
  const [declarationTimestamp, setDeclarationTimestamp] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestRef, setRequestRef] = useState('');
  const [idQrCode, setIdQrCode] = useState('');
  const [previewQrCode, setPreviewQrCode] = useState('');
  const idCardRef = useRef(null);

  const getIdCardData = (data = {}) => {
    const fullName = data.fullName || ID_CARD.name || '';
    const nameParts = fullName.trim().split(/\s+/);
    const surname = data.surname || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : '');
    const givenNames = data.givenNames || (nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : fullName);
    return {
      fullName,
      employeeNumber: data.employeeNumber || ID_CARD.employeeNo,
      staffIdNumber: data.staffIdNumber || data.id || ID_CARD.staffIdNumber,
      givenNames,
      surname,
      sex: data.sex || data.gender || ID_CARD.sex,
      rank: data.rank || data.designation || ID_CARD.rank,
      bloodGroup: data.bloodGroup || ID_CARD.bloodGroup,
      photo: data.photo || defaultUserPhoto,
    };
  };

  const getPreviewData = useCallback(() => {
    const fullName = employeeRecord.fullName || editingApp?.fullName || ID_CARD.name || '';
    return {
      ...employeeRecord,
      id: editingApp?.staffIdNumber || editingApp?.id || requestRef || 'PREVIEW',
      fullName,
      givenNames: employeeRecord.givenNames || editingApp?.givenNames || '',
      surname: employeeRecord.surname || editingApp?.surname || '',
      sex: employeeRecord.gender || editingApp?.sex || '',
      rank: employeeRecord.designation || editingApp?.rank || editingApp?.designation || '',
      bloodGroup: employeeRecord.bloodGroup || editingApp?.bloodGroup || '',
      photo: idPhoto || employeeRecord.photo || editingApp?.photo || defaultUserPhoto,
    };
  }, [employeeRecord, idPhoto, editingApp, requestRef]);

  useEffect(() => {
    if (!selectedApp) return;
    const fullName = selectedApp.fullName || ID_CARD.name;
    const employeeNo = selectedApp.employeeNumber || ID_CARD.employeeNo;
    const staffIdNumber = selectedApp.staffIdNumber || selectedApp.id || ID_CARD.staffIdNumber;
    const payload = `${employeeNo}\nID${staffIdNumber}\n${fullName}`;
    QRCode.toDataURL(payload, { width: 130, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then(url => setIdQrCode(url))
      .catch(() => setIdQrCode(''));
  }, [selectedApp]);

  useEffect(() => {
    const data = getPreviewData();
    const employeeNo = data.employeeNumber || ID_CARD.employeeNo;
    const staffIdNumber = data.staffIdNumber || data.id || ID_CARD.staffIdNumber;
    const payload = `${employeeNo}\nID${staffIdNumber}\n${data.fullName || ''}`;
    QRCode.toDataURL(payload, { width: 130, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then(url => setPreviewQrCode(url))
      .catch(() => setPreviewQrCode(''));
  }, [getPreviewData]);

  const openApp = (app) => { setSelectedApp(app); setModalTab('info'); };

  const handleViewAttachment = (att) => {
    const preview = openBrandedHtml(`
      <html>
        <head><title>${att.name}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #f5f7fa; padding: 40px; display: flex; justify-content: center; }
            .preview { background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 32px; max-width: 720px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            h2 { margin: 0 0 8px; color: #0B2E59; font-size: 20px; }
            p { color: #64748b; margin: 0 0 24px; }
            .doc { background: #f0f4ff; border: 1px dashed #2F80ED; border-radius: 8px; height: 260px; display: flex; align-items: center; justify-content: center; color: #2F80ED; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="preview">
            <h2>${att.name}</h2>
            <p>${att.required ? 'Required document' : 'Optional document'}</p>
            <div class="doc">Document preview placeholder</div>
          </div>
        </body>
      </html>
    `, att.name);
    if (!preview) {
      notificationService.info('Please allow popups to view attachments.');
    }
  };

  const buildInitialEmployeeRecord = () => ({
    employeeId: '', employeeNumber: '', checkNumber: '', nin: '',
    fullName: '', givenNames: '', surname: '', gender: '', dob: '',
    nationality: '', maritalStatus: '', photo: '',
    territory: '', workingRegion: '', workingStation: '', department: '',
    designation: '', employmentType: '', appointmentDate: '', dutyStation: '',
    region: '', district: '', position: '',
    mobileNumber: '', emailAddress: '', officialEmail: '', phoneNumber: '',
    ward: '', physicalAddress: '', postalAddress: '',
    bloodGroup: '',
  });

  const openCorrection = (app) => {
    setEditingApp(app);
    setShowRequestModal(true);
    setStep(1);
    setSubmitted(false);
    setDeclared(false);
    setIsVerified(false);
    setEmployeeRecord(buildInitialEmployeeRecord());
    setIdPhoto(null);
    setVerifyForm({ checkNumber: (user?.checkNumber || '').toString(), nin: (user?.nin || '').toString() });
    setVerifyError('');
    setRequestDetails({ idType: 'New Staff ID', comments: '', supportingDoc: null });
    setDeclarationTimestamp(null);
    setPreviewQrCode('');
  };

  const openNewRequest = () => {
    setEditingApp(null);
    setShowRequestModal(true);
    setStep(1);
    setSubmitted(false);
    setDeclared(false);
    setIsVerified(false);
    setEmployeeRecord(buildInitialEmployeeRecord());
    setIdPhoto(null);
    setVerifyForm({ checkNumber: (user?.checkNumber || '').toString(), nin: (user?.nin || '').toString() });
    setVerifyError('');
    setRequestDetails({ idType: 'New Staff ID', comments: '', supportingDoc: null });
    setDeclarationTimestamp(null);
    setPreviewQrCode('');
  };

  const mapEmployeeToRecord = (emp) => ({
    employeeId: emp.employeeId || '',
    employeeNumber: emp.employeeNumber || '',
    checkNumber: emp.checkNumber || '',
    nin: emp.nin || '',
    fullName: emp.fullName || '',
    givenNames: emp.givenNames || '',
    surname: emp.surname || '',
    gender: emp.gender || '',
    dob: emp.dob || '',
    nationality: emp.nationality || '',
    maritalStatus: emp.maritalStatus || '',
    photo: emp.photo || '',
    territory: emp.territory || '',
    workingRegion: emp.workingRegion || '',
    workingStation: emp.workingStation || '',
    department: emp.department || '',
    designation: emp.designation || '',
    employmentType: emp.employmentType || '',
    appointmentDate: emp.appointmentDate || '',
    dutyStation: emp.dutyStation || '',
    region: emp.region || '',
    district: emp.district || '',
    position: emp.position || '',
    mobileNumber: emp.mobileNumber || emp.phoneNumber || emp.mobile || emp.phone || '',
    emailAddress: emp.emailAddress || emp.email || emp.officialEmail || '',
    officialEmail: emp.officialEmail || emp.emailAddress || emp.email || '',
    phoneNumber: emp.phoneNumber || emp.mobileNumber || emp.mobile || emp.phone || '',
    ward: emp.ward || '',
    physicalAddress: emp.physicalAddress || '',
    postalAddress: emp.postalAddress || '',
    bloodGroup: emp.bloodGroup || '',
  });

  const handleVerify = async () => {
    setVerifyError('');
    if (!hasIdentifiers) {
      setVerifyError('Employee verification information is incomplete. Please contact HR support.');
      return;
    }
    setVerifyLoading(true);
    try {
      const employee = await notificationService.promise(
        searchEmployee({ checkNumber: user?.checkNumber || '', nin: user?.nin || '' }),
        {
          loading: 'Searching employee record...',
          success: 'Employee information verified successfully.',
          error: (err) => err?.message || 'Employee information could not be found. Please verify your details and try again.',
        }
      );
      setEmployeeRecord(mapEmployeeToRecord(employee));
      setIsVerified(true);
    } catch (err) {
      setEmployeeRecord(buildInitialEmployeeRecord());
      setIsVerified(false);
      setVerifyError(err?.message || 'Employee information could not be found. Please verify your details and try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/image\/jpeg|image\/png/)) {
      notificationService.warning('Only JPEG and PNG image files are allowed.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setIdPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      notificationService.warning('Only PDF files are allowed for supporting documents.');
      return;
    }
    setRequestDetails(prev => ({ ...prev, supportingDoc: file }));
  };

  const handleDeclaration = (checked) => {
    setDeclared(checked);
    if (checked) {
      setDeclarationTimestamp(new Date().toISOString());
    } else {
      setDeclarationTimestamp(null);
    }
  };

  const generateRefNumber = () => {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 900) + 100);
    return `SID-${year}-0${num}`;
  };

  const renderIdCardFront = (data, qrCode, cardRef) => {
    const d = getIdCardData(data);
    return (
      <div className="staffid-official-id" ref={cardRef}>
        <div className="staffid-id-watermark">SPECIMEN</div>
        <div className="staffid-id-header">
          <img src={coatOfArms} alt="Coat of Arms" className="staffid-id-logo-left" />
          <div className="staffid-id-header-text">
            <div>JAMHURI YA MUUNGANO WA TANZANIA</div>
            <div>WIZARA YA MAMBO YA NDANI YA NCHI</div>
            <div>IDARA YA UHAMIAJI</div>
          </div>
          <img src={immigrationLogo} alt="Immigration" className="staffid-id-logo-right" />
          <div className="staffid-id-strip">
            <div className="staffid-id-strip-green" />
            <div className="staffid-id-strip-yellow" />
            <div className="staffid-id-strip-black" />
            <div className="staffid-id-strip-yellow" />
            <div className="staffid-id-strip-blue" />
          </div>
        </div>
        <div className="staffid-id-body">
          <div className="staffid-id-title">
            <h2>KITAMBULISHO CHA AFISA UHAMIAJI</h2>
            <p>IMMIGRATION OFFICER IDENTITY CARD</p>
          </div>
          <div className="staffid-id-qr">
            {qrCode ? <img src={qrCode} alt="QR Code" /> : <div className="staffid-id-qr-placeholder">QR</div>}
          </div>
          <div className="staffid-id-fields">
            <div className="staffid-id-field"><span className="staffid-id-label">Utambulisho / ID No.</span><span className="staffid-id-value">{d.staffIdNumber}</span></div>
            <div className="staffid-id-field"><span className="staffid-id-label">Jina / Given Names</span><span className="staffid-id-value">{d.givenNames}</span></div>
            <div className="staffid-id-field"><span className="staffid-id-label">Jina la Ukoo / Surname</span><span className="staffid-id-value">{d.surname}</span></div>
            <div className="staffid-id-field"><span className="staffid-id-label">Jinsia / Sex</span><span className="staffid-id-value">{d.sex}</span></div>
            <div className="staffid-id-field"><span className="staffid-id-label">Cheo / Rank</span><span className="staffid-id-value">{d.rank}</span></div>
            <div className="staffid-id-field"><span className="staffid-id-label">Kundi la Damu / Blood Group</span><span className="staffid-id-value">{d.bloodGroup}</span></div>
          </div>
          <img src={d.photo} alt="Employee" className="staffid-id-photo" />
        </div>
      </div>
    );
  };

  const getCurrentAppId = () => selectedApp?.id || editingApp?.id || requestRef || 'staff-id';

  const handleDownloadPng = async () => {
    if (!idCardRef.current) return;
    try {
      const canvas = await html2canvas(idCardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `${getCurrentAppId()}-staff-id.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      notificationService.error('Failed to download image.');
    }
  };

  const handleDownloadPdf = async () => {
    if (!idCardRef.current) return;
    try {
      const canvas = await html2canvas(idCardRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      const dataUrl = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'mm', format: [85.6, 53.98], orientation: 'landscape' });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 85.6, 53.98, undefined, 'FAST');
      pdf.save(`${getCurrentAppId()}-staff-id.pdf`);
    } catch (err) {
      notificationService.error('Failed to download PDF.');
    }
  };

  const handlePrintPreview = async () => {
    if (!idCardRef.current) return;
    try {
      const canvas = await html2canvas(idCardRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const dataUrl = canvas.toDataURL('image/png');
      const currentId = getCurrentAppId();
      const win = openBrandedHtml(`
        <html>
          <head><title>Print Staff ID - ${currentId}</title>
            <style>
              body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f7fa; }
              img { max-width: 100%; max-height: 100vh; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Staff ID" onload="setTimeout(function(){ window.print(); }, 300);" />
          </body>
        </html>
      `, `Print Staff ID - ${currentId}`);
      if (!win) {
        notificationService.info('Please allow popups to print.');
        return;
      }
    } catch (err) {
      notificationService.error('Failed to open print preview.');
    }
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Staff ID Management"
          subtitle="Manage your official identification and applications"
          color="#0B2E59"
          ctaLabel="Request Staff ID"
          onCta={openNewRequest}
        />

        <div className="staffid-tabs-row">
          <div className="reg-tabs">
            {TABS.map(tab => (
              <button key={tab.key} className={`reg-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => { setActiveTab(tab.key); setStep(1); setSubmitted(false); }}>
                {TAB_ICONS[tab.key]}{tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'status' && (
            <div className="staffid-tracker-selector staffid-tabs-tracker">
              <label className="form-label" htmlFor="trackingAppSelect">Select Application</label>
              <select id="trackingAppSelect" className="form-input form-select" value={trackingApp?.id || ''} onChange={e => setTrackingApp(APPLICATIONS.find(a => a.id === e.target.value) || null)}>
                {APPLICATIONS.map(app => (
                  <option key={app.id} value={app.id}>{app.id} — {app.type} ({app.status})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Request Staff ID Modal */}
        {showRequestModal && (
          <Modal
            isOpen={showRequestModal}
            onClose={() => { setShowRequestModal(false); setStep(1); setSubmitted(false); setEditingApp(null); }}
            title={editingApp ? `Edit Staff ID Application (Correction Mode) - ${editingApp.id}` : 'Request Staff ID'}
            size="lg"
            className="apply-leave-modal"
            footer={
              !submitted ? (
                step === 1 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => { setShowRequestModal(false); setStep(1); setEditingApp(null); }}>Cancel</button>
                    {isVerified && <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Personal Information</button>}
                  </div>
                ) : step === 2 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(1)}>Previous</button>
                    <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Request New ID</button>
                  </div>
                ) : step === 3 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(2)}>Previous</button>
                    <button className="btn btn-primary" onClick={() => setStep(4)}>Next: ID Preview</button>
                  </div>
                ) : step === 4 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(3)}>Previous</button>
                    <button className="btn btn-primary" onClick={() => setStep(5)}>Next: Declaration</button>
                  </div>
                ) : step === 5 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(4)}>Previous</button>
                    <button className="btn btn-primary" disabled={!declared} onClick={() => { setRequestRef(generateRefNumber()); setSubmitted(true); }}>Submit Request</button>
                  </div>
                ) : null
              ) : (
                <div className="leave-form-actions">
                  <button className="btn btn-primary" onClick={() => { setShowRequestModal(false); setSubmitted(false); setStep(1); setEditingApp(null); }}>Close</button>
                </div>
              )
            }
          >
            {!submitted ? (
              <>
                <div className="staffid-stepper">
                  {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                      <div className={`staffid-step ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : ''} ${i > 0 && !isVerified ? 'disabled' : ''}`}>
                        <div className="staffid-step-number">{step > i + 1 ? <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}</div>
                        <span className="staffid-step-label">{s}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className={`staffid-step-separator ${step > i + 1 ? 'completed' : ''} ${i === 0 && !isVerified ? 'disabled' : ''}`} />}
                    </React.Fragment>
                  ))}
                </div>

                {step === 1 && (
                  <>
                    {editingApp && editingApp.remarks && (
                      <div className="staffid-correction-banner">
                        <h5>HR Correction Remarks</h5>
                        <p>{editingApp.remarks}</p>
                        <span>Returned by {editingApp.returnedBy} on {editingApp.returnedDate}</span>
                      </div>
                    )}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Employee Verification</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>Your employee identifiers are pre-filled from your HRMS profile and are read-only.</p>
                      {!hasIdentifiers && (
                        <div className="login-modal-error" style={{ marginBottom: 16 }}>
                          Employee verification information is incomplete. Please contact HR support.
                        </div>
                      )}
                      {verifyError && <div className="login-modal-error" style={{ marginBottom: 16 }}>{verifyError}</div>}
                      {isVerified && employeeRecord && (
                        <div className="staffid-verify-success" style={{ marginBottom: 16 }}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <div>
                            <strong>Employee Verified Successfully</strong>
                            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                              {employeeRecord.fullName} &middot; {employeeRecord.employeeNumber}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="staffid-verify-row">
                        <div className="form-group">
                          <label className="form-label staffid-locked-label">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            Check Number
                          </label>
                          <input type="text" className="form-input form-input--readonly" value={verifyForm.checkNumber} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label staffid-locked-label">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            National ID (NIN)
                          </label>
                          <input type="text" className="form-input form-input--readonly" value={verifyForm.nin} readOnly />
                        </div>
                        <div className="form-group">
                          <span className="form-label" style={{ visibility: 'hidden' }} aria-hidden="true">&nbsp;</span>
                          {!isVerified && (
                            <button className="btn btn-primary" onClick={handleVerify} disabled={!hasIdentifiers || verifyLoading}>
                              {verifyLoading ? 'Verifying...' : 'Search Employee'}
                            </button>
                          )}
                          {isVerified && (
                            <button className="btn btn-secondary" onClick={() => { setIsVerified(false); setEmployeeRecord(buildInitialEmployeeRecord()); setIdPhoto(null); }}>
                              Clear Results
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Personal Information</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>The following details are retrieved from the official HRMS employee record and are read-only.</p>
                      <div className="leave-form-row">
                        <div className="form-group">
                          <label className="form-label">Employee Number</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.employeeNumber} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.fullName} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">National ID (NIN)</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.nin} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Gender</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.gender} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date of Birth</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.dob} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Nationality</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.nationality} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Marital Status</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.maritalStatus} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Blood Group</label>
                          <select className="form-input form-select form-input--readonly" value={employeeRecord.bloodGroup} disabled>
                            <option value="">Select blood group</option>
                            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                            <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Employment Information</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>Employment details are read-only and sourced from HRMS.</p>
                      <div className="leave-form-row">
                        <div className="form-group">
                          <label className="form-label">Department / Unit</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.department} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Designation</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.designation} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Employment Type</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.employmentType} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Appointment Date</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.appointmentDate} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Duty Station</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.dutyStation} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Region</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.region} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">District</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.district} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Position</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.position} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Territory</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.territory} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Working Region</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.workingRegion} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Working Station</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.workingStation} readOnly />
                        </div>
                      </div>
                    </div>

                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Contact & Address Information</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>Contact details are read-only and sourced from HRMS.</p>
                      <div className="leave-form-row">
                        <div className="form-group">
                          <label className="form-label">Official Email</label>
                          <input type="email" className="form-input form-input--readonly" value={employeeRecord.officialEmail} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.phoneNumber} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Mobile Number</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.mobileNumber} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Ward</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.ward} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Physical Address</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.physicalAddress} readOnly />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Postal Address</label>
                          <input type="text" className="form-input form-input--readonly" value={employeeRecord.postalAddress} readOnly />
                        </div>
                      </div>
                    </div>
                    {employeeRecord.photo && (
                      <div className="leave-form-section">
                        <h4 className="leave-form-section-title">Employee Photo (HRMS)</h4>
                        <p className="leave-section-desc" style={{ marginBottom: 16 }}>Employee photo retrieved from the official HRMS record.</p>
                        <div className="staffid-photo-upload staffid-photo-upload--readonly">
                          <div className="staffid-photo-preview">
                            <img src={employeeRecord.photo} alt="Employee" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Upload Current Photo for Staff ID</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>Upload a passport-size photo. Allowed: JPEG, PNG (max 5MB).</p>
                      <input type="file" ref={photoInputRef} className="file-upload-input" accept=".jpg,.jpeg,.png" onChange={handlePhotoUpload} />
                      <div className="staffid-photo-upload">
                        {idPhoto ? (
                          <div className="staffid-photo-preview">
                            <img src={idPhoto} alt="Employee" />
                            <div className="staffid-photo-actions">
                              <button className="btn btn-sm btn-secondary" onClick={() => photoInputRef.current?.click()}>Replace</button>
                              <button className="btn btn-sm btn-secondary" onClick={() => setIdPhoto(null)}>Remove</button>
                            </div>
                          </div>
                        ) : (
                          <div className="staffid-photo-placeholder" onClick={() => photoInputRef.current?.click()}>
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            <span>Click to upload photo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Request New ID</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>Select the type of ID request and provide any additional comments.</p>
                      <div className="leave-form-row">
                        <div className="form-group">
                          <label className="form-label">Type of ID Request</label>
                          <select className="form-input form-select" value={requestDetails.idType} onChange={e => setRequestDetails(prev => ({ ...prev, idType: e.target.value }))}>
                            <option>New Staff ID</option>
                            <option>Replacement ID</option>
                            <option>Lost ID</option>
                            <option>Damaged ID</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="leave-form-row leave-form-row--full">
                        <div className="form-group">
                          <label className="form-label">Comments / Reasons</label>
                          <textarea className="form-input form-textarea" rows={4} value={requestDetails.comments} onChange={e => setRequestDetails(prev => ({ ...prev, comments: e.target.value }))} placeholder="Provide additional explanation for your ID request..." />
                        </div>
                      </div>
                    </div>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Upload Supporting Document</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>Upload a supporting document. Accepted format: PDF only (max 10MB).</p>
                      <input type="file" ref={docInputRef} className="file-upload-input" accept=".pdf,application/pdf" onChange={handleDocUpload} />
                      <div className="attachment-row">
                        <div className="attachment-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                        <div className="attachment-info">
                          <p className="attachment-name">{requestDetails.supportingDoc ? requestDetails.supportingDoc.name : 'No file selected'}</p>
                          <p className="attachment-hint">{requestDetails.supportingDoc ? `${(requestDetails.supportingDoc.size / 1024).toFixed(1)} KB` : 'Click upload to select a PDF file'}</p>
                        </div>
                        <div className="attachment-status"><span className="attachment-badge required">Required</span></div>
                        <div className="attachment-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => docInputRef.current?.click()}>{requestDetails.supportingDoc ? 'Replace' : 'Upload'}</button>
                          {requestDetails.supportingDoc && <button className="btn btn-sm btn-secondary" onClick={() => setRequestDetails(prev => ({ ...prev, supportingDoc: null }))}>Remove</button>}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">ID Preview</h4>
                      <p className="leave-section-desc" style={{ marginBottom: 16 }}>Preview your Staff ID before submission. This is the same card design used in Application Details and will be printed once the request is approved.</p>
                      <div className="id-card-preview-wrap">
                        <div className="staffid-id-card-wrapper">
                          {renderIdCardFront(getPreviewData(), previewQrCode, idCardRef)}
                        </div>
                        <div className="staffid-id-actions">
                          <button className="btn btn-primary" onClick={handleDownloadPng}>Download Image</button>
                          <button className="btn btn-primary" onClick={handleDownloadPdf}>Download PDF</button>
                          <button className="btn btn-secondary" onClick={handlePrintPreview}>Print Preview</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    {/* Employee Verification Summary */}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Employee Verification</h4>
                      <div className="leave-detail-grid leave-detail-grid--3col">
                        <div className="leave-detail-item"><span className="leave-detail-label">Employee Name</span><span className="leave-detail-value">{employeeRecord?.fullName}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Employee Number</span><span className="leave-detail-value">{employeeRecord?.employeeNumber}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Check Number</span><span className="leave-detail-value">{employeeRecord?.checkNumber}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">National ID (NIN)</span><span className="leave-detail-value">{employeeRecord?.nin}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Designation</span><span className="leave-detail-value">{employeeRecord?.designation}</span></div>
                      </div>
                    </div>

                    {/* Personal Information Summary */}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Personal Information</h4>
                      <div className="leave-detail-grid leave-detail-grid--3col">
                        <div className="leave-detail-item"><span className="leave-detail-label">Employee Number</span><span className="leave-detail-value">{employeeRecord.employeeNumber}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Full Name</span><span className="leave-detail-value">{employeeRecord.fullName}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">National ID (NIN)</span><span className="leave-detail-value">{employeeRecord.nin}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Gender</span><span className="leave-detail-value">{employeeRecord.gender}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Date of Birth</span><span className="leave-detail-value">{employeeRecord.dob}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Nationality</span><span className="leave-detail-value">{employeeRecord.nationality}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Marital Status</span><span className="leave-detail-value">{employeeRecord.maritalStatus}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Blood Group</span><span className="leave-detail-value">{employeeRecord.bloodGroup}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Photo Uploaded</span><span className="leave-detail-value">{idPhoto ? 'Yes' : 'No'}</span></div>
                      </div>
                    </div>

                    {/* Employment Information Summary */}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Employment Information</h4>
                      <div className="leave-detail-grid leave-detail-grid--3col">
                        <div className="leave-detail-item"><span className="leave-detail-label">Department</span><span className="leave-detail-value">{employeeRecord.department}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Designation</span><span className="leave-detail-value">{employeeRecord.designation}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Employment Type</span><span className="leave-detail-value">{employeeRecord.employmentType}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Appointment Date</span><span className="leave-detail-value">{employeeRecord.appointmentDate}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Duty Station</span><span className="leave-detail-value">{employeeRecord.dutyStation}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Region</span><span className="leave-detail-value">{employeeRecord.region}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">District</span><span className="leave-detail-value">{employeeRecord.district}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Position</span><span className="leave-detail-value">{employeeRecord.position}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Territory</span><span className="leave-detail-value">{employeeRecord.territory}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Working Region</span><span className="leave-detail-value">{employeeRecord.workingRegion}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Working Station</span><span className="leave-detail-value">{employeeRecord.workingStation}</span></div>
                      </div>
                    </div>

                    {/* Contact & Address Information Summary */}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Contact & Address Information</h4>
                      <div className="leave-detail-grid leave-detail-grid--3col">
                        <div className="leave-detail-item"><span className="leave-detail-label">Official Email</span><span className="leave-detail-value">{employeeRecord.officialEmail}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Phone Number</span><span className="leave-detail-value">{employeeRecord.phoneNumber}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Mobile Number</span><span className="leave-detail-value">{employeeRecord.mobileNumber}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Ward</span><span className="leave-detail-value">{employeeRecord.ward}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Physical Address</span><span className="leave-detail-value">{employeeRecord.physicalAddress}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Postal Address</span><span className="leave-detail-value">{employeeRecord.postalAddress}</span></div>
                      </div>
                    </div>

                    {/* Request New ID Summary */}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Request New ID</h4>
                      <div className="leave-detail-grid leave-detail-grid--3col">
                        <div className="leave-detail-item"><span className="leave-detail-label">Type of ID Request</span><span className="leave-detail-value">{requestDetails.idType}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Supporting Document</span><span className="leave-detail-value">{requestDetails.supportingDoc ? requestDetails.supportingDoc.name : 'None'}</span></div>
                      </div>
                      {requestDetails.comments && (
                        <div style={{ marginTop: 12 }}>
                          <span className="leave-detail-label" style={{ display: 'block', marginBottom: 4 }}>Comments / Reasons</span>
                          <p style={{ fontSize: 14, color: 'var(--color-text)', background: 'var(--color-bg)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>{requestDetails.comments}</p>
                        </div>
                      )}
                    </div>

                    {/* Declaration */}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Declaration</h4>
                      <div className="staffid-declaration">
                        <p className="staffid-declaration-text">I, <strong>{employeeRecord?.fullName || 'the employee'}</strong>, hereby declare that all the information provided in this Staff ID request is true, accurate, and complete to the best of my knowledge. I understand that any false or misleading information may result in the rejection of this request and may subject me to disciplinary action in accordance with the organization's policies and regulations.</p>
                        <div className="staffid-declaration-check">
                          <input type="checkbox" id="declare" checked={declared} onChange={e => handleDeclaration(e.target.checked)} />
                          <label htmlFor="declare">I confirm that the information provided in this Staff ID request is correct and belongs to me.</label>
                        </div>
                        {declarationTimestamp && (
                          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 12 }}>
                            Declaration accepted on {new Date(declarationTimestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </>
            ) : (
              <div className="staffid-success">
                <div className="staffid-success-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <h3 className="staffid-success-title">{editingApp ? 'Correction Submitted Successfully' : 'Request Submitted Successfully'}</h3>
                <p className="staffid-success-desc">{editingApp ? 'Your corrected Staff ID application has been resubmitted to the Human Resource Office for re-evaluation.' : 'Your Staff ID request has been submitted successfully and is awaiting processing.'}</p>
                <div className="staffid-success-details">
                  <div className="staffid-success-row"><span className="staffid-success-label">Request Reference</span><span className="staffid-success-value">{requestRef || (editingApp ? editingApp.id : 'SID-2026-005')}</span></div>
                  <div className="staffid-success-row"><span className="staffid-success-label">Employee Name</span><span className="staffid-success-value">{employeeRecord?.fullName}</span></div>
                  <div className="staffid-success-row"><span className="staffid-success-label">Request Type</span><span className="staffid-success-value">{requestDetails.idType}</span></div>
                  <div className="staffid-success-row"><span className="staffid-success-label">Submission Date</span><span className="staffid-success-value">{new Date().toISOString().split('T')[0]}</span></div>
                  <div className="staffid-success-row"><span className="staffid-success-label">Current Status</span><span className="staffid-success-value"><span className="status-pill" style={editingApp ? STATUS_STYLE.Resubmitted : STATUS_STYLE.Submitted}>{editingApp ? 'Resubmitted' : 'Submitted'}</span></span></div>
                </div>
              </div>
            )}
          </Modal>
        )}

        {activeTab === 'my' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Application No', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'type', header: 'Type', render: row => <span className="leave-type">{row.type}</span> },
                { key: 'reason', header: 'Reason' },
                { key: 'submittedDate', header: 'Submitted Date' },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
                { key: 'hrResponse', header: 'HR Response' },
                { key: 'lastUpdated', header: 'Last Updated' },
              ]}
              data={APPLICATIONS}
              title="Applications"
              searchPlaceholder="Search by ID, reason, or status..."
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => openApp(row)} title="View Details"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                  {(row.status === 'Returned for Correction' || row.status === 'Draft') && (
                    <button className="action-btn action-btn--edit" onClick={() => openCorrection(row)} title="Edit / Correct Application"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  )}
                </div>
              )}
              emptyState={{ title: 'No applications found', description: 'You have not submitted any Staff ID applications yet.' }}
            />
          </>
        )}

        {activeTab === 'status' && (
          <>
            {trackingApp && (
              <>
                <div className="staffid-status-card">
                  <div className="staffid-status-card-main">
                    <div>
                      <span className="staffid-status-card-label">Current Status</span>
                      <span className="status-pill" style={{ background: STATUS_STYLE[trackingApp.status]?.background, color: STATUS_STYLE[trackingApp.status]?.color }}>{trackingApp.status}</span>
                    </div>
                    <div>
                      <span className="staffid-status-card-label">Application Type</span>
                      <span className="staffid-status-card-value">{trackingApp.type}</span>
                    </div>
                    <div>
                      <span className="staffid-status-card-label">Submitted</span>
                      <span className="staffid-status-card-value">{trackingApp.submittedDate}</span>
                    </div>
                    <div>
                      <span className="staffid-status-card-label">Last Updated</span>
                      <span className="staffid-status-card-value">{trackingApp.lastUpdated}</span>
                    </div>
                  </div>
                  {trackingApp.status === 'Returned for Correction' && (
                    <div className="staffid-status-card-alert">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <span>Action Required: This application has been returned for correction.</span>
                    </div>
                  )}
                </div>

                <div className="staffid-tracker-grid">
                  <div className="staffid-tracker-panel">
                    <h4 className="staffid-tracker-panel-title">Processing Progress</h4>
                    <div className="staffid-progress-tracker">
                      {['Submitted', 'Received by HR', 'Verification', 'Approved', 'Printing', 'Quality Verification', 'Ready for Collection', 'Issued'].map((stage, i) => {
                        const currentIdx = ['Submitted', 'Received by HR', 'Verification', 'Returned for Correction', 'Resubmitted', 'Approved', 'Printing', 'Quality Verification', 'Ready for Collection', 'Issued'].indexOf(trackingApp.status);
                        const isActive = i <= currentIdx;
                        const isCurrent = trackingApp.status === stage;
                        return (
                          <div key={stage} className={`staffid-progress-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                            <div className="staffid-progress-dot" />
                            <span className="staffid-progress-label">{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="staffid-tracker-panel">
                    <h4 className="staffid-tracker-panel-title">HR Response</h4>
                    <div className="staffid-hr-response">
                      <div className="staffid-hr-response-item">
                        <p className="staffid-hr-response-text">{trackingApp.remarks || 'No remarks available.'}</p>
                        <div className="staffid-hr-response-meta">
                          <span>Officer: {trackingApp.hrResponse === 'Pending' ? '—' : trackingApp.returnedBy || 'HR Office'}</span>
                          <span>Date: {trackingApp.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {trackingApp.status === 'Returned for Correction' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                    <button className="btn btn-primary" onClick={() => openCorrection(trackingApp)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit / Correct Application
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {selectedApp && (
          <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Application Details - ${selectedApp.id}`} size="xl" className="staffid-detail-modal" footer={<button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>}>
            <div className="staffid-modal-tabs">
              {[{ key: 'info', label: 'Application Info' }, { key: 'attachments', label: 'Attachments' }, { key: 'preview', label: 'ID Preview' }, { key: 'timeline', label: 'Timeline' }].map(t => (
                <button key={t.key} className={`staffid-modal-tab ${modalTab === t.key ? 'active' : ''}`} onClick={() => setModalTab(t.key)}>{t.label}</button>
              ))}
            </div>

            {modalTab === 'info' && (
              <>
                <div className="leave-detail-status-bar">
                  <span className="leave-detail-status-label">Status</span>
                  <span className="status-pill" style={{ background: STATUS_STYLE[selectedApp.status]?.background, color: STATUS_STYLE[selectedApp.status]?.color }}>{selectedApp.status}</span>
                </div>

                <div className="leave-detail-section">
                  <h5 className="leave-detail-section-title">Application Information</h5>
                  <div className="leave-detail-grid leave-detail-grid--3col">
                    <div className="leave-detail-item"><span className="leave-detail-label">Application No</span><span className="leave-detail-value">{selectedApp.id}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Application Type</span><span className="leave-detail-value">{selectedApp.type}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Reason</span><span className="leave-detail-value">{selectedApp.reason}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Submitted Date</span><span className="leave-detail-value">{selectedApp.submittedDate}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Last Updated</span><span className="leave-detail-value">{selectedApp.lastUpdated}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">HR Response</span><span className="leave-detail-value">{selectedApp.hrResponse}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Correction Status</span><span className="leave-detail-value">{selectedApp.correctionStatus}</span></div>
                    {selectedApp.returnedDate && <div className="leave-detail-item"><span className="leave-detail-label">Returned Date</span><span className="leave-detail-value">{selectedApp.returnedDate}</span></div>}
                    {selectedApp.returnedBy && <div className="leave-detail-item"><span className="leave-detail-label">Returned By</span><span className="leave-detail-value">{selectedApp.returnedBy}</span></div>}
                  </div>
                </div>

                <div className="leave-detail-section">
                  <h5 className="leave-detail-section-title">Employee & Personal Information</h5>
                  <div className="leave-detail-grid leave-detail-grid--3col">
                    <div className="leave-detail-item"><span className="leave-detail-label">Employee Name</span><span className="leave-detail-value">{selectedApp.fullName}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Employee Number</span><span className="leave-detail-value">{selectedApp.employeeNumber}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Department</span><span className="leave-detail-value">{selectedApp.department}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Working Station</span><span className="leave-detail-value">{selectedApp.workingStation}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Territory</span><span className="leave-detail-value">{selectedApp.territory}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Working Region</span><span className="leave-detail-value">{selectedApp.workingRegion}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Mobile Number</span><span className="leave-detail-value">{selectedApp.mobile}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Email Address</span><span className="leave-detail-value">{selectedApp.email}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Blood Group</span><span className="leave-detail-value">{selectedApp.bloodGroup}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Photo Uploaded</span><span className="leave-detail-value">{selectedApp.photoUploaded ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>

                <div className="leave-detail-section">
                  <h5 className="leave-detail-section-title">Request Details</h5>
                  <div className="leave-detail-grid leave-detail-grid--3col">
                    <div className="leave-detail-item"><span className="leave-detail-label">ID Request Type</span><span className="leave-detail-value">{selectedApp.type}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Supporting Document</span><span className="leave-detail-value">{selectedApp.supportingDoc || 'None'}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Declaration</span><span className="leave-detail-value">{selectedApp.declaration ? 'Accepted' : 'Not Accepted'}</span></div>
                  </div>
                  {selectedApp.comments && (
                    <div style={{ marginTop: 16 }}>
                      <span className="leave-detail-label" style={{ display: 'block', marginBottom: 6 }}>Comments / Reasons</span>
                      <p style={{ fontSize: 14, color: 'var(--color-text)', background: 'var(--color-bg)', padding: '12px 16px', borderRadius: 'var(--radius-md)', margin: 0, lineHeight: 1.5 }}>{selectedApp.comments}</p>
                    </div>
                  )}
                </div>

                {selectedApp.remarks && (
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">HR Remarks</h5>
                    <p style={{ fontSize: 14, color: 'var(--color-text)', background: 'var(--color-bg)', padding: '12px 16px', borderRadius: 'var(--radius-md)', margin: 0, lineHeight: 1.5 }}>{selectedApp.remarks}</p>
                  </div>
                )}
              </>
            )}

            {modalTab === 'attachments' && (
              <div className="leave-detail-section">
                <h5 className="leave-detail-section-title">Uploaded Attachments</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(REASON_ATTACHMENTS[selectedApp.reason] || []).map(([idx, att]) => (
                    <div key={idx} className="attachment-row">
                      <div className="attachment-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                      <div className="attachment-info"><p className="attachment-name">{att.name}</p><p className="attachment-hint">{att.required ? 'Required document' : 'Optional document'}</p></div>
                      <div className="attachment-actions"><button className="btn btn-sm btn-primary" onClick={() => handleViewAttachment(att)}>View</button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalTab === 'preview' && (
              <div className="id-card-preview-wrap">
                <div className="staffid-id-card-wrapper">
                  {renderIdCardFront(selectedApp, idQrCode, idCardRef)}
                </div>
                <div className="staffid-id-actions">
                  <button className="btn btn-primary" onClick={handleDownloadPng}>Download Image</button>
                  <button className="btn btn-primary" onClick={handleDownloadPdf}>Download PDF</button>
                  <button className="btn btn-secondary" onClick={handlePrintPreview}>Print Preview</button>
                </div>
              </div>
            )}

            {modalTab === 'timeline' && (
              <div className="staffid-timeline" style={{ marginTop: 0 }}>
                {TIMELINE.map(t => (
                  <div key={t.stage} className="staffid-timeline-item">
                    <div className={`staffid-timeline-dot ${t.status === 'Completed' ? 'completed' : t.status === 'Current' ? 'current' : ''}`} />
                    <div className="staffid-timeline-content">
                      <p className="staffid-timeline-title">{t.stage}</p>
                      <p className="staffid-timeline-meta">{t.date} &middot; {t.time} &middot; {t.officer}{t.comment ? ` &middot; ${t.comment}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>
        )}
      </main>
    </div>
  );
}

export default StaffIdPage;
