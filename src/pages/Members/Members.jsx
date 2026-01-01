import { useEffect, useRef, useState } from "react";
//import fakeUsers from "../../data/fakeUsers";

import CustomCalendar from "../../components/CustomCalendar";
import addMinutes from "../../helpers/addMinutes";
import createSecureRandomString from "../../helpers/createSecureRandomString";

import { supabase } from "../../supabaseClient";

import "./Members.css";
import alien from "../../assets/audio/alien-voice.mp3";
import french from "../../assets/audio/french-female-voice.mp3";

export default function Members({ session }) {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [local, setLocal] = useState([]);

  const PAGE_SIZE = 5; //10;
  const loaderRef = useRef(null);

  const [currentUser, setCurrentUser] = useState({
    userid: null,
    username: null,
    userage: null,
    userimg: null,
  });

  const [scene, setScene] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [members, setMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [age, setAge] = useState(18);
  const [genderOption, setGenderOption] = useState("both");
  const [filteredMembers, setFilteredMembers] = useState(members);

  // // dummy dates for fakeUsers
  // const highlitDates = [
  //   "2025-12-14",
  //   "2025-12-15",
  //   "2025-12-16",
  //   "2025-12-19",
  //   "2025-12-24",
  // ];

  const handleSetStartDate = (newData) => {
    setStartDate(newData);
  };

  const [obj, setObj] = useState({
    id: "",
    name: "",
    image: "",
    fact: "",
    gender: "",
    status: "",
    age: "",
    available: [],
  });

  const injectToModal = (id, n, i, f, g, s, a, av) => {
    setObj({
      id: id,
      name: n,
      image: i,
      fact: f,
      gender: g,
      status: s,
      age: a,
      available: av,
    });
  };

  const handleSelectionChange = async () => {
    const roomID = createSecureRandomString(10);

    try {
      setSubmitting(true);
      const { error } = await supabase.from("meetings").insert({
        room_id: roomID,
        scene_type: scene,
        time_limit: duration,
        start_date: startDate,
        start_time: startTime,
        end_time: addMinutes(startTime, +duration),
        participant_ids: [currentUser.userid, obj.id],
        participant_usernames: [currentUser.username, obj.name],
        requester: currentUser.username,
        status: "valid", // "valid"|"invalid"
      });
      if (!error) {
        alert(
          `You've requested a date with ${obj.name}. Check the Schedule page for details.`
        );
      } else {
        alert("Request failed: ", error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
    setScene("");
    setDuration("");
    setStartDate("");
    setStartTime("");
  };

  const handleGenderSelect = (event) => {
    setGenderOption(event.target.value);
  };

  const applyFilter = () => {
    // filters members list
    const f = members.filter((m) => m.age >= age && m.gender === genderOption);
    if (genderOption !== "both") {
      setFilteredMembers(f);
    } else {
      setFilteredMembers(members);
    }
  };

  const playAudio = (g) => {
    const audio = g === "Male" ? new Audio(alien) : new Audio(french);
    audio.play();
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .range(from, to);

    if (error) {
      console.error(error);
      return;
    }

    setMembers((prev) => [...prev, ...data]);
    setFilteredMembers((prev) => [...prev, ...data]);

    setPage((prev) => prev + 1);
    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }
    setLoading(false);

    localStorage.setItem("members", JSON.stringify([...members, ...data]));
  };

  useEffect(() => {
    //getMembers();
    //  loadMore();
    const storedList = localStorage.getItem("members");
    if (storedList !== null) {
      // console.log(storedList);
      setFilteredMembers(JSON.parse(storedList));
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, avatar_url, age`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setCurrentUser({
            userid: user.id,
            username: data.username,
            userage: data.age,
            userimg: data.avatar_url,
          });

          // setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  // // Intersection Observer setup
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         loadMore();
  //       }
  //     },
  //     { threshold: 1 }
  //   );
  //   if (loaderRef.current) {
  //     observer.observe(loaderRef.current);
  //   }
  //   return () => {
  //     if (loaderRef.current) {
  //       observer.unobserve(loaderRef.current);
  //     }
  //   };
  // }, [loaderRef.current]);

  return (
    <div className="container">
      <div
        style={{
          width: "34px",
          height: "30px",
          background: "orange",
          alignContent: "center",

          borderRadius: "3px",
          position: "fixed",
          top: "15%",
          left: "5%",
          cursor: "pointer",
          zIndex: 30,
        }}
        className="dropdown"
      >
        <i
          className="bi bi-filter"
          id="filterDrop"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></i>
        <ul className="dropdown-menu p-2 bg-gray" aria-labelledby="filterDrop">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sexRadio"
              id="males"
              value="Male"
              checked={genderOption === "Male"}
              onChange={handleGenderSelect}
            />
            <label
              className="form-check-label"
              htmlFor="males"
              style={{ fontSize: "14px" }}
            >
              Males only
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sexRadio"
              id="females"
              value="Female"
              checked={genderOption === "Female"}
              onChange={handleGenderSelect}
            />
            <label
              className="form-check-label"
              htmlFor="females"
              style={{ fontSize: "14px" }}
            >
              Females only
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="sexRadio"
              id="both"
              value="both"
              checked={genderOption === "both"}
              onChange={handleGenderSelect}
            />
            <label
              className="form-check-label"
              htmlFor="both"
              style={{ fontSize: "14px" }}
            >
              All
            </label>
          </div>
          <hr />
          <div>
            <label
              htmlFor="ageRange"
              className="form-label p-1"
              style={{ fontSize: "14px" }}
            >
              See only {age} & above
            </label>
            <input
              type="range"
              value={age}
              disabled={genderOption === "both"}
              className="form-range"
              min="18"
              max="100"
              id="ageRange"
              onChange={(e) => setAge(e.target.value)}
            ></input>
          </div>
          <hr />
          <button className="btn btn-outline-dark btn-sm" onClick={applyFilter}>
            Apply
          </button>
        </ul>
      </div>
      <div className="grid">
        {/* {Array.from({ length: 20 }, (_, index) => (

        ))} */}
        {filteredMembers.length > 0 ? (
          filteredMembers.map((m, i) => (
            <div key={i}>
              <div className="user-card text-center" key={m.id}>
                <div className="avatar">
                  <img
                    src={
                      m.avatar_url ??
                      "https://ionicframework.com/docs/img/demos/avatar.svg"
                    }
                    alt={m.username ? m.username : "member"}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title fs-6">
                    {m.username}{" "}
                    <span style={{ fontSize: "10px", color: "gray" }}>
                      ({m.gender})
                    </span>{" "}
                    <span style={{ cursor: "pointer" }}>
                      <i
                        className="bi bi-volume-up-fill"
                        onClick={() => playAudio(m.gender)}
                      ></i>
                    </span>
                  </h5>
                  <p className="card-text" style={{ fontSize: "12px" }}>
                    {m.fun_fact
                      ? m.fun_fact
                      : `Some quick example text to build on the card title and make up
                the bulk of the card's content.`}
                  </p>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#reqModal"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() =>
                      injectToModal(
                        m.id,
                        m.username,
                        m.avatar_url,
                        m.fun_fact,
                        m.gender,
                        m.status,
                        m.age,
                        m.available_days
                      )
                    }
                  >
                    Schedule date
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <div className="user-card text-center">
              <div className="avatar">
                <img
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                  alt="member"
                />
              </div>
              <div className="card-body">
                <h5 className="card-title fs-6">
                  Username{" "}
                  <span style={{ fontSize: "10px", color: "gray" }}>
                    (Gender)
                  </span>{" "}
                  <span style={{ cursor: "pointer" }}>
                    <i className="bi bi-volume-up-fill" disabled></i>
                  </span>
                </h5>
                <p className="card-text" style={{ fontSize: "12px" }}>
                  Members remain anonymous to each other, unless they decide
                  otherwise. Only usernames, voices, and avatars are showed on
                  the Members' lobby.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  disabled
                >
                  Schedule date
                </button>
              </div>
            </div>
          </div>
        )}

        {/*{hasMore && (
          <div ref={loaderRef} style={{ height: "50px" }}>
            {loading && <p>Loading...</p>}
          </div>
        )}*/}
      </div>
      {hasMore && (
        <button
          className="btn btn-outline-dark fixed-bottom"
          onClick={loadMore}
          disabled={loading}
          style={{ maxWidth: "120px", margin: "0 auto" }}
        >
          {loading ? "Loading.." : "Load more"}
        </button>
      )}
      {/* <!-- Vertically centered scrollable modal --> */}
      <div
        className="modal fade"
        id="reqModal"
        tabIndex="-1"
        aria-labelledby="reqModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="reqModalLabel">
                Schedule a date with {obj.name}{" "}
                <span className="text-muted" style={{ fontSize: "12px" }}>
                  ({obj.gender})
                </span>
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <img
                src={
                  obj.image
                    ? obj.image
                    : "https://ionicframework.com/docs/img/demos/avatar.svg"
                }
                alt={obj.name}
                width={"100"}
                height={"100"}
              />
              <br />
              <span style={{ color: "gray", fontSize: "14px" }}>
                {obj.status}
              </span>
              <br />
              <label htmlFor="VN">Hear {obj.name}'s voice</label>
              <div style={{ textAlign: "center" }} id="VN">
                <audio controls>
                  <source src="your-audio-file.mp3" type="audio/mpeg" />
                  Your browser does not support playing audio.
                </audio>
              </div>

              <span className="fst-italic fs-6">{obj.fact}</span>

              <h6 className="mt-4">Book a scene, duration, day & time</h6>

              <select
                className="form-select"
                aria-label="Default select example"
                id="sceneSelect"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
              >
                <option value="">Choose a scene</option>

                <option value="haunted_interior">Haunted Interior</option>
                <option value="white_court">Cordelia Park</option>
                <option value="flat_land1">Flat Land One</option>
                <option value="pools_gardens">Pools Gardens</option>
                <option value="building_site">Building Site</option>
              </select>

              <br />

              <label htmlFor="durationDiv">Select a duration</label>
              <br />
              <div id="durationDiv">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="5"
                    value={5}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="5">
                    5 minutes
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="10"
                    value={10}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="10">
                    10 minutes
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="15"
                    value={15}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="15">
                    15 minutes
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="20"
                    value={20}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled
                  />
                  <label className="form-check-label" htmlFor="20">
                    20 minutes
                  </label>
                </div>
              </div>

              <br />
              <div>
                <label>{obj.name}'s available days this month</label>
                <br />
                <span
                  className="fst-italic text-muted"
                  style={{ fontSize: "12px" }}
                >
                  Click purple highlight to select/deselect
                </span>
                <div>
                  <CustomCalendar
                    dates={obj.available || highlitDates}
                    onDataChange={handleSetStartDate}
                  />
                </div>
                <br />
                <label>Select a time</label>
                <br />

                <input
                  type={"time"}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <br />
              <button
                className="btn btn-outline-dark"
                onClick={handleSelectionChange}
              >
                {submitting ? "Wait.." : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
