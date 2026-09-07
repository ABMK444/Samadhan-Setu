import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Landmark, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { demoUsers } from "../data/seed";
import { resetDemo } from "../services/storage";
import type { Role } from "../types";
import { Field, Message, Modal } from "../components/UI";
export const roleNames: Record<Role, string> = {
  citizen: "Citizen",
  university: "University / HEI",
  industry: "Industry Partner",
  government: "Government Administrator",
};
export default function Login() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("university");
  const [email, setEmail] = useState("university@demo.in");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [reset, setReset] = useState(false);
  const [success, setSuccess] = useState("");
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;
  const login = (demo = false) => {
    try {
      const u = authService.login({
        email: demo ? demoUsers.find((u) => u.role === role)!.email : email,
        password: demo ? "Demo@123" : password,
        role,
        remember,
      });
      setUser(u);
      nav(`/${u.role}/dashboard`);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <div className="login-page">
      <header className="public-header">
        <Landmark size={34} />
        <div>
          <small>Government of Jharkhand · Demonstration</small>
          <strong>SAMADHAN SETU</strong>
          <span>Societal Innovation Collaboration Portal</span>
        </div>
      </header>
      <main className="login-main">
        <section className="login-intro">
          <p className="eyebrow">A SHARED PATH TO LOCAL SOLUTIONS</p>
          <h1>
            Connecting societal challenges with academic and industry solutions.
          </h1>
          <p>
            One place for communities, institutions and partners to turn local
            challenges into practical, measurable progress.
          </p>
          <div className="login-steps">
            <div>
              <b>01</b>
              <span>Identify a community challenge</span>
            </div>
            <div>
              <b>02</b>
              <span>Connect the right expertise</span>
            </div>
            <div>
              <b>03</b>
              <span>Develop and track a solution</span>
            </div>
          </div>
          <p className="fine">
            Frontend demonstration. Not an official government service. Project,
            faculty and community records are fictional.
          </p>
        </section>
        <section className="panel login-form">
          <p className="eyebrow">PORTAL ACCESS</p>
          <h2>Sign in to Samadhan Setu</h2>
          <p className="muted">Choose your role to access your workspace.</p>
          <Message error={error} success={success} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <Field label="Account role">
              <select
                value={role}
                onChange={(e) => {
                  const r = e.target.value as Role;
                  setRole(r);
                  setEmail(demoUsers.find((u) => u.role === r)!.email);
                }}
              >
                {Object.entries(roleNames).map(([value, name]) => (
                  <option value={value} key={value}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Email / Username">
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </Field>
            <Field label="Password">
              <div className="password">
                <input
                  required
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>
            <div className="row-between">
              <label className="check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-button"
                onClick={() =>
                  setSuccess(
                    "Password recovery is not connected in this demo. Use Demo@123.",
                  )
                }
              >
                Forgot password?
              </button>
            </div>
            <button className="primary full" type="submit">
              Sign in <ArrowRight size={18} />
            </button>
          </form>
          <div className="demo-box">
            <strong>Explore the demonstration</strong>
            <p>
              Demo password: <code>Demo@123</code>
            </p>
            <button className="secondary full" onClick={() => login(true)}>
              Continue as {roleNames[role]}
            </button>
          </div>
          {import.meta.env.VITE_DEMO_MODE !== "false" && (
            <button className="text-button" onClick={() => setReset(true)}>
              Reset Demo Data
            </button>
          )}
        </section>
      </main>
      {reset && (
        <Modal
          title="Reset demonstration data?"
          onClose={() => setReset(false)}
        >
          <p>
            This removes all locally added challenges, projects, teams and
            attachments.
          </p>
          <div className="actions">
            <button className="secondary" onClick={() => setReset(false)}>
              Cancel
            </button>
            <button
              className="danger-button"
              onClick={() => {
                try {
                  resetDemo();
                  setReset(false);
                  setSuccess("Demo data restored.");
                } catch {
                  setError("Could not reset browser storage.");
                }
              }}
            >
              Reset data
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
