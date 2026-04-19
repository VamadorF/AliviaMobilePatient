import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

export interface TakenMedication {
  id: string;
  relief: number;
}

export interface DailyRecordData {
  primaryPainArea: string;
  secondaryPainAreas: string[];
  isUsualPlace: boolean;
  painIntensity: number;
  painQualities: string[];
  painQualityOther: string;
  durationUnit: 'hours' | 'days' | 'weeks' | 'months';
  durationValue: number;
  hasHadBefore: boolean | null;
  weeklyFrequency: number | null;
  functionalImpactPhysical: number;
  functionalImpactWork: number;
  functionalImpactSocial: number;
  functionalImpactSleep: number;
  phq2Answer1: number | null;
  phq2Answer2: number | null;
  gad2Answer1: number | null;
  gad2Answer2: number | null;
  tookMedication: boolean | null;
  /** @deprecated retained for backwards compatibility with old persisted records */
  medicationId: string | null;
  /** @deprecated retained for backwards compatibility with old persisted records */
  medicationRelief: number | null;
  takenMedications: TakenMedication[];
  recommendation: {
    category: 'autocuidado' | 'cesfam-ccr' | 'sapu-sar' | 'urgencia';
    message: string;
  } | null;
}

const initialData: DailyRecordData = {
  primaryPainArea: '',
  secondaryPainAreas: [],
  isUsualPlace: false,
  painIntensity: 5,
  painQualities: [],
  painQualityOther: '',
  durationUnit: 'hours',
  durationValue: 1,
  hasHadBefore: null,
  weeklyFrequency: null,
  functionalImpactPhysical: 0,
  functionalImpactWork: 0,
  functionalImpactSocial: 0,
  functionalImpactSleep: 0,
  phq2Answer1: null,
  phq2Answer2: null,
  gad2Answer1: null,
  gad2Answer2: null,
  tookMedication: null,
  medicationId: null,
  medicationRelief: null,
  takenMedications: [],
  recommendation: null,
};

type Action =
  | { type: 'UPDATE'; payload: Partial<DailyRecordData> }
  | { type: 'RESET' };

function reducer(state: DailyRecordData, action: Action): DailyRecordData {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialData;
    default:
      return state;
  }
}

interface DailyRecordContextType {
  data: DailyRecordData;
  updateData: (updates: Partial<DailyRecordData>) => void;
  resetData: () => void;
}

const DailyRecordContext = createContext<DailyRecordContextType | null>(null);

export function DailyRecordProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, initialData);

  const updateData = useCallback((updates: Partial<DailyRecordData>) => {
    dispatch({ type: 'UPDATE', payload: updates });
  }, []);

  const resetData = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <DailyRecordContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </DailyRecordContext.Provider>
  );
}

export function useDailyRecordData(): DailyRecordContextType {
  const ctx = useContext(DailyRecordContext);
  if (!ctx) {
    throw new Error('useDailyRecordData debe usarse dentro de DailyRecordProvider');
  }
  return ctx;
}
