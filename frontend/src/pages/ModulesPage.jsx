import { useEffect, useMemo, useState } from "react";
import { fetchModules } from "../api/moduleApi";
import { fetchProgress } from "../api/progressApi";
import ModuleCard from "../components/ModuleCard";

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const moduleRes = await fetchModules();

        // ---- IMPORTANT: handle multiple possible backend shapes ----
        // 1) [ {..}, {..} ]
        // 2) { modules: [..] }
        // 3) { data: [..] }
        // 4) { data: { modules: [..] } }
        const d = moduleRes.data;
        const list = Array.isArray(d)
          ? d
          : d?.modules
          ? d.modules
          : Array.isArray(d?.data)
          ? d.data
          : d?.data?.modules || [];

        setModules(list);
        console.log("Loaded modules:", list); // for debugging
        try {
          const progressRes = await fetchProgress();
          setProgressData(progressRes.data);
        } catch (progressErr) {
          console.warn("Progress unavailable", progressErr);
        }
      } catch (err) {
        console.error("Error loading modules", err);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const progressMap = useMemo(() => {
    const map = {};
    progressData?.modules?.forEach((module) => {
      map[module.moduleId] = module;
    });
    return map;
  }, [progressData]);

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h2 className="section-title">All modules</h2>
          <p className="section-subtitle">
            Browse every stock market mini-course available.
          </p>
        </div>
      </div>

      {loading && <p className="section-subtitle">Loading modules…</p>}

      {!loading && modules.length === 0 && (
        <p className="section-subtitle">
          No modules found. Check that your backend is running and your MongoDB
          collection has documents.
        </p>
      )}

      <div className="modules-grid">
        {modules.map((m, idx) => (
          <ModuleCard
            key={m._id || idx}
            module={m}
            index={idx}
            progress={progressMap[m._id]}
          />
        ))}
      </div>
    </div>
  );
};

export default ModulesPage;
