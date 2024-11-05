// declarations.d.ts
import 'react-native';

declare module 'react-native' {
  interface UIManagerStatic {
    ScannerManager: {
      Commands: {
        create: number;
      };
    };
  }
  declare module '*.png' {
    const value: any;
    export default value;
  }
}
