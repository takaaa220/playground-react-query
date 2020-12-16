import { Link } from "@reach/router";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { FormEvent, useEffect, useState } from "react";
import { usePullRequests } from "../../hooks/usePullRequests";

export const PullRequestList = () => {
  const [value, setValue] = useState("");
  const {
    isLoading,
    error,
    data,
    page,
    totalPage,
    perPage,
    onChangePage,
    addMutation,
  } = usePullRequests();

  const handleAddPullRequest = async (e: FormEvent) => {
    e.preventDefault();

    await addMutation.mutateAsync(value);
    setValue("");
  };

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
        <div>
          <form onSubmit={handleAddPullRequest}>
            {!addMutation.isLoading ? (
              <input value={value} onChange={(e) => setValue(e.target.value)} />
            ) : (
              <p>adding...</p>
            )}
          </form>
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
        </div>
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
