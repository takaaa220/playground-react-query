import { RouteComponentProps } from "@reach/router";
import { FormEvent, useState, VFC } from "react";
import { useRecoilValue } from "recoil";

import { usePullRequests } from "../../hooks/usePullRequests";
import { currentRepoState } from "../../states";

import { PullRequestList } from "./List";

export const PullRequests: VFC<RouteComponentProps> = () => {
  const currentRepo = useRecoilValue(currentRepoState);
  const [value, setValue] = useState(currentRepo);
  const { onChangeRepo } = usePullRequests();

  const handleChangeRepo = (e: FormEvent) => {
    e.preventDefault();

    onChangeRepo(value);
  };

  return (
    <div className="container">
      <form onSubmit={handleChangeRepo} className="mb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="レポジトリ"
          className="p-2 border-black"
        />
      </form>
      {currentRepo ? <PullRequestList /> : null}
    </div>
  );
};
