import PropTypes from "prop-types";

const SDKPropTypes = {
  field: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
  }),
  location: PropTypes.shape({
    is: PropTypes.func.isRequired,
  }),
  dialogs: PropTypes.shape({
    openExtension: PropTypes.func.isRequired,
  }),
};

export default SDKPropTypes;
