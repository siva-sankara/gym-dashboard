import React, { useState, useEffect } from 'react';
import { FaStar, FaMapMarkerAlt, FaPhone, FaUtensils, FaPlay, FaArrowRight, 
  FaDumbbell, FaMedal, FaTrophy, FaHeartbeat, FaRunning, FaFire } from 'react-icons/fa';
  import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './LandingPage.css';
import FAQs from '../../components/faqs/FAQs';
import Footer from '../../components/footer/Footer';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const [selectedCity, setSelectedCity] = useState('mumbai ');
  const [showVideo, setShowVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

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

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };
  const [gyms] = useState([
    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },
    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },
    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },

    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },
    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },
    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },
    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },
    {
      id: 1,
      name: "FitZone Premium",
      location: "Andheri West",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470",
      price: "₹2,000/month",
      facilities: ["Cardio Area", "Weight Training", "Yoga Classes"]
    },

    {
      id: 2,
      name: "PowerHouse Gym",
      location: "Bandra",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470",
      price: "₹2,500/month",
      facilities: ["Personal Training", "Swimming Pool", "Spa"]
    },
    {
      id: 3,
      name: "Elite Fitness Club",
      location: "Juhu",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469",
      price: "₹3,000/month",
      facilities: ["CrossFit", "Zumba", "Steam Room"]
    },
    {
      id: 2,
      name: "PowerHouse Gym",
      location: "Bandra",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470",
      price: "₹2,500/month",
      facilities: ["Personal Training", "Swimming Pool", "Spa"]
    },
    {
      id: 3,
      name: "Elite Fitness Club",
      location: "Juhu",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469",
      price: "₹3,000/month",
      facilities: ["CrossFit", "Zumba", "Steam Room"]
    }, {
      id: 2,
      name: "PowerHouse Gym",
      location: "Bandra",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470",
      price: "₹2,500/month",
      facilities: ["Personal Training", "Swimming Pool", "Spa"]
    },
    {
      id: 3,
      name: "Elite Fitness Club",
      location: "Juhu",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469",
      price: "₹3,000/month",
      facilities: ["CrossFit", "Zumba", "Steam Room"]
    }
  ]);
  const gymMedia = {
    images: [
      { id: 1, url: 'https://cdn.presetfree.com/thumb-item/webp/gym_and_fitness/gym_and_fitness_6_after.webp', title: 'Modern Equipment' },
      { id: 2, url: 'https://i.ytimg.com/vi/zOSX1wtSkrA/maxresdefault.jpg', title: 'Cardio Zone' },
      { id: 1, url: 'https://cdn.presetfree.com/thumb-item/webp/gym_and_fitness/gym_and_fitness_6_after.webp', title: 'Modern Equipment' },
      { id: 2, url: 'https://i.ytimg.com/vi/zOSX1wtSkrA/maxresdefault.jpg', title: 'Cardio Zone' }, { id: 1, url: 'https://cdn.presetfree.com/thumb-item/webp/gym_and_fitness/gym_and_fitness_6_after.webp', title: 'Modern Equipment' },
      { id: 2, url: 'https://i.ytimg.com/vi/zOSX1wtSkrA/maxresdefault.jpg', title: 'Cardio Zone' }, { id: 1, url: 'https://cdn.presetfree.com/thumb-item/webp/gym_and_fitness/gym_and_fitness_6_after.webp', title: 'Modern Equipment' },
      { id: 2, url: 'https://i.ytimg.com/vi/zOSX1wtSkrA/maxresdefault.jpg', title: 'Cardio Zone' },
    ],
    videos: [
      {
        id: 1,
        thumbnail: 'https://i.ytimg.com/vi/gey73xiS8F4/maxresdefault.jpg',
        url: 'https://www.youtube.com/embed/gey73xiS8F4',
        title: 'Full Body Workout Session'
      },
      {
        id: 2,
        thumbnail: 'https://i.ytimg.com/vi/149Iac5fmoE/maxresdefault.jpg',
        url: 'https://www.youtube.com/embed/149Iac5fmoE',
        title: 'Power Yoga Class'
      },
      {
        id: 3,
        thumbnail: 'https://i.ytimg.com/vi/QRZcZgSgSHI/maxresdefault.jpg',
        url: 'https://www.youtube.com/embed/QRZcZgSgSHI',
        title: 'High Energy Zumba Dance'
      }
    ]
  };
  const [topUsers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=500",
      achievement: "Lost 20kg in 3 months",
      testimonial: "Transformed my life completely!",
      memberSince: "2023"
    },
    {
      id: 2,
      name: "Priya Patel",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500",
      achievement: "Fitness Competition Winner",
      testimonial: "Best training facilities ever",
      memberSince: "2022"
    },
    {
      id: 3,
      name: "Amit Kumar",
      image: "https://images.unsplash.com/photo-1583468982228-19f19164aee3?w=500",
      achievement: "Marathon Runner",
      testimonial: "Great community support",
      memberSince: "2023"
    },
    {
      id: 4,
      name: "Neha Singh",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=500",
      achievement: "Yoga Expert",
      testimonial: "Found my fitness family here",
      memberSince: "2022"
    }
  ]);
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowVideo(true);
  };

  return (
 <div>
     <div className="landing-page-cons landing-page">
      {/* Previous sections remain the same */}
      <section 
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImages[currentBgIndex]})`,
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <h1>Find Your Perfect Gym in {selectedCity}</h1>
        <div className="search-box">
          <input type="text" className='input-field' placeholder="Search by area..." />
          <button>Search</button>
        </div>
      </section>

      <section className="city-gyms">
        <h2>Top Gyms in {selectedCity}</h2>
        <div className="gyms-grid">
          <Carousel 
            responsive={responsive} 
            infinite={false}
            autoPlay={true}
            autoPlaySpeed={3000}
            swipeable={true}
            draggable={true}
          >
            {gyms.map(gym => (
              <div key={gym.id} className="gym-card">
                <div className="gym-image">
                  <img src={gym.image} alt={gym.name} />
                </div>
                <div className="gym-info">
                  <h3>{gym.name}</h3>
                  <p><FaMapMarkerAlt /> {gym.location}</p>
                  <div className="rating">
                    <FaStar className="star-icon" /> {gym.rating}
                  </div>
                  <div className="price">{gym.price}</div>
                  <div className="facilities">
                    {gym.facilities.slice(0, 3).map((facility, index) => (
                      <span key={index} className="facility-tag">{facility}</span>
                    ))}
                  </div>
                  <Link to='/login'><button className="view-details">View Details</button></Link>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>
      <section className="gym-media">
        <h2>Explore Our Facilities</h2>
        
        <div className="media-section">
          <h3>Photo Gallery</h3>
          <Carousel responsive={responsive} infinite={true}>
            {gymMedia.images.map(image => (
              <div key={image.id} className="media-card">
                <img src={image.url} alt={image.title} />
                <p>{image.title}</p>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="media-section">
          <h3>Video Tours</h3>
          <div className="video-grid">
            {gymMedia.videos.map(video => (
              <div key={video.id} className="video-card" onClick={() => handleVideoClick(video)}>
                <div className="thumbnail-container">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="play-button">
                    <FaPlay />
                  </div>
                </div>
                <p>{video.title}</p>
              </div>
            ))}
          </div>
        </div>

        {showVideo && (
          <div className="video-modal" onClick={() => setShowVideo(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button 
                className="close-button" 
                onClick={() => setShowVideo(false)}
                aria-label="Close video"
              >
                X
              </button>
              <iframe
                width="100%"
                height="560"
                src={`${selectedVideo.url}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </section>
      <section className="top-users">
        <div className="background-icons">
          <FaDumbbell className="floating-icon icon-1" />
          <FaMedal className="floating-icon icon-2" />
          <FaTrophy className="floating-icon icon-3" />
          <FaHeartbeat className="floating-icon icon-4" />
          <FaRunning className="floating-icon icon-5" />
          <FaFire className="floating-icon icon-6" />
        </div>
        <h2>Success Stories</h2>
        <div className="users-carousel">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            swipeable={true}
            draggable={true}
            centerMode={true}
            arrows={false}
            autoPlaySpeed={3000}
            transitionDuration={1000}
            customTransition="transform 1000ms ease-in-out"
            ssr={true}
          >
            {topUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-image">
                  <img src={user.image} alt={user.name} />
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="achievement">{user.achievement}</p>
                  <p className="testimonial">"{user.testimonial}"</p>
                  <p className="member-since">Member since {user.memberSince}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>
      <section>
        <FAQs />
      </section>
    </div>
    <section>
    <Footer />
  </section>
 </div>
  );
}