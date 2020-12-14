import axios from "axios";
import { parse } from "http-link-header";
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

export class FetchError extends Error {
  error: any;

  constructor(message: string, error: { message: string }) {
    super(message);

    this.error = error;
  }
}

export const fetchPullRequests = async ({
  page,
  repo,
  perPage,
}: {
  page: number;
  repo: string;
  perPage: number;
}) => {
  const { data, headers } = await axios.get<PR[]>(
    `https://api.github.com/repos/${repo}/pulls?page=${page}&per_page=${perPage}`,
  );
  if (!headers.link)
    return {
      data,
      lastPage: 1,
    };

  const link = parse(headers.link);
  const lastPageInfo = link.get("rel", "last")[0];
  if (!lastPageInfo)
    return {
      data,
      lastPage: 1,
    };

  const uri = new URL(lastPageInfo.uri);
  const params = new URLSearchParams(uri.search);

  const lastPage = Number(params.get("page") ?? 1);

  return {
    data,
    lastPage,
  };
};

export const fetchPullRequest = async ({ repo, id }: { repo: string; id: string }) => {
  const { data } = await axios.get<PR>(`https://api.github.com/repos/${repo}/pulls/${id}`);

  return data;
};
