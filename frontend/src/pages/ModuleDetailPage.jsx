import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchModuleById } from "../api/moduleApi";
import { fetchProgress } from "../api/progressApi";

const ModuleDetailPage = () => {
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const moduleRes = await fetchModuleById(moduleId);
        setModuleData(moduleRes.data);
        try {
          const progressRes = await fetchProgress();
          setProgressData(progressRes.data);
        } catch (progressErr) {
          console.warn("Progress unavailable", progressErr);
        }
      } catch (err) {
        console.error("Failed to load module", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [moduleId]);

  const moduleProgress = useMemo(() => {
    return (
      progressData?.modules?.find(
        (m) => String(m.moduleId) === String(moduleId)
      ) || null
    );
  }, [progressData, moduleId]);

  if (loading) return <div>Loading...</div>;
  if (!moduleData) return <div>Module not found</div>;

  const { module, lessons } = moduleData;

  return (
    <div className="page">
      <div className="module-hero">
        <div>
          <h2>{module.title}</h2>
          <p className="section-subtitle">{module.description}</p>
        </div>
        {moduleProgress && (
          <div className="progress-chip">
            {moduleProgress.completedLessons}/{moduleProgress.totalLessons} done
            <div className="progress-mini-bar">
              <div
                className="progress-mini-bar-fill"
                style={{ width: `${moduleProgress.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="lessons-list">
        {lessons.map((lesson) => {
          const lessonProgress = moduleProgress?.lessons?.find(
            (l) => String(l.lessonId) === String(lesson._id)
          );

          return (
            <div key={lesson._id} className="lesson-row">
              <div>
                <h4 className="lesson-title">{lesson.title}</h4>
                <p className="section-subtitle">
                  Difficulty: {lesson.difficulty || "Beginner"}
                </p>
              </div>
              <div className="lesson-row-actions">
                {lessonProgress && (
                  <span
                    className={`lesson-status-pill ${lessonProgress.status}`}
                  >
                    {lessonProgress.status.replace("_", " ")}
                  </span>
                )}
                <Link to={`/lessons/${lesson._id}`}>
                  <button className="btn btn-primary">Open lesson</button>
                </Link>
              </div>
            </div>
          );
        })}

        {lessons.length === 0 && (
          <p className="section-subtitle">No lessons in this module yet.</p>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
