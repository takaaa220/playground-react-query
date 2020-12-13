import { atom } from "recoil";

export const currentRepoState = atom<string>({
  key: "currentRepo",
  default: "",
});

export const pullRequestsPaginationState = atom({
  key: "pullRequestsPagination",
  default: {
    page: 1,
    totalPage: 1,
    perPage: 30,
  },
});
