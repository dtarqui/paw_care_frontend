import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { toast } from "sonner";
import { usersApi } from "./api";
import type {
  AcceptInvitationInput,
  ChangeRoleInput,
  InviteVetInput,
  NewUserInput,
  VetPreRegistrationInput,
} from "./types";

export function useUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["users", "list", page, pageSize],
    queryFn: () => usersApi.list(page, pageSize),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewUserInput) => usersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["vets"] });
      toast.success(t("toasts.userCreated"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ChangeRoleInput }) => usersApi.changeRole(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["vets"] });
      toast.success(t("toasts.roleUpdated"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "ACTIVE" | "INACTIVE" }) =>
      usersApi.changeStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["vets"] });
      toast.success(variables.status === "ACTIVE" ? t("toasts.userActivated") : t("toasts.userDeactivated"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function usePreRegisterVet() {
  return useMutation({
    mutationFn: (input: VetPreRegistrationInput) => usersApi.preRegisterVet(input),
  });
}

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      usersApi.changeMyPassword(currentPassword, newPassword),
    onSuccess: () => toast.success(t("toasts.passwordUpdated")),
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: number; newPassword: string }) =>
      usersApi.resetPassword(id, newPassword),
    onSuccess: () => toast.success(t("toasts.passwordReset")),
    onError: (error: Error) => toast.error(error.message),
  });
}

export function usePendingInvitations() {
  return useQuery({
    queryKey: ["users", "invitations"],
    queryFn: async () => (await usersApi.listInvitations()).invitations,
  });
}

export function useInviteVet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteVetInput) => usersApi.invite(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "invitations"] });
      toast.success(t("toasts.invitationSent"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCancelInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.cancelInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "invitations"] });
      toast.success(t("toasts.invitationCancelled"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useValidateInvitation(token: string | undefined) {
  return useQuery({
    queryKey: ["users", "invitations", "validate", token],
    queryFn: () => usersApi.validateInvitation(token!),
    enabled: !!token,
    retry: false,
  });
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: ({ token, input }: { token: string; input: AcceptInvitationInput }) =>
      usersApi.acceptInvitation(token, input),
  });
}
