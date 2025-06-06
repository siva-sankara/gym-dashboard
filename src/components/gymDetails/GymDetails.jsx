import React, { useEffect, useState } from "react";
import "./GymDetails.css";
import { useParams } from "react-router-dom";
import { getGymById, getGymMembershipPlans, subscribeToPlan, verifyPaymentSubscription } from "../../apis/apis";
import {
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaParking,
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
import Loader from "../../utils/Loader";
import { toast } from "react-toastify";



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


const GymDetails = () => {
    const { gymId } = useParams();
    const [gymDetails, setGymDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBgImage, setCurrentBgImage] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isMapInteractive, setIsMapInteractive] = useState(false);
    const [highlightedPlan, setHighlightedPlan] = useState(null);
    const [membershipPlans, setMembershipPlans] = useState(null);
    const [membershipLoading, setMembershipLoading] = useState(true);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentButton, setPaymentButton] = useState(false);
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
        const fetchMembershipPlans = async () => {
            try {
                const response = await getGymMembershipPlans(gymId);
                setMembershipPlans(response.data);
            } catch (err) {
                console.error('Failed to fetch membership plans:', err);
                setMembershipPlans(null);
            } finally {
                setMembershipLoading(false);
            }
        };
        if (gymId) {
            fetchGymDetails();
            fetchMembershipPlans();
        }
    }, [gymId]);

    const handlePayment = async (plan) => {
        try {
            setPaymentProcessing(true);
            
            // Step 1: Initiate payment
            const response = await subscribeToPlan(gymId, plan._id);
            if (!response?.success) {
                throw new Error(response?.message || 'Failed to create payment order');
            }
    
            // Step 2: Configure Razorpay options
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Use environment variable
                amount: response.data.amount,
                currency: response.data.currency,
                name: response.data.name,
                description: response.data.description,
                order_id: response.data.order_id,
                prefill: {
                    name: response.data.prefill.name,
                    email: response.data.prefill.email,
                    contact: response.data.prefill.contact
                },
                notes: {
                    gymId: response.data.notes.gymId,
                    planId: response.data.notes.planId,
                    userId: response.data.notes.userId
                },
                handler: async function (paymentResponse) {
                    try {
                        // Step 3: Verify payment
                        const verificationData = {
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                            gymId: response.data.notes.gymId,
                            planId: response.data.notes.planId
                        };
    
                        const verificationResult = await verifyPaymentSubscription(
                            verificationData.gymId,
                            verificationData.planId,
                            verificationData
                        );
    
                        if (verificationResult.success) {
                            setSelectedPlan(null);
                            toast.success("Payment successful! Your membership is now active.");
                            // Optionally refresh user data or redirect
                            // navigate('/dashboard'); // or wherever you want to redirect
                        } else {
                            throw new Error(verificationResult.message || "Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },
                modal: {
                    ondismiss: function() {
                        setPaymentProcessing(false);
                    }
                },
                theme: {
                    color: "#528FF0"
                }
            };
    
            // Step 4: Initialize Razorpay
            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                toast.error("Payment failed. Please try again.");
                setPaymentProcessing(false);
            });
    
            paymentObject.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            toast.error(error.message || "Failed to initiate payment. Please try again.");
            setPaymentProcessing(false);
        }
    };
    const renderMembershipSection = () => {
        if (membershipLoading) {
            return <div className="loading-plans">Loading membership plans...</div>;
        }

        return (
            <>
                {(!membershipPlans || membershipPlans.length === 0) ? (
                    <section className="gym-cta-section">
                        <h2 className="gym-section-title">Join Us Today</h2>
                        <p className="gym-cta-description">
                            Contact us to learn more about our membership options!
                        </p>
                        <button className="gym-cta-button">
                            Join Now
                            <FaArrowRight className="gym-cta-icon" />
                        </button>
                    </section>
                ) : (
                        <section className="gym-plans-section">
                            <h2 className="gym-section-title">Membership Plans</h2>
                            <div className="gym-plans-grid">
                                {membershipPlans.map((plan, index) => (
                                    <div
                                        key={plan._id || index}
                                        className={`gym-plan-card ${plan.isPopular ? 'popular' : ''} ${highlightedPlan === plan.name ? 'highlighted' : ''}`}
                                    >
                                        {plan.isPopular && <div className="gym-plan-badge">Most Popular</div>}
                                        {highlightedPlan === plan.name && (
                                            <div className="gym-plan-badge selected">Selected</div>
                                        )}
                                        <h3 className="gym-plan-name">{plan.name}</h3>
                                        <div className="gym-plan-price">
                                            <span className="gym-price-currency">₹</span>
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
                                            {highlightedPlan === plan.name ? 'Selected' : 'Choose Plan & Join'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                )}


            </>
        );
    };


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
    const dummyReviews = [
        {
            userName: "Sarah Johnson",
            rating: 5,
            comment: "Amazing facilities and professional trainers! The 24/7 access is perfect for my schedule.",
            date: "2023-11-15"
        },
        {
            userName: "Mike Chen",
            rating: 4.5,
            comment: "Great equipment and friendly staff. The yoga classes are exceptional.",
            date: "2023-11-10"
        },
        {
            userName: "Emily Davis",
            rating: 5,
            comment: "Best gym in the area! Love the clean environment and variety of equipment.",
            date: "2023-11-05"
        },
        {
            userName: "Alex Thompson",
            rating: 4,
            comment: "Excellent personal training programs. Have seen great results in just 2 months.",
            date: "2023-11-01"
        },
        {
            userName: "Rachel Kim",
            rating: 5,
            comment: "The spa facilities are top-notch. Perfect after an intense workout session.",
            date: "2023-10-28"
        },
        {
            userName: "David Wilson",
            rating: 4.5,
            comment: "Modern equipment and great atmosphere. The group classes are very motivating.",
            date: "2023-10-25"
        }
    ];
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
                    <div className="gym-hero-info-container">
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
                        <div className="gym-hero-reviews">
                            <h2 className="gym-reviews-title mobile-only">Member Reviews</h2>
                            {dummyReviews?.map((review, index) => (
                                <div key={index} className="gym-review-card" style={{ animationDelay: `${index * 0.2}s` }}>
                                    <div className="gym-review-header">
                                        <span className="gym-review-author">{review.userName}</span>
                                        <span className="gym-review-rating">★ {review.rating}</span>
                                    </div>
                                    <p className="gym-review-text">{review.comment}</p>
                                </div>
                            ))}
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
                <section className="gym-hours-section">
                    <h2 className="gym-section-title">Opening Hours</h2>
                    <div className="gym-hours-grid">
                        {Object.entries(gymDetails.operatingHours).map(([day, hours]) => (
                            <div key={day} className="gym-hours-card">
                                <div className="gym-hours-day">
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </div>
                                <div className="gym-hours-time">
                                    <FaClock className="gym-hours-icon" />
                                    <span>{hours.open} - {hours.close}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                {/* ... other sections ... */}
                {renderMembershipSection()}
                {/* ... other sections ... */}


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
            {selectedPlan && (
                <div className="gym-modal-overlay">
                    <div className="gym-modal-content">
                        <h3>Confirm Subscription</h3>
                        <p>Are you sure you want to subscribe to the {selectedPlan.name} plan?</p>
                        <div className="gym-modal-actions">
                            <button
                                onClick={() => setSelectedPlan(null)}
                                disabled={paymentProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handlePayment(selectedPlan)}
                                disabled={paymentProcessing}
                                className="gym-modal-confirm"
                            >
                                {paymentProcessing ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymDetails;