import "./QuestionIndicator.css"

export default function QuestionIndicator( {questionNumber} ) {
    return (
        <div className="question-indicator-container rounded-md p-2">
            <p>Q: {questionNumber}/15</p>
        </div>
    )
}