import React from "react";
import "../App.css";
import ScheduleTable from "../components/ScheduleTable";

const Schedule: React.FC = () => {
  const schedule: any[] = [];
  return (
    <>
      <h2>Schedule for this week</h2>
      <div className="tab-content">
        {schedule.length === 0 ? <div>No schedule items.</div> : <ScheduleTable schedule={schedule} />}
      </div>
    </>
  );
};

export default Schedule;
