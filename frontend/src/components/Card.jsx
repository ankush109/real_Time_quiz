import { FaRegUser } from "react-icons/fa";

function Card({ sno, name, points, image }) {
    return (
        <div className="flex justify-between items-center w-96 bg-red-400 mb-4 rounded-md text-black px-4">
            <div className="flex gap-4 my-5 w-5/12">
                <p>{sno}.</p>
                <h3>{name}</h3>
            </div>
            <div>
                <p>{points}</p>
            </div>
            <div>
                <div className="bg-white p-1 rounded-full">
                    {image ? (
                        <img
                            src={image}
                            alt={image}
                            className="w-8 rounded-full"
                        />
                    ) : (
                        <FaRegUser className="text-black text-3xl" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;