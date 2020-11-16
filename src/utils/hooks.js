import axios from 'axios';
import { useState, useEffect } from 'react';

function makeState({ error = null, response = null, loading = true } = {}) {
  return { error, response, loading };
}

export function useAsync(toCall) {
  const [state, setState] = useState(makeState());

  useEffect(() => {
    (async () => {
      try {
        setState(makeState({ loading: true }));
        const response = await toCall();
        setState(makeState({ response, loading: false }));
      } catch (fetchError) {
        // eslint-disable-next-line no-console
        console.error(fetchError);
        setState(makeState({ error: fetchError, loading: false }));
      }
    })();
  }, []);

  return state;
}

export function useAxios({ url: defaultUrl, method: defaultMethod, data: defaultData }) {
  const [url, setUrl] = useState(defaultUrl || null);
  const [data, setData] = useState(defaultData || null);
  const [method, setMethod] = useState(defaultMethod || 'get');

  const { error, response } = useAsync(() =>
    axios({
      data,
      method,
      url
    })
  );

  return { error, response, setUrl, setData, setMethod };
}

export default { useAxios, useAsync };
