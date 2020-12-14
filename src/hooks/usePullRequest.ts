import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { fetchPullRequest, PR, FetchError } from "../api/pullRequests";
import { currentRepoState } from "../states";

export const usePullRequest = (id: string) => {
  const currentRepo = useRecoilValue(currentRepoState);

  const query = useQuery<PR, FetchError>([currentRepo, id], async () => {
    return fetchPullRequest({ repo: currentRepo, id });
  });

  return query;
};
