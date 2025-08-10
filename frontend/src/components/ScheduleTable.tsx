import React from "react";

interface ScheduleTableProps {
  schedule: any[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => (
  <table className="full-width-table">
    <thead>
      <tr>
        <th>Recipe</th>
        <th>Date</th>
        <th>Servings</th>
      </tr>
    </thead>
    <tbody>
      {schedule.map((item) => (
        <tr key={item.id}>
          <td>{item.recipe_name}</td>
          <td>{item.date}</td>
          <td>{item.servings}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ScheduleTable;
