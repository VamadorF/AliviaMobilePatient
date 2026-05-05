import type { DashboardData, MedicationCatalogItem } from '@/shared/types/domain';

export const mockUser = {
  id: '1',
  email: 'paciente@ejemplo.com',
  firstName: 'Javier',
  lastName: 'Fernández',
  role: 'PATIENT',
  memberSince: '2024-04-01',
};

export const mockHealthPro = {
  id: '2',
  email: 'profesional@ejemplo.com',
  firstName: 'Dra.',
  lastName: 'Carla Soto',
  role: 'HEALTH_PRO',
  specialty: 'Medicina del Dolor',
  memberSince: '2023-08-12',
};

export const mockDashboard: DashboardData = {
  chartData: [
    { date: '2024-01-01', painIntensity: 5, dayType: 'neutral' },
    { date: '2024-01-02', painIntensity: 6, dayType: 'bad' },
    { date: '2024-01-03', painIntensity: 4, dayType: 'good' },
    { date: '2024-01-04', painIntensity: 5, dayType: 'neutral' },
    { date: '2024-01-05', painIntensity: 7, dayType: 'bad' },
    { date: '2024-01-06', painIntensity: 3, dayType: 'good' },
    { date: '2024-01-07', painIntensity: 5, dayType: 'neutral' },
  ],
  stats: {
    averagePain: 5,
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
        firstName: 'Dra.',
        lastName: 'Carla Soto',
        specialty: 'Medicina del Dolor',
      },
    },
  },
];

export const mockMedicationsCatalog: MedicationCatalogItem[] = [
  {
    id: 'cat-paracetamol',
    name: 'Paracetamol',
    substance: 'Paracetamol',
    defaultFrequency: 8,
    type: 'analgesic',
    standardDose: '500 mg',
    clinicalUse: 'Analgésico no opioide y antipirético',
  },
  {
    id: 'cat-ibuprofeno',
    name: 'Ibuprofeno',
    substance: 'Ibuprofeno',
    defaultFrequency: 8,
    type: 'antiinflammatory',
    standardDose: '400 mg',
    clinicalUse: 'AINE para dolor leve-moderado e inflamación',
  },
  {
    id: 'cat-tramadol',
    name: 'Tramadol',
    substance: 'Tramadol',
    defaultFrequency: 6,
    type: 'analgesic',
    standardDose: '50 mg',
    clinicalUse: 'Opioide débil para dolor moderado-severo',
  },
  {
    id: 'cat-amitriptilina',
    name: 'Amitriptilina',
    substance: 'Amitriptilina',
    defaultFrequency: 24,
    type: 'other',
    standardDose: '25 mg',
    clinicalUse: 'Antidepresivo tricíclico para dolor neuropático',
  },
  {
    id: 'cat-pregabalina',
    name: 'Pregabalina',
    substance: 'Pregabalina',
    defaultFrequency: 12,
    type: 'other',
    standardDose: '75 mg',
    clinicalUse: 'Anticonvulsivante para dolor neuropático',
  },
  {
    id: 'cat-gabapentina',
    name: 'Gabapentina',
    substance: 'Gabapentina',
    defaultFrequency: 8,
    type: 'other',
    standardDose: '300 mg',
    clinicalUse: 'Anticonvulsivante para dolor neuropático',
  },
  {
    id: 'cat-duloxetina',
    name: 'Duloxetina',
    substance: 'Duloxetina',
    defaultFrequency: 24,
    type: 'other',
    standardDose: '60 mg',
    clinicalUse: 'IRSN para dolor crónico y depresión asociada',
  },
  {
    id: 'cat-naproxeno',
    name: 'Naproxeno',
    substance: 'Naproxeno',
    defaultFrequency: 12,
    type: 'antiinflammatory',
    standardDose: '500 mg',
    clinicalUse: 'AINE de larga duración para dolor musculoesquelético',
  },
  {
    id: 'cat-diclofenaco',
    name: 'Diclofenaco',
    substance: 'Diclofenaco sódico',
    defaultFrequency: 8,
    type: 'antiinflammatory',
    standardDose: '50 mg',
    clinicalUse: 'AINE para dolor inflamatorio agudo',
  },
  {
    id: 'cat-ciclobenzaprina',
    name: 'Ciclobenzaprina',
    substance: 'Ciclobenzaprina',
    defaultFrequency: 8,
    type: 'muscle-relaxant',
    standardDose: '10 mg',
    clinicalUse: 'Relajante muscular para espasmos agudos',
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
    name: 'Cómo lidiar con el síndrome de Sudeck',
    pathology: 'SDRC / Sudeck',
    description: 'Apoyo entre personas con síndrome doloroso regional complejo.',
    _count: { memberships: 64, posts: 22 },
  },
  {
    id: '3',
    name: 'Fibromialgia',
    pathology: 'Fibromialgia',
    description: 'Comunidad para personas con fibromialgia',
    _count: { memberships: 89, posts: 23 },
  },
];

export const mockChatMessages = [
  {
    id: 'ai-1',
    channel: 'ai' as const,
    authorName: 'AlivIA IA',
    authorRole: 'AlivIA' as const,
    body: 'Hola, soy AlivIA. ¿Cómo te sientes hoy? Cuéntame y te puedo ayudar a manejarlo.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'team-1',
    channel: 'team' as const,
    authorName: 'Equipo Médico',
    authorRole: 'DOCTOR' as const,
    body: 'Hola, soy tu equipo médico. ¿En qué podemos ayudarte hoy?',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

export const mockCommunityPosts = [
  {
    id: 'post-1',
    communityId: '2',
    authorId: 'u-2',
    authorName: 'Juan Pérez',
    category: 'experiencias' as const,
    title: 'Yo salgo a trotar todos los días para mejorar mi nivel de dolor',
    body: 'Llevo 3 meses corriendo en las mañanas y mi calidad de vida cambió mucho.',
    createdAt: '2025-04-04T20:25:00.000Z',
    updatedAt: '2025-04-04T20:25:00.000Z',
    likes: 12,
  },
  {
    id: 'post-2',
    communityId: '1',
    authorId: 'u-3',
    authorName: 'Diego F.',
    category: 'preguntas' as const,
    title: '¿Alguien probó la respiración 4-7-8?',
    body: '¿Les funcionó para el dolor lumbar? La estoy probando hace dos semanas.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 4,
  },
  {
    id: 'post-3',
    communityId: '3',
    authorId: 'u-4',
    authorName: 'Antonia P.',
    category: 'apoyo' as const,
    title: 'Hoy tuve un día difícil',
    body: 'Necesitaba contar que hoy fue duro. Gracias por estar aquí.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    likes: 18,
  },
];

export const mockVoiceSpaces = [
  {
    id: 'vs-1',
    title: 'Pruebas Dolor',
    hostName: 'Dra. Carla Soto',
    description: 'Espacio abierto para compartir experiencias y dudas con tu equipo médico.',
    scheduledFor: null,
    isLive: true,
    participants: 1,
    channelName: 'alivia-vs-1',
  },
  {
    id: 'vs-2',
    title: 'Un día a la vez',
    hostName: 'Klga. Sofía Méndez',
    description: 'Sesión guiada para tomar el día con calma.',
    scheduledFor: null,
    isLive: true,
    participants: 1,
    channelName: 'alivia-vs-2',
  },
  {
    id: 'vs-3',
    title: 'Cada día cuenta',
    hostName: 'Anfitrión Alivia',
    description: 'Pequeñas charlas para compartir tu progreso.',
    scheduledFor: null,
    isLive: true,
    participants: 1,
    channelName: 'alivia-vs-3',
  },
  {
    id: 'vs-4',
    title: 'Control del dolor',
    hostName: 'Klgo. Pablo Reyes',
    description: 'Espacio para conversar sobre técnicas de control del dolor.',
    scheduledFor: null,
    isLive: true,
    participants: 1,
    channelName: 'alivia-vs-4',
  },
];

export const mockBreathingExercise = {
  title: 'Respiración 4-7-8',
  steps: [
    'Inhala por la nariz contando hasta 4',
    'Mantén la respiración contando hasta 7',
    'Exhala por la boca contando hasta 8',
    'Repite 4 veces',
  ],
};
