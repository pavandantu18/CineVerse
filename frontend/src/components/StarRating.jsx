import { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating = 0, onRate, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star-btn ${star <= (hover || rating) ? 'filled' : ''}`}
          onClick={() => !readOnly && onRate && onRate(star === rating ? 0 : star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          disabled={readOnly}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
      {rating > 0 && !readOnly && <span className="rating-label">{rating}/5</span>}
    </div>
  );
};

export default StarRating;
