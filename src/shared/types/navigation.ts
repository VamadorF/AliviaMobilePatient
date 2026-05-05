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

export type CommunityStackParamList = {
  CommunityHome: undefined;
  CommunityDetail: { communityId: string };
  VoiceSpaces: undefined;
  VoiceSession: { spaceId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Notifications: undefined;
  Security: undefined;
  Appearance: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  History: undefined;
  Medications: undefined;
};

export type MainTabsParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  Community: NavigatorScreenParams<CommunityStackParamList>;
  Chat: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootMainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabsParamList>;
  DailyRecord: NavigatorScreenParams<DailyRecordStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<RootMainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- fusión con tipos de React Navigation
    interface RootParamList extends RootStackParamList {}
  }
}
