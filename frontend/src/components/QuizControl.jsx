
export const QuizControls = ({socket, roomId}) => {
    return <div>
Quiz Controls
        <button onClick={() => {
            socket.emit("next", {
                roomId
            })
        }}>Next Problem</button>
    </div>
}