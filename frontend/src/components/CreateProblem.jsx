import { useState } from "react";
import { QuizControls } from "./QuizControl";

const CreateProblem = ({ socket, roomId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState([
    { id: 0, title: "" },
    { id: 1, title: "" },
    { id: 2, title: "" },
    { id: 3, title: "" },
  ]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Problem</h1>
      <label className="block mb-2">
        Title
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block mb-2">
        Description
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      {[0, 1, 2, 3].map((optionId) => (
        <div key={optionId} className="mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={optionId === answer}
              onChange={() => setAnswer(optionId)}
              className="mr-2"
            />
            Option {optionId}
          </label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            onChange={(e) =>
              setOptions((options) =>
                options.map((x) =>
                  x.id === optionId ? { ...x, title: e.target.value } : x
                )
              )
            }
          />
        </div>
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => {
          socket.emit("createproblem", {
            roomId,
            problem: {
              title,
              description,
              options,
              answer,
            },
          });
        }}
      >
        Add Problem
      </button>

      <QuizControls socket={socket} roomId={roomId} />
    </div>
  );
};

export default CreateProblem;
