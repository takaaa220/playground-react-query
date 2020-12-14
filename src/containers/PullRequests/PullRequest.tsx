import { RouteComponentProps } from "@reach/router";
import { usePullRequest } from "../../hooks/usePullRequest";

type Props = RouteComponentProps & {
  id?: string;
};

export const PullRequest = ({ id }: Props) => {
  const { data, isLoading, error } = usePullRequest(id ?? "");

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>error: {error.message}</p>;
  }

  return <div>{data?.title}</div>;
};
