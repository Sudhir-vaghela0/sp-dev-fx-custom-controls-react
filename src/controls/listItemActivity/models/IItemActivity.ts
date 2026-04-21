// ─── Identity ─────────────────────────────────────────────────────────────────

export interface IActivityIdentity {
  id?: string;
  displayName?: string;
  email?: string;
}

// ─── Graph beta itemActivityOLD shape ─────────────────────────────────────────

export interface IItemActivity {
  id: string;
  action: {
    create?: Record<string, unknown>;
    edit?: Record<string, unknown>;
    delete?: { objectType: string };
    move?: { from: string; to: string };
    rename?: { oldName: string; newName: string };
    restore?: Record<string, unknown>;
    share?: { recipients: Array<{ user?: IActivityIdentity; group?: IActivityIdentity }> };
    version?: { newVersion: string };
    mention?: { mentionees?: IActivityIdentity[] };
    comment?: { isReply?: boolean };
  };
  actor: {
    user?: IActivityIdentity;
    application?: IActivityIdentity;
    device?: IActivityIdentity;
  };
  times: {
    /** ISO 8601 */
    recordedDateTime: string;
  };
}
