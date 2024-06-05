import type { AuthenticationPayloadV1 } from './AppModel';

export type RootStackParamList = {
  Home: undefined;
  Featurelist: { handler: (val: boolean) => void };
  TOTP: undefined;
  LiveID: undefined;
  QRScan: undefined;
  QRAuth: { payload: AuthenticationPayloadV1 };
};
