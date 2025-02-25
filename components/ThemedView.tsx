import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'primary' | 'secondary' | 'background';
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  variant = 'background',
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    variant
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
