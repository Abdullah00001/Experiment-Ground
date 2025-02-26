import React from "react";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-2xl max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome!</h1>
        <p className="text-gray-600 text-lg">
          Discover amazing content and enjoy your journey with us.
        </p>
        <p className="text-gray-500 mt-2">
          Stay tuned for more updates and exciting features!
        </p>
      </div>
    </div>
  );
};

export default Home;
