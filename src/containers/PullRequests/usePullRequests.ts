import axios from "axios";
import { parse } from "http-link-header";
import { usePaginatedQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentRepoState, pullRequestsPaginationState } from "../../states";

class FetchError extends Error {
  error: any;

  constructor(message: string, error: { message: string }) {
    super(message);

    this.error = error;
  }
}

type PR = {
  id: string;
  title: string;
  html_url: string;
  user: {
    login: string;
    url: string;
  };
};

export const usePullRequests = () => {
  const currentRepo = useRecoilValue(currentRepoState);
  const [{ page, totalPage, perPage }, setPagination] = useRecoilState(pullRequestsPaginationState);

  const onChangePage = (page: number) => {
    setPagination((current) => ({
      ...current,
      page,
    }));
  };

  const { error, latestData, isFetching } = usePaginatedQuery<PR[], FetchError>(
    ["repoData", page],
    async () => {
      const { data, headers } = await axios.get(
        `https://api.github.com/repos/${currentRepo}/pulls?page=${page}&per_page=${perPage}`,
      );

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
  );

  return {
    page,
    totalPage,
    perPage,
    error,
    latestData,
    isFetching,
    onChangePage,
  };
};
