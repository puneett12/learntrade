import { useEffect, useState } from "react";
import { fetchProgress } from "../api/progressApi";

const ProgressPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetchProgress();
        setProgressData(res.data);
      } catch (err) {
        setError("Could not load progress right now.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const summary = progressData?.summary;
  const modules = progressData?.modules || [];

  if (loading) {
    return <div className="page">Loading your progress…</div>;
  }

  if (error) {
    return <div className="page">{error}</div>;
  }

  return (
    <div className="page">
      <div className="progress-summary">
        <div>
          <h2 className="section-title">Your learning progress</h2>
          <p className="section-subtitle">
            Track finished lessons, streaks, and what to study next.
          </p>
        </div>
        {summary && (
          <div className="summary-chip">
            {summary.completedLessons}/{summary.totalLessons} lessons (
            {summary.percent}%)
          </div>
        )}
      </div>

      {summary && (
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Completion</span>
            <strong className="summary-value">{summary.percent}%</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Lessons completed</span>
            <strong className="summary-value">
              {summary.completedLessons}
            </strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Lessons remaining</span>
            <strong className="summary-value">
              {summary.totalLessons - summary.completedLessons}
            </strong>
          </div>
        </div>
      )}

      <div className="progress-modules">
        {modules.map((module) => (
          <div key={module.moduleId} className="progress-card">
            <div className="progress-card-head">
              <div>
                <h3 className="progress-card-title">{module.moduleTitle}</h3>
                <p className="progress-card-subtitle">
                  {module.completedLessons} of {module.totalLessons} lessons
                  complete
                </p>
              </div>
              <span className="progress-percent">{module.percent}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${module.percent}%` }}
              />
            </div>
            <ul className="progress-lesson-list">
              {module.lessons.map((lesson) => (
                <li key={lesson.lessonId} className="progress-lesson-row">
                  <span>{lesson.title}</span>
                  <span className={`lesson-status-pill ${lesson.status}`}>
                    {lesson.status.replace("_", " ")}
                  </span>
                </li>
              ))}
              {module.lessons.length === 0 && (
                <li className="progress-lesson-row">
                  <span>No lessons yet</span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPage;
