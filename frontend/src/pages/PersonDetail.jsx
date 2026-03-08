import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getPersonDetails, getPosterUrl } from '../services/tmdbApi';
import { PLACEHOLDER_PERSON, safeText } from '../utils/constants';
import './PersonDetail.css';



const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getPersonDetails(id);
        setPerson(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="person-page">
        <div className="person-skeleton">
          <div className="skeleton-photo shimmer" />
          <div className="skeleton-bio">
            <div className="skeleton-line shimmer" style={{ width: '60%', height: '24px' }} />
            <div className="skeleton-line shimmer" style={{ width: '40%' }} />
            <div className="skeleton-line shimmer" style={{ width: '100%', height: '10px' }} />
            <div className="skeleton-line shimmer" style={{ width: '90%', height: '10px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="person-page">
        <div className="detail-error">
          <p>Person not found.</p>
          <button onClick={() => navigate(-1)} className="btn-back">← Go Back</button>
        </div>
      </div>
    );
  }

  const photo = person.profile_path ? getPosterUrl(person.profile_path, 'large') : PLACEHOLDER;
  const bio = safeText(person.biography, 'Biography not available.');
  const movieCredits = person.movie_credits?.cast?.slice(0, 10) || [];
  const tvCredits = person.tv_credits?.cast?.slice(0, 10) || [];

  return (
    <div className="person-page">
      <div className="person-content">
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>

        <div className="person-main">
          <div className="person-photo-large">
            <img src={photo} alt={person.name} onError={(e) => { if (e.target.src !== PLACEHOLDER_PERSON) e.target.src = PLACEHOLDER_PERSON; }} />
          </div>
          <div className="person-details">
            <h1>{person.name}</h1>
            <div className="person-meta">
              {person.known_for_department && (
                <span className="meta-badge">{person.known_for_department}</span>
              )}
              {person.birthday && <span>Born: {person.birthday}</span>}
              {person.place_of_birth && <span>📍 {person.place_of_birth}</span>}
            </div>

            <div className="person-bio">
              <h3>Biography</h3>
              <p>
                {showFull || bio.length <= 400 ? bio : bio.slice(0, 400) + '...'}
              </p>
              {bio.length > 400 && (
                <button className="btn-read-more" onClick={() => setShowFull(!showFull)}>
                  {showFull ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>
        </div>

        {movieCredits.length > 0 && (
          <section className="person-section">
            <h2>Movie Appearances</h2>
            <div className="scroll-row">
              {movieCredits.map((m) => (
                <div key={m.id} className="scroll-item">
                  <MovieCard item={m} mediaType="movie" />
                </div>
              ))}
            </div>
          </section>
        )}

        {tvCredits.length > 0 && (
          <section className="person-section">
            <h2>TV Appearances</h2>
            <div className="scroll-row">
              {tvCredits.map((t) => (
                <div key={t.id} className="scroll-item">
                  <MovieCard item={t} mediaType="tv" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PersonDetail;
