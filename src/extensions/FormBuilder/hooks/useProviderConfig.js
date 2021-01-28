import { useState } from 'react';
import { merge } from 'lodash/fp';

import { URL_TYPES } from './utils';

/**
 * Provider configuration holds the remote endpoint for the form
 * currently this is mostly hubspot, but in future the idea is to add
 * different provider configurations here.
 *
 * By passing in the initial provider configuration we get a set of functions
 * which can be used to update that (and callback to contentful)

 * * onChange should be a function which takes a string<key> and a <value>
 * onChange('some.maybe.deep.key', someValue)
 * */
export default function useProviderConfig(onChangeField, { provider = {} } = {}) {
  const { parameters = {}, type = 'custom' } = provider;
  const { formId = '', portalId = '', url = '' } = parameters;

  const [values, setValues] = useState({ type, formId, portalId, url });

  return {
    ...values,

    setType: (newType) => {
      // Save to contentful
      onChangeField('provider.type', newType);

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
      onChangeField('provider.parameters.formId', newUrl);

      setValues((oldValues) => merge(oldValues)({ formId: newUrl }));
    },

    setPortalId: (newUrl) => {
      // Save to contentful
      onChangeField('provider.parameters.portalId', newUrl);

      setValues((oldValues) => merge(oldValues)({ portalId: newUrl }));
    },

    setUrl: (newUrl) => {
      // Save to contentful
      onChangeField('provider.parameters.url', newUrl);

      setValues((oldValues) => merge(oldValues)({ url: newUrl }));
    },

    update: ({ parameters: newParameters, type: newType }) =>
      setValues({
        ...values,
        ...newParameters,
        type: newType
      })
  };
}
