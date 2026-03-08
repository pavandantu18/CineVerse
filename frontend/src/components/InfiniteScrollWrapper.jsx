import { useEffect, useRef } from 'react';

const InfiniteScrollWrapper = ({ hasMore, loading, onLoadMore, children }) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, onLoadMore]);

  return (
    <>
      {children}
      <div ref={sentinelRef} style={{ height: '20px' }} />
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
          <div className="spinner" />
        </div>
      )}
    </>
  );
};

export default InfiniteScrollWrapper;
