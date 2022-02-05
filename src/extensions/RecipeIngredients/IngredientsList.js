import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getIngredientsTable } from './helpers';
import { getIconButton } from '../../shared/helpers';
import { openDialog } from './dialogs';

const IngredientsList = ({ sdk }) => {
  const [ingredientList, setIngredientList] = useState([]);

  useEffect(() => {
    if (sdk.field.getValue()) {
      let fieldValue = sdk.field.getValue();
      if (!Array.isArray(fieldValue)) {
        fieldValue = fieldValue.ingredients || [];
      }
      setIngredientList(fieldValue);
    }
  }, [sdk.field]);

  const addIngredient = (ingredient) => {
    if (ingredient) {
      const ingredients = [...ingredientList];
      ingredients.push(ingredient);
      sdk.field.setValue(ingredients);
      setIngredientList(ingredients);
    }
  };

  const openAddModal = async () => {
    const result = await openDialog(sdk, 'Add Ingredient');
    addIngredient(result);
  };

  const copyFromDefaultField = async () => {
    const defaultLocale = sdk.locales.default;
    const { _value } = sdk.entry.fields.ingredients._fieldLocales[defaultLocale];
    sdk.field.setValue(_value);
    setIngredientList(_value);
  };

  const deleteItems = () => {
    sdk.field.setValue([]);
    setIngredientList([]);
  };

  const editIngredient = (ingredient, ingredientIndex) => {
    const ingredients = [...ingredientList];
    if (ingredient && ingredients[ingredientIndex]) {
      ingredients[ingredientIndex] = ingredient;
      sdk.field.setValue(ingredients);
      setIngredientList(ingredients);
    }
  };

  const openEditModal = async (ingredientIndex) => {
    const result = await openDialog(sdk, 'Edit Ingredient', { ingredient: ingredientList[ingredientIndex] });
    editIngredient(result, ingredientIndex);
  };

  const deleteStep = (ingredientIndex) => {
    if (ingredientIndex > -1) {
      const ingredients = ingredientList.filter((ingredient, i) => i !== ingredientIndex);
      sdk.field.setValue(ingredients);
      setIngredientList(ingredients);
    }
  };

  return (
    <>
      {getIngredientsTable(ingredientList, openEditModal, deleteStep)}
      <div id="add-table-row-wrap">
        {getIconButton('Click to add a new row', 'positive', 'PlusCircle', 'large', openAddModal)}
        {ingredientList.length === 0
          ? getIconButton('Copy rows to another locale', 'positive', 'Copy', 'large', copyFromDefaultField)
          : getIconButton('Delete all rows', 'negative', 'Delete', 'large', deleteItems)}
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
    locales: PropTypes.shape({
      default: PropTypes.string
    }),
    entry: PropTypes.shape({
      fields: PropTypes.shape({
        ingredients: PropTypes.shape({
          _fieldLocales: PropTypes.shape()
        })
      })
    })
  }).isRequired
};

export default IngredientsList;
