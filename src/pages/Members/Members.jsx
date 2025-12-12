import { useState } from "react";
import fakeUsers from "../../data/fakeUsers";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "./Members.css";

export default function Members() {
  const [scene, setScene] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [members, setMembers] = useState([]);
  const [date, setDate] = useState(new Date());
  const highlitDates = [
    new Date(2025, 11, 14),
    new Date(2025, 11, 15),
    new Date(2025, 11, 16),
    new Date(2025, 11, 19),
    new Date(2025, 11, 24),
  ];

  const [obj, setObj] = useState({
    name: "",
    image: "",
    fact: "",
    gender: "",
    status: "",
  });

  const injectToModal = (n, i, f, g, s) => {
    // setObj((prevObj) => ({
    //   ...prevObj,
    //   name: n,
    //   image: i,
    //   fact: f,
    //   gender: g,
    //   status: s,
    // }));
    setObj({
      name: n,
      image: i,
      fact: f,
      gender: g,
      status: s,
    });
  };

  const handleSelectionChange = () => {
    // let date = new Date(startDate);
    // date.setMinutes(date.getMinutes() + duration);
    // let updated = date.toISOString().substr(11, 8);

    const newBooking = {
      guest: obj.name,
      sceneType: scene,
      timeLimit: duration,
      startDate: date,
      startTime,
      // startTime: new Date(startDate).toLocaleTimeString("en-NG"),
      // endTime: updated,
    };
    console.log("Booked: ", newBooking);
    setScene("");
    setDuration("");
    setStartDate("");
    setStartTime("");
  };

  return (
    <div className="container">
      <div className="grid">
        {/* {Array.from({ length: 20 }, (_, index) => (

        ))} */}
        {fakeUsers ? (
          fakeUsers.map((m) => (
            <div
              className="user-card text-center"
              style={{ background: "lightgray" }}
              key={m.id}
            >
              <div className="avatar">
                <img
                  src={
                    m.avatar_url ??
                    "https://ionicframework.com/docs/img/demos/avatar.svg"
                  }
                  alt={m.username ? m.username : "member"}
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title fs-6">
                  {m.username}{" "}
                  <span style={{ fontSize: "10px", color: "gray" }}>
                    ({m.gender})
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
                  className="btn btn-outline-dark"
                  onClick={() =>
                    injectToModal(
                      m.username,
                      m.avatar_url,
                      m.fun_fact,
                      m.gender,
                      m.status
                    )
                  }
                >
                  Request date
                </button>
              </div>
            </div>
          ))
        ) : (
          <h5>No Members Found</h5>
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
              <h5 className="modal-title" id="reqModalLabel">
                Schedule a date with {obj.name} ({obj.gender})
              </h5>
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
              <div style={{ textAlign: "center" }}>
                <audio id="VN" controls>
                  <source src="your-audio-file.mp3" type="audio/mpeg" />
                  Your browser does not support playing audio.
                </audio>
              </div>

              <span className="fst-italic fs-6">{obj.fact}</span>
              <br />

              <select
                className="form-select"
                aria-label="Default select example"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
              >
                <option value="">Choose a scene</option>

                <option value="Scene One">Scene One</option>
                <option value="Scene Two">Scene Two</option>
                <option value="Scene Three">Scene Three</option>
              </select>

              <br />

              <label>Select a duration</label>
              <br />
              <div>
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
                <label>Days {obj.name} is available</label>
                <div style={{ marginLeft: "15%" }}>
                  <Calendar
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
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
