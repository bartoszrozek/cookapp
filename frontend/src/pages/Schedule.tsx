import React from "react";
import "../App.css";
import ScheduleTable from "../components/ScheduleTable";

const Schedule: React.FC = () => {
  const [week, setWeek] = React.useState(0); // 0 = current week

  // Calculate start (Monday) and end (Sunday) dates for the week
  const getWeekRange = (weekOffset: number) => {
    const now = new Date();
    // Get current day of week (0=Sunday, 1=Monday, ...)
    const day = now.getDay();
    // Calculate how many days to subtract to get to Monday
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    // Get Monday of current week
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);
    // Get Sunday of current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { monday, sunday };
  };

  const { monday, sunday } = getWeekRange(week);
  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  const handlePrevWeek = () => setWeek((w) => w - 1);
  const handleNextWeek = () => setWeek((w) => w + 1);

  return (
    <>
      <h2>
        Schedule for week: {formatDate(monday)} – {formatDate(sunday)}
      </h2>

      <div className="tab-content">
        <ScheduleTable weekStart={monday} weekEnd={sunday} />
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={handlePrevWeek}>Previous Week</button>
          <button onClick={handleNextWeek}>Next Week</button>
        </div>
      </div>
    </>
  );
};

export default Schedule;
