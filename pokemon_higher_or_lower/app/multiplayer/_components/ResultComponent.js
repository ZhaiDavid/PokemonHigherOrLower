import "./ResultComponent.css";

export default function ResultComponent({ hasWon, roomScore, playerUsernames }) {
    const usernames = new Map(userNames);
    const scores = new Map(Object.entries(roomScore));
    
    return (
        <div className="result-component">
            {hasWon && <h1>Victory!</h1>}
            {!hasWon && <h1>Defeat!</h1>}
            {Array.from(usernames.keys()).map((id, index) => (
                <div className="score-content-container" key={index}>
                    <p className="content-username">{usernames.get(id)}</p>
                    <p className="content-score"> : {scores.get(id)}</p>
                </div>
            ))}
        </div>
    )
}