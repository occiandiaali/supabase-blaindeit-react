export default function Schedule() {
  return (
    <div>
      <ul className="list-group">
        {Array.from({ length: 5 }, (_, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            Item {index}
            <div className="p-2">
              <span className="badge bg-primary rounded-pill m-2">
                {index * 2}
              </span>
              <button
                type="button"
                className="btn btn-success btn-sm m-1"
                data-bs-toggle="modal"
                data-bs-target="#iframeModal"
              >
                Join
              </button>
              <button type="button" className="btn btn-danger btn-sm m-1">
                Cancel
              </button>
            </div>
          </li>
        ))}
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
              ></button>
            </div>
            <div className="modal-body">
              <h5>Popover in a modal</h5>
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
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
