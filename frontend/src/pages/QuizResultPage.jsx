import { useLocation, useNavigate } from "react-router-dom";

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return <div className="page">No result data. Take a quiz first.</div>;
  }

  const scorePercent = data.total ? Math.round((data.score / data.total) * 100) : 0;
  const incorrectCount = Math.max(data.total - data.score, 0);

  return (
    <div className="page quiz-result-page">
      <div className="quiz-card">
        <p className="quiz-eyebrow">Result summary</p>
        <h2 className="quiz-title">{data.quizTitle || "Quiz result"}</h2>
        <p className="quiz-subtitle">
          Great effort! Review your answers below to reinforce what you learned.
        </p>
        <div className="quiz-result-stats">
          <div className="quiz-result-chip">
            <span className="quiz-result-label">Score</span>
            <strong className="quiz-result-value">
              {data.score} / {data.total}
            </strong>
          </div>
          <div className="quiz-result-chip">
            <span className="quiz-result-label">Accuracy</span>
            <strong className="quiz-result-value">{scorePercent}%</strong>
          </div>
          <div className="quiz-result-chip">
            <span className="quiz-result-label">Correct</span>
            <strong className="quiz-result-value">{data.score}</strong>
          </div>
          <div className="quiz-result-chip">
            <span className="quiz-result-label">Need review</span>
            <strong className="quiz-result-value">{incorrectCount}</strong>
          </div>
        </div>
      </div>

      <div className="quiz-answer-list">
        {data.details.map((detail, idx) => (
          <div
            key={detail.questionId || idx}
            className={`quiz-answer-card ${
              detail.isCorrect ? "correct" : "incorrect"
            }`}
          >
            <div className="quiz-answer-head">
              <span className="quiz-question-number">Q{idx + 1}</span>
              <p className="quiz-question-text">{detail.questionText}</p>
            </div>
            <div className="quiz-answer-meta">
              <span
                className={`quiz-answer-pill ${
                  detail.isCorrect ? "success" : "danger"
                }`}
              >
                {detail.isCorrect ? "Correct" : "Incorrect"}
              </span>
              <span className="quiz-selection-info">
                Your answer: {detail.selectedOption || "None"}
              </span>
              <span className="quiz-selection-info">
                Correct answer: {detail.correctOption}
              </span>
            </div>
            {detail.explanation && (
              <p className="quiz-explanation">{detail.explanation}</p>
            )}
          </div>
        ))}
      </div>

      <div className="quiz-actions">
        {data.lessonId && (
          <button
            className="btn btn-ghost"
            onClick={() => navigate(`/lessons/${data.lessonId}/quiz`)}
          >
            Retake quiz
          </button>
        )}
        <button className="btn btn-primary" onClick={() => navigate("/modules")}>
          Back to modules
        </button>
      </div>
    </div>
  );
};

export default QuizResultPage;
