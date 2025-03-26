import React, { useEffect, useState } from "react";
import "./GymDetails.css";
import { useParams } from "react-router-dom";
import { getGymById } from "../../apis/apis";
import {
    FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaClock, FaParking,
    FaShower,
    FaWifi,
    FaDumbbell,
    FaSwimmer,
    FaHotTub,
    FaRunning,
    FaHeartbeat, FaCheck, FaArrowRight,
    FaExclamationTriangle,
    FaExclamationCircle
} from 'react-icons/fa';
import GymMap from "../maps/GymMap";
import Footer from "../footer/Footer";
import Loader from "../../utils/Loader";



// Add this constant at the top of your file
const facilityIcons = {
    parking: { icon: FaParking, label: "Parking Available" },
    shower: { icon: FaShower, label: "Shower Facilities" },
    wifi: { icon: FaWifi, label: "Free Wi-Fi" },
    gym: { icon: FaDumbbell, label: "Gym Equipment" },
    pool: { icon: FaSwimmer, label: "Swimming Pool" },
    spa: { icon: FaHotTub, label: "Spa Services" },
    cardio: { icon: FaRunning, label: "Cardio Area" },
    fitness: { icon: FaHeartbeat, label: "Fitness Center" }
};
const backgroundImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c",
];

const subscriptionPlans = [
    {
        name: "Basic",
        price: "29.99",
        duration: "Monthly",
        features: [
            "Access to gym equipment",
            "Basic fitness assessment",
            "Locker room access",
            "2 Guest passes monthly"
        ]
    },
    {
        name: "Premium",
        price: "49.99",
        duration: "Monthly",
        features: [
            "All Basic features",
            "Personal trainer consultation",
            "Group fitness classes",
            "Nutrition guidance",
            "4 Guest passes monthly"
        ],
        popular: true
    },
    {
        name: "Elite",
        price: "79.99",
        duration: "Monthly",
        features: [
            "All Premium features",
            "Unlimited personal training",
            "Spa access",
            "Priority booking",
            "Unlimited guest passes"
        ]
    }
];

const GymDetails = () => {
    const { gymId } = useParams();
    const [gymDetails, setGymDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBgImage, setCurrentBgImage] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isMapInteractive, setIsMapInteractive] = useState(false);
    const [highlightedPlan, setHighlightedPlan] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchGymDetails = async () => {
            try {
                setLoading(true);
                const response = await getGymById(gymId);
                setGymDetails(response.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch gym details');
            } finally {
                setLoading(false);
            }
        };

        if (gymId) {
            fetchGymDetails();
        }
    }, [gymId]);

    if (loading) return <Loader text="Loading gym details..." height="100vh" />;
    if (error) return (
        <div className="gym-error-state">
            <FaExclamationCircle size={40} />
            <p>{error}</p>
        </div>
    );
    if (!gymId || !gymDetails) return (
        <div className="gym-error-state">
            <FaExclamationTriangle size={40} />
            <p>Gym not found</p>
        </div>
    );

    return (
        <div className="gym-details-wrapper">
            <div className="gym-hero-banner">
                {backgroundImages.map((img, index) => (
                    <div
                        key={index}
                        className={`gym-hero-slide ${index === currentBgImage ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                <div className="gym-hero-content">
                    <div className="gym-hero-main-info">
                        <h1 className="gym-hero-title">{gymDetails.name}</h1>
                        <div className="gym-hero-metadata">
                            <p className="gym-hero-status">{gymDetails.status}</p>
                            <span className="gym-hero-dot">•</span>
                            <span className="gym-hero-location">
                                <FaMapMarkerAlt className="gym-hero-icon" />
                                {gymDetails.location.city}
                            </span>
                        </div>
                        <p className="gym-hero-description">{gymDetails.description}</p>
                        <div className="gym-hero-stats">
                            <div className="gym-hero-stat">
                                <FaDumbbell className="gym-hero-icon" />
                                <span>{gymDetails.facilities.length} Facilities</span>
                            </div>
                            <div className="gym-hero-stat">
                                <FaClock className="gym-hero-icon" />
                                <span>24/7 Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="gym-content-container">
                <section className="gym-features-section">
                    <h2 className="gym-section-title">Our Facilities</h2>
                    <div className="gym-features-grid">
                        {gymDetails.facilities.map((facility, index) => {
                            const facilityInfo = facilityIcons[facility] || {
                                icon: FaDumbbell,
                                label: facility.charAt(0).toUpperCase() + facility.slice(1)
                            };
                            const IconComponent = facilityInfo.icon;

                            return (
                                <div key={index} className="gym-feature-card">
                                    <div className="gym-feature-icon-wrapper">
                                        <IconComponent />
                                    </div>
                                    <h3>{facilityInfo.label}</h3>
                                </div>
                            );
                        })}
                    </div>
                </section>
                <section className="gym-plans-section">
                    <h2 className="gym-section-title">Membership Plans</h2>
                    <div className="gym-plans-grid">
                        {subscriptionPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`gym-plan-card ${plan.popular ? 'popular' : ''} ${highlightedPlan === plan.name ? 'highlighted' : ''
                                    }`}
                            >
                                {plan.popular && <div className="gym-plan-badge">Most Popular</div>}
                                {highlightedPlan === plan.name && (
                                    <div className="gym-plan-badge selected">Selected</div>
                                )}
                                <h3 className="gym-plan-name">{plan.name}</h3>
                                <div className="gym-plan-price">
                                    <span className="gym-price-currency">$</span>
                                    <span className="gym-price-amount">{plan.price}</span>
                                    <span className="gym-price-duration">/{plan.duration}</span>
                                </div>
                                <ul className="gym-plan-features">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <FaCheck className="gym-feature-icon" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="gym-plan-button"
                                    onClick={() => {
                                        setHighlightedPlan(plan.name);
                                        setSelectedPlan(plan);
                                    }}
                                >
                                    {highlightedPlan === plan.name ? 'Selected' : 'Choose Plan'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="gym-cta-section">
                    <h2 className="gym-section-title">Join Us Today</h2>
                    <p className="gym-cta-description">
                        Start your fitness journey with us today!
                    </p>
                    <button className="gym-cta-button">
                        Join Now
                        <FaArrowRight className="gym-cta-icon" />
                    </button>
                </section>
                <section className="gym-contact-section">
                    <h2 className="gym-section-title">Location & Contact</h2>
                    <div className="gym-contact-grid reverse">
                        <div className="gym-map-container">
                            <div className="gym-location-header">
                                <div className="location-info">
                                    <FaMapMarkerAlt className="gym-location-icon" />
                                    <h3 className="gym-location-title">{gymDetails.location.address}</h3>
                                </div>
                                <div className="map-toggle-switch">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={isMapInteractive}
                                            onChange={() => setIsMapInteractive(!isMapInteractive)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="toggle-label">
                                        {isMapInteractive ? 'Map Unlocked' : 'Map Locked'}
                                    </span>
                                </div>
                            </div>
                            <div className="gym-map">
                                <GymMap
                                    coordinates={gymDetails.location.coordinates}
                                    isInteractive={isMapInteractive}
                                />
                            </div>
                        </div>
                        <div className="gym-contact-info">
                            <h3 className="gym-contact-subtitle">Contact Information</h3>
                            <div className="gym-contact-items">
                                <div className="gym-contact-item">
                                    <FaPhone className="gym-contact-icon" />
                                    <div className="gym-contact-detail">
                                        <span className="gym-contact-label">Phone</span>
                                        <span className="gym-contact-value">{gymDetails.contactInfo.phone}</span>
                                    </div>
                                </div>
                                <div className="gym-contact-item">
                                    <FaEnvelope className="gym-contact-icon" />
                                    <div className="gym-contact-detail">
                                        <span className="gym-contact-label">Email</span>
                                        <span className="gym-contact-value">{gymDetails.contactInfo.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {selectedPlan && (
                <div className="gym-modal-overlay">
                    <div className="gym-modal-content">
                        <h3>Confirm Subscription</h3>
                        <p>Are you sure you want to subscribe to the {selectedPlan.name} plan?</p>
                        <div className="gym-modal-actions">
                            <button onClick={() => setSelectedPlan(null)}>Cancel</button>
                            <button onClick={() => {
                                console.log(`Subscribed to ${selectedPlan.name}`);
                                setSelectedPlan(null);
                            }}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymDetails;