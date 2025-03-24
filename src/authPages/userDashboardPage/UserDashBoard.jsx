
import React, { useState, useEffect } from 'react';
import {
  FaStar, FaMapMarkerAlt
} from 'react-icons/fa';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './UserDashboard.css';
import Footer from '../../components/footer/Footer';
import { Link } from 'react-router-dom';
import { getApprovedGyms, searchGyms } from '../../apis/apis';
import { useSelector } from 'react-redux';


function UserDashBoard() {

  const location = useSelector((state) => state.location);

  const [selectedCity, setSelectedCity] = useState(location?.address?.state_district || 'vizag');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const [approvedGyms, setApprovedGyms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  //serch gyms by city name and gym name \
  const [searchParams, setSearchParams] = useState({
    area: '',
    city: '',
    page: 1,
    limit: 8
  });
  const [searchResults, setSearchResults] = useState({
    gyms: [],
    pagination: null
  });
  const [searchLoading, setSearchLoading] = useState(false);


  useEffect(() => {
    if (location?.address?.state_district) {
      setSelectedCity(location?.address?.state_district);
    }
  }, [location]);

  const fetchApprovedGyms = async (page) => {
    try {
      setLoading(true);
      const result = await getApprovedGyms(page, 5);
      if (!result.data.gyms || result.data.gyms.length === 0) {
        setHasMore(false);
      } else {
        if (page === 1) {
          setApprovedGyms(result.data.gyms);
        } else {
          setApprovedGyms(prev => [...prev, ...result.data.gyms]);
        }
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching approved gyms:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchApprovedGyms(1)
  }, [selectedCity]); // Reset and reload when city changes

  // Load more function
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchApprovedGyms(currentPage + 1);
    }
  };

  // Replace handleScroll with a button click handler
  const handleLoadMore = () => {
    loadMore();
  };


  const backgroundImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1470',
  ];

  // Add background image slider effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  //handle serching 
  const handleSearch = async (newPage) => {
    try {
      setSearchLoading(true);
      const result = await searchGyms({
        ...searchParams,
        page: newPage || searchParams.page
      });

      if (result.success && result.data) {
        if (newPage === 1) {
          setSearchResults({
            gyms: result.data.gyms,
            pagination: result.data.pagination
          });
        } else {
          setSearchResults(prev => ({
            gyms: [...prev.gyms, ...result.data.gyms],
            pagination: result.data.pagination
          }));
        }
        setSearchParams(prev => ({ ...prev, page: result.data.pagination.currentPage }));
      }
    } catch (error) {
      console.error('Error searching gyms:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset page when search params change
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(1); // Reset to first page on new search
  };

  const loadMoreResults = () => {
    if (!searchLoading && searchResults.pagination?.hasNextPage) {
      handleSearch(searchResults.pagination.currentPage + 1);
    }
  };


  // console.log(approvedGyms);
  
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 595 }, items: 2 },
    mobile: { breakpoint: { max: 595, min: 0 }, items: 1 }
  };
  return (
    <div>
      <div className="landing-page">
        {/* Previous sections remain the same */}
        <section
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImages[currentBgIndex]})`,
            transition: 'background-image 1s ease-in-out'
          }}
        >
          <h1>Find Your Perfect Gym in {selectedCity}</h1>
          <form onSubmit={handleSearchSubmit} className="search-box">
            <input
              type="text"
              name="area"
              className="input-field"
              placeholder="Search by area..."
              value={searchParams.area}
              onChange={handleSearchInputChange}
            />
            <input
              type="text"
              name="city"
              className="input-field"
              placeholder="Enter city..."
              value={searchParams.city}
              onChange={handleSearchInputChange}
            />
            <button type="submit">Search</button>
          </form>
        </section>

        {/* Search Results Section */}
        {searchResults.gyms.length > 0 && (
          <section className="search-results">
            <div className="head-seeall-con">
              <h2>Search Results</h2>
            </div>
            <div className="nearby-gyms-grid">
              {searchResults.gyms.map((gym, index) => (
                <div key={`search-${gym._id}-${index}`} className="nearby-gym-card">
                  <div className="nearby-gym-image">
                  <img
                    src={gym.images && gym.images.length > 0 ? gym.images[0] :
                      gym.image || 'https://t4.ftcdn.net/jpg/00/99/82/15/240_F_99821575_nVEHTBXzUnTcLIKN6yOymAWAnFwEybGb.jpg'}
                    alt={gym.name}
                  />
                  <div className="gym-distance">
                    <FaMapMarkerAlt /> 2.5 km
                  </div>
                </div>
                <div className="nearby-gym-info">
                  <h3>{gym.name}</h3>
                  <p className="location">{gym.location?.area}, {gym.location?.city}</p>
                  <div className="rating-price">
                    <span className="rating">
                      <FaStar className="star-icon" /> {gym.ratings?.average || 'N/A'}
                    </span>
                    <span className="price">{gym.price || 'Price not available'}</span>
                  </div>
                  <div className="nearby-facilities">
                    {(gym.facilities || []).slice(0, 2).map((facility, facilityIndex) => (
                      <span key={`nearby-${gym._id}-facility-${facilityIndex}`} className="nearby-facility-tag">
                        {facility}
                      </span>
                    ))}
                  </div>
                  <Link to={`/gym/${gym._id}`} className="nearby-view-details">
                    View Details
                  </Link>
                </div>
                </div>
              ))}
            </div>
            {searchResults.pagination?.hasNextPage && (
              <div className="load-more-container">
                <button
                  onClick={loadMoreResults}
                  className="load-more-button"
                  disabled={searchLoading}
                >
                  {searchLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </section>
        )}






        <section className="city-gyms">
          <div className="head-seeall-con">
            <h2>Top Gyms in {selectedCity}</h2>
            <p className='seeall-con'><Link>Explore More Gyms</Link></p>
          </div>
          <div className="gyms-grid">
            <Carousel
              responsive={responsive}
              infinite={false}
              autoPlay={false}
              swipeable={true}
              draggable={true}
              shouldResetAutoplay={true}
              rewind={false}
              rewindWithAnimation={false}
              partialVisible={false}
              afterChange={(previousSlide, { currentSlide }) => {
                // Check if we're near the end of the carousel
                const totalItems = approvedGyms.length;
                const visibleItems = 4; // desktop view shows 4 items
                if (currentSlide >= totalItems - visibleItems && hasMore) {
                  handleLoadMore();
                }
              }}
              customTransition="transform 300ms ease-in-out"
            >
              {approvedGyms.map((gym, index) => (
                <div key={`${gym._id}-${index}`} className="gym-card">
                  <div className="gym-image">
                    <img
                      src={gym.images && gym.images.length > 0 ? gym.images[0] :
                        gym.image || 'https://t4.ftcdn.net/jpg/00/99/82/15/240_F_99821575_nVEHTBXzUnTcLIKN6yOymAWAnFwEybGb.jpg'}
                      alt={gym.name}
                    />
                  </div>
                  <div className="gym-info">
                    <h3>{gym.name}</h3>
                    <p><FaMapMarkerAlt /> {gym.location?.area}, {gym.location?.city}</p>
                    <div className="rating">
                      <FaStar className="star-icon" /> {gym.ratings?.average || 'N/A'}
                    </div>
                    <div className="price">{gym.price || 'Price not available'}</div>
                    <div className="facilities">
                      {(gym.facilities || []).slice(0, 3).map((facility, facilityIndex) => (
                        <span key={`${gym._id}-facility-${facilityIndex}`} className="facility-tag">
                          {facility}
                        </span>
                      ))}
                    </div>
                    <Link to={`/gym/${gym._id}`}>
                      <button className="view-details">View Details</button>
                    </Link>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </section>



        <section className="nearby-gyms">
          <div className="head-seeall-con">
            <h2>Nearby Gyms in {selectedCity}</h2>
            <p className='seeall-con'><Link>View All</Link></p>
          </div>
          <div className="nearby-gyms-grid">
            {approvedGyms.slice(0, 4).map((gym, index) => (
              <div key={`nearby-${gym._id}-${index}`} className="nearby-gym-card">
                <div className="nearby-gym-image">
                  <img
                    src={gym.images && gym.images.length > 0 ? gym.images[0] :
                      gym.image || 'https://t4.ftcdn.net/jpg/00/99/82/15/240_F_99821575_nVEHTBXzUnTcLIKN6yOymAWAnFwEybGb.jpg'}
                    alt={gym.name}
                  />
                  <div className="gym-distance">
                    <FaMapMarkerAlt /> 2.5 km
                  </div>
                </div>
                <div className="nearby-gym-info">
                  <h3>{gym.name}</h3>
                  <p className="location">{gym.location?.area}, {gym.location?.city}</p>
                  <div className="rating-price">
                    <span className="rating">
                      <FaStar className="star-icon" /> {gym.ratings?.average || 'N/A'}
                    </span>
                    <span className="price">{gym.price || 'Price not available'}</span>
                  </div>
                  <div className="nearby-facilities">
                    {(gym.facilities || []).slice(0, 2).map((facility, facilityIndex) => (
                      <span key={`nearby-${gym._id}-facility-${facilityIndex}`} className="nearby-facility-tag">
                        {facility}
                      </span>
                    ))}
                  </div>
                  <Link to={`/gym/${gym._id}`} className="nearby-view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      <section>
        <Footer />
      </section>
    </div>
  );
}

export default UserDashBoard;