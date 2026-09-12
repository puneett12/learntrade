import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchQuizByLesson, submitQuizAttempt } from "../api/quizApi";

const QuizPage = () => {
  const { lessonId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchQuizByLesson(lessonId);
        setQuiz(res.data.quiz);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  const answeredCount = useMemo(() => {
    if (!questions.length) return 0;
    return questions.reduce(
      (total, question) => (answers[question._id] ? total + 1 : total),
      0
    );
  }, [answers, questions]);

  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const handleChange = (qId, opt) => {
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleClearAnswer = (qId) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleResetAnswers = () => {
    setAnswers({});
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const formatted = questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] || ""
    }));
    try {
      setSubmitting(true);
      const res = await submitQuizAttempt(quiz._id, formatted);
      navigate(`/quizzes/${quiz._id}/result`, {
        state: {
          ...res.data,
          quizTitle: quiz.title,
          lessonId: quiz.lessonId
        }
      });
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page">Loading quiz…</div>;
  if (!quiz) return <div className="page">No quiz for this lesson.</div>;

  return (
    <div className="page quiz-page">
      <div className="quiz-card">
        <div className="quiz-header">
          <div>
            <p className="quiz-eyebrow">Lesson quiz</p>
            <h2 className="quiz-title">{quiz.title}</h2>
            <p className="quiz-subtitle">
              Choose the best answer for each question. You can change answers at
              any time before submitting.
            </p>
          </div>
          <div className="quiz-progress">
            <span>
              {answeredCount}/{questions.length} answered
            </span>
            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="quiz-progress-percent">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="quiz-questions">
        {questions.length === 0 && (
          <div className="quiz-card">
            <p className="quiz-subtitle">
              This lesson does not have any questions yet.
            </p>
          </div>
        )}

        {questions.map((question, idx) => (
          <div key={question._id} className="quiz-question-card">
            <div className="quiz-question-head">
              <span className="quiz-question-number">Q{idx + 1}</span>
              <p className="quiz-question-text">{question.questionText}</p>
            </div>
            <div className="quiz-options">
              {["A", "B", "C", "D"].map((opt) => {
                const label = question[`option${opt}`];
                if (!label) return null;
                const selected = answers[question._id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`quiz-option${selected ? " selected" : ""}`}
                    onClick={() => handleChange(question._id, opt)}
                    disabled={submitting}
                  >
                    <span className="quiz-option-key">{opt}</span>
                    <span className="quiz-option-label">{label}</span>
                  </button>
                );
              })}
            </div>
            <div className="quiz-question-footer">
              {answers[question._id] ? (
                <span className="quiz-selection-info">
                  Selected answer: {answers[question._id]}
                </span>
              ) : (
                <span className="quiz-selection-info muted">
                  No answer selected
                </span>
              )}
              {answers[question._id] && (
                <button
                  type="button"
                  className="btn btn-ghost quiz-clear-btn"
                  onClick={() => handleClearAnswer(question._id)}
                  disabled={submitting}
                >
                  Clear answer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="quiz-actions">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit quiz"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleResetAnswers}
            disabled={submitting || answeredCount === 0}
          >
            Reset answers
          </button>
          {!questions.every((q) => answers[q._id]) && (
            <p className="quiz-note">
              Tip: Unanswered questions will count as incorrect.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
