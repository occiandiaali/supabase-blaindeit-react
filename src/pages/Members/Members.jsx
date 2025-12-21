import { useEffect, useState } from "react";
import fakeUsers from "../../data/fakeUsers";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import CustomCalendar from "../../components/CustomCalendar";
import addMinutes from "../../helpers/addMinutes";
import createSecureRandomString from "../../helpers/createSecureRandomString";

import { supabase } from "../../supabaseClient";

import "./Members.css";
import alien from "../../assets/audio/alien-voice.mp3";
import french from "../../assets/audio/french-female-voice.mp3";

export default function Members({ session }) {
  const [loading, setLoading] = useState(true);
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
  const [filteredMembers, setFilteredMembers] = useState([]);
  // const highlitDates = [
  //   new Date(2025, 11, 14),
  //   new Date(2025, 11, 15),
  //   new Date(2025, 11, 16),
  //   new Date(2025, 11, 19),
  //   new Date(2025, 11, 24),
  // ];

  // dummy dates for fakeUsers
  const highlitDates = [
    "2025-12-14",
    "2025-12-15",
    "2025-12-16",
    "2025-12-19",
    "2025-12-24",
  ];

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
    // setObj((prevObj) => ({
    //   ...prevObj,
    //   name: n,
    //   image: i,
    //   fact: f,
    //   gender: g,
    //   status: s,
    // }));
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
    // const newBooking = {
    //   room_id: roomID,
    //   // me: currentUser.username,
    //   // guest: obj.name,
    //   scene_type: scene,
    //   time_limit: duration,
    //   start_date: startDate,
    //   start_time: startTime,
    //   end_time: addMinutes(startTime, +duration),
    //   participant_ids: [currentUser.userid, obj.id],
    //   participant_usernames: [currentUser.username, obj.name],
    //   requester: currentUser.username,
    //   status: "valid", // "valid"|"invalid"
    // };
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

    //  console.log("Booked: ", newBooking);
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
    // console.log(`Filtered -> Age:${age} & ${genderOption}`);
    const f = members.filter((m) => m.age >= age && m.gender === genderOption);
    if (genderOption !== "both") {
      setFilteredMembers(f);
    } else {
      setFilteredMembers(members);
    }
    // console.log(f);
  };

  const playAudio = (g) => {
    const audio = g === "Male" ? new Audio(alien) : new Audio(french);
    audio.play();
  };

  useEffect(() => {
    async function getMembers() {
      setLoading(true);

      const { data, error } = await supabase.from("profiles").select();

      if (error) throw error.message;
      if (data) {
        // console.log(data);

        setMembers(fakeUsers.concat(data));
        //  console.log(members);
        setFilteredMembers(fakeUsers.concat(data));
      }

      setLoading(false);
    }

    try {
      getMembers();
    } catch (error) {
      console.error(error);
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
              {loading ? (
                <div
                  className="user-card text-center"
                  style={{ background: "lightgray" }}
                  key={m.id}
                >
                  <h2>Loading..</h2>
                </div>
              ) : (
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
                      See more
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "20vh", marginLeft: "20%" }}
          >
            <h5>No Members Found</h5>
          </div>
        )}
      </div>
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
                Schedule a date with {obj.name} ({obj.gender})
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
                <div style={{ marginLeft: "5%" }}>
                  {/* <Calendar
                    onChange={setDate}
                    value={date}
                    tileClassName={({ date, view }) => {
                      if (
                        highlitDates.find(
                          (d) => d.toDateString() === date.toDateString()
                        )
                      ) {
                        return "highlight";
                      }
                    }}
                  /> */}
                  <CustomCalendar
                    dates={obj.available || highlitDates}
                    onDataChange={handleSetStartDate}
                  />
                </div>
                <br />
                <label>Select a time</label>
                <br />
                {/* <input
                  type={"datetime-local"}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                /> */}
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
