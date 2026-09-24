import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseQueryResult<T> extends QueryState<T> {
  refetch: () => Promise<void>;
}

export function useQuery<T>(fetcher: () => Promise<T>, deps: DependencyList = []): UseQueryResult<T> {
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    await Promise.resolve();
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : 'Unexpected error',
      });
    }
  }, []);

  // load() fetches data; setState happens after an await (never synchronously),
  // and `deps` is intentionally caller-controlled — both rules are false positives here.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    load();
  }, deps);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return { ...state, refetch: load };
}