import React, { useState, useEffect } from 'react';
import '../App.scss';
import ShoppingListTable from '../components/ShoppingListTable';
import { fetchShoppingList } from '../api';
import type { Recipe, ShoppingListItem } from '../types/apiTypes';
import type { FridgeForm } from '../types/Ingredients.types';
import AddToFridgeModal from '../components/modals/AddToFridgeModal';
import Ingredients from './Ingredients';

const ShoppingList: React.FC = () => {
 const items: any[] = [];
 const [selectedIngredient, setSelectedIngredient] = useState<ShoppingListItem>([]);
 const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>([]);
 const [modalOpen, setModalOpen] = useState('none');
 const [startDate, setStartDate] = useState(() =>
  new Date().toISOString().slice(0, 10),
 );
 const [endDate, setEndDate] = useState(() => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
 });
 const [fridgeForm, setFridgeForm] = useState<FridgeForm>({
  quantity: '',
  unit: '',
  expiration_date: '',
 });

 const fridgeModalOpen = modalOpen == 'fridge';

 useEffect(() => {
  fetchShoppingList(startDate, endDate)
   .then((data) => {
    setShoppingItems(data);
   })
   .catch((e) => console.error('Failed to fetch schedule:', e));
 }, [startDate, endDate]);

 const openFridgeModal = (ingredient: any) => {
  setSelectedIngredient(ingredient);
  setModalOpen('fridge');
 };

 return (
  <>
   <h2>Shopping List</h2>
   <div className='tab-modal-container'>
    <div className='tab-content'>
     <div className='button-group'>
      <div></div>
      <div className='ingredient-row'>
       <label>Filter by shopping period:</label>
       <div>
      <input
       name='shopping_start'
       placeholder='Start Date (YYYY-MM-DD)'
       type='date'
       value={startDate}
       onChange={(e) => setStartDate(e.target.value)}
       required
      />
      <input
       name='shopping_end'
       placeholder='End Date (YYYY-MM-DD)'
       type='date'
       value={endDate}
       onChange={(e) => setEndDate(e.target.value)}
       required
      />
       </div>
      </div>
     </div>
     {shoppingItems.length === 0 ? (
      <div>No items in shopping list.</div>
     ) : (
      <ShoppingListTable
       items={shoppingItems}
       onAddToFridge={openFridgeModal}
      />
     )}
    </div>
    <AddToFridgeModal
        open={fridgeModalOpen && !!selectedIngredient}
        onClose={() => setModalOpen("none")}
        ingredient={{id: selectedIngredient.id,
          name: selectedIngredient.ingredient_name,
          default_unit: selectedIngredient.unit,
        }}
        defaultQuantity={selectedIngredient.quantity}
        defaultUnit={selectedIngredient.unit}
      />
   </div>
  </>
 );
};

export default ShoppingList;
