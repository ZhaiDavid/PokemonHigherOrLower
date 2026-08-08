import "./ResultComponent.css";

export default function ResultComponent({ hasWon, roomScore, playerUsernames, userID }) {
    // TODO: I think the issue here is that this code only runs once on component mount

    // const [usernames, setUsernames] = useState(new Map(playerUsernames));
    // const [scores, setScores] = useState(new Map(roomScore));

    // console.log(usernames);
    // console.log(roomScore);

    // useEffect(() => {

    // }, [])

    return (
        <div className="result-component w-md h-75 absolute m-auto inset-0 z-10 bg-white rounded-lg">
            <div className="text-4xl md:text-5xl">
                {hasWon && <h1>Victory!</h1>}
                {!hasWon && <h1>Defeat!</h1>}
            </div>
            {Array.from(playerUsernames.keys()).map((id, index) => (
                <div className="score-content-container" key={index}>
                    <p className="content-username">{playerUsernames.get(id)}</p>
                    <p className="content-score"> : {roomScore.get(id)}</p>
                </div>
            ))}
        </div>
    )
}