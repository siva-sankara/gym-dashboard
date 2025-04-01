import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaParking,
    FaShower, FaWifi, FaDumbbell, FaSwimmer, FaHotTub,
    FaRunning, FaHeartbeat, FaEdit, FaImage, FaPlus,
    FaSave, FaTimes, FaMoneyBillWave, FaTrash,
    FaCheck, FaExclamationTriangle,
    FaUsers
} from 'react-icons/fa';
import './GymProfile.css';
import GymMap from '../../../components/maps/GymMap';

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

const GymProfile = () => {
    const { selectedGym } = useSelector((state) => state.gym);
    const [editedGym, setEditedGym] = useState(selectedGym);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    if (!selectedGym) {
        return (
            <div className="owner-empty-state">
                <FaDumbbell size={40} />
                <h2>Please select a gym to view its profile</h2>
            </div>
        );
    }

    const handleChange = (section, value) => {
        setEditedGym(prev => ({
            ...prev,
            [section]: value
        }));
    };

    const handleSaveAll = () => {
        // TODO: API call to save all changes
        console.log('Saving all changes:', editedGym);
        setShowEditModal(false);
    };

    const handleDeleteRequest = () => {
        // TODO: API call to request deletion
        console.log('Requesting deletion for gym:', selectedGym.id);
        setShowDeleteModal(false);
    };

    const handleContactChange = (field, value) => {
        setEditedGym(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                [field]: value
            }
        }));
    };

    const handleLocationChange = (field, value) => {
        setEditedGym(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value
            }
        }));
    };
    console.log('====================================');
    console.log(selectedGym);
    console.log('====================================');
    const handleHoursChange = (day, field, value) => {
        setEditedGym(prev => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                [day]: {
                    ...prev.operatingHours[day],
                    [field]: value
                }
            }
        }));
    };

    const handlePlanChange = (index, field, value) => {
        setEditedGym(prev => ({
            ...prev,
            membershipPlans: prev.membershipPlans.map((plan, i) =>
                i === index ? { ...plan, [field]: value } : plan
            )
        }));
    };

    const renderEditModalContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <div className="edit-modal-section">
                        <div className="edit-field-group">
                            <label>Gym Name</label>
                            <input
                                type="text"
                                value={editedGym?.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                        <div className="edit-field-group">
                            <label>Description</label>
                            <textarea
                                value={editedGym.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className="edit-modal-section">
                        <div className="edit-field-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={editedGym.contactInfo?.phone || ''}
                                onChange={(e) => handleContactChange('phone', e.target.value)}
                            />
                        </div>
                        <div className="edit-field-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={editedGym.contactInfo?.email || ''}
                                onChange={(e) => handleContactChange('email', e.target.value)}
                            />
                        </div>
                        <div className="edit-field-group">
                            <label>Address</label>
                            <input
                                type="text"
                                value={editedGym.location?.address || ''}
                                onChange={(e) => handleLocationChange('address', e.target.value)}
                            />
                        </div>
                        <div className="edit-field-group">
                            <label>City</label>
                            <input
                                type="text"
                                value={editedGym.location?.city || ''}
                                onChange={(e) => handleLocationChange('city', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 'hours':
                return (
                    <div className="edit-modal-section">
                        {Object.entries(editedGym.operatingHours || {}).map(([day, hours]) => (
                            <div key={day} className="edit-hours-group">
                                <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                                <div className="hours-inputs">
                                    <input
                                        type="time"
                                        value={hours?.open || ''}
                                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                    />
                                    <span>to</span>
                                    <input
                                        type="time"
                                        value={hours?.close || ''}
                                        onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'facilities':
                return (
                    <div className="edit-modal-section">
                        <div className="facilities-grid">
                            {Object.entries(facilityIcons).map(([key, { icon: Icon, label }]) => (
                                <div key={key} className="facility-checkbox">
                                    <input
                                        type="checkbox"
                                        id={key}
                                        checked={editedGym.facilities?.includes(key)}
                                        onChange={(e) => {
                                            const newFacilities = e.target.checked
                                                ? [...(editedGym.facilities || []), key]
                                                : editedGym.facilities?.filter(f => f !== key);
                                            handleChange('facilities', newFacilities);
                                        }}
                                    />
                                    <label htmlFor={key}>
                                        <Icon /> {label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'plans':
                return (
                    <div className="edit-modal-section">
                        {editedGym.membershipPlans?.map((plan, index) => (
                            <div key={index} className="edit-plan-group">
                                <div className="edit-field-group">
                                    <label>Plan Name</label>
                                    <input
                                        type="text"
                                        value={plan.name}
                                        onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="edit-field-group">
                                    <label>Price ($/month)</label>
                                    <input
                                        type="number"
                                        value={plan.price}
                                        onChange={(e) => handlePlanChange(index, 'price', e.target.value)}
                                    />
                                </div>
                                <div className="edit-field-group">
                                    <label>Features (comma-separated)</label>
                                    <textarea
                                        value={plan.features.join(', ')}
                                        onChange={(e) => handlePlanChange(index, 'features', e.target.value.split(',').map(f => f.trim()))}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            className="add-plan-btn"
                            onClick={() => {
                                const newPlan = {
                                    name: 'New Plan',
                                    price: 0,
                                    features: []
                                };
                                setEditedGym(prev => ({
                                    ...prev,
                                    membershipPlans: [...(prev.membershipPlans || []), newPlan]
                                }));
                            }}
                        >
                            <FaPlus /> Add New Plan
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="owner-dashboard">
            <div className="owner-actions-bar">
                <button onClick={() => setShowEditModal(true)} className="owner-edit-all-btn">
                    <FaEdit /> Edit Gym Profile
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="owner-delete-btn">
                    <FaTrash /> Request Deletion
                </button>
            </div>

            <div className="owner-header">
                <div className="owner-cover-section">
                    <img
                        className="owner-cover-image"
                        src={selectedGym.media?.images[0] || "https://via.placeholder.com/1200x300"}
                        alt="Gym Cover"
                    />
                </div>

                <div className="owner-basic-info">
                    <div className="owner-title-section">
                        <h1>{selectedGym.name}</h1>
                        <span className="owner-status-badge">{selectedGym.status}</span>
                    </div>
                    <p>{selectedGym.description}</p>
                </div>
            </div>

            <div className="owner-content-grid">

                

                <div className="owner-card">
                    <div className="owner-card-header">
                        <h2>Membership Plans</h2>
                    </div>
                    <div className="owner-plans-grid">
                        {selectedGym.membershipPlans?.length > 0 ? (
                            selectedGym.membershipPlans.map((plan, index) => (
                                <div key={index} className="owner-plan-card">
                                    <div className="owner-plan-header">
                                        <h3>{plan.name}</h3>
                                        <span className="owner-plan-price">${plan.price}/month</span>
                                    </div>
                                    <div className="owner-plan-features">
                                        {plan.features.map((feature, idx) => (
                                            <p key={idx}><FaCheck /> {feature}</p>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="owner-empty-plans">
                                <FaMoneyBillWave size={40} />
                                <h3>No Membership Plans Yet</h3>
                                <p>Add plans in edit mode</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="owner-card">
                    <div className="owner-card-header">
                        <h2>Operating Hours</h2>
                    </div>
                    <div className="owner-hours-grid">
                        {Object.entries(selectedGym.operatingHours || {}).map(([day, hours]) => (
                            <div key={day} className="owner-hours-item">
                                <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                                <p>{hours?.open || 'Closed'} - {hours?.close || 'Closed'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="owner-card">
                    <div className="owner-card-header">
                        <h2>Membership Statistics</h2>
                    </div>
                    <div className="owner-stats-grid">
                        <div className="owner-stat-item">
                            <FaUsers className="owner-icon" />
                            <div className="owner-stat-content">
                                <h3>{selectedGym?.members?.length || 0}</h3>
                                <p>Total Members</p>
                            </div>
                        </div>
                        <div className="owner-stat-item">
                            <FaUsers className="owner-icon" />
                            <div className="owner-stat-content">
                                <h3>
                                    {selectedGym.members?.filter(member => member.status === 'active').length || 0}
                                </h3>
                                <p>Active Members</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="owner-card">
                    <div className="owner-card-header">
                        <h2>Facilities</h2>
                    </div>
                    <div className="owner-facilities-grid">
                        {selectedGym.facilities?.map((facility, index) => {
                            const facilityInfo = facilityIcons[facility?.toLowerCase()] || {
                                icon: FaDumbbell,
                                label: facility
                            };
                            const IconComponent = facilityInfo.icon;
                            return (
                                <div key={index} className="owner-facility-item">
                                    <IconComponent className="owner-facility-icon" />
                                    <span>{facilityInfo.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="owner-card">
                    <div className="owner-card-header">
                        <h2>Contact Information</h2>
                    </div>
                    <div className="owner-contact-info">
                        <div className="owner-info-item">
                            <FaPhone className="owner-icon" />
                            <p>{selectedGym.contactInfo?.phone || 'Not provided'}</p>
                        </div>
                        <div className="owner-info-item">
                            <FaEnvelope className="owner-icon" />
                            <p>{selectedGym.contactInfo?.email || 'Not provided'}</p>
                        </div>
                        <div className="owner-info-item">
                            <FaMapMarkerAlt className="owner-icon" />
                            <p>{`${selectedGym.location?.address || ''}, ${selectedGym.location?.city || ''}`}</p>
                        </div>
                    </div>
                </div>
                <div className="owner-card owner-map-card">
                    <div className="owner-card-header">
                        <h2>Location</h2>
                    </div>
                    <div className="owner-map-container">
                        <GymMap
                            coordinates={selectedGym.location?.coordinates}
                            isInteractive={false}
                        />
                    </div>
                </div>
               
            </div>

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <div className="modal-header">
                            <h2>Edit Gym Profile</h2>
                            <button onClick={() => setShowEditModal(false)} className="modal-close">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-tabs">
                            <button
                                className={activeTab === 'basic' ? 'active' : ''}
                                onClick={() => setActiveTab('basic')}
                            >
                                Basic Info
                            </button>
                            <button
                                className={activeTab === 'contact' ? 'active' : ''}
                                onClick={() => setActiveTab('contact')}
                            >
                                Contact
                            </button>
                            <button
                                className={activeTab === 'hours' ? 'active' : ''}
                                onClick={() => setActiveTab('hours')}
                            >
                                Hours
                            </button>
                            <button
                                className={activeTab === 'facilities' ? 'active' : ''}
                                onClick={() => setActiveTab('facilities')}
                            >
                                Facilities
                            </button>
                            <button
                                className={activeTab === 'plans' ? 'active' : ''}
                                onClick={() => setActiveTab('plans')}
                            >
                                Plans
                            </button>
                        </div>
                        <div className="modal-contentss">
                            {renderEditModalContent()}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowEditModal(false)} className="modal-cancel-btn">
                                Cancel
                            </button>
                            <button onClick={handleSaveAll} className="modal-save-btn">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <div className="modal-header">
                            <h2>Request Gym Deletion</h2>
                            <button onClick={() => setShowDeleteModal(false)} className="modal-close">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-content">
                            <FaExclamationTriangle className="delete-warning-icon" />
                            <p>Are you sure you want to request deletion of your gym?</p>
                            <p className="delete-warning">This request will be sent to the admin for review.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowDeleteModal(false)} className="modal-cancel-btn">
                                Cancel
                            </button>
                            <button onClick={handleDeleteRequest} className="modal-delete-btn">
                                Request Deletion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymProfile;