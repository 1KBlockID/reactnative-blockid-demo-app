/**
 * Payload model for FIDO2 set,reset and change Pin.
 */
export declare type Fido2PayloadModel = {
  /**
   * Handler to call, if an error is thrown.
   */
  errorHandler?: (error?) => void;
  /**
   * User new pin.
   */
  pin?: string;

  /**
   * User currentPin pin.
   */
  currentPin?: string;
};

// Defined Error Type
export type Fido2Error = {
  message?: string;
  code?: number;
};
