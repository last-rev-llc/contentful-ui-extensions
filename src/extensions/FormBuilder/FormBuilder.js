import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import arrayMove from "array-move";
import CreateForm from "./CreateForm";
import SetupForm from "./SetupForm";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import SetupStep from "./SetupStep";
import "./FormBuilder.scss";

const FormBuilder = () => {
  const [values, setValues] = useState({
    name: "",
    type: "custom",
    steps: [
      {
        id: uuidv4(),
        title: "Step 1",
        fields: [
          { id: uuidv4(), title: "Field 1" },
          { id: uuidv4(), title: "Field 2" },
        ],
      },
      { id: uuidv4(), title: "Step 2", fields: [] },
    ],
  });
  const [removeStep, setRemoveStep] = useState();
  const [setupStep, setSetupStep] = useState();

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddStep = () => {
    setValues((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: uuidv4(),
          title: `New Step ${prev.steps.length + 1}`,
          fields: [],
        },
      ],
    }));
  };

  const handleOpenConfirmRemoveStep = (step) => () => setRemoveStep(step);

  const handleCancelRemoveStep = () => setRemoveStep();

  const handleRemoveStep = () => {
    if (removeStep) {
      setValues((prev) => ({
        ...prev,
        steps: prev.steps.filter((o) => o.id !== removeStep.id),
      }));
      handleCancelRemoveStep();
    }
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setValues((prev) => ({
      ...prev,
      steps: arrayMove(prev.steps, oldIndex, newIndex),
    }));
  };

  const handleOpenSetupStep = (step) => () => setSetupStep(step);

  const handleCloseSetupStep = () => setSetupStep();

  const handleStepSubmit = (step) => {
    console.log(step);
  };

  const handleSubmit = () => {};

  return (
    <div>
      <CreateForm
        type={values.type}
        name={values.name}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <SetupForm
        steps={values.steps}
        onAddStep={handleAddStep}
        onRemoveStep={handleOpenConfirmRemoveStep}
        onEditStep={handleOpenSetupStep}
        onSortEnd={handleSortEnd}
      />
      <ConfirmDeleteDialog
        item={removeStep}
        onClose={handleCancelRemoveStep}
        onSubmit={handleRemoveStep}
      />
      <SetupStep
        step={setupStep}
        onClose={handleCloseSetupStep}
        onSubmit={handleStepSubmit}
      />
    </div>
  );
};

export default FormBuilder;
