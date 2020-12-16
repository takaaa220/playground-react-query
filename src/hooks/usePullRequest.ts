import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import {
  fetchPullRequest2 as fetchPullRequest,
  PR,
  FetchError,
  deletePullRequest,
  updatePullRequest,
} from "../api/pullRequests";
import { QUERY_KEYS } from "../queries";
import { currentRepoState } from "../states";

export const usePullRequest = (id: string) => {
  const currentRepo = useRecoilValue(currentRepoState);
  const client = useQueryClient();

  const deleteMutation = useMutation(() => deletePullRequest(id), {
    onSuccess: async () => {
      client.invalidateQueries([QUERY_KEYS.Pull, currentRepo, id]);
    },
  });

  const updateMutation = useMutation((title: string) => updatePullRequest(id, { title }), {
    onSuccess: async () => {
      client.invalidateQueries([QUERY_KEYS.Pull, currentRepo, id]);
    },
  });

  const query = useQuery<PR, FetchError>([QUERY_KEYS.Pull, currentRepo, id], async () => {
    return fetchPullRequest({ repo: currentRepo, id });
  });

  return {
    query,
    deleteMutation,
    updateMutation,
  };
};
