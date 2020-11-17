import React, { useState, useEffect } from 'react';
import { merge, pickBy } from 'lodash/fp';
import PropTypes from 'prop-types';
import { StepsTable } from './helpers';
import { openDialog } from './dialogs';
import { getIconButton } from '../../shared/helpers';

const removeEmptyKeys = pickBy((value) => [undefined, null, false].includes(value) === false);

const StepList = ({ sdk }) => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (sdk.field.getValue()) {
      setSteps(sdk.field.getValue());
    }
  }, [sdk.field]);

  const colAdd = (name) => {
    const updatedSteps = steps.map((step) => removeEmptyKeys(merge({ [name]: '' }, step)));
    sdk.field.setValue(updatedSteps);
    setSteps(updatedSteps);
  };

  const colRemove = (name) => {
    const updatedSteps = steps.map((step) => removeEmptyKeys(merge(step, { [name]: null })));
    sdk.field.setValue(updatedSteps);
    setSteps(updatedSteps);
  };

  const addStep = (step) => {
    if (step) {
      const updatedSteps = [...steps];
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
    const updatedSteps = [...steps];
    if (step && updatedSteps[stepIndex]) {
      updatedSteps[stepIndex] = step;
      sdk.field.setValue(updatedSteps);
      setSteps(updatedSteps);
    }
  };

  const openEditModal = async (stepIndex) => {
    const stepToEdit = steps[stepIndex];
    const stepNumber = steps[stepIndex] && steps[stepIndex].step;
    if (stepToEdit) {
      stepToEdit.step = stepNumber && stepNumber.toString();
    }
    const result = await openDialog(sdk, 'Edit Step', { step: stepToEdit });
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
      <StepsTable steps={steps} colRemove={colRemove} colAdd={colAdd} edit={openEditModal} remove={deleteStep} />
      <div id="add-table-row-wrap">
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
    })
  }).isRequired
};

export default StepList;
