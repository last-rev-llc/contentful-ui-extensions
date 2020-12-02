import React, { useContext } from 'react';

export const SDKContext = React.createContext({});

export const useSDK = () => useContext(SDKContext);

export default { SDKContext, useSDK };
