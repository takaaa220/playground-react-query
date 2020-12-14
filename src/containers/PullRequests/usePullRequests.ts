import axios from "axios";
import { parse } from "http-link-header";
import { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import { currentRepoState, pullRequestsPaginationState } from "../../states";

export class FetchError extends Error {
  error: any;

  constructor(message: string, error: { message: string }) {
    super(message);

    this.error = error;
  }
}

export type PR = {
  id: string;
  title: string;
  html_url: string;
  number: string;
  user: {
    login: string;
    url: string;
    avatar_url: string;
  };
};

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
      client.invalidateQueries("repoData");
      setCurrentRepo(repo);
      setPagination({ page: 1, totalPage: 1, perPage: 30 });
    },
    [setPagination, setCurrentRepo, client],
  );

  const fetchData = useCallback(
    async (page: number, currentRepo: string, perPage: number) => {
      if (!currentRepo) return [];

      const { data, headers } = await axios.get(
        `https://api.github.com/repos/${currentRepo}/pulls?page=${page}&per_page=${perPage}`,
      );

      if (!headers.link) return data;
      const link = parse(headers.link);

      const lastPage = link.get("rel", "last")[0];

      if (lastPage) {
        const uri = new URL(lastPage.uri);
        const params = new URLSearchParams(uri.search);

        setPagination((current) => ({
          ...current,
          totalPage: Number(params.get("page") ?? 1),
        }));
      }

      return data;
    },
    [setPagination],
  );

  const { isLoading, error, data, isFetching } = useQuery<PR[], FetchError>(
    ["repoData", { page, currentRepo, perPage }],
    () => fetchData(page, currentRepo, perPage),
  );

  return {
    page,
    totalPage,
    perPage,
    error,
    data,
    isFetching,
    isLoading,
    onChangePage,
    onChangeRepo,
  };
};
