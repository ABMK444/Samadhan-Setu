import { useEffect, useState } from "react";
import { readDB } from "../services/storage";
// One subscription keeps all role dashboards in sync after a service mutation,
// including changes from another tab. Replace with query/refetch when using APIs.
export function useDatabase() {
  const [db, setDB] = useState(readDB);
  useEffect(() => {
    const refresh = () => setDB(readDB());
    window.addEventListener("samadhan-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("samadhan-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return db;
}
