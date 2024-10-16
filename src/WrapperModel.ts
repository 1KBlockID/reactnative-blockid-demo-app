export interface TotpResponse {
  totp: string;
  getRemainingSecs: number;
}

export enum DocType {
  nationalId,
  drivingLicence,
  passport,
}
