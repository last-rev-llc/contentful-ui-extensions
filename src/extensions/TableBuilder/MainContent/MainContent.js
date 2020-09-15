import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@contentful/forma-36-react-components";
import SDKPropTypes from "../SDKPropTypes";

export const MainContentPropTypes = {
  sdk: PropTypes.shape(SDKPropTypes).isRequired,
};

const MainContent = ({ sdk }) => {
  const [values, setValues] = useState([]);

  const handleOpenModal = () => {
    sdk.dialogs.openExtension({
      width: "large",
      title: "TEST",
      allowHeightOverflow: true,
    });
  };

  useEffect(() => {
    if (sdk.field.getValue()) {
      let fieldValue = sdk.field.getValue();
      if (!Array.isArray(fieldValue)) {
        fieldValue = fieldValue.ingredients || [];
      }
      //   setIngredientList(fieldValue);
      setValues(fieldValue);
    }
  }, [sdk.field]);

  return (
    <div>
      <Table>
        <TableHead isSticky>
          <TableRow>
            <TableCell>Step</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </div>
  );
};

MainContent.propTypes = MainContentPropTypes;

export default MainContent;
