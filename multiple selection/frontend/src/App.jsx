import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [topics, setTopics] = useState([]);
  const [preference, setPreference] = useState([]);
  const handlePreference = (topicId) => {
    setPreference((prevSate) => {
      if (prevSate.includes(topicId)) {
        return prevSate.filter((id) => id !== topicId);
      } else if (prevSate.length < 5) {
        return [...prevSate, topicId];
      } else {
        return prevSate;
      }
    });
  };
  const handleDone = () => {
    console.log(preference);
    axios
      .post("http://localhost:5000/api/v1/preference", {
        chosenTopics: preference,
      })
      .then((res) => console.log(res.data.data));
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/topics")
      .then((data) => setTopics(data.data.data));
  }, []);
  return (
    <>
      <section className="mt-[100px]">
        <div className="w-[1144px] mx-auto">
          <div className="">
            <h1 className="text-3xl font-bold text-center">
              Select Your Fevourite Topics
            </h1>
            <p className="text-[18px] font-semibold text-center mt-4">
              Your Selected Topics Post Will Be Shown In Your Feed
            </p>
          </div>
          <div className="mt-[20px] p-4  shadow-slate-700 shadow rounded-[16px]">
            <div className="flex items-center gap-4 flex-wrap">
              {topics.map((topic) => {
                const isSelected = preference.includes(topic._id);
                const isDisabled = preference.length >= 5 && !isSelected;
                return (
                  <div
                    key={topic._id}
                    onClick={() => !isDisabled && handlePreference(topic._id)}
                    className={`bg-slate-800 hover:bg-teal-600 hover:text-slate-950 text-yellow-300 px-[1.5rem] py-[1rem] rounded-[16px] text-2xl font-bold
                    ${
                      isSelected
                        ? "bg-blue-900 hover:opacity-100"
                        : "cursor-not-allowed"
                    }
                    ${
                      isDisabled
                        ? "opacity-55 cursor-not-allowed hover:bg-black hover:text-white"
                        : "cursor-pointer"
                    }
                    `}
                  >
                    {topic.topicsName}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-[40px]">
              <button
                type="button"
                className={`bg-gray-300 text-black font-bold text-[22px] py-2 px-4 rounded-[12px] ${
                  preference.length === 0 && "opacity-55 cursor-not-allowed"
                }`}
                onClick={() => setPreference([])}
                disabled={preference.length === 0 && "disabled"}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleDone}
                className={`bg-blue-600 text-white font-bold text-[22px] py-2 px-4 rounded-[12px] ${
                  preference.length === 0 && "opacity-55 cursor-not-allowed"
                }`}
                disabled={preference.length === 0 && "disabled"}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
