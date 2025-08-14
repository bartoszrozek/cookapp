import React, { useEffect, useState } from "react";
import { fetchMealTypes, fetchSchedule, fetchRecipeById } from "../api";
import { FaMinusCircle, FaPlusCircle, FaEye } from "react-icons/fa";
import DivButton from "../components/DivButton";
import type { Schedule, ScheduleTableProps } from "../types/Schedule.types";

const ScheduleTable: React.FC<ScheduleTableProps> = ({ weekStart, weekEnd, setModalOpen, setModalData, handleDeleteDish, setSelectedRecipe }) => {

  const [schedule, setSchedule] = useState<Schedule[]>([]);
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

  const handleModal = (date: string, mealTypeId: number) => {
    setModalOpen("addDishToSchedule");
    setModalData({ date, mealTypeId });
  };

  const setRecipe = (recipe: Schedule) => {
    fetchRecipeById(recipe.recipe_id)
      .then((fullRecipe) => {
        setSelectedRecipe(fullRecipe);
        setModalOpen("instructions");
      })
      .catch((e) => console.error("Failed to fetch recipe:", e));
  }

  return (<table className="full-width-table schedule-table">
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
                      <div className="schedule-field-buttons">
                        <DivButton tooltip="See instructions" onClick={() => setRecipe(recipe)}><FaEye /></DivButton>
                        <DivButton tooltip="Delete dish" onClick={() => handleDeleteDish(recipe.id)}><FaMinusCircle /></DivButton>
                      </div>
                    ) : (
                      <DivButton tooltip="Add dish" onClick={() => handleModal(date, mealType.id)}><FaPlusCircle /></DivButton>
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
