import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../actions/userActions";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};
