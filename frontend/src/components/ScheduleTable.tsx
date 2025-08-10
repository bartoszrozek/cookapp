import React, { useEffect, useState } from "react";
import { fetchMealTypes, fetchSchedule } from "../api";
import { FaMinusCircle, FaPlusCircle, FaEye } from "react-icons/fa";
import DivButton from "../components/DivButton";

interface ScheduleTableProps {
  weekStart: Date;
  weekEnd: Date;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ weekStart, weekEnd }) => {

  const [schedule, setSchedule] = useState<any[]>([]);
  useEffect(() => {
    fetchSchedule(weekStart.toISOString().slice(0, 10), weekEnd.toISOString().slice(0, 10))
      .then(setSchedule)
      .catch((e) => console.error("Failed to fetch schedule:", e));
  }, [weekStart, weekEnd]);

  const [mealTypes, setMealTypes] = useState<any[]>([]);
  useEffect(() => {
    fetchMealTypes()
      .then(setMealTypes)
      .catch((e) => console.error("Failed to fetch meal types:", e));
  }, []);

  return (<table className="full-width-table">
    <thead>
      <tr>
        <th style={{ textAlign: "center" }}>Date</th>
        {mealTypes.map(mealType => (
          <th key={mealType.id} style={{ textAlign: "center" }}>{mealType.name}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {(() => {
        // Use weekStart to generate the week dates
        const weekDates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          return d.toISOString().slice(0, 10);
        });

        return weekDates.map(date => (
          <tr key={date}>
            <td>{date}</td>
            {mealTypes.map(mealType => {
              const recipe = schedule.find(item => item.date === date && item.meal_type === mealType.id);
              return (
                <td key={mealType.id}>
                  <div className={`schedule-field ${recipe ? "" : "schedule-field-center"}`}>
                    <div>{recipe ? recipe.recipe_name : ""}</div>
                    {recipe ? (
                      <div>
                        <DivButton tooltip = "See instructions"><FaEye /></DivButton>
                        <DivButton tooltip = "Delete dish"><FaMinusCircle /></DivButton>
                      </div>
                    ) : (
                      <DivButton tooltip = "Add dish"><FaPlusCircle /></DivButton>
                    )}


                  </div>
                </td>
              );
            })}
          </tr>
        ));
      })()}
    </tbody>
  </table>)
};

export default ScheduleTable;
