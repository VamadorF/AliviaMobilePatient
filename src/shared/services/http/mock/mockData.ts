import type { DashboardData } from '@/shared/types/domain';

export const mockUser = {
  id: '1',
  email: 'paciente@ejemplo.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  role: 'PATIENT',
};

export const mockHealthPro = {
  id: '2',
  email: 'profesional@ejemplo.com',
  firstName: 'Dr.',
  lastName: 'García',
  role: 'HEALTH_PRO',
  specialty: 'Medicina del Dolor',
};

export const mockDashboard: DashboardData = {
  chartData: [
    { date: '2024-01-01', painIntensity: 5, dayType: 'neutral' },
    { date: '2024-01-02', painIntensity: 6, dayType: 'bad' },
    { date: '2024-01-03', painIntensity: 4, dayType: 'good' },
    { date: '2024-01-04', painIntensity: 5, dayType: 'neutral' },
    { date: '2024-01-05', painIntensity: 7, dayType: 'bad' },
    { date: '2024-01-06', painIntensity: 3, dayType: 'good' },
    { date: '2024-01-07', painIntensity: 4, dayType: 'good' },
  ],
  stats: {
    averagePain: 5.4,
    goodDays: 8,
    badDays: 5,
    totalRecords: 20,
    adherence: 66.7,
  },
  activeIndications: 2,
  communities: [{ id: '1', name: 'Dolor Crónico General', pathology: 'Dolor Crónico' }],
};

export const mockIndications = [
  {
    id: '1',
    title: 'Ejercicios de estiramiento',
    description: 'Realizar ejercicios de estiramiento diariamente',
    type: 'non_pharmacological',
    instructions: ['Estirar 10 minutos por la mañana', 'Estirar 10 minutos por la noche'],
    startDate: '2024-01-01',
    endDate: null,
    isActive: true,
    professional: {
      user: {
        firstName: 'Dr.',
        lastName: 'García',
        specialty: 'Fisioterapia',
      },
    },
  },
];

export const mockCommunities = [
  {
    id: '1',
    name: 'Dolor Crónico General',
    pathology: 'Dolor Crónico',
    description: 'Comunidad para personas con dolor crónico',
    _count: { memberships: 150, posts: 45 },
  },
  {
    id: '2',
    name: 'Fibromialgia',
    pathology: 'Fibromialgia',
    description: 'Comunidad para personas con fibromialgia',
    _count: { memberships: 89, posts: 23 },
  },
];
