import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommunityStack } from './CommunityStack';
import { ChatScreen } from '@/features/chat/screens/ChatScreen';
import { ProfileStack } from './ProfileStack';
import { DashboardStack } from './DashboardStack';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Radius } from '@/shared/theme/spacing';
import type { MainTabsParamList } from '@/shared/types/navigation';

const Tab = createBottomTabNavigator<MainTabsParamList>();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  key: keyof MainTabsParamList;
  label: string;
  icon: IconName;
  iconActive: IconName;
}

const tabs: TabConfig[] = [
  { key: 'Dashboard', label: 'Diario', icon: 'book-outline', iconActive: 'book' },
  {
    key: 'Community',
    label: 'Comunidad',
    icon: 'people-outline',
    iconActive: 'people',
  },
  {
    key: 'Chat',
    label: 'AlivIA',
    icon: 'chatbubble-ellipses-outline',
    iconActive: 'chatbubble-ellipses',
  },
  { key: 'Profile', label: 'Perfil', icon: 'person-outline', iconActive: 'person' },
];

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.barInner}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = tabs.find((t) => t.key === route.name) ?? tabs[0];
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.item}
              hitSlop={6}
            >
              <Ionicons
                name={focused ? config.iconActive : config.icon}
                size={focused ? 24 : 22}
                color={focused ? Colors.primary.base : Colors.text.muted}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? Colors.primary.base : Colors.text.muted },
                ]}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export const MainTabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Dashboard" component={DashboardStack} options={{ title: 'Diario' }} />
    <Tab.Screen
      name="Community"
      component={CommunityStack}
      options={{ title: 'Comunidad' }}
    />
    <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'AlivIA' }} />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{ title: 'Perfil' }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.background.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border.subtle,
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  barInner: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: Radius.full,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
    fontFamily: Typography.fontFamily.medium,
  },
});

export default MainTabs;
