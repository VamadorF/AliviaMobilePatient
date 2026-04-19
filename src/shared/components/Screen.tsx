import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: Edge[];
  keyboardAware?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  padded = true,
  background = Colors.background.light,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
  keyboardAware = false,
}) => {
  const innerStyle: ViewStyle = {
    flex: scroll ? undefined : 1,
    padding: padded ? Spacing.base : 0,
    ...contentStyle,
  };

  const Content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, innerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={innerStyle}>{children}</View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: background }, style]}
      edges={edges}
    >
      {keyboardAware ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {Content}
        </KeyboardAvoidingView>
      ) : (
        Content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
