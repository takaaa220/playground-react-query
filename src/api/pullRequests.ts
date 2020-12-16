// import axios from "axios";
// import { parse } from "http-link-header";

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

// export const fetchPullRequests = async ({
//   page,
//   repo,
//   perPage,
// }: {
//   page: number;
//   repo: string;
//   perPage: number;
// }) => {
//   const { data, headers } = await axios.get<PR[]>(
//     `https://api.github.com/repos/${repo}/pulls?page=${page}&per_page=${perPage}`,
//   );
//   if (!headers.link)
//     return {
//       data,
//       lastPage: 1,
//     };

//   const link = parse(headers.link);
//   const lastPageInfo = link.get("rel", "last")[0];
//   if (!lastPageInfo)
//     return {
//       data,
//       lastPage: 1,
//     };

//   const uri = new URL(lastPageInfo.uri);
//   const params = new URLSearchParams(uri.search);

//   const lastPage = Number(params.get("page") ?? 1);

//   return {
//     data,
//     lastPage,
//   };
// };

// export const fetchPullRequest = async ({ repo, id }: { repo: string; id: string }) => {
//   const { data } = await axios.get(`https://api.github.com/repos/${repo}/pulls/${id}`);

//   return data;
// };

let currentId = 0;

const _create = (pull?: Partial<PR>) => {
  currentId++;

  return {
    id: `id-${currentId}`,
    title: `title-title-title-${currentId}`,
    html_url: "https://aaa.exapmle.com",
    number: `${currentId}`,
    user: {
      login: "takaaa220",
      url: "https://aaa.example.com",
      avatar_url: "https://aaa.example.com/a.pn",
    },
    ...pull,
  };
};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

let prList: PR[] = [...Array(40)].map(() => _create());

export const fetchPullRequests2 = async ({
  page,
  perPage,
}: {
  page: number;
  repo: string;
  perPage: number;
}): Promise<{ lastPage: number; data: PR[] }> => {
  await sleep();

  return Promise.resolve({
    lastPage: Math.round((prList.length / perPage) * 10) / 10,
    data: prList.slice((page - 1) * perPage, page * perPage),
  });
};

export const fetchPullRequest2 = async ({ id }: { repo: string; id: string }) => {
  await sleep();

  const pr = prList.find((pr) => pr.number === id);
  if (!pr) {
    throw new FetchError("Not Found", { message: "Not Found" });
  }

  return pr;
};

export const addPullRequest = async ({ title }: { title: string }) => {
  await sleep();

  const pr = _create({ title });
  prList.push(pr);

  return pr;
};

export const updatePullRequest = async (id: string, { title }: { title: string }) => {
  await sleep();

  const pr = await fetchPullRequest2({ repo: "", id });

  prList = prList.reduce(
    (acc, p) => [...acc, ...(p.number === id ? [{ ...pr, title }] : [p])],
    [] as PR[],
  );
};

export const deletePullRequest = async (id: string) => {
  await sleep();
  prList = prList.filter((pr) => pr.number !== id);
};
