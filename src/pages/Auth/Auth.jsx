import { useState } from "react";
//import { supabase } from "../../supabaseClient";
import BgVideo from "/src/videos/video-bg.mp4";
import appLogo from "/src/images/blindate-logo-nobg.png";
import "./Auth.css";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [funFact, setFunFact] = useState("");
  const [isNewMember, setIsNewMember] = useState(false);

  const handleIsNewMember = () => {
    setIsNewMember((prev) => !prev);
  };

  const handleLogin = async () => {};

  const handleRegister = async () => {};

  return (
    <>
      <video autoPlay muted loop playsInline className="bg-vid">
        <source src={BgVideo} type="video/mp4" />
      </video>
      <div className="wrapperDiv">
        <img
          src={appLogo}
          alt="blindate"
          width="140"
          height="44"
          className="d-inline-block align-text-top"
        />
        <h3>{isNewMember ? "Join us" : "Sign in"}</h3>

        <form
          className="form-widget"
          onSubmit={isNewMember ? handleRegister : handleLogin}
        >
          {isNewMember ? (
            <div className="mb-2">
              <input
                className="form-control fs-6"
                id="username"
                placeholder="What should we call you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          ) : null}

          <div className="mb-2">
            <input
              type="email"
              className="form-control fs-6"
              id="email"
              placeholder="email@domain.whatever"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            {isNewMember ? (
              <textarea
                className="form-control fs-6"
                id="funFact"
                rows="2"
                placeholder="A fun-fact about you.."
                value={funFact}
                onChange={(e) => setFunFact(e.target.value)}
                required
              ></textarea>
            ) : null}
          </div>
          <div className="mb-2">
            <input
              type={"password"}
              id="password"
              value={password}
              className="form-control fs-6"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isNewMember ? (
              <span style={{ fontSize: "12px", color: "red" }}>
                (Min. 8 alphanumeric e.g. 99Kw_Bu!)
              </span>
            ) : null}
          </div>
          {isNewMember ? (
            <div className="mb-2">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                className="form-control fs-6"
                placeholder="Enter password again"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          ) : null}
          <div>
            <button className={"btn btn-outline-dark mt-2"} disabled={loading}>
              {loading ? (
                <span>Working..</span>
              ) : (
                <span className="text-light">
                  {isNewMember ? "Register" : "Sign in"}
                </span>
              )}
            </button>
          </div>
        </form>
        <div className="form-check m-2">
          <input
            className="form-check-input"
            type="checkbox"
            value={isNewMember}
            id="memberCheck"
            onChange={handleIsNewMember}
          />
          <label className="form-check-label" htmlFor="memberCheck">
            I'm new here
          </label>
        </div>
      </div>
    </>
  );
}
