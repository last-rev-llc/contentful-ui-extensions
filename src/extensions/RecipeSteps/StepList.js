import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getStepsTable } from './helpers';
import { openDialog } from './dialogs';
import { getIconButton } from '../../shared/helpers';

const StepList = ({ sdk }) => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if(sdk.field.getValue()) {
      setSteps(sdk.field.getValue());
    }
  }, [sdk.field]);

  const addStep = (step) => {
    if (step) {
      const updatedSteps = [ ...steps ];
      updatedSteps.push(step);
      sdk.field.setValue(updatedSteps);
      setSteps(updatedSteps);
    }
  };

  const openAddModal = async () => {
    const result = await openDialog(sdk, 'Add Step');
    addStep(result);
  };

  const editStep = (step, stepIndex) => {
    const updatedSteps = [ ...steps ];
    if (step && updatedSteps[stepIndex]) {
      updatedSteps[stepIndex] = step;
      sdk.field.setValue(updatedSteps);
      setSteps(updatedSteps);
    }
  };

  const openEditModal = async (stepIndex) => {
    const result = await openDialog(sdk, 'Edit Step', { step: steps[stepIndex] });
    editStep(result, stepIndex);
  };

  const deleteStep = (stepIndex) => {
    if (stepIndex > -1) {
      const updatedSteps = steps.filter((step, i) => i !== stepIndex);
      sdk.field.setValue(updatedSteps);
      setSteps(updatedSteps);
    }
  };

  return (
    <>
      {getStepsTable(steps, openEditModal, deleteStep)}
      <div id='add-table-row-wrap'>
        {getIconButton('Click to add a new row', 'positive', 'PlusCircle', 'large', openAddModal)}
      </div>
    </>
  );
  
};

StepList.propTypes = {
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

export default StepList;

