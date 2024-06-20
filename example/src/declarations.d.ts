// declarations.d.ts
import 'react-native';

declare module 'react-native' {
  interface UIManagerStatic {
    LiveIDScannerManager: {
      Commands: {
        create: number;
      };
    };
  }
}
