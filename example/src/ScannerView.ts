import {
  type StyleProp,
  type ViewStyle,
  requireNativeComponent,
} from 'react-native';

export interface ScannerViewProps {
  style?: StyleProp<ViewStyle>;
}

export const ScannerView =
  requireNativeComponent<ScannerViewProps>('RNTScannerView');
