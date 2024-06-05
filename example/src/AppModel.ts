export class Origin {
  tag?: string;
  url?: string;
  communityName?: string;
  communityId?: string;
  authPage?: string;

  constructor({
    tag,
    url,
    communityName,
    communityId,
    authPage,
  }: {
    tag?: string;
    url?: string;
    communityName?: string;
    communityId?: string;
    authPage?: string;
  } = {}) {
    this.tag = tag;
    this.url = url;
    this.communityName = communityName;
    this.communityId = communityId;
    this.authPage = authPage;
  }

  static fromJson(json: Record<string, any>): Origin {
    return new Origin({
      tag: json.tag,
      url: json.url,
      communityName: json.communityName,
      communityId: json.communityId,
      authPage: json.authPage,
    });
  }

  toJson(): Record<string, any> {
    return {
      tag: this.tag,
      url: this.url,
      communityName: this.communityName,
      communityId: this.communityId,
      authPage: this.authPage,
    };
  }
}

export class AuthenticationPayloadV2 {
  sId?: string;
  scopes?: string;
  authtype?: string;
  sessionId?: string;
  origin?: Origin | null;
  publicKey?: string;
  createdTS?: number;
  expiryTS?: number;
  expiresDate?: string;
  iV?: number;
  metadata?: Record<string, any> | null;

  constructor(
    sId?: string,
    scopes?: string,
    authtype?: string,
    sessionId?: string,
    origin?: Origin | null,
    publicKey?: string,
    createdTS?: number,
    expiryTS?: number,
    expiresDate?: string,
    iV?: number,
    metadata?: Record<string, any>
  ) {
    this.sId = sId;
    this.scopes = scopes;
    this.authtype = authtype;
    this.sessionId = sessionId;
    this.origin = origin || null;
    this.publicKey = publicKey;
    this.createdTS = createdTS;
    this.expiryTS = expiryTS;
    this.expiresDate = expiresDate;
    this.iV = iV;
    this.metadata = metadata || null;
  }

  static fromJson(json: Record<string, any>): AuthenticationPayloadV2 {
    return new AuthenticationPayloadV2(
      json._id,
      json.scopes,
      json.authtype,
      json.sessionId,
      json.origin ? Origin.fromJson(json.origin) : null,
      json.publicKey,
      json.createdTS,
      json.expiryTS,
      json.expiresDate,
      json.__v,
      json.metadata
    );
  }

  toJson(): Record<string, any> {
    return {
      _id: this.sId,
      scopes: this.scopes,
      authtype: this.authtype,
      sessionId: this.sessionId,
      origin: this.origin ? this.origin.toJson() : null,
      publicKey: this.publicKey,
      createdTS: this.createdTS,
      expiryTS: this.expiryTS,
      expiresDate: this.expiresDate,
      __v: this.iV,
      metadata: this.metadata,
    };
  }
}

export class AuthenticationPayloadV1 {
  authtype?: string;
  scopes?: string;
  creds?: string;
  publicKey?: string;
  session?: string;
  api?: string;
  tag?: string;
  community?: string;
  authPage?: string;
  name?: string;
  sessionUrl?: string;
  metadata?: Record<string, any> | null;

  constructor(data: Partial<AuthenticationPayloadV1> = {}) {
    this.authtype = data.authtype || '';
    this.scopes = data.scopes || '';
    this.creds = data.creds || '';
    this.publicKey = data.publicKey || '';
    this.session = data.session || '';
    this.api = data.api || '';
    this.tag = data.tag || '';
    this.community = data.community || '';
    this.authPage = data.authPage || '';
    this.name = data.name || '';
    this.sessionUrl = data.sessionUrl || '';
    this.metadata = data.metadata || {};
  }

  static fromV2(
    data: AuthenticationPayloadV2,
    url: string
  ): AuthenticationPayloadV1 {
    return new AuthenticationPayloadV1({
      authtype: data.authtype,
      scopes: data.scopes,
      creds: '',
      publicKey: data.publicKey,
      session: data.sessionId,
      api: data.origin?.url,
      tag: data.origin?.tag,
      community: data.origin?.communityName,
      authPage: data.origin?.authPage,
      sessionUrl: url,
      metadata: data.metadata,
    });
  }

  toJson(): Record<string, any> {
    return {
      authtype: this.authtype,
      scopes: this.scopes,
      creds: this.creds,
      publicKey: this.publicKey,
      session: this.session,
      api: this.api,
      tag: this.tag,
      community: this.community,
      authPage: this.authPage,
      sessionUrl: this.sessionUrl,
      metadata: this.metadata,
    };
  }

  getMap(): Map<string, any> {
    return new Map(Object.entries(this.toJson())) as Map<string, any>;
  }
}
