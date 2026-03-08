import './SkeletonCard.css';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-poster shimmer" />
    <div className="skeleton-info">
      <div className="skeleton-line shimmer" style={{ width: '80%' }} />
      <div className="skeleton-line shimmer" style={{ width: '50%', height: '10px' }} />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 12 }) => (
  <div className="movies-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
