import React, { useState } from "react";
import Link from "next/link";

const LoginForm = () => {
  const [username, setUsername] = useState("Anonymous user");
  const [role, setRole] = useState("viewer");
  return (
    <div className="login">
      {/* this will be the component for the login page */}
      <h1 className="login__header">
        Welcome to my game streaming application
      </h1>
      <form className="login__form">
        <label className="login__form__label">Username</label>
        <input
          className="login__form__input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="login__form__label">Role</label>
        <select
          className="login__form__select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="streamer">Streamer</option>
        </select>
        <Link
          className="login__form__button"
          href={{
            pathname: "/game-streaming",
            query: { name: username, role: role },
          }}
        >
          <button>Login</button>
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
