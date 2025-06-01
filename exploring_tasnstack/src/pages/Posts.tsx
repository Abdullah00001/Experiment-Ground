import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import getPost from "../apis/getPost";
export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
const Posts: FC = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: getPost,
  });
  console.log(isLoading, isFetching);
  return (
    <>
      <div className="w-[1140px] mx-auto">
        <div className="mt-[100px]">
          <h1 className="text-4xl text-center font-bold mb-10">Posts</h1>
          <div className="grid grid-cols-3 border-[1px] max-h-[600px] gap-5 border-black rounded-lg p-3  flex-wrap overflow-scroll">
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

export default Posts;
