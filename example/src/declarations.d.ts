// declarations.d.ts
import 'react-native';

declare module 'react-native' {
  interface UIManagerStatic {
    ScannerRefViewManager: {
      Commands: {
        create: number;
      };
    };
  }
}
