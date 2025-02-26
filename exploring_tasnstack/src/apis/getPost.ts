import axios from "axios";
import { IPost } from "../pages/Posts";

const getPost = async (): Promise<IPost[] | undefined> => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) throw error;
  }
};

export default getPost;
