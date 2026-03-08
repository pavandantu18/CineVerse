import { useState, useEffect, useCallback } from 'react';

const useInfiniteScroll = (fetchFn, deps = []) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    reset();
  }, deps); // eslint-disable-line

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!hasMore) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchFn(page);
        if (!cancelled) {
          const results = data.results || [];
          setItems((prev) => (page === 1 ? results : [...prev, ...results]));
          setHasMore(page < data.total_pages);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [page, version]); // eslint-disable-line

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((p) => p + 1);
  }, [loading, hasMore]);

  return { items, loading, error, hasMore, loadMore, reset };
};

export default useInfiniteScroll;
