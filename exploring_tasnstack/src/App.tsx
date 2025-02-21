import { useQuery } from "@tanstack/react-query";
import "./App.css";
import getPost from "./apis/getPost";
import { FC } from "react";

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const App: FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPost,
  });
  return (
    <>
      <div className="w-[1140px] mx-auto">
        <div className="mt-[100px]">
          <h1 className="text-4xl text-center font-bold mb-10">Posts</h1>
          <div className="grid grid-cols-3 border-[1px] overflow-hidden max-h-[600px] gap-5 border-black rounded-lg p-3  flex-wrap overflow-scroll">
            {isLoading ? (
              <h1 className="text-center text-5xl">Loading...</h1>
            ) : (
              <>
                {data?.map((post: IPost) => (
                  <div key={post.id} className=" p-3 shadow-lg">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
