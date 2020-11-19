import { useState, useEffect } from 'react';

function makeState({ error = null, response = null, loading = true } = {}) {
  return { error, response, loading };
}

export function useAsync(toCall) {
  const [state, setState] = useState(makeState());

  const fetch = async () => {
    try {
      setState(makeState({ loading: true }));
      const response = await toCall();
      setState(makeState({ response, loading: false }));
    } catch (fetchError) {
      // eslint-disable-next-line no-console
      console.error(fetchError);
      setState(makeState({ error: fetchError, loading: false }));
    }
  };

  useEffect(
    () => {
      fetch();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { ...state, fetch, set: (newValues = {}) => setState(makeState(newValues)) };
}

export default { useAsync };
