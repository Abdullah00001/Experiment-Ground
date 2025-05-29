import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { RootState } from "./app/store";
import { like, disLike } from "./features/counter/counterSlice";

function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <>
      <section>
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="p-5 border border-black rounded-[8px] space-y-2">
            <h1 className="text-2xl font-bold text-left">
              Total Count : {count}
            </h1>
            <div className="flex justify-left items-center space-x-3">
              <button
                onClick={() => dispatch(like())}
                className="px-3 py-2 bg-black text-white font-bold rounded-[6px]"
              >
                Like
              </button>
              <button
                onClick={() => dispatch(disLike())}
                className="px-3 py-2 bg-black text-white font-bold rounded-[6px]"
              >
                Dislike
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
