import type { ComponentType } from 'react';
import { Platform } from 'react-native';

const MapScreen: ComponentType =
  Platform.OS === 'web'
    ? (require('./index.web') as typeof import('./index.web')).default
    : (require('@/components/NativeMapScreen') as typeof import('@/components/NativeMapScreen')).default;

export default MapScreen;
