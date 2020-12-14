import axios from "axios";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { currentRepoState } from "../../states";
import { PR, FetchError } from "./usePullRequests";

export const usePullRequest = (id: string) => {
  const currentRepo = useRecoilValue(currentRepoState);

  const query = useQuery<PR, FetchError>([currentRepo, id], async () => {
    const { data } = await axios.get(`https://api.github.com/repos/${currentRepo}/pulls/${id}`);

    return data;
  });

  return query;
};
