import { Component, Suspense, lazy, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PortalLayout from "./layouts/PortalLayout";
import Login from "./pages/Login";
import type { Role } from "./types";
import { Empty } from "./components/UI";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Challenges = lazy(() => import("./pages/Challenges"));
const ChallengeDetail = lazy(() => import("./pages/ChallengeDetail"));
const SubmitChallenge = lazy(() => import("./pages/SubmitChallenge"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Teams = lazy(() => import("./pages/Teams"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Universities = lazy(() => import("./pages/Universities"));
function Guard({ role }: { role: Role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role)
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <PortalLayout />;
}
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: string }
> {
  state = { error: "" };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    return this.state.error ? (
      <div className="panel m-8">
        <h1>Unable to open the portal</h1>
        <p role="alert">{this.state.error}</p>
        <button
          className="primary"
          onClick={() => {
            localStorage.removeItem("samadhan-session");
            sessionStorage.removeItem("samadhan-session");
            window.location.href = "/login";
          }}
        >
          Return to login
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  const location = useLocation();
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="empty" role="status">
            Loading workspace…
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          {(["citizen", "university", "government", "industry"] as Role[]).map(
            (role) => (
              <Route
                key={role}
                path={`/${role}`}
                element={<Guard role={role} />}
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="notifications" element={<Notifications />} />
                {role === "citizen" && (
                  <Route path="challenges/new" element={<SubmitChallenge />} />
                )}
                <Route
                  path="challenges/:id"
                  element={<ChallengeDetail key={location.pathname} />}
                />
                {role === "university" && (
                  <>
                    <Route path="matches" element={<Challenges />} />
                    <Route path="teams" element={<Teams />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="completed" element={<Projects completed />} />
                  </>
                )}
                {role === "government" && (
                  <>
                    <Route path="challenges" element={<Challenges />} />
                    <Route path="universities" element={<Universities />} />
                  </>
                )}
                {role !== "citizen" && (
                  <>
                    <Route
                      path="projects"
                      element={<Projects key={location.pathname} />}
                    />
                    <Route
                      path="projects/:id"
                      element={<ProjectDetail key={location.pathname} />}
                    />
                  </>
                )}
              </Route>
            ),
          )}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="*"
            element={
              <Empty text="Page not found.">
                <a href="/login">Return to portal</a>
              </Empty>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
