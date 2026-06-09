import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  listTasks,
  login,
  logout,
  me,
  register,
  updateTask,
} from "./api";

const emptyAuth = {
  name: "",
  email: "",
  password: "",
};

const emptyTask = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
};

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuth);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const profile = await me();
        if (!active) return;

        setUser(profile.user);
        const taskResponse = await listTasks();
        if (!active) return;
        setTasks(taskResponse.tasks);
      } catch (error) {
        if (active) {
          setUser(null);
          setTasks([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "DONE").length,
    [tasks],
  );

  function flash(message, type = "info") {
    setStatusMessage(message);
    setStatusType(type);
  }

  async function refreshTasks() {
    const taskResponse = await listTasks();
    setTasks(taskResponse.tasks);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const payload =
        authMode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };

      const response =
        authMode === "register"
          ? await register(payload)
          : await login(payload);
      setUser(response.user);
      setAuthForm(emptyAuth);
      await refreshTasks();
      flash(response.message, "success");
    } catch (error) {
      flash(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);

    try {
      const response = await logout();
      setUser(null);
      setTasks([]);
      setEditingTaskId(null);
      setTaskForm(emptyTask);
      flash(response.message, "success");
    } catch (error) {
      flash(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleTaskSubmit(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        status: taskForm.status,
        priority: taskForm.priority,
      };

      const response = editingTaskId
        ? await updateTask(editingTaskId, payload)
        : await createTask(payload);

      setTaskForm(emptyTask);
      setEditingTaskId(null);
      await refreshTasks();
      flash(response.message, "success");
    } catch (error) {
      flash(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function handleTaskEdit(task) {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    });
    flash(`Editing ${task.title}`, "info");
  }

  async function handleTaskDelete(taskId) {
    setBusy(true);

    try {
      const response = await deleteTask(taskId);
      await refreshTasks();
      flash(response.message, "success");
    } catch (error) {
      flash(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="shell center-shell">
        <div className="loading-card">Loading dashboard...</div>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Prime Trade API Suite</p>
          <h1>
            MongoDB-backed auth and task management in one testing surface.
          </h1>
          <p className="hero-copy">
            Register, log in, and manage protected tasks against the REST API
            with JWT cookies and role-based access.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <span>Active user</span>
            <strong>{user ? user.name : "Guest"}</strong>
          </div>
          <div>
            <span>Tasks visible</span>
            <strong>{totalTasks}</strong>
          </div>
          <div>
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>
      </section>

      {statusMessage ? (
        <div className={`notice ${statusType}`}>{statusMessage}</div>
      ) : null}

      {!user ? (
        <section className="auth-grid">
          <div className="panel auth-panel">
            <div className="tabs">
              <button
                className={authMode === "login" ? "active" : ""}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className={authMode === "register" ? "active" : ""}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="stack">
              {authMode === "register" ? (
                <label>
                  Name
                  <input
                    value={authForm.name}
                    onChange={(event) =>
                      setAuthForm({ ...authForm, name: event.target.value })
                    }
                    placeholder="Avery Stone"
                    required
                  />
                </label>
              ) : null}

              <label>
                Email
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm({ ...authForm, password: event.target.value })
                  }
                  placeholder="At least 8 characters"
                  required
                />
              </label>

              <button className="primary-button" type="submit" disabled={busy}>
                {busy
                  ? "Working..."
                  : authMode === "register"
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>
          </div>

          <div className="panel info-panel">
            <h2>What this demo covers</h2>
            <ul>
              <li>JWT auth stored in httpOnly cookies</li>
              <li>Role-based permissions for user and admin</li>
              <li>Task CRUD with ownership checks</li>
              <li>Swagger docs at the API server</li>
            </ul>
            <div className="seed-box">
              <span>Seeded admin</span>
              <strong>admin@primetrade.local</strong>
              <small>Password: Admin123!</small>
            </div>
          </div>
        </section>
      ) : (
        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Protected dashboard</p>
                <h2>Hello, {user.name}</h2>
              </div>
              <button
                className="secondary-button"
                onClick={handleLogout}
                disabled={busy}
              >
                Log out
              </button>
            </div>
            <div className="meta-row">
              <span>{user.email}</span>
              <span>{isAdmin ? "Admin access" : "User access"}</span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Task editor</p>
                <h2>{editingTaskId ? "Update task" : "Create task"}</h2>
              </div>
              {editingTaskId ? (
                <button
                  className="secondary-button"
                  onClick={() => {
                    setEditingTaskId(null);
                    setTaskForm(emptyTask);
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <form onSubmit={handleTaskSubmit} className="stack">
              <label>
                Title
                <input
                  value={taskForm.title}
                  onChange={(event) =>
                    setTaskForm({ ...taskForm, title: event.target.value })
                  }
                  placeholder="Ship beta release"
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  rows="4"
                  value={taskForm.description}
                  onChange={(event) =>
                    setTaskForm({
                      ...taskForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Add a short context note"
                />
              </label>

              <div className="split-fields">
                <label>
                  Status
                  <select
                    value={taskForm.status}
                    onChange={(event) =>
                      setTaskForm({ ...taskForm, status: event.target.value })
                    }
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={taskForm.priority}
                    onChange={(event) =>
                      setTaskForm({ ...taskForm, priority: event.target.value })
                    }
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </label>
              </div>

              <button className="primary-button" type="submit" disabled={busy}>
                {busy
                  ? "Saving..."
                  : editingTaskId
                    ? "Update task"
                    : "Create task"}
              </button>
            </form>
          </div>

          <div className="panel tasks-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Task list</p>
                <h2>Protected CRUD</h2>
              </div>
              <span className="count-pill">{tasks.length} records</span>
            </div>

            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  No tasks yet. Create one above.
                </div>
              ) : (
                tasks.map((task) => (
                  <article key={task.id} className="task-card">
                    <div className="task-card-header">
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description || "No description provided."}</p>
                      </div>
                      <div className="chip-row">
                        <span
                          className={`chip status-${task.status.toLowerCase()}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`chip priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="task-meta">
                      <span>Owner: {task.user?.name || "Unknown"}</span>
                      <span>
                        Updated: {new Date(task.updatedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="task-actions">
                      <button
                        className="secondary-button"
                        onClick={() => handleTaskEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="danger-button"
                        onClick={() => handleTaskDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
