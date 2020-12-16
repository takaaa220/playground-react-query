import { RouteComponentProps, navigate } from "@reach/router";
import { FormEvent, useEffect, useState } from "react";
import { usePullRequest } from "../../hooks/usePullRequest";

type Props = RouteComponentProps & {
  id?: string;
};

export const PullRequest = ({ id }: Props) => {
  const {
    query: { data, isLoading, error },
    deleteMutation,
    updateMutation,
  } = usePullRequest(id ?? "");
  const [value, setValue] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await updateMutation.mutateAsync(value);
  };

  const handleDelete = async () => {
    if (!window.confirm("削除しますか？")) return;

    await deleteMutation.mutateAsync();
    navigate("/");
  };

  useEffect(() => {
    setValue(data?.title ?? "");
  }, [data?.title]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>error: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl mb-6">{data?.title}</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <label>
          タイトル
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
      </form>
      <button type="button" onClick={handleDelete} className="px-10 py-4 bg-black text-white">
        削除
      </button>
    </div>
  );
};
