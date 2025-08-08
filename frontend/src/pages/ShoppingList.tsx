import React from "react";
import "../App.css";
import ShoppingListTable from "../components/ShoppingListTable";

const ShoppingList: React.FC = () => {
  const items: any[] = [];
  return (
    <>
      <h2>Shopping List</h2>
      <div className="tab-content">
        {items.length === 0 ? <div>No items in shopping list.</div> : <ShoppingListTable items={items} />}
      </div>
    </>
  );
};

export default ShoppingList;
