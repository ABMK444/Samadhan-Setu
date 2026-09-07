import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../hooks/useDatabase";
import { notificationService } from "../services/notificationService";
import { PageTitle, Badge, Empty, Message } from "../components/UI";
import { useState } from "react";
export default function Notifications() {
  const db = useDatabase();
  const { user } = useAuth();
  const [unread, setUnread] = useState(false);
  const [error, setError] = useState("");
  if (!user) return null;
  const records = db.notifications
    .filter((n) => n.recipientId === user.id && (!unread || !n.read))
    .sort((a, b) => b.date.localeCompare(a.date));
  const act = (fn: () => void) => {
    try {
      fn();
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <PageTitle
        title="Notifications"
        description="Challenge matches, project activity and collaboration requests."
        action={
          <button
            className="secondary"
            onClick={() => act(() => notificationService.markAllRead(user.id))}
          >
            Mark all as read
          </button>
        }
      />
      <Message error={error} />
      <label className="check mb-4">
        <input
          type="checkbox"
          checked={unread}
          onChange={(e) => setUnread(e.target.checked)}
        />
        Unread only
      </label>
      <section className="panel">
        {records.map((n) => (
          <article
            className={`notification ${n.read ? "" : "unread"}`}
            key={n.id}
          >
            <div>
              <Badge>{n.category}</Badge>
              <p>
                <Link
                  to={n.path}
                  onClick={() =>
                    act(() => notificationService.markRead(n.id, user.id))
                  }
                >
                  {n.message}
                </Link>
              </p>
              <small>{new Date(n.date).toLocaleString()}</small>
            </div>
            {!n.read && (
              <button
                className="secondary"
                onClick={() =>
                  act(() => notificationService.markRead(n.id, user.id))
                }
              >
                Mark as read
              </button>
            )}
          </article>
        ))}
        {!records.length && (
          <Empty text="You’re all caught up. No notifications to show." />
        )}
      </section>
    </>
  );
}
