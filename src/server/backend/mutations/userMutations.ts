import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, deleteUser } from "../actions/userActions";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: async (res) => {
      if (res?.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
      if (res?.error) {
        toast.error(res.error);
      }
    },
    onError: (err) => {
      console.log("error", err);
      toast.success("Could not delete User");
    },
  });
};

export const useChangePassword = () => {
  // const queryClient=useQueryClient()

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => changePassword({ currentPassword, newPassword }),
    onSuccess: async (res) => {
      if (res?.success) {
        toast.success(res.success);
        // queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
      if (res?.error) {
        toast.error(res.error);
      }
    },
    onError: (err) => {
      console.log("error", err);
      toast.success("Could not delete User");
    },
  });
};
