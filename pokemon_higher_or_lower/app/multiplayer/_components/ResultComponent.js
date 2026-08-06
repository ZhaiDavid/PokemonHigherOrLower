import "./ResultComponent.css";

export default function ResultComponent({ hasWon, roomScore, playerUsernames }) {
    const usernames = new Map(playerUsernames);
    const scores = new Map(roomScore);

    console.log(usernames);
    console.log(scores);

    return (
        <div className="result-component w-md h-75 absolute m-auto inset-0 z-10 bg-white rounded-lg">
            <div className="text-4xl md:text-5xl">
                {hasWon && <h1>Victory!</h1>}
                {!hasWon && <h1>Defeat!</h1>}
            </div>
            {Array.from(usernames.keys()).map((id, index) => (
                <div className="score-content-container" key={index}>
                    <p className="content-username">{usernames.get(id)}</p>
                    <p className="content-score"> : {scores.get(id)}</p>
                </div>
            ))}
        </div>
    )
}