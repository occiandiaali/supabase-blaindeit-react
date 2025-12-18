import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

import "./Schedule.css";

export default function Schedule() {
  const [loading, setLoading] = useState(false);
  const [thisUserID, setThisUserID] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const [scene, setScene] = useState(null);
  const [roomid, setRoomid] = useState(null);
  const [limit, setLimit] = useState(null);
  const [usernames, setUsernames] = useState(null);

  const injectToFrame = (s, r, l, u) => {
    setScene(s);
    setRoomid(r);
    setLimit(l);
    setUsernames(u);
  };

  const getCurrentUserID = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // console.log("Schedule for: ", user);
    let userid = user?.id;
    return userid;
  };

  const getUserSchedule = async () => {
    getCurrentUserID()
      .then((u) => {
        setThisUserID(u);
      })
      .catch((e) => console.error(e));

    try {
      setLoading(true);

      const { data, error: scheduleFetchErr } = await supabase
        .from("meetings")
        .select("*")
        .order("id", { ascending: false })
        .contains("participant_ids", [thisUserID]);

      if (scheduleFetchErr) {
        alert(`Failed to fetch Schedule: ${scheduleFetchErr.message}`);
        return;
      }

      setSchedule(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id) => {
    try {
      if (confirm("Are you sure you want to delete this?")) {
        supabase
          .from("meetings")
          .delete()
          .eq("id", id)
          .then(() => {
            alert("Successfully deleted.");
            window.location.reload();
          })
          .catch((e) => console.error(e));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserSchedule();
  }, []);

  const currentDate = new Date(); // test strikethrough

  return (
    <div>
      <ul className="list-group">
        {/* {loading && (
          <p className="card-text placeholder-glow">
            <span className="placeholder col-12"></span>
            <span className="placeholder col-12"></span>
            <span className="placeholder col-12"></span>
          </p>
        )} */}
        {schedule.length > 0 ? (
          schedule.map((s) => (
            <li
              key={s.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                textDecoration:
                  s.start_date < currentDate.toISOString().slice(0, 10)
                    ? "line-through"
                    : "none",
              }}
            >
              {s.participant_usernames.join(" & ")} on {s.start_date} for{" "}
              {s.time_limit} mins from {s.start_time}
              <div className="p-2">
                <span style={{ fontSize: "12px", color: "gray" }}>RoomID</span>
                <span className="badge bg-primary rounded-pill m-2">
                  {s.room_id}
                </span>
                <button
                  type="button"
                  className="btn btn-success btn-sm m-1"
                  data-bs-toggle="modal"
                  data-bs-target="#iframeModal"
                  onClick={() =>
                    injectToFrame(
                      s.scene_type,
                      s.room_id,
                      s.time_limit,
                      s.participant_usernames
                    )
                  }
                  disabled={
                    s.start_date < currentDate.toISOString().slice(0, 10)
                  }
                >
                  Join
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm m-1"
                  onClick={() => removeItem(s.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        ) : (
          <h2 className="fs-6">No Schedule found.</h2>
        )}
      </ul>
      {/**Fullscreen modal */}
      <div
        className="modal fade"
        id="iframeModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header" style={{ opacity: 0.5 }}>
              {/* <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5> */}
              <button
                type="button"
                className="btn-close btn-outline-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ opacity: 1 }}
                onClick={() => window.location.reload()}
              ></button>
            </div>
            <div className="modal-body">
              <div className="meeting-live-area">
                <iframe
                  src={
                    scene === "white_court"
                      ? `https://playcanv.as/p/ITn9wsmF/?room_id=${encodeURIComponent(
                          roomid
                        )}&duration=${encodeURIComponent(
                          limit
                        )}&participant_usernames=${encodeURIComponent(
                          usernames
                        )}`
                      : scene === "haunted_interior"
                      ? `https://playcanv.as/p/1KTW8pdN/?room_id=${encodeURIComponent(
                          roomid
                        )}&duration=${encodeURIComponent(
                          limit
                        )}&participant_usernames=${encodeURIComponent(
                          usernames
                        )}`
                      : scene === "flat_land1"
                      ? `https://bf342761-237e-4b7e-8898-1853fd304904-00-2j34a7t27gjdm.spock.replit.dev/`
                      : null
                  }
                  className="meeting-iframe"
                  allow="fullscreen; autoplay; microphone; camera;xr-spatial-tracking"
                ></iframe>
              </div>
              {/* <h5>Popover in a modal</h5>
              <p>
                This{" "}
                <a
                  href="#"
                  role="button"
                  className="btn btn-secondary popover-test"
                  title="Popover title"
                  data-bs-content="Popover body content is set in this attribute."
                >
                  button
                </a>{" "}
                triggers a popover on click.
              </p>
              <hr />
              <h5>Tooltips in a modal</h5>
              <p>
                <a
                  href="#"
                  className="tooltip-test"
                  title="The countdown timer for this session"
                >
                  This link
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="tooltip-test"
                  title="The room ID for the scene"
                >
                  that link
                </a>{" "}
                have tooltips on hover.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
