import React, { useState, useRef } from 'react';
import Modal from '../common/Modal/Modal';
import EmployeeSearchTab from './EmployeeSearchTab';
import PersonalTab from './PersonalTab';
import EducationTab from './EducationTab';
import DependantsTab from './DependantsTab';
import NextOfKinTab from './NextOfKinTab';
import ContactTab from './ContactTab';
import './EmployeeRegistrationModal.css';

const TABS = [
  { key: 'search', label: 'Employee Search', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { key: 'personal', label: 'Personal Information', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { key: 'education', label: 'Education Information', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10l-10-6-10 6 10 6 10-6z"/><path d="M6 12v5l6 3 6-3v-5"/></svg> },
  { key: 'dependants', label: 'Dependants', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { key: 'nextofkin', label: 'Next of Kin', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { key: 'contact', label: 'Contact Information', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
];

const INIT_LOC = { region: '', district: '', ward: '', village: '', street: '', house: '' };
const INIT_PERSONAL = { firstName: '', middleName: '', lastName: '', gender: '', dateOfBirth: '', maritalStatus: '', nationality: 'Tanzanian', idType: '', idNumber: '', employeePhoto: null, employeeId: '', checkNumber: '', department: '', designation: '', grade: '', dateOfFirstAppointment: '', dateOfCurrentAppointment: '', employmentType: 'Permanent' };
const makeId = () => Date.now() + Math.floor(Math.random() * 1000);
const blankEdu = () => ({ id: makeId(), level: '', institution: '', year: '', attachments: [] });
const blankHigher = () => ({ id: makeId(), degree: '', institution: '', year: '', attachments: [] });
const blankProf = () => ({ id: makeId(), qualification: '', institution: '', year: '', attachments: [] });
const blankDep = () => ({ id: makeId(), fullName: '', relationship: '', gender: '', dateOfBirth: '', occupation: '', school: '', attachments: [] });
const blankKin = () => ({ id: makeId(), fullName: '', relationship: '', dateOfBirth: '', gender: '', occupation: '', phone: '', email: '', physicalAddress: '', postalAddress: '' });

function EmployeeRegistrationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('search');
  const [personal, setPersonal] = useState(INIT_PERSONAL);
  const [photo, setPhoto] = useState(null);
  const [basicEdu, setBasicEdu] = useState([blankEdu()]);
  const [higherEdu, setHigherEdu] = useState([blankHigher()]);
  const [profQuals, setProfQuals] = useState([blankProf()]);
  const [dependants, setDependants] = useState([blankDep()]);
  const [nextOfKin, setNextOfKin] = useState([blankKin()]);
  const [contact, setContact] = useState({ phone: '', email: '', altPhone: '' });
  const [physAddr, setPhysAddr] = useState({ ...INIT_LOC });
  const [workLoc, setWorkLoc] = useState({ ...INIT_LOC });
  const [domicile, setDomicile] = useState({ ...INIT_LOC });
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const photoRef = useRef(null);
  const fileRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!personal.firstName.trim()) e.firstName = 'First name is required';
    if (!personal.lastName.trim()) e.lastName = 'Last name is required';
    if (!personal.gender) e.gender = 'Gender is required';
    if (!personal.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!personal.idType) e.idType = 'ID type is required';
    if (!personal.idNumber.trim()) e.idNumber = 'ID number is required';
    if (!personal.employeeId.trim()) e.employeeId = 'Employee ID is required';
    if (!personal.checkNumber.trim()) e.checkNumber = 'Check number is required';
    if (!personal.department.trim()) e.department = 'Department is required';
    if (!contact.phone.trim()) e.phone = 'Phone number is required';
    if (!contact.email.trim()) e.email = 'Email address is required';
    if (!physAddr.region) e.physRegion = 'Region is required';
    if (!physAddr.district) e.physDistrict = 'District is required';
    return e;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorTab = getErrorTab(validationErrors);
      if (firstErrorTab) setActiveTab(firstErrorTab);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Employee registration submitted successfully!');
      resetForm();
      onClose();
    }, 1500);
  };

  const handleSaveDraft = () => {
    alert('Draft saved successfully!');
  };

  const resetForm = () => {
    setPersonal(INIT_PERSONAL);
    setPhoto(null);
    setBasicEdu([blankEdu()]);
    setHigherEdu([blankHigher()]);
    setProfQuals([blankProf()]);
    setDependants([blankDep()]);
    setNextOfKin([blankKin()]);
    setContact({ phone: '', email: '', altPhone: '' });
    setPhysAddr({ ...INIT_LOC });
    setWorkLoc({ ...INIT_LOC });
    setDomicile({ ...INIT_LOC });
    setAttachments([]);
    setErrors({});
    setActiveTab('search');
  };

  const handlePopulate = (data) => {
    if (data.personal) setPersonal({ ...INIT_PERSONAL, ...data.personal });
    if (data.contact) setContact(data.contact);
    if (data.physAddr) setPhysAddr({ ...INIT_LOC, ...data.physAddr });
    if (data.workLoc) setWorkLoc({ ...INIT_LOC, ...data.workLoc });
    if (data.domicile) setDomicile({ ...INIT_LOC, ...data.domicile });
    if (data.basicEdu) setBasicEdu(data.basicEdu.map(e => ({ ...e, id: e.id || makeId() })));
    if (data.higherEdu) setHigherEdu(data.higherEdu.map(e => ({ ...e, id: e.id || makeId() })));
    if (data.profQuals) setProfQuals(data.profQuals.map(e => ({ ...e, id: e.id || makeId() })));
    if (data.dependants) setDependants(data.dependants.map(d => ({ ...blankDep(), ...d, id: d.id || makeId() })));
    if (data.nextOfKin) setNextOfKin(data.nextOfKin.map(k => ({ ...blankKin(), ...k, id: k.id || makeId() })));
    setErrors({});
    setActiveTab('personal');
  };

  const getErrorTab = (errs) => {
    const personalFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'idType', 'idNumber', 'employeeId', 'checkNumber', 'department'];
    const contactFields = ['phone', 'email', 'physRegion', 'physDistrict'];
    if (Object.keys(errs).some(f => personalFields.includes(f))) return 'personal';
    if (Object.keys(errs).some(f => contactFields.includes(f))) return 'contact';
    return 'personal';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search': return <EmployeeSearchTab onPopulate={handlePopulate} />;
      case 'personal': return <PersonalTab personal={personal} setPersonal={setPersonal} errors={errors} setErrors={setErrors} photo={photo} setPhoto={setPhoto} photoRef={photoRef} />;
      case 'education': return <EducationTab basicEdu={basicEdu} setBasicEdu={setBasicEdu} higherEdu={higherEdu} setHigherEdu={setHigherEdu} profQuals={profQuals} setProfQuals={setProfQuals} />;
      case 'dependants': return <DependantsTab dependants={dependants} setDependants={setDependants} />;
      case 'nextofkin': return <NextOfKinTab nextOfKin={nextOfKin} setNextOfKin={setNextOfKin} />;
      case 'contact': return <ContactTab contact={contact} setContact={setContact} physAddr={physAddr} setPhysAddr={setPhysAddr} workLoc={workLoc} setWorkLoc={setWorkLoc} domicile={domicile} setDomicile={setDomicile} attachments={attachments} setAttachments={setAttachments} fileRef={fileRef} errors={errors} />;
      default: return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Employee Registration"
      size="xl"
      className="registration-modal"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-secondary" onClick={handleSaveDraft}>Save as Draft</button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </>
      }
    >
      <div className="reg-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`reg-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="reg-tab-content">
        {renderTabContent()}
      </div>
    </Modal>
  );
}

export default EmployeeRegistrationModal;
