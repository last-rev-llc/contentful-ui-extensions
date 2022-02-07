/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getStepsTable } from './helpers';
import { getIconButton, openDialog } from '../../shared/helpers';

const StepList = ({ sdk }) => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (sdk.field.getValue()) {
      setSteps(sdk.field.getValue());
    }
  }, [sdk.field]);

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

  const copyFromDefaultField = async () => {
    const defaultLocale = sdk.locales.default;
    const { _value } = sdk.entry.fields.steps._fieldLocales[defaultLocale];
    sdk.field.setValue(_value);
    setSteps(_value);
  };

  const deleteItems = () => {
    sdk.dialogs
      .openConfirm({
        title: ' Delete Recipie Steps',
        message: 'Are you sure you want to delete all of these steps? This can not be undone',
        intent: 'positive',
        confirmLabel: 'Yes, Delete',
        cancelLabel: 'No'
      })
      .then((result) => {
        if (result) {
          sdk.field.setValue([]);
          setSteps([]);
        }
      });
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

  const openBulkEditModal = async () => {
    const result = await openDialog(sdk, 'Bulk Edit Steps', { rows: steps, dialogType: 'bulk-edit' }, 'fullWidth');
    if (result && result.length > 0) {
      sdk.field.setValue(result);
      setSteps(result);
    }
  };

  const getBulkEditButton = () => {
    if (steps.length > 0) {
      return getIconButton('Click to add a new row', 'positive', 'Edit', 'large', openBulkEditModal);
    }
  };

  const getDeleteButton = () => {
    if (steps.length > 0) {
      return getIconButton('Delete all rows', 'negative', 'Delete', 'large', deleteItems);
    }
  };

  const getCopyButton = () => {
    if (steps.length === 0 && sdk.field.locale !== sdk.locales.default) {
      return getIconButton('Copy rows to another locale', 'positive', 'Copy', 'large', copyFromDefaultField);
    }
  };

  return (
    <>
      {getStepsTable(steps, openEditModal, deleteStep)}
      <div id="add-table-row-wrap">
        {getIconButton('Click to add a new row', 'positive', 'PlusCircle', 'large', openAddModal)}
        {getBulkEditButton()}
        {getCopyButton()}
        {getDeleteButton()}
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
      openExtension: PropTypes.func.isRequired,
      openConfirm: PropTypes.func.isRequired
    }),
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
      locale: PropTypes.string.isRequired
    }),
    locales: PropTypes.shape({
      default: PropTypes.string
    }),
    entry: PropTypes.shape({
      fields: PropTypes.shape({
        steps: PropTypes.shape({
          _fieldLocales: PropTypes.shape()
        })
      })
    })
  }).isRequired
};

export default StepList;
