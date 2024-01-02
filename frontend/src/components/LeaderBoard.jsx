import { useEffect } from "react";
import Card from "./Card";

export function LeaderBoard({ leaderboardData }) {
 
    return (
        <div className="bg-opacity-20 bg-gray-400 backdrop-blur-5 m-20 border border-opacity-30 border-solid border-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl  text-center my-4 text-black">
                Leaderboard Results 🚀
            </h1>
            <div className="">
                {leaderboardData?.length > 0  && leaderboardData?.map((el, index) => (
                    <div className=" flex justify-center" key={index}>
                        <Card
                            sno={index + 1}
                            name={el.name}
                            points={el.points}
                            image={el.profilePicture}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
