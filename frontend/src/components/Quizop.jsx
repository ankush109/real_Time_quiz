import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Quizop({
  quizData,
  socket,
  userId,
  problemId,
  roomId
}) {
  const [selected, setSelected] = useState(0); // Set the default selected index to 0

  useEffect(() => {
    console.log(selected, "selected");
  }, [selected]);

  return (
    <div className="m-5">
      <div className="mb-5 mt-5">
        <label className="text-base font-semibold text-gray-900">
        {problemId } {")"} {quizData.title}
        </label>
        <p className="text-sm text-gray-500">
          Select any one of the following options.
        </p>
      </div>
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
        <div className="-space-y-px rounded-md bg-white">
          {quizData.options.map((setting, settingIdx) => (
            <RadioGroup.Option
              key={setting.title}
              value={settingIdx} // Set the value to the index of the option
              className={({ checked }) =>
                classNames(
                  settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                  settingIdx === quizData.options.length - 1
                    ? "rounded-bl-md rounded-br-md"
                    : "",
                  checked
                    ? "z-10 border-gray-200 bg-gray-50"
                    : "border-gray-200",
                  "relative flex cursor-pointer border p-4 focus:outline-none"
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span
                    className={classNames(
                      checked
                        ? "bg-gray-600 border-transparent"
                        : "bg-white border-gray-300",
                      active ? "ring-2 ring-offset-2 ring-gray-600" : "",
                      "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center"
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <span className="ml-3 flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? "text-gray-900" : "text-gray-900",
                        "block text-sm font-medium"
                      )}
                    >
                      {setting.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={classNames(
                        checked ? "text-gray-700" : "text-gray-500",
                        "block text-sm"
                      )}
                    >
                      {setting.description}
                    </RadioGroup.Description>
                  </span>
                </>
              )}
            </RadioGroup.Option>
          ))}
          <div className="flex justify-center my-10 w-full text-white items-center">
            <button
              className="py-3 my-10 px-10 bg-blue-600 rounded-lg flex justify-center items-center"
              onClick={() => {
                socket.emit("submit", {
                  userId,
                  problemId,
                  submission: selected, // Pass the selected index
                  roomId,
                });
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
