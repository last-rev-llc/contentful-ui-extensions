import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getIconButton, getIngredientsTable } from './helpers/index';
import { openDialog } from './dialogs/index';


const IngredientsList = ({ sdk }) => {
  const [ingredientList, setIngredientList] = useState({ ingredients: [] });

  useEffect(() => {
    if(sdk.field.getValue()) {
      setIngredientList(sdk.field.getValue());
    }
  }, [sdk.field]);

  const addIngredient = (ingredient) => {
    if (ingredient) {
      const ingredients = [ ...ingredientList.ingredients ];
      ingredients.push(ingredient);
      sdk.field.setValue({ ingredients });
      setIngredientList({ ingredients });
    }
  };

  const openAddModal = async () => {
    const result = await openDialog(sdk, 'Add Ingredient');
    addIngredient(result);
  };

  const editIngredient = (ingredient, ingredientIndex) => {
    const ingredients = [ ...ingredientList.ingredients ];
    if (ingredient && ingredients[ingredientIndex]) {
      ingredients[ingredientIndex] = ingredient;
      sdk.field.setValue({ ingredients });
      setIngredientList({ ingredients });
    }
  };

  const openEditModal = async (ingredientIndex) => {
    const result = await openDialog(sdk, 'Edit Ingredient', { ingredient: ingredientList.ingredients[ingredientIndex] });
    editIngredient(result, ingredientIndex);
  };

  const deleteStep = (ingredientIndex) => {
    if (ingredientIndex > -1) {
      const ingredients = ingredientList.ingredients.filter((ingredient, i) => i !== ingredientIndex);
      sdk.field.setValue({ ingredients });
      setIngredientList({ ingredients });
    }
  };

  return (
    <>
      {getIngredientsTable(ingredientList.ingredients, openEditModal, deleteStep)}
      <div id='add-table-row-wrap'>
        {getIconButton('Click to add a new row', 'positive', 'PlusCircle', 'large', openAddModal)}
      </div>
    </>
  );
  
};

IngredientsList.propTypes = {
  sdk: PropTypes.shape({
    window: PropTypes.shape({
      updateHeight: PropTypes.func.isRequired
    }),
    dialogs: PropTypes.shape({
      openExtension: PropTypes.func.isRequired
    }),
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default IngredientsList;

