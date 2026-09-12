import { Link } from "react-router-dom";

const fallbackImages = [
  "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
];

const moduleImageOverrides = {
  "Market participants and order types":
    "https://images.unsplash.com/photo-1487715433499-93e010c911ae?auto=format&fit=crop&w=1200&q=80",
  "Fundamental analysis":
    "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=1200&q=80"
};

const ModuleCard = ({ module, index, progress }) => {
  const coverImage =
    (module.coverImage && module.coverImage.trim()) ||
    moduleImageOverrides[module.title] ||
    fallbackImages[index % fallbackImages.length];

  return (
    <div className="card module-card">
      <div className="card-thumb">
        <img
          src={coverImage}
          alt={`${module.title} cover art`}
          loading="lazy"
        />
        <span className="card-thumb-overlay" />
      </div>

      <div className="card-body">
        <div className="card-provider">LearnTrade • Micro-course</div>
        <h3 className="card-title">{module.title}</h3>
        <p className="card-description">{module.description}</p>

        {progress && (
          <div className="card-progress">
            <span>
              {progress.completedLessons}/{progress.totalLessons} lessons
            </span>
            <div className="progress-mini-bar">
              <div
                className="progress-mini-bar-fill"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        <div className="card-meta">
          <div className="card-tags">
            <span className="card-tag">Beginner</span>
            <span className="card-tag">Quiz included</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <Link to={`/modules/${module._id}`}>
          <button className="btn btn-link">View details</button>
        </Link>
      </div>
    </div>
  );
};

export default ModuleCard;
