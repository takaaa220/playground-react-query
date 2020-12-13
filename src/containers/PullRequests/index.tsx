import { FormEvent, useState } from "react";
import { useRecoilState } from "recoil";

import { queryCache } from "../../App";
import { currentRepoState } from "../../states";

import { PullRequestList } from "./List";

export const PullRequests = () => {
  const [currentRepo, setCurrentRepo] = useRecoilState(currentRepoState);
  const [value, setValue] = useState(currentRepo);

  const handleChangeRepo = (e: FormEvent) => {
    e.preventDefault();

    queryCache.invalidateQueries("repoData");
    setCurrentRepo(value);
  };

  return (
    <div>
      <form onSubmit={handleChangeRepo}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="レポジトリ"
        />
      </form>
      {currentRepo ? <PullRequestList /> : null}
    </div>
  );
};
