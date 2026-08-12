/**
 * Permission configuration.
 *
 * Defines modules and actions, plus a role-to-permission matrix used as a
 * fallback when the backend does not return an explicit permission object.
 */

export const MODULES = {
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  STAFF_ID: 'staffId',
  TRANSFER: 'transfer',
  LIKIZO: 'likizo',
  TRAINING: 'training',
  ANNOUNCEMENTS: 'announcements',
  DOCUMENTS: 'documents',
  SALARY: 'salary',
  LOAN: 'loan',
  ANUAI: 'anuai',
};

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
};

function perms(view, create = false, update = false, remove = false, approve = false) {
  return {
    [ACTIONS.VIEW]: view,
    [ACTIONS.CREATE]: create,
    [ACTIONS.UPDATE]: update,
    [ACTIONS.DELETE]: remove,
    [ACTIONS.APPROVE]: approve,
  };
}

function allPermissions(granted) {
  const result = {};
  Object.values(MODULES).forEach((m) => {
    result[m] = {};
    Object.values(ACTIONS).forEach((a) => {
      result[m][a] = granted;
    });
  });
  return result;
}

const READ = perms(true);
const READ_WRITE = perms(true, true, true);
const READ_CREATE = perms(true, true);

export const ROLE_PERMISSIONS = {
  admin: allPermissions(true),
  hr: {
    [MODULES.DASHBOARD]: READ,
    [MODULES.PROFILE]: READ_WRITE,
    [MODULES.STAFF_ID]: READ,
    [MODULES.TRANSFER]: READ_WRITE,
    [MODULES.LIKIZO]: READ_WRITE,
    [MODULES.TRAINING]: READ_WRITE,
    [MODULES.ANNOUNCEMENTS]: { ...READ_WRITE, [ACTIONS.APPROVE]: true },
    [MODULES.DOCUMENTS]: READ_WRITE,
    [MODULES.SALARY]: READ,
    [MODULES.LOAN]: READ_WRITE,
    [MODULES.ANUAI]: { ...READ_WRITE, [ACTIONS.APPROVE]: true },
  },
  staff: {
    [MODULES.DASHBOARD]: READ,
    [MODULES.PROFILE]: READ_WRITE,
    [MODULES.STAFF_ID]: READ,
    [MODULES.TRANSFER]: READ_CREATE,
    [MODULES.LIKIZO]: READ_CREATE,
    [MODULES.TRAINING]: READ_CREATE,
    [MODULES.ANNOUNCEMENTS]: READ,
    [MODULES.DOCUMENTS]: READ_CREATE,
    [MODULES.SALARY]: READ,
    [MODULES.LOAN]: READ_CREATE,
    [MODULES.ANUAI]: READ_CREATE,
  },
  manager: {
    [MODULES.DASHBOARD]: READ,
    [MODULES.PROFILE]: READ_WRITE,
    [MODULES.STAFF_ID]: READ,
    [MODULES.TRANSFER]: { ...READ_CREATE, [ACTIONS.APPROVE]: true },
    [MODULES.LIKIZO]: { ...READ_CREATE, [ACTIONS.APPROVE]: true },
    [MODULES.TRAINING]: READ,
    [MODULES.ANNOUNCEMENTS]: READ,
    [MODULES.DOCUMENTS]: READ,
    [MODULES.SALARY]: READ,
    [MODULES.LOAN]: { ...READ_CREATE, [ACTIONS.APPROVE]: true },
    [MODULES.ANUAI]: { ...READ_CREATE, [ACTIONS.APPROVE]: true },
  },
};

/**
 * Derive a permission map from the user's role.  Used as a fallback when the
 * backend does not return a permission object.
 */
export function derivePermissions(user) {
  if (user?.permissions && typeof user.permissions === 'object') {
    return user.permissions;
  }
  const role = String(user?.role || user?.roles?.[0] || 'staff').toLowerCase();
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.staff;
}
