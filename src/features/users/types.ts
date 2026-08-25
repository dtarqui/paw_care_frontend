import type { Role } from "@/features/auth/types";

export interface User {
  id: number;
  username: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName?: string;
  nationalId: string;
  email?: string;
  phone?: string;
  role: Role;
  status: "ACTIVE" | "INACTIVE";
  selfRegistered: boolean;
}

export interface NewUserInput {
  firstName: string;
  paternalLastName: string;
  maternalLastName?: string;
  nationalId: string;
  email?: string;
  username: string;
  phone?: string;
  role: Role;
  password: string;
  licenseNumber?: string;
  specialty?: string;
}

export interface ChangeRoleInput {
  role: Role;
  licenseNumber?: string;
  specialty?: string;
}

export interface VetPreRegistrationInput {
  firstName: string;
  paternalLastName: string;
  maternalLastName?: string;
  nationalId: string;
  email: string;
  username: string;
  phone?: string;
  password: string;
  licenseNumber: string;
  specialty: string;
}

export interface InviteVetInput {
  email: string;
  name?: string;
}

export interface PendingInvitation {
  id: number;
  email: string;
  name?: string;
  invitedBy: { firstName: string; paternalLastName: string };
  expiresAt: string;
  createdAt: string;
}

export interface InvitationData {
  email: string;
  name?: string;
}

export interface AcceptInvitationInput {
  firstName: string;
  paternalLastName: string;
  maternalLastName?: string;
  nationalId: string;
  username: string;
  phone?: string;
  password: string;
  licenseNumber: string;
  specialty: string;
}
