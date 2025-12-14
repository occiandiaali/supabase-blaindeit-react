import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [age, setAge] = useState(null);
  const [funFact, setFunFact] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [days, setDays] = useState("");
  const [userId, setUserId] = useState(null);

  const array = [];

  const handleAvailableDays = (d) => {
    array.push(d);
  };
  const updateDays = async () => {
    console.log(array);
    const { error } = await supabase
      .from("profiles")
      .update({ available_days: array })
      .eq("id", userId);
  };

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, age, avatar_url`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setAge(data.age);
          // setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(event, avatarUrl) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }

  return (
    <div className="containerDiv">
      <img
        width={"64px"}
        height={"64px"}
        style={{ borderRadius: "100%" }}
        src="https://ionicframework.com/docs/img/demos/avatar.svg"
        // src={user.user_metadata.avatar_url}
        // alt={user.user_metadata.username}
      />
      <br />
      <span role="button" className="mb-2">
        Update
      </span>

      {/* <form onSubmit={updateProfile} className="form-widget mt-2"> */}
      <form className="form-widget mt-2">
        <div className="mb-2">
          <label htmlFor="email">Email</label>{" "}
          <input id="email" type="text" value={session.user.email} disabled />
          {/* <input
            id="email"
            type="text"
            value="email@domain.whatever"
            placeholder="Email"
            disabled
          /> */}
        </div>

        <div className="mb-2">
          <label htmlFor="username" className="fw-bold">
            Username
          </label>{" "}
          <input
            id="username"
            type="text"
            placeholder="Update username"
            required
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />{" "}
          <span role="button" onClick={updateDays}>
            Update
          </span>
        </div>

        <div className="mb-2">
          <label htmlFor="age" className="fw-bold">
            Age
          </label>{" "}
          <input
            type={"number"}
            name="age"
            id="age"
            min={18}
            max={100}
            value={age || 18}
            onChange={(e) => setAge(e.target.value)}
            required
          />{" "}
          <span role="button" onClick={updateDays}>
            Update
          </span>
        </div>

        <div className="mb-2">
          <label htmlFor="funFact" className="fw-bold">
            Fact
          </label>{" "}
          <textarea
            id="funFact"
            rows="2"
            placeholder="Update your fun fact"
            value={funFact || ""}
            onChange={(e) => setFunFact(e.target.value)}
            required
          ></textarea>{" "}
          <span role="button" onClick={updateDays}>
            Update
          </span>
        </div>

        <div className="mb-2">
          <label htmlFor="calends" className="fw-bold">
            Availability
          </label>{" "}
          <input
            type={"date"}
            id="calends"
            name="calends"
            onChange={(e) => handleAvailableDays(e.target.value)}
          />{" "}
          <span role="button" onClick={updateDays}>
            Update
          </span>
        </div>

        <div className="mb-2">
          <label htmlFor="VN" className="fw-bold">
            <span role="button" className="fw-normal" onClick={updateDays}>
              Update
            </span>{" "}
            Voice note
          </label>{" "}
          <input type="file" id="VN" name="VN" accept="audio/*" />{" "}
        </div>
        {/* <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div> */}

        {/* <div>
          <button className="button block" type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Update"}
          </button>
        </div> */}

        <div>
          <button
            // className="button block"
            // type="button"
            className="btn btn-outline-danger mt-2"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
