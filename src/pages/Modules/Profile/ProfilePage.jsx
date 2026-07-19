import React, { useState, useRef } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import EmployeeSearchTab from '../../../components/registration/EmployeeSearchTab';
import PersonalTab from '../../../components/registration/PersonalTab';
import EducationTab from '../../../components/registration/EducationTab';
import DependantsTab from '../../../components/registration/DependantsTab';
import NextOfKinTab from '../../../components/registration/NextOfKinTab';
import ContactTab from '../../../components/registration/ContactTab';
import TransferHistoryTab from '../../../components/registration/TransferHistoryTab';
import LeaveHistoryTab from '../../../components/registration/LeaveHistoryTab';
import DeclarationTab from '../../../components/registration/DeclarationTab';
import '../../../components/registration/EmployeeRegistrationModal.css';
import { notificationService } from '../../../components/Notifications/notificationService';
import './ProfilePage.css';

const TABS = [
  { key: 'search', label: 'Employee Search', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { key: 'personal', label: 'Personal Information', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { key: 'education', label: 'Education Information', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10l-10-6-10 6 10 6 10-6z"/><path d="M6 12v5l6 3 6-3v-5"/></svg> },
  { key: 'dependants', label: 'Dependants', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { key: 'nextofkin', label: 'Next of Kin', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { key: 'contact', label: 'Contact Information', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { key: 'transferHistory', label: 'Transfer History', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h3v3h-3z"/><path d="M8 18h3v3H8z"/><path d="M21 6l-9 9"/><path d="M15 6h6v6"/><path d="M9 18H3v-6"/></svg> },
  { key: 'leaveHistory', label: 'Leave History', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { key: 'declaration', label: 'Declaration', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
];

const INIT_LOC = { region: '', district: '', ward: '', village: '', street: '', house: '' };
const INIT_PERSONAL = { firstName: '', middleName: '', lastName: '', gender: '', dateOfBirth: '', maritalStatus: '', nationality: 'Tanzanian', idType: '', idNumber: '', employeePhoto: null, employeeId: '', checkNumber: '', department: '', designation: '', grade: '', dateOfFirstAppointment: '', dateOfCurrentAppointment: '', employmentType: 'Permanent' };
const makeId = () => Date.now() + Math.floor(Math.random() * 1000);
const blankEdu = () => ({ id: makeId(), level: '', institution: '', year: '', attachments: [] });
const blankHigher = () => ({ id: makeId(), degree: '', institution: '', year: '', attachments: [] });
const blankProf = () => ({ id: makeId(), qualification: '', institution: '', year: '', attachments: [] });
const blankDep = () => ({ id: makeId(), fullName: '', relationship: '', gender: '', dateOfBirth: '', occupation: '', school: '', attachments: [] });
const blankKin = () => ({ id: makeId(), fullName: '', relationship: '', dateOfBirth: '', gender: '', occupation: '', phone: '', email: '', physicalAddress: '', postalAddress: '' });

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('search');
  const [employeeVerified, setEmployeeVerified] = useState(false);
  const [verifiedEmployeeId, setVerifiedEmployeeId] = useState('');
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
  const [declared, setDeclared] = useState(false);
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
    if (!declared) {
      setActiveTab('declaration');
      return;
    }
    setSubmitting(true);
    notificationService.promise(
      new Promise(resolve => setTimeout(() => { resetForm(); resolve(); }, 1500)),
      { loading: 'Submitting profile update...', success: 'Employee information updated successfully.', error: 'Failed to update employee information.' }
    ).finally(() => setSubmitting(false));
  };

  const handleSaveDraft = () => {
    notificationService.success('Draft saved successfully.');
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
    setEmployeeVerified(false);
    setVerifiedEmployeeId('');
    setDeclared(false);
  };

  const handlePopulate = (data) => {
    setEmployeeVerified(true);
    if (data.personal?.employeeId) setVerifiedEmployeeId(data.personal.employeeId);
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
      case 'transferHistory': return <TransferHistoryTab employeeId={verifiedEmployeeId} />;
      case 'leaveHistory': return <LeaveHistoryTab employeeId={verifiedEmployeeId} />;
      case 'declaration': return <DeclarationTab personal={personal} contact={contact} physAddr={physAddr} workLoc={workLoc} basicEdu={basicEdu} higherEdu={higherEdu} profQuals={profQuals} dependants={dependants} nextOfKin={nextOfKin} attachments={attachments} declared={declared} setDeclared={setDeclared} onSubmit={handleSubmit} onSaveDraft={handleSaveDraft} submitting={submitting} />;
      default: return null;
    }
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="My Profile"
          subtitle="View and manage your personal and employment details"
          color="#0B2E59"
        />

        <div className="reg-tabs">
          {TABS.map(tab => {
            const disabled = tab.requiresEmployee && !employeeVerified;
            return (
              <button
                key={tab.key}
                className={`reg-tab ${activeTab === tab.key ? 'active' : ''} ${disabled ? 'reg-tab--disabled' : ''}`}
                onClick={() => !disabled && setActiveTab(tab.key)}
                disabled={disabled}
                type="button"
                title={disabled ? 'Complete employee search first' : ''}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        <Card hover={false}>
          <div className="reg-tab-content">
            {renderTabContent()}
          </div>
        </Card>

        {employeeVerified && (
          <div className="profile-page-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel / Reset</button>
            <button type="button" className="btn btn-secondary" onClick={handleSaveDraft}>Save Changes</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Update Request'}
            </button>
          </div>
        )}
      </main>

    </div>
  );
}

export default ProfilePage;
