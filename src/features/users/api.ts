import { apiClient } from "@/lib/api-client";
import type {
  AcceptInvitationInput,
  ChangeRoleInput,
  InvitationData,
  InviteVetInput,
  NewUserInput,
  PendingInvitation,
  User,
  VetPreRegistrationInput,
} from "./types";

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export const usersApi = {
  list: (page = 1, pageSize = 20) => apiClient.get<UserListResponse>(`/api/users?page=${page}&pageSize=${pageSize}`),
  create: (input: NewUserInput) => apiClient.post<{ user: User }>("/api/users", input),
  changeStatus: (id: number, status: "ACTIVE" | "INACTIVE") =>
    apiClient.patch<{ user: User }>(`/api/users/${id}/status`, { status }),
  changeRole: (id: number, input: ChangeRoleInput) => apiClient.patch<{ user: User }>(`/api/users/${id}/role`, input),
  preRegisterVet: (input: VetPreRegistrationInput) => apiClient.post<{ user: User }>("/api/users/pre-register", input),
  changeMyPassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch<{ ok: boolean }>("/api/users/me/password", { currentPassword, newPassword }),
  resetPassword: (id: number, newPassword: string) =>
    apiClient.patch<{ ok: boolean }>(`/api/users/${id}/password`, { newPassword }),
  invite: (input: InviteVetInput) => apiClient.post<{ ok: boolean }>("/api/users/invitations", input),
  listInvitations: () => apiClient.get<{ invitations: PendingInvitation[] }>("/api/users/invitations"),
  cancelInvitation: (id: number) => apiClient.delete<void>(`/api/users/invitations/${id}`),
  validateInvitation: (token: string) => apiClient.get<InvitationData>(`/api/users/invitations/validate/${token}`),
  acceptInvitation: (token: string, input: AcceptInvitationInput) =>
    apiClient.post<{ user: User }>(`/api/users/invitations/accept/${token}`, input),
};
