import React, { useEffect, useState } from "react";
import StoryCard from "./StoryCard/StoryCard";

const Stories = () => {
  const [fakeData, setFakeData] = useState([]);
  useEffect(() => {
    const fetchFakeData = async () => {
      await fetch("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
          return res.json();
        })
        .then((response) => {
          setFakeData(response);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchFakeData();
  }, []);

  return (
    <div className="flex space-x-2 px-6 py-3 bg-white mt-8 border border-gray-200 rounded-sm overflow-x-auto scrollbar-thumb-black scrollbar-thin w-full">
      {fakeData?.map((data) => (
        <StoryCard data={data} key={data.id} />
      ))}
    </div>
  );
};

export default Stories;
