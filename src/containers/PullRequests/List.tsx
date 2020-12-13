import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { usePullRequests } from "./usePullRequests";

export const PullRequestList = () => {
  const {
    isFetching,
    error,
    latestData,
    page,
    totalPage,
    perPage,
    onChangePage,
  } = usePullRequests();

  return (
    <div>
      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p>An error has occurred: {error.message}</p>
      ) : (
        <ul>
          {latestData?.map((pull) => (
            <li key={pull.id}>
              <a href={pull.html_url} target="_blank" rel="noopener noreferrer">
                <p>{pull.title}</p>
                <p>{pull.user.login}</p>
              </a>
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
