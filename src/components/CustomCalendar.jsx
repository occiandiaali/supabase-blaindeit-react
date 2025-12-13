import { useState } from "react";

const CustomCalendar = ({ dates, onDataChange }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const [selected, setSelected] = useState(null);
  const [set, setSet] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const highlighted = new Set(dates);

  const formatDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const toggleSelection = (str) => {
    setSet((prev) => !prev);
    if (set) {
      onDataChange(str);
      setSelected(str);
    } else {
      onDataChange(null);
      setSelected(null);
    }
    //  set ? setSelected(str) : setSelected(null);
  };

  return (
    <div>
      {/* Weekday headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "8px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ textAlign: "center", fontWeight: "bold" }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={idx} />; // empty cell
          }

          const dateStr = formatDate(year, month, day);
          const isHighlighted = highlighted.has(dateStr);
          const isSelected = selected === dateStr;

          // Figure out weekday (0 = Sunday, 6 = Saturday)
          const weekday = new Date(year, month, day).getDay();
          const isWeekend = weekday === 0 || weekday === 6;

          return (
            <div
              key={day}
              onClick={() => toggleSelection(dateStr)}
              style={{
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                border: "1px solid #ccc",
                backgroundColor: isSelected
                  ? "orange"
                  : isHighlighted
                  ? "lightblue"
                  : isWeekend
                  ? "#cac7c7ff" // gray for weekends
                  : "white",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* {selected && (
        <p style={{ marginTop: "10px" }}>
          Selected date: <strong>{selected}</strong>
        </p>
      )} */}
      {selected !== null ? (
        <p style={{ marginTop: "10px" }}>
          Selected date: <strong>{selected}</strong>
        </p>
      ) : null}
    </div>
  );
};

export default CustomCalendar;
