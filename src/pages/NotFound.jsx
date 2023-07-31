// NotFound.js
import React from "react";

function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen text-2xl">
      <div className="text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7487/7487110.png"
          alt="Not Found!!"
          className="w-80 mb-10"
        />
        <p className="font-semibold mb-8">404 - This page does not exist!!</p>
        <button className="border-2 border-yellow-400 rounded-md p-5 hover:bg-yellow-400 hover:text-white transition duration-200 ease-out"> Go Back </button>
      </div>
    </div>
  );
}

export default NotFound;
