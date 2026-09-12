import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchLessonById } from "../api/lessonApi";
import { updateLessonProgress } from "../api/progressApi";

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchLessonById(lessonId);
        setLesson(res.data);
      } catch (err) {
        console.error("Error loading lesson", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  const videoPlayer = useMemo(() => {
    if (!lesson?.videoUrl) return null;
    const url = lesson.videoUrl;

    const toEmbeddedUrl = (value) => {
      try {
        const parsed = new URL(value);
        if (parsed.hostname.includes("youtube.com")) {
          const id = parsed.searchParams.get("v");
          if (id) return `https://www.youtube.com/embed/${id}`;
        }
        if (parsed.hostname.includes("youtu.be")) {
          const segments = parsed.pathname.split("/").filter(Boolean);
          const id = segments.pop();
          if (id) return `https://www.youtube.com/embed/${id}`;
        }
        if (parsed.hostname.includes("vimeo.com")) {
          const id = parsed.pathname.split("/").filter(Boolean).pop();
          if (id) return `https://player.vimeo.com/video/${id}`;
        }
      } catch {
        return null;
      }
      return null;
    };

    const embedUrl = toEmbeddedUrl(url);
    const isFile = /\.(mp4|webm|ogg)$/i.test(url);

    if (embedUrl) {
      return { type: "iframe", src: embedUrl };
    }
    if (isFile) {
      return { type: "video", src: url };
    }
    return { type: "iframe", src: url };
  }, [lesson?.videoUrl]);

  const handleStatusChange = async (status) => {
    if (!lesson) return;
    if (lesson.progressStatus === status) return;

    try {
      setSavingProgress(true);
      await updateLessonProgress(lessonId, status);
      setLesson((prev) => ({
        ...prev,
        progressStatus: status,
        completedAt: status === "completed" ? new Date().toISOString() : null
      }));
    } catch (err) {
      console.error("Failed to update progress", err);
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (!lesson) return <div className="page">Lesson not found</div>;

  const statusKey = lesson.progressStatus || "not_started";
  const statusText = statusKey.replace("_", " ");

  return (
    <div className="page">
      <div className="lesson-layout">
        {/* LEFT: lesson content */}
        <div>
          <h2>{lesson.title}</h2>
          <p className="lesson-meta">
            Difficulty: {lesson.difficulty || "Beginner"}
            {lesson.durationMinutes ? ` • ${lesson.durationMinutes} min` : ""}
          </p>
          <div className="lesson-progress-box">
            <span className={`lesson-status-pill ${statusKey}`}>
              {statusText}
            </span>
            <div className="lesson-progress-actions">
              <button
                className="btn btn-ghost"
                disabled={savingProgress || lesson.progressStatus === "in_progress"}
                onClick={() => handleStatusChange("in_progress")}
              >
                Mark in progress
              </button>
              <button
                className="btn btn-primary"
                disabled={savingProgress || lesson.progressStatus === "completed"}
                onClick={() => handleStatusChange("completed")}
              >
                Mark completed
              </button>
            </div>
            {lesson.completedAt && (
              <p className="section-subtitle">
                Completed on {new Date(lesson.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {videoPlayer && (
            <div className="lesson-video">
              <h4>Video lesson</h4>
              {videoPlayer.type === "iframe" ? (
                <div className="video-frame">
                  <iframe
                    src={videoPlayer.src}
                    title="Lesson video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video controls src={videoPlayer.src} className="video-element" />
              )}
            </div>
          )}

          <div
            className="lesson-content-box"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* RIGHT: sidebar / quiz CTA */}
        <div className="lesson-sidebar">
          <p>
            <strong>Ready to practice?</strong>
          </p>
          <p style={{ marginBottom: 10 }}>
            Test yourself with a quick quiz based on this lesson. Your score and
            explanations will help you remember concepts like a real course
            platform.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/lessons/${lessonId}/quiz`)}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
