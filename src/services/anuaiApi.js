import { notificationService } from '../components/Notifications/notificationService';
import { apiClient } from './apiClient';
import {
  USE_DEMO,
  ANUAI_REQUESTS_ENDPOINT,
  ANUAI_REQUEST_ENDPOINT,
} from '../config/api';

let demoIdCounter = 4;

const DEMO_REQUESTS = [
  {
    id: 'AZJ-2026-001',
    referenceNo: 'AZJ-2026-001',
    employeeId: 'EMP-2026-00125',
    type: 'support',
    category: 'Gender Equality',
    subject: 'Request for gender desk awareness session',
    description: 'I would like the gender desk team to organise an awareness session for our department on workplace harassment policies.',
    submittedDate: '2026-07-15',
    submittedAt: '2026-07-15T09:30:00',
    status: 'Under Review',
    contactMethod: 'Portal Response',
    isConfidential: false,
    attachments: [],
    location: '',
    incidentDate: '',
    additionalRemarks: '',
    managementResponse: 'Your request has been received. The gender desk will schedule the session within two weeks.',
    timeline: [
      { stage: 'Employee submitted request', date: '2026-07-15', time: '09:30 AM', actor: 'You', comment: 'Request created' },
      { stage: 'Management received request', date: '2026-07-15', time: '10:00 AM', actor: 'Anuai za Jamii Desk', comment: 'Request acknowledged' },
      { stage: 'Under review', date: '2026-07-16', time: '11:30 AM', actor: 'Gender Desk Officer', comment: 'Planning awareness schedule' },
    ],
  },
  {
    id: 'AZJ-2026-002',
    referenceNo: 'AZJ-2026-002',
    employeeId: 'EMP-2026-00125',
    type: 'support',
    category: 'People with Disabilities Support',
    subject: 'Accessibility request for meeting room',
    description: 'The conference room on the second floor does not have wheelchair access. Can the department look into this?',
    submittedDate: '2026-06-20',
    submittedAt: '2026-06-20T14:15:00',
    status: 'Resolved',
    contactMethod: 'Email',
    isConfidential: false,
    attachments: [],
    location: 'Dar es Salaam HQ',
    incidentDate: '',
    additionalRemarks: '',
    managementResponse: 'The facilities team has installed a ramp and reserved parking near the lift. Thank you for raising this.',
    timeline: [
      { stage: 'Employee submitted request', date: '2026-06-20', time: '02:15 PM', actor: 'You', comment: 'Request created' },
      { stage: 'Management received request', date: '2026-06-20', time: '03:00 PM', actor: 'Anuai za Jamii Desk', comment: 'Request acknowledged' },
      { stage: 'In Progress', date: '2026-06-21', time: '09:00 AM', actor: 'Facilities Officer', comment: 'Assessing access points' },
      { stage: 'Resolved', date: '2026-06-25', time: '04:00 PM', actor: 'Facilities Officer', comment: 'Ramp installed' },
    ],
  },
  {
    id: 'AZJ-2026-003',
    referenceNo: 'AZJ-2026-003',
    employeeId: 'EMP-2026-00125',
    type: 'concern',
    category: 'Workplace Health and Safety',
    subject: 'Broken air conditioning in office block B',
    description: 'The air conditioning in office block B has not been working for three days. The heat is affecting productivity.',
    submittedDate: '2026-08-01',
    submittedAt: '2026-08-01T10:00:00',
    status: 'In Progress',
    contactMethod: 'Phone',
    isConfidential: false,
    attachments: [],
    location: 'Office Block B',
    incidentDate: '2026-07-29',
    additionalRemarks: 'Affects the whole floor.',
    managementResponse: '',
    timeline: [
      { stage: 'Employee submitted request', date: '2026-08-01', time: '10:00 AM', actor: 'You', comment: 'Concern reported' },
      { stage: 'Management received request', date: '2026-08-01', time: '11:00 AM', actor: 'Anuai za Jamii Desk', comment: 'Escalated to facilities' },
      { stage: 'In Progress', date: '2026-08-02', time: '08:00 AM', actor: 'Facilities Officer', comment: 'Technician dispatched' },
    ],
  },
  {
    id: 'AZJ-2026-004',
    referenceNo: 'AZJ-2026-004',
    employeeId: 'EMP-2026-00125',
    type: 'support',
    category: 'Sports and Culture',
    subject: 'Participation in upcoming sports tournament',
    description: 'I would like to register for the upcoming inter-department football tournament. Kindly advise on the process.',
    submittedDate: '2026-08-05',
    submittedAt: '2026-08-05T08:45:00',
    status: 'Submitted',
    contactMethod: 'Portal Response',
    isConfidential: false,
    attachments: [],
    location: '',
    incidentDate: '',
    additionalRemarks: '',
    managementResponse: '',
    timeline: [
      { stage: 'Employee submitted request', date: '2026-08-05', time: '08:45 AM', actor: 'You', comment: 'Request created' },
    ],
  },
];

