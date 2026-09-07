import { useState } from "react";
import {
  NavLink,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Landmark,
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  Users,
  Bell,
  Building2,
  LogOut,
  Menu,
  CheckCircle,
  Plus,
  Handshake,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../hooks/useDatabase";
import { authService } from "../services/authService";
import { roleNames } from "../pages/Login";
const icons = {
  dashboard: LayoutDashboard,
  matches: ClipboardList,
  projects: FolderKanban,
  teams: Users,
  notifications: Bell,
  profile: Building2,
  completed: CheckCircle,
  challenges: ClipboardList,
  universities: Building2,
  new: Plus,
};
export default function PortalLayout() {
  const { user, setUser } = useAuth();
  const db = useDatabase();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const root = `/${user.role}`;
  const items =
    user.role === "university"
      ? [
          ["dashboard", "Overview"],
          ["matches", "Matched Challenges"],
          ["projects", "Active Solutions"],
          ["teams", "Teams"],
          ["notifications", "Notifications"],
          ["completed", "Completed Projects"],
          ["profile", "University Profile"],
        ]
      : user.role === "government"
        ? [
            ["dashboard", "Overview"],
            ["challenges", "Challenge Review"],
            ["projects", "All Projects"],
            ["universities", "Universities"],
            ["notifications", "Notifications"],
          ]
        : user.role === "citizen"
          ? [
              ["dashboard", "My Challenges"],
              ["challenges/new", "Submit a Challenge"],
              ["notifications", "Notifications"],
            ]
          : [
              ["dashboard", "Overview"],
              ["projects", "Collaboration Projects"],
              ["notifications", "Notifications"],
            ];
  const unread = db.notifications.filter(
    (n) => n.recipientId === user.id && !n.read,
  ).length;
  return (
    <div className="portal">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <Landmark size={29} />
          <div>
            <strong>SAMADHAN SETU</strong>
            <span>Government of Jharkhand</span>
          </div>
          <button
            className="mobile icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <div className="workspace-label">{roleNames[user.role]} WORKSPACE</div>
        <nav aria-label="Main navigation">
          {items.map(([path, label]) => {
            const Icon = icons[path as keyof typeof icons] || Plus;
            return (
              <NavLink
                to={`${root}/${path}`}
                key={path}
                onClick={() => setOpen(false)}
              >
                <Icon size={19} />
                <span>{label}</span>
                {path === "notifications" && unread > 0 && (
                  <b className="count">{unread}</b>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <Handshake size={20} />
          <p>
            Connecting local needs
            <br />
            with institutional expertise.
          </p>
          <button
            onClick={() => {
              authService.logout();
              setUser(null);
              nav("/login");
            }}
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      {open && (
        <button
          className="drawer-shade"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="portal-content">
        <header className="topbar">
          <button
            className="mobile icon-button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <span className="topbar-title">
            Societal Innovation Collaboration Portal
          </span>
          <div className="topbar-right">
            <Link
              className="icon-button"
              aria-label={`${unread} unread notifications`}
              to={`${root}/notifications`}
            >
              <Bell size={20} />
              {unread > 0 && <span className="notification-dot" />}
            </Link>
            <span className="avatar">
              {user.role === "university"
                ? "BM"
                : user.name
                    .split(" ")
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("")}
            </span>
            <div>
              <strong>
                {user.role === "university"
                  ? db.universities.find((u) => u.id === user.universityId)
                      ?.name
                  : user.name}
              </strong>
              <small>{roleNames[user.role]}</small>
            </div>
          </div>
        </header>
        <main id="main">
          <div className="breadcrumb">
            <Link to={`${root}/dashboard`}>Workspace</Link>
            <span>/</span>
            <span>
              {location.pathname.split("/").at(-1)?.replaceAll("-", " ")}
            </span>
          </div>
          <Outlet />
        </main>
        <footer>
          Samadhan Setu · Government of Jharkhand context{" "}
          <span>Demonstration only · Fictional project data</span>
        </footer>
      </div>
    </div>
  );
}
