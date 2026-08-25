export type ReminderType = "APPOINTMENT" | "PREVENTIVE_CONTROL";

export interface PendingReminder {
  id: string;
  type: ReminderType;
  owner: { phone: string; firstName: string; paternalLastName: string };
  message: string;
  reference: string;
}

export interface SentReminder {
  id: number;
  owner: { firstName: string; paternalLastName: string };
  message: string;
  channel: string;
  sentAt: string;
}
