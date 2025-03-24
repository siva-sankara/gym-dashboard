import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './NaerByGyms.css';
import { getNearbyGyms, searchGyms } from '../../apis/apis';

const NearByGyms = () => {
    const userLocation = useSelector((state) => state.location);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchRadius, setSearchRadius] = useState(5);
    const [nearbyGyms, setNearbyGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
      sortBy: 'distance',
      facilities: [],
      priceRange: 'all',
      rating: 'all',
      amenities: []
    });
  
    const searchGymsData = async (isLoadMore = false) => {
      setLoading(true);
      try {
        let response;
        const currentPage = isLoadMore ? page + 1 : 1;
        
        if (userLocation?.lat && userLocation?.lon) {
          // Use getNearbyGyms if we have coordinates
          response = await getNearbyGyms({
            latitude: userLocation.lat,
            longitude: userLocation.lon,
            radius: searchRadius,
            page: currentPage,
            limit: 5
          });
        } else {
          // Fallback to searchGyms if no coordinates
          response = await searchGyms({
            area: searchQuery,
            city: searchQuery,
            page: currentPage,
            limit: 5,
            sortBy: filters.sortBy
          });
        }
  
        const newGyms = response.data || [];
        setHasMore(newGyms.length === 5); // If we get less than limit, we've reached the end
        
        if (isLoadMore) {
          setNearbyGyms(prev => [...prev, ...newGyms]);
          setPage(currentPage);
        } else {
          setNearbyGyms(newGyms);
          setPage(1);
        }
      } catch (error) {
        console.error('Error fetching gyms:', error);
        setNearbyGyms([]);
        setHasMore(false);
      }
      setLoading(false);
    };
  
    useEffect(() => {
      searchGymsData();
    }, [userLocation, searchRadius, filters.sortBy]);
  const renderFacilities = (facilities) => {
    return facilities.map((facility, index) => (
      <span key={index} className="facility-tag">{facility}</span>
    ));
  };

  return (
    <div className="nearby-gyms-container">
      <div className="header">
        <h1>Nearby Gyms</h1>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <h3 className="filter-title">Filters</h3>
          <div className="controls">
            <select 
              value={searchRadius} 
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="select"
            >
              <option value="1">1km radius</option>
              <option value="5">5km radius</option>
              <option value="10">10km radius</option>
              <option value="20">20km radius</option>
            </select>

            <select 
              value={filters.sortBy} 
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="select"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
            </select>

            <select 
              value={filters.priceRange} 
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              className="select"
            >
              <option value="all">All Prices</option>
              <option value="budget">Budget</option>
              <option value="medium">Medium</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search gyms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      {loading && page === 1 ? (
        <div className="loading">Loading nearby gyms...</div>
      ) : (
        <div>

          <div className="gym-list">
            {nearbyGyms.map((gym) => (
              <div key={gym._id} className="gym-card">
              <div className="gym-header">
                <h2 className="gym-name">{gym.name}</h2>
                <p className="gym-description">{gym.description}</p>
              </div>

              <div className="info-section">
                <h3 className="info-title">Location</h3>
                <p>{gym.location.address}, {gym.location.area}</p>
                <p>{gym.location.city}, {gym.location.state}</p>
              </div>

              <div className="info-section">
                <h3 className="info-title">Contact</h3>
                <p>Phone: {gym.contactInfo.phone}</p>
                <p>Email: {gym.contactInfo.email}</p>
              </div>

              <div className="info-section">
                <h3 className="info-title">Facilities</h3>
                <div className="facilities-list">
                  {renderFacilities(gym.facilities)}
                </div>
              </div>

              <div className="info-section">
                <h3 className="info-title">Rating</h3>
                <p>{gym.ratings.average}/5 ({gym.ratings.count} reviews)</p>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
            <div className="load-more-container">
              <button 
                className="load-more-button"
                onClick={() => searchGymsData(true)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Show More'}
              </button>
            </div>
          )}
       </div>
      )}
    </div>
  );
};

export default NearByGyms;