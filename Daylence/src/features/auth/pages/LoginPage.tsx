import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../../supabaseClient";
import "../css/LoginPage.css";

type LoginProps = {
  setToken: (token: { token: string }) => void;
};

export default function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .eq("password", password)
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      setErrorMessage("Email ou mot de passe incorrect");
      return;
    }

    setToken({ token: "connected" });
  };

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
