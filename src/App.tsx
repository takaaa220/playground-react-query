import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { RecoilRoot } from "recoil";
import "./App.css";
import { PullRequests } from "./containers/PullRequests";

export const queryCache = new QueryCache();

function App() {
  return (
    <RecoilRoot>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <PullRequests />
      </ReactQueryCacheProvider>
    </RecoilRoot>
  );
}

export default App;
