import "./ResultComponent.css";

export default function ResultComponent({ hasWon, draw, roomScore, playerUsernames, userID }) {
    // TODO: I think the issue here is that this code only runs once on component mount

    // const [usernames, setUsernames] = useState(new Map(playerUsernames));
    // const [scores, setScores] = useState(new Map(roomScore));

    // console.log(usernames);
    // console.log(roomScore);

    // useEffect(() => {

    // }, [])

    return (
        <div className="result-component w-xs md:w-sm h-60 absolute m-auto inset-0 z-10 bg-white rounded-lg">
            <div className="text-4xl md:text-5xl font-bold mb-1">
                {hasWon && !draw && <h1>Victory!</h1>}
                {draw && <h1>draw!</h1>}
                {!hasWon && !draw && <h1>Defeat!</h1>}
            </div>
            
                {Array.from(playerUsernames.keys()).map((id, index) => (
                    <div className="score-content-container mt-1" key={index}>
                        {(id == userID) && <p className="content-username">{playerUsernames.get(id)} (You)</p>}
                        {(id !== userID) && <p className="content-username">{playerUsernames.get(id)}</p>}
                        <p className="content-score"> : {roomScore.get(id)}</p>
                    </div>
                ))}
            
        </div>
    )
}