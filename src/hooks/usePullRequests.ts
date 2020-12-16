import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import {
  fetchPullRequests2 as fetchPullRequests,
  PR,
  FetchError,
  addPullRequest,
} from "../api/pullRequests";
import { QUERY_KEYS } from "../queries";
import { currentRepoState, pullRequestsPaginationState } from "../states";

export const usePullRequests = () => {
  const client = useQueryClient();
  const [currentRepo, setCurrentRepo] = useRecoilState(currentRepoState);
  const [{ page, totalPage, perPage }, setPagination] = useRecoilState(pullRequestsPaginationState);

  const onChangePage = useCallback(
    (page: number) => {
      setPagination((current) => ({
        ...current,
        page,
      }));
    },
    [setPagination],
  );

  const onChangeRepo = useCallback(
    (repo: string) => {
      setCurrentRepo(repo);
      setPagination({ page: 1, totalPage: 1, perPage: 30 });
    },
    [setPagination, setCurrentRepo],
  );

  const fetchData = useCallback(
    async (page: number, currentRepo: string, perPage: number) => {
      if (!currentRepo) return [];

      const { data, lastPage } = await fetchPullRequests({ page, repo: currentRepo, perPage });

      setPagination((current) => ({
        ...current,
        totalPage: lastPage,
      }));

      return data;
    },
    [setPagination],
  );

  const addMutation = useMutation(
    async (title: string) => {
      return addPullRequest({ title });
    },
    {
      onSuccess: (data) => {
        client.invalidateQueries([QUERY_KEYS.PullLists, currentRepo]);
        client.setQueryData([QUERY_KEYS.Pull, currentRepo, data.number], data);
      },
    },
  );

  const query = useQuery<PR[], FetchError>(
    [QUERY_KEYS.PullLists, currentRepo, { page, perPage }],
    () => fetchData(page, currentRepo, perPage),
  );

  return {
    ...query,
    page,
    totalPage,
    perPage,
    onChangePage,
    onChangeRepo,
    addMutation,
  };
};
