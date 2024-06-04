export interface TotpResponse {
  totp: string;
  getRemainingSecs: number;
}

export enum DocType {
  none,
  nationalId,
  drivingLicence,
  passport,
}
