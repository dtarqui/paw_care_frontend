export type AuditAction =
  | "ACTIVATE_ACCOUNT"
  | "DEACTIVATE_ACCOUNT"
  | "RESET_PASSWORD"
  | "CHANGE_ROLE"
  | "INVITE_VET";

export interface AuditLog {
  id: number;
  actor?: { firstName: string; paternalLastName: string };
  action: AuditAction;
  entityType: string;
  entityId?: number;
  details?: string;
  date: string;
}
