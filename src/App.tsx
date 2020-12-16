import { Router } from "@reach/router";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RecoilRoot } from "recoil";
import { PullRequest } from "./containers/PullRequest";
import { PullRequests } from "./containers/PullRequests";
import "./App.css";
import "./dist/index.css";

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <div className="container m-auto p-2">
          <Router>
            <PullRequest path="/:id" />
            <PullRequests path="*" />
          </Router>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
