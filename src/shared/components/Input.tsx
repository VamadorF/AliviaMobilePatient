import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerStyle,
      style,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View
          style={[
            styles.inputWrap,
            focused && styles.inputWrapFocused,
            !!error && styles.inputWrapError,
          ]}
        >
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={Colors.text.light}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />
          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </View>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helper}>{helperText}</Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: Spacing.base },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.white,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  inputWrapFocused: {
    borderColor: Colors.medical.blue,
  },
  inputWrapError: {
    borderColor: Colors.status.error,
  },
  iconLeft: { marginRight: Spacing.sm },
  iconRight: { marginLeft: Spacing.sm },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    paddingVertical: Spacing.sm,
  },
  helper: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
    marginTop: 4,
  },
  error: {
    fontSize: Typography.fontSize.xs,
    color: Colors.status.error,
    marginTop: 4,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
});
