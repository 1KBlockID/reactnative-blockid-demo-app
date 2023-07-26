type origin = {
  authPage: string;
  communityId: string;
  communityName: string;
  tag: string;
  url: string;
};
export type sessionDataResponseType = {
  api: string;
  authPage: string;
  authtype: string;
  community: string;
  metadata: {};
  publicKey: string;
  scopes: string;
  session: string;
  sessionUrl: string;
  tag: string;
  creds: string;
  name: string;
};
export type scopeDataResponseType = {
  device_info: {
    device_name: string;
    device_os: string;
    deviceid: string;
    network_info: string;
    user_agent: string;
  };
  did: string;
  ial: string;
  location: {
    lat: string;
    lon: string;
  };
  userId: string;
};

class ScopeData {
  scopeData: scopeDataResponseType;
  sessionData: sessionDataResponseType;
  constructor() {
    this.scopeData = {
      device_info: {
        device_name: '',
        device_os: '',
        deviceid: '',
        network_info: '',
        user_agent: '',
      },
      did: '',
      ial: '',
      location: {
        lat: '',
        lon: '',
      },
      userId: '',
    };
    this.sessionData = {
      api: '',
      authPage: '',
      authtype: '',
      community: '',
      metadata: {},
      publicKey: '',
      scopes: '',
      session: '',
      sessionUrl: '',
      tag: '',
      creds: '',
      name: '',
    };
  }

  addScopeData(newData: any) {
    this.scopeData = newData;
  }

  addSessionData(qrData: any) {
    this.sessionData = qrData;
  }
  getSessionData() {
    return this.sessionData;
  }

  getScopeData() {
    return this.scopeData;
  }
}

export default new ScopeData();
