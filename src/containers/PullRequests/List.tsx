import { Link } from "@reach/router";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { useEffect } from "react";
import { usePullRequests } from "./usePullRequests";

export const PullRequestList = () => {
  const { isLoading, error, data, page, totalPage, perPage, onChangePage } = usePullRequests();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>An error has occurred: {error.message}</p>
      ) : (
        <ul>
          {data?.map((pull) => (
            <li key={pull.id} className="p-2 rounded">
              <div className="flex items-center">
                <img src={pull.user.avatar_url} alt="" className="w-9 h-9 mr-4" />
                <div>
                  <p>
                    <Link to={`/${pull.number}`} className="text-lg text-blue-700 underline">
                      {pull.title}
                    </Link>
                  </p>
                  <p>
                    <a
                      href={pull.user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      {pull.user.login}
                    </a>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        current={page}
        total={totalPage * perPage}
        pageSize={perPage}
        onChange={onChangePage}
      />
    </div>
  );
};
