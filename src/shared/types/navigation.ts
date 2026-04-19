import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type DailyRecordStackParamList = {
  Location: undefined;
  Intensity: undefined;
  Quality: undefined;
  Duration: undefined;
  FunctionalImpact: undefined;
  EmotionalState: undefined;
  Medication: undefined;
  Recommendation: undefined;
  Save: undefined;
};

export type MainTabsParamList = {
  Dashboard: undefined;
  DailyRecord: NavigatorScreenParams<DailyRecordStackParamList>;
  Medications: undefined;
  History: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
