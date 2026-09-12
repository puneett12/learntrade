import { useEffect, useState } from "react";
import {
  createModule,
  deleteModule,
  fetchModuleById,
  fetchModules
} from "../api/moduleApi";
import { createLesson, updateLesson } from "../api/lessonApi";
import { fetchQuizByLesson, saveQuiz } from "../api/quizApi";

const defaultModuleForm = {
  title: "",
  description: "",
  orderIndex: 0
};
const defaultLessonForm = {
  moduleId: "",
  title: "",
  content: "",
  videoUrl: "",
  durationMinutes: 10,
  difficulty: "beginner",
  orderIndex: 0
};
const createEmptyQuizQuestion = () => ({
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  explanation: ""
});
const createDefaultQuizForm = () => ({
  moduleId: "",
  lessonId: "",
  title: "",
  questions: [createEmptyQuizQuestion()]
});

const AdminPanelPage = () => {
  const [modules, setModules] = useState([]);
  const [moduleForm, setModuleForm] = useState(defaultModuleForm);
  const [lessonForm, setLessonForm] = useState(defaultLessonForm);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [moduleSaving, setModuleSaving] = useState(false);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [selectedModuleLessons, setSelectedModuleLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState("");
  const [quizForm, setQuizForm] = useState(() => createDefaultQuizForm());
  const [quizLessons, setQuizLessons] = useState([]);
  const [quizLessonsLoading, setQuizLessonsLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSaving, setQuizSaving] = useState(false);
  const [editingQuizLessonId, setEditingQuizLessonId] = useState("");

  const loadModules = async () => {
    try {
      const res = await fetchModules();
      const result = Array.isArray(res.data) ? res.data : res.data?.modules;
      setModules(result || []);
    } catch (err) {
      console.error("Failed to load modules", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const loadLessonsForModule = async (moduleId) => {
    if (!moduleId) {
      setSelectedModuleLessons([]);
      return;
    }
    setLessonsLoading(true);
    try {
      const res = await fetchModuleById(moduleId);
      const lessons = res.data?.lessons || [];
      setSelectedModuleLessons(lessons);
    } catch (err) {
      console.error("Failed to load lessons", err);
      setStatusMessage("Failed to load lessons for module.");
    } finally {
      setLessonsLoading(false);
    }
  };

  const resetLessonForm = (moduleId = "") => {
    setLessonForm({
      ...defaultLessonForm,
      moduleId
    });
    setEditingLessonId("");
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    try {
      setModuleSaving(true);
      await createModule(moduleForm);
      setModuleForm(defaultModuleForm);
      setStatusMessage("Module created.");
      loadModules();
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to create module.");
    } finally {
      setModuleSaving(false);
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    if (!lessonForm.moduleId) {
      setStatusMessage("Select a module first.");
      return;
    }

    const moduleIdForRefresh = lessonForm.moduleId;
    try {
      setLessonSaving(true);
      if (editingLessonId) {
        await updateLesson(editingLessonId, lessonForm);
        setStatusMessage("Lesson updated.");
      } else {
        await createLesson(lessonForm);
        setStatusMessage("Lesson created.");
      }
      resetLessonForm(moduleIdForRefresh);
      loadLessonsForModule(moduleIdForRefresh);
    } catch (err) {
      console.error(err);
      setStatusMessage(
        editingLessonId ? "Failed to update lesson." : "Failed to create lesson."
      );
    } finally {
      setLessonSaving(false);
    }
  };

  const handleLessonModuleChange = (moduleId) => {
    setLessonForm((prev) => ({
      ...prev,
      moduleId
    }));
    if (!moduleId) {
      setSelectedModuleLessons([]);
      setEditingLessonId("");
      return;
    }
    loadLessonsForModule(moduleId);
  };

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson._id);
    setLessonForm({
      moduleId: lesson.moduleId,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || "",
      durationMinutes:
        typeof lesson.durationMinutes === "number"
          ? lesson.durationMinutes
          : defaultLessonForm.durationMinutes,
      difficulty: lesson.difficulty || defaultLessonForm.difficulty,
      orderIndex:
        typeof lesson.orderIndex === "number"
          ? lesson.orderIndex
          : defaultLessonForm.orderIndex
    });
    loadLessonsForModule(lesson.moduleId);
  };

  const handleCancelLessonEdit = () => {
    resetLessonForm(lessonForm.moduleId);
    setStatusMessage("Lesson editing canceled.");
  };

  const loadQuizLessons = async (moduleId) => {
    if (!moduleId) {
      setQuizLessons([]);
      return;
    }
    setQuizLessonsLoading(true);
    try {
      const res = await fetchModuleById(moduleId);
      const lessons = res.data?.lessons || [];
      setQuizLessons(lessons);
    } catch (err) {
      console.error("Failed to load quiz lessons", err);
      setStatusMessage("Failed to load lessons for quiz.");
      setQuizLessons([]);
    } finally {
      setQuizLessonsLoading(false);
    }
  };

  const handleQuizModuleChange = (moduleId) => {
    setQuizForm({
      ...createDefaultQuizForm(),
      moduleId
    });
    setEditingQuizLessonId("");
    if (!moduleId) {
      setQuizLessons([]);
      return;
    }
    loadQuizLessons(moduleId);
  };

  const loadQuizForLesson = async (lessonId) => {
    if (!lessonId) {
      setQuizForm((prev) => ({
        ...createDefaultQuizForm(),
        moduleId: prev.moduleId
      }));
      setEditingQuizLessonId("");
      return;
    }
    setQuizLoading(true);
    try {
      const res = await fetchQuizByLesson(lessonId);
      const quiz = res.data?.quiz;
      const questions = res.data?.questions || [];
      setQuizForm((prev) => ({
        ...prev,
        lessonId,
        title: quiz?.title || "",
        questions:
          questions.length > 0
            ? questions.map((question) => ({
                questionText: question.questionText || "",
                optionA: question.optionA || "",
                optionB: question.optionB || "",
                optionC: question.optionC || "",
                optionD: question.optionD || "",
                correctOption: question.correctOption || "A",
                explanation: question.explanation || ""
              }))
            : [createEmptyQuizQuestion()]
      }));
      setEditingQuizLessonId(lessonId);
    } catch (err) {
      if (err?.response?.status === 404) {
        setQuizForm((prev) => ({
          ...prev,
          lessonId,
          title: "",
          questions: [createEmptyQuizQuestion()]
        }));
        setEditingQuizLessonId("");
      } else {
        console.error("Failed to load quiz", err);
        setStatusMessage("Failed to load quiz.");
      }
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizLessonChange = (lessonId) => {
    setQuizForm((prev) => ({
      ...prev,
      lessonId
    }));
    setEditingQuizLessonId("");
    loadQuizForLesson(lessonId);
  };

  const handleQuizQuestionChange = (index, field, value) => {
    setQuizForm((prev) => {
      const questions = prev.questions.map((question, i) =>
        i === index ? { ...question, [field]: value } : question
      );
      return { ...prev, questions };
    });
  };

  const addQuizQuestion = () => {
    setQuizForm((prev) => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuizQuestion()]
    }));
  };

  const removeQuizQuestion = (index) => {
    setQuizForm((prev) => {
      if (prev.questions.length === 1) {
        return prev;
      }
      const questions = prev.questions.filter((_, i) => i !== index);
      return { ...prev, questions };
    });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    if (!quizForm.moduleId || !quizForm.lessonId) {
      setStatusMessage("Select a module and lesson first.");
      return;
    }
    if (!quizForm.title.trim()) {
      setStatusMessage("Quiz title is required.");
      return;
    }
    try {
      setQuizSaving(true);
      await saveQuiz({
        lessonId: quizForm.lessonId,
        title: quizForm.title,
        questions: quizForm.questions.map((question) => ({
          questionText: question.questionText,
          optionA: question.optionA,
          optionB: question.optionB,
          optionC: question.optionC,
          optionD: question.optionD,
          correctOption: question.correctOption,
          explanation: question.explanation
        }))
      });
      setStatusMessage("Quiz saved.");
      setEditingQuizLessonId(quizForm.lessonId);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to save quiz.");
    } finally {
      setQuizSaving(false);
    }
  };

  const handleQuizReset = () => {
    setQuizForm((prev) => ({
      ...createDefaultQuizForm(),
      moduleId: prev.moduleId
    }));
    setEditingQuizLessonId("");
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module and its lessons?")) return;
    try {
      await deleteModule(moduleId);
      setStatusMessage("Module deleted.");
      loadModules();
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to delete module.");
    }
  };

  return (
    <div className="page">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <h2 className="section-title">Admin panel</h2>
            <p className="section-subtitle">
              Manage modules and lessons, including their video links.
            </p>
          </div>
          {statusMessage && (
            <span className="status-message">{statusMessage}</span>
          )}
        </div>

        <div className="admin-summary">
          <div>
            <p className="summary-label">Modules live</p>
            <strong className="summary-value">{modules.length}</strong>
          </div>
          <div>
            <p className="summary-label">Default duration</p>
            <strong className="summary-value">
              {defaultLessonForm.durationMinutes} min
            </strong>
          </div>
          <div>
            <p className="summary-label">Tip</p>
            <p className="admin-tip">
              Fill in descriptions and video URLs so lessons look complete.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading modules…</p>
        ) : (
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card-heading">
                <h3>Create module</h3>
                <p className="admin-card-description">
                  Title, summary and order for your catalog.
                </p>
              </div>
              <form className="admin-form" onSubmit={handleModuleSubmit}>
                <div className="form-field">
                  <label className="form-label" htmlFor="module-title">
                    Title
                  </label>
                  <input
                    id="module-title"
                    className="form-input"
                    placeholder="e.g. Intro to Stock Orders"
                    value={moduleForm.title}
                    onChange={(e) =>
                      setModuleForm((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="module-description">
                    Description
                  </label>
                  <textarea
                    id="module-description"
                    className="form-input"
                    rows={3}
                    placeholder="One or two sentences describing the module…"
                    value={moduleForm.description}
                    onChange={(e) =>
                      setModuleForm((prev) => ({
                        ...prev,
                        description: e.target.value
                      }))
                    }
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="module-order">
                    Order index
                  </label>
                  <input
                    id="module-order"
                    type="number"
                    min={0}
                    className="form-input"
                    value={moduleForm.orderIndex}
                    onChange={(e) =>
                      setModuleForm((prev) => ({
                        ...prev,
                        orderIndex: Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={moduleSaving}
                >
                  {moduleSaving ? "Saving…" : "Save module"}
                </button>
              </form>
            </div>

            <div className="admin-card">
              <div className="admin-card-heading">
                <h3>Create lesson</h3>
                <p className="admin-card-description">
                  Attach lessons with content, video links, and difficulty.
                </p>
              </div>
              <form className="admin-form" onSubmit={handleLessonSubmit}>
                {editingLessonId && (
                  <div className="admin-tip">
                    Editing existing lesson. Update fields and click "Update
                    lesson" to save your changes.
                  </div>
                )}
                <div className="form-field">
                  <label className="form-label" htmlFor="lesson-module">
                    Module
                  </label>
                  <select
                    id="lesson-module"
                    className="form-input"
                    value={lessonForm.moduleId}
                    onChange={(e) => handleLessonModuleChange(e.target.value)}
                    required
                  >
                    <option value="">Select module</option>
                    {modules.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="lesson-title">
                    Lesson title
                  </label>
                  <input
                    id="lesson-title"
                    className="form-input"
                    placeholder="e.g. Market vs Limit Orders"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="lesson-content">
                    Content (HTML allowed)
                  </label>
                  <textarea
                    id="lesson-content"
                    className="form-input"
                    rows={5}
                    placeholder="<p>Explain the idea…</p>"
                    value={lessonForm.content}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        content: e.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="lesson-video">
                    Video URL
                  </label>
                  <input
                    id="lesson-video"
                    className="form-input"
                    placeholder="https://youtu.be/..."
                    value={lessonForm.videoUrl}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        videoUrl: e.target.value
                      }))
                    }
                  />
                </div>
                <div className="admin-form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="lesson-duration">
                      Duration (minutes)
                    </label>
                    <input
                      id="lesson-duration"
                      type="number"
                      min={0}
                      className="form-input"
                      value={lessonForm.durationMinutes}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          durationMinutes: Number(e.target.value)
                        }))
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="lesson-difficulty">
                      Difficulty
                    </label>
                    <select
                      id="lesson-difficulty"
                      className="form-input"
                      value={lessonForm.difficulty}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          difficulty: e.target.value
                        }))
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="lesson-order">
                      Order index
                    </label>
                    <input
                      id="lesson-order"
                      type="number"
                      min={0}
                      className="form-input"
                      value={lessonForm.orderIndex}
                      onChange={(e) =>
                        setLessonForm((prev) => ({
                          ...prev,
                          orderIndex: Number(e.target.value)
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={lessonSaving}
                  >
                    {lessonSaving
                      ? "Saving…"
                      : editingLessonId
                        ? "Update lesson"
                        : "Save lesson"}
                  </button>
                  {editingLessonId && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleCancelLessonEdit}
                      disabled={lessonSaving}
                    >
                      Discard changes
                    </button>
                  )}
                </div>
              </form>
              {lessonForm.moduleId && (
                <div className="lesson-list">
                  <div className="lesson-list-header">
                    <h4>Existing lessons in module</h4>
                    {lessonsLoading && <span>Loading…</span>}
                  </div>
                  {!lessonsLoading && selectedModuleLessons.length === 0 && (
                    <p className="module-description">No lessons yet.</p>
                  )}
                  <div className="lesson-list-items">
                    {selectedModuleLessons.map((lesson) => (
                      <div key={lesson._id} className="lesson-list-row">
                        <div>
                          <strong>{lesson.title}</strong>
                          <p className="module-description">
                            Duration: {lesson.durationMinutes ?? 0}m •{" "}
                            {lesson.difficulty || "beginner"}
                          </p>
                        </div>
                        <button
                          className="btn btn-ghost"
                          type="button"
                          onClick={() => handleEditLesson(lesson)}
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-card">
              <div className="admin-card-heading">
                <h3>Manage lesson quizzes</h3>
                <p className="admin-card-description">
                  Create questions for each lesson to reinforce learning.
                </p>
              </div>
              <form className="admin-form" onSubmit={handleQuizSubmit}>
                {quizLoading && (
                  <p className="module-description">Loading quiz data…</p>
                )}
                {editingQuizLessonId &&
                  editingQuizLessonId === quizForm.lessonId && (
                    <div className="admin-tip">
                      Editing an existing quiz. Update questions and save to
                      overwrite.
                    </div>
                  )}
                <div className="form-field">
                  <label className="form-label" htmlFor="quiz-module">
                    Module
                  </label>
                  <select
                    id="quiz-module"
                    className="form-input"
                    value={quizForm.moduleId}
                    onChange={(e) => handleQuizModuleChange(e.target.value)}
                  >
                    <option value="">Select module</option>
                    {modules.map((module) => (
                      <option key={module._id} value={module._id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="quiz-lesson">
                    Lesson
                  </label>
                  <select
                    id="quiz-lesson"
                    className="form-input"
                    value={quizForm.lessonId}
                    onChange={(e) => handleQuizLessonChange(e.target.value)}
                    disabled={!quizForm.moduleId || quizLessons.length === 0}
                  >
                    <option value="">Select lesson</option>
                    {quizLessons.map((lesson) => (
                      <option key={lesson._id} value={lesson._id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                  {quizLessonsLoading && (
                    <p className="module-description">Loading lessons…</p>
                  )}
                  {quizForm.moduleId &&
                    !quizLessonsLoading &&
                    quizLessons.length === 0 && (
                      <p className="module-description">
                        No lessons found in this module.
                      </p>
                    )}
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="quiz-title">
                    Quiz title
                  </label>
                  <input
                    id="quiz-title"
                    className="form-input"
                    placeholder="e.g. Lesson review quiz"
                    value={quizForm.title}
                    onChange={(e) =>
                      setQuizForm((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    required
                  />
                </div>
                {quizForm.questions.map((question, index) => (
                  <div key={index} className="quiz-question">
                    <div className="admin-card-heading">
                      <h4>Question {index + 1}</h4>
                      {quizForm.questions.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => removeQuizQuestion(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-field">
                      <label
                        className="form-label"
                        htmlFor={`question-text-${index}`}
                      >
                        Prompt
                      </label>
                      <textarea
                        id={`question-text-${index}`}
                        className="form-input"
                        rows={3}
                        placeholder="Write the quiz question…"
                        value={question.questionText}
                        onChange={(e) =>
                          handleQuizQuestionChange(
                            index,
                            "questionText",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className="admin-form-row">
                      <div className="form-field">
                        <label className="form-label">
                          Option A (required)
                        </label>
                        <input
                          className="form-input"
                          value={question.optionA}
                          onChange={(e) =>
                            handleQuizQuestionChange(
                              index,
                              "optionA",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">
                          Option B (required)
                        </label>
                        <input
                          className="form-input"
                          value={question.optionB}
                          onChange={(e) =>
                            handleQuizQuestionChange(
                              index,
                              "optionB",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="form-field">
                        <label className="form-label">Option C</label>
                        <input
                          className="form-input"
                          value={question.optionC}
                          onChange={(e) =>
                            handleQuizQuestionChange(
                              index,
                              "optionC",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Option D</label>
                        <input
                          className="form-input"
                          value={question.optionD}
                          onChange={(e) =>
                            handleQuizQuestionChange(
                              index,
                              "optionD",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="form-field">
                        <label className="form-label">Correct option</label>
                        <select
                          className="form-input"
                          value={question.correctOption}
                          onChange={(e) =>
                            handleQuizQuestionChange(
                              index,
                              "correctOption",
                              e.target.value
                            )
                          }
                        >
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label className="form-label">Explanation</label>
                        <textarea
                          className="form-input"
                          rows={2}
                          placeholder="(optional) Explain the correct choice…"
                          value={question.explanation}
                          onChange={(e) =>
                            handleQuizQuestionChange(
                              index,
                              "explanation",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={addQuizQuestion}
                >
                  Add another question
                </button>
                <div className="admin-form-actions">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={quizSaving}
                  >
                    {quizSaving ? "Saving…" : "Save quiz"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleQuizReset}
                    disabled={quizSaving}
                  >
                    Clear form
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-card">
          <div className="admin-card-heading">
            <h3>Existing modules</h3>
            <p className="admin-card-description">
              Review titles, descriptions, and order. Deleting also removes
              lessons.
            </p>
          </div>
          <div className="module-table">
            {modules.length === 0 && <p>No modules yet.</p>}
            {modules.map((module) => (
              <div key={module._id} className="module-row">
                <div className="module-row-details">
                  <div>
                    <strong>{module.title}</strong>
                    <p className="module-description">
                      {module.description || "No description added."}
                    </p>
                  </div>
                  <span className="module-order-pill">
                    #{module.orderIndex ?? 0}
                  </span>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleDeleteModule(module._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
