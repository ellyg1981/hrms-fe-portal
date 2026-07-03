import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      profile: 'My Profile',
      leave: 'Leave Management',
      training: 'Training',
      announcements: 'Announcements',
      documents: 'Documents',
      performance: 'Performance',
      logout: 'Logout',
      login: 'Login',
      welcome: 'Welcome back',
      quickActions: 'Quick Actions',
      notifications: 'Notifications',
      myActivity: 'My Activity',
      apply: 'Apply',
      view: 'View',
      download: 'Download',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
      status: 'Status',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
      inProgress: 'In Progress',
    }
  },
  sw: {
    translation: {
      dashboard: 'Dashibodi',
      profile: 'Wasifu Wangu',
      leave: 'Usimamizi wa Likizo',
      training: 'Mafunzo',
      announcements: 'Matangazo',
      documents: 'Nyaraka',
      performance: 'Utendaji',
      logout: 'Toka',
      login: 'Ingia',
      welcome: 'Karibu tena',
      quickActions: 'Vitendo vya Haraka',
      notifications: 'Arifa',
      myActivity: 'Shughuli Zangu',
      apply: 'Omba',
      view: 'Tazama',
      download: 'Pakua',
      save: 'Hifadhi',
      cancel: 'Ghairi',
      search: 'Tafuta',
      filter: 'Chuja',
      status: 'Hali',
      pending: 'Inasubiri',
      approved: 'Imekubaliwa',
      rejected: 'Imekataliwa',
      completed: 'Imekamilika',
      inProgress: 'Inaendelea',
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
