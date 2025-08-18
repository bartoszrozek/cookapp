import React, { useEffect } from "react";
import "../App.scss";
import ScheduleTable from "../components/ScheduleTable";
import type { ModalDataType } from "../types/Schedule.types";
import type { Recipe } from "../types/apiTypes";
import AddScheduleDishModal from "../components/modals/AddScheduleDishModal";
import { fetchRecipes, addScheduleDish, deleteScheduleDish } from "../api";
import RecipeInstructionsModal from "../components/modals/RecipeInstructionsModal";


const Schedule: React.FC = () => {
  const [week, setWeek] = React.useState(0); // 0 = current week
  const [modalOpen, setModalOpen] = React.useState("none");
  const [modalData, setModalData] = React.useState<ModalDataType | null>(null);
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);
  const [recipes, setRecipes] = React.useState<any[]>([]);

  const modalInstructionsOpen = modalOpen === "instructions";

  useEffect(() => {
    fetchRecipes()
      .then((data) => {
        setRecipes(data);
      })
  }, []);

  // Callback for adding a dish
  const handleAddDish = (recipeId: number, date: string, mealTypeId: number) => {
    const scheduleItem = {
      recipe_id: recipeId,
      user_id: 1,
      date,
      meal_type: mealTypeId
    };
    console.log("Adding dish to schedule:", scheduleItem);
    addScheduleDish(scheduleItem)
      .then(() => {
        setModalOpen("none");
        setModalData(null);
        fetchRecipes().then((data) => setRecipes(data));
      })
      .catch((e) => console.error("Failed to add dish to schedule:", e));
  };

  const handleDeleteDish = (scheduleId: number) => {
    if (!window.confirm("Are you sure you want to delete this dish from schedule?")) return;
    // Call API to delete dish from schedule
    deleteScheduleDish(scheduleId)
      .then(() => {
        fetchRecipes().then((data) => setRecipes(data));
      })
      .catch((e) => console.error("Failed to delete dish from schedule:", e));
  };

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
      <div className="tab-modal-container">
        <div className="tab-content">
          <ScheduleTable
            weekStart={monday}
            weekEnd={sunday}
            setModalOpen={setModalOpen}
            setModalData={setModalData}
            handleDeleteDish={handleDeleteDish}
            setSelectedRecipe={setSelectedRecipe}
          />
          <div className="button-group">
            <button onClick={handlePrevWeek}>Previous Week</button>
            <button onClick={handleNextWeek}>Next Week</button>
          </div>
        </div>
        <AddScheduleDishModal open={modalOpen === "addDishToSchedule"}
          onClose={() => setModalOpen("none")}
          onSubmit={(recipe_id) => handleAddDish(recipe_id, modalData!.date, modalData!.mealTypeId)}
          date={modalData?.date}
          mealTypeId={modalData?.mealTypeId}
          recipes={recipes}>
        </AddScheduleDishModal>
        <RecipeInstructionsModal
          open={modalInstructionsOpen && !!selectedRecipe}
          onClose={() => setModalOpen("none")}
          recipe={selectedRecipe}
        />
      </div>
    </>
  );
};

export default Schedule;
