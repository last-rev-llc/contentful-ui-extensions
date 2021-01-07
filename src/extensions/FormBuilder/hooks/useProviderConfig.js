import { useState } from 'react';
import { merge } from 'lodash/fp';

import { URL_TYPES } from './utils';

function noop() {
  return null;
}

export default function useProviderConfig({ parameters = {}, type = 'custom' } = {}, setContentfulKey = noop) {
  const { formId = '', portalId = '' } = parameters;
  const [values, setValues] = useState({ type, formId, portalId });

  return {
    ...values,

    setType: (newType) => {
      // Save to contentful
      setContentfulKey('provider.type', newType);

      setValues((oldValues) =>
        merge(oldValues)({
          type: newType,

          // Disable the URL if this type does not support it
          formId: URL_TYPES.includes(newType) ? oldValues.formId : null,
          portalId: URL_TYPES.includes(newType) ? oldValues.portalId : null
        })
      );
    },

    setFormId: (newUrl) => {
      // Save to contentful
      setContentfulKey('provider.parameters.formId', newUrl);

      setValues((oldValues) => merge(oldValues)({ formId: newUrl }));
    },

    setPortalId: (newUrl) => {
      // Save to contentful
      setContentfulKey('provider.parameters.portalId', newUrl);

      setValues((oldValues) => merge(oldValues)({ portalId: newUrl }));
    },

    update: ({ parameters: newParameters, type: newType }) =>
      setValues({
        ...values,
        ...newParameters,
        type: newType
      })
  };
}
