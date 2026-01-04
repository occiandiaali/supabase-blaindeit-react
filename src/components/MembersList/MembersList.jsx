import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useDebounce } from "../../hooks/useDebounce";
import alien from "../../assets/audio/alien-voice.mp3";
import french from "../../assets/audio/french-female-voice.mp3";
import CustomCalendar from "../../components/CustomCalendar";
import addMinutes from "../../helpers/addMinutes";
import createSecureRandomString from "../../helpers/createSecureRandomString";

import "./MembersList.css";

const PAGE_SIZE = 4;

export default function MembersList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [gender, setGender] = useState("all");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);

  // Debounced filters
  const debouncedGender = useDebounce(gender, 400);
  const debouncedMinAge = useDebounce(minAge, 400);
  const debouncedMaxAge = useDebounce(maxAge, 400);

  const loaderRef = useRef(null);

  const [scene, setScene] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSetStartDate = (newData) => {
    setStartDate(newData);
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

  const fetchUsers = async (page, gender, minAge, maxAge) => {
    let query = await supabase
      .from("profiles")
      .select("*")
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    // if (gender !== "both") {
    //   query = query.eq("gender", gender);
    // }

    // query = query.gte("age", minAge).lte("age", maxAge);

    const { data, error } = query;
    console.log("query ", data);
    console.log(`Data Len: ${data.length} & PAGE_SIZE: ${PAGE_SIZE}`);
    if (error) {
      console.error(error);
      return;
    }

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setUsers((prev) => [...prev, ...data]);
  };

  // Reset when debounced filters change
  useEffect(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
    fetchUsers(0, debouncedGender, debouncedMinAge, debouncedMaxAge);
  }, [debouncedGender, debouncedMinAge, debouncedMaxAge]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchUsers(
            nextPage,
            debouncedGender,
            debouncedMinAge,
            debouncedMaxAge
          );
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [
    loaderRef,
    page,
    debouncedGender,
    debouncedMinAge,
    debouncedMaxAge,
    hasMore,
  ]);

  const playAudio = (g) => {
    const audio = g === "Male" ? new Audio(alien) : new Audio(french);
    audio.play();
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

  return (
    <div>
      {/* Gender filter */}
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="both">All</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      {/* Age range filter */}
      <div>
        <label>
          Min Age:
          <input
            type="number"
            value={minAge}
            min={18}
            max={100}
            onChange={(e) => setMinAge(Number(e.target.value))}
          />
        </label>
        <label>
          Max Age:
          <input
            type="number"
            value={maxAge}
            min={18}
            max={100}
            onChange={(e) => setMaxAge(Number(e.target.value))}
          />
        </label>
      </div>

      {/* <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.gender}, {user.age})
          </li>
        ))}
      </ul> */}
      <div className="grid">
        {users.map((user) => (
          <div className="user-card text-center" key={user.id}>
            <div className="avatar">
              <img
                src={
                  user.avatar_url ??
                  "https://ionicframework.com/docs/img/demos/avatar.svg"
                }
                alt={user.username ? user.username : "member"}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title fs-6">
                {user.username}{" "}
                <span style={{ fontSize: "10px", color: "gray" }}>
                  ({user.gender})
                </span>{" "}
                <span style={{ cursor: "pointer" }}>
                  <i
                    className="bi bi-volume-up-fill"
                    onClick={() => playAudio(user.gender)}
                  ></i>
                </span>
              </h5>
              <p className="card-text" style={{ fontSize: "12px" }}>
                {user.fun_fact
                  ? user.fun_fact
                  : `Some short, fun-fact to get others interested or curious.`}
              </p>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#reqModal"
                className="btn btn-outline-dark btn-sm"
                onClick={() =>
                  injectToModal(
                    user.id,
                    user.username,
                    user.avatar_url,
                    user.fun_fact,
                    user.gender,
                    user.status,
                    user.age,
                    user.available_days
                  )
                }
              >
                Schedule date
              </button>
            </div>
          </div>
        ))}
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
                    dates={obj.available}
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
      {/**modal */}

      {hasMore && <div ref={loaderRef}>Loading more...</div>}
      {!hasMore && <p>No more users</p>}
    </div>
  );
} // MembersList