function demoDelay(ms = 400) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeRequest(payload) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return {
    ...payload,
    submittedDate: dateStr,
    submittedAt: now.toISOString(),
    status: 'Submitted',
    referenceNo: `AZJ-2026-${String(demoIdCounter++).padStart(3, '0')}`,
    managementResponse: '',
    timeline: [
      { stage: payload.type === 'concern' ? 'Employee reported concern' : 'Employee submitted request', date: dateStr, time: timeStr, actor: 'You', comment: 'Request created' },
    ],
  };
}

export async function getMyRequests(employeeId) {
  if (USE_DEMO) {
    await demoDelay();
    return DEMO_REQUESTS.filter(r => r.employeeId === employeeId);
  }
  return apiClient.get(ANUAI_REQUESTS_ENDPOINT, { employeeId });
}

export async function getRequest(id) {
  if (USE_DEMO) {
    await demoDelay();
    const request = DEMO_REQUESTS.find(r => r.id === id);
    if (!request) throw new Error('Request not found.');
    return request;
  }
  return apiClient.get(`${ANUAI_REQUEST_ENDPOINT}/${id}`);
}

export async function createRequest(payload) {
  if (USE_DEMO) {
    await demoDelay(600);
    const request = normalizeRequest(payload);
    DEMO_REQUESTS.unshift(request);
    return request;
  }
  return apiClient.post(ANUAI_REQUESTS_ENDPOINT, payload);
}

export async function cancelRequest(id) {
  if (USE_DEMO) {
    await demoDelay(400);
    const request = DEMO_REQUESTS.find(r => r.id === id);
    if (!request) throw new Error('Request not found.');
    if (request.status === 'Cancelled') throw new Error('Request is already cancelled.');
    if (['Resolved', 'Closed'].includes(request.status)) throw new Error('Cannot cancel a completed request.');
    const now = new Date();
    request.status = 'Cancelled';
    request.timeline.push({
      stage: 'Request cancelled by employee',
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      actor: 'You',
      comment: 'Request cancelled',
    });
    return request;
  }
  return apiClient.patch(`${ANUAI_REQUEST_ENDPOINT}/${id}/cancel`);
}

export async function addFollowUp(id, { message, attachments = [] }) {
  if (USE_DEMO) {
    await demoDelay(500);
    const request = DEMO_REQUESTS.find(r => r.id === id);
    if (!request) throw new Error('Request not found.');
    const now = new Date();
    request.timeline.push({
      stage: 'Employee follow-up',
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      actor: 'You',
      comment: message,
    });
    return request;
  }
  return apiClient.post(`${ANUAI_REQUEST_ENDPOINT}/${id}/follow-up`, { message, attachments });
}

export function withApiNotification(promise, messages) {
  return notificationService.promise(promise, messages);
}
