export type Role = "ADMIN" | "VET" | "RECEPTIONIST";

export interface SessionUser {
  id: number;
  username: string;
  firstName: string;
  paternalLastName: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: SessionUser;
}
