import { useState } from "react";
import { QuizControls } from "./QuizControl";

 const CreateProblem = ({socket, roomId}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [answer, setAnswer] = useState(0);
    const [options, setOptions] = useState([{
        id: 0,
        title: ""
    },{
        id: 1,
        title: ""
    },{
        id: 2,
        title: ""
    },{
        id: 3,
        title: ""
    }])

    return <div>
        Create problem
        Title = <input type="text" onChange={(e) => {
            setTitle(e.target.value)
        }}></input>
        <br /><br />
        Description - <input type="text" onChange={(e) => {
            setDescription(e.target.value)
        }}></input>
        <br />
        
        {[0, 1, 2, 3].map(optionId => <div> 
            <input type="radio" checked={optionId === answer} onChange={() => {
                setAnswer(optionId)
            }}></input>
            Option {optionId}
            <input type="text" onChange={(e) => {
                setOptions(options => options.map(x => {
                    if (x.id === optionId) {
                        return {
                            ...x,
                            title: e.target.value
                        }
                    }
                    return x;
                }))
            }}></input>
        <br />
        </div>)}
 
        <button onClick={() => {
            socket.emit("createproblem", {
                roomId,
                problem: {
                    title,
                    description,
                    options,
                    answer,
                }
            });
        }}>Add problem</button>       
        <QuizControls socket={socket} roomId={roomId} />
    </div>
}
export default CreateProblem