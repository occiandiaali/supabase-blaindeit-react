import { useState, useEffect } from "react";
//import { supabase } from "./supabaseClient";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [age, setAge] = useState(null);
  const [funFact, setFunFact] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  // useEffect(() => {
  //   let ignore = false;
  //   async function getProfile() {
  //     setLoading(true);
  //     const { user } = session;

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select(`username, website, avatar_url`)
  //       .eq("id", user.id)
  //       .single();

  //     if (!ignore) {
  //       if (error) {
  //         console.warn(error);
  //       } else if (data) {
  //         setUsername(data.username);
  //         setWebsite(data.website);
  //         setAvatarUrl(data.avatar_url);
  //       }
  //     }

  //     setLoading(false);
  //   }

  //   getProfile();

  //   return () => {
  //     ignore = true;
  //   };
  // }, [session]);

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
        alt="user"
      />
      <br />
      <span>Change</span>

      <form onSubmit={updateProfile} className="form-widget mt-2">
        <div>
          <label htmlFor="email">Email</label>{" "}
          {/* <input id="email" type="text" value={session.user.email} disabled /> */}
          <input id="email" type="text" value="" placeholder="Email" disabled />
        </div>
        <br />
        <div>
          <label htmlFor="username">Username</label>{" "}
          <input
            id="username"
            type="text"
            placeholder="Update username"
            required
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="age">Age</label>{" "}
          <input
            type={"number"}
            name="age"
            id="age"
            min={18}
            max={100}
            value={age || 18}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <textarea
            id="funFact"
            rows="2"
            placeholder="Update your fun fact"
            value={funFact || ""}
            onChange={(e) => setFunFact(e.target.value)}
            required
          ></textarea>
        </div>
        <br />
        <div>
          <label htmlFor="VN">Update voice note</label>{" "}
          <input type="file" id="VN" name="VN" accept="audio/*" />
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
        <br />

        <div>
          <button className="button block" type="submit" disabled={loading}>
            {!loading ? "Loading ..." : "Update"}
          </button>
        </div>

        <div>
          <button
            className="button block"
            type="button"
            // onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
