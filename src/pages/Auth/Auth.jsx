import { useState } from "react";
import { supabase } from "../../supabaseClient";
import BgVideo from "/src/videos/video-bg.mp4";
import appLogo from "/src/images/blindate-logo-nobg.png";
import "./Auth.css";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(18);
  const [funFact, setFunFact] = useState("");
  const [isNewMember, setIsNewMember] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleIsNewMember = () => {
    setIsNewMember((prev) => !prev);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      //  alert("Welcome, ", data.user);
      console.log("Success ", data.user.user_metadata);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      // const newMember = {
      //   username,
      //   email,
      //   password,
      //   confirmPassword,
      //   gender,
      //   age,
      //   funFact,
      // };
      // localStorage.setItem("new", JSON.stringify(newMember));
      // console.log("Registered ", newMember);
      const { data, error: RegErr } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            gender: gender,
            age: age,
            fun_fact: funFact,
            avatar_url: "https://ionicframework.com/docs/img/demos/avatar.svg",
            voice_note: "",
          },
        },
      });

      if (RegErr) {
        console.error(RegErr);
        alert(`Error: ${RegErr.message}`);
        return;
      }
      if (data) {
        alert("Successfully registered!");
        console.log("User registered ", data.user);

        setUsername("");
        setEmail("");
        setPassword("");
        // setConfirmPassword("");
        setGender("");
        setAge(18);
        setFunFact("");
      }
    } catch (error) {
      console.error("catch error ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <video autoPlay muted loop playsInline className="bg-vid">
        <source src={BgVideo} type="video/mp4" />
      </video>
      <div className="wrapperDiv">
        <img
          src={appLogo}
          alt="blindate"
          width="200"
          height="54"
          className="d-inline-block align-text-top"
        />
        <h5>{isNewMember ? "Join us" : "Sign in"}</h5>

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
          {isNewMember ? (
            <div className="mb-2">
              <label
                style={{
                  display: "flex",
                  justifyContent: "left",

                  fontSize: "16px",
                }}
              >
                I am:{" "}
                <span
                  style={{
                    fontSize: "10px",
                    color: "red",
                    margin: "4px 0 0 4px",
                  }}
                >
                  (Gender & Age are used for match-making)
                </span>
              </label>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="male"
                  value="Male"
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="female"
                  value="Female"
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  style={{ width: "54px" }}
                  type={"number"}
                  name="age"
                  id="age"
                  min={18}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />{" "}
                <label style={{ fontSize: "14px" }}> years old</label>
              </div>
            </div>
          ) : null}

          {isNewMember ? (
            <div className="mb-2">
              <textarea
                className="form-control fs-6"
                id="funFact"
                rows="2"
                placeholder="A fun-fact about you.."
                value={funFact}
                onChange={(e) => setFunFact(e.target.value)}
                required
              ></textarea>
            </div>
          ) : null}
          <div className="mb-2">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              value={password}
              className="form-control fs-6"
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* {isNewMember && (

            )} */}

            {isNewMember ? (
              <>
                <span
                  style={{ fontSize: "12px", color: "red", marginRight: "6px" }}
                >
                  (Min. 8 alphanumeric e.g. 99Kw_Bu!)
                </span>
                <i
                  role="button"
                  className={
                    isPasswordVisible ? "bi bi-eye" : "bi bi-eye-slash"
                  }
                  onClick={togglePasswordVisibility}
                ></i>
              </>
            ) : null}
          </div>
          {/* {isNewMember ? (
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
          ) : null} */}
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
