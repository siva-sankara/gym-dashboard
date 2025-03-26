import React, { useState } from 'react';
import { getLocationDetails, registerGym } from '../../apis/apis';
import './RegisterOwnGym.css';
import { showToast } from '../../components/toast/Toast';
import {  FaMapMarkerAlt, FaPhone, FaCopy, FaBusinessTime, FaClock } from 'react-icons/fa';
import { getLocationFromAddress } from '../../utils/locationUtils';
import { useNavigate } from 'react-router-dom';
const initialFormData = {
    name: '',
    description: '',
    mainImage: "https://snworksceo.imgix.net/cav/8d443aec-2090-4e9e-8793-6b95d830d89f.sized-1000x1000.JPG?w=1000",
    location: {
        address: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        coordinates: {
            type: 'Point',
            coordinates: [0, 0]
        }
    },
    contactInfo: {
        email: '',
        phone: '',
        website: ''
    },
    businessDetails: {
        registrationNumber: '',
        gstNumber: '',
        establishmentYear: new Date().getFullYear(),
        licenseNumber: ''
    },
    facilities: [],
    operatingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '06:00', close: '22:00' },
        sunday: { open: '06:00', close: '22:00' }
    }
}
const RegisterOwnGym = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [bulkTiming, setBulkTiming] = useState({ open: '06:00', close: '22:00' });
    const [selectedDays, setSelectedDays] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [formData, setFormData] = useState(initialFormData);

    const facilities = ['parking', 'shower', 'wifi', 'locker', 'cafe', 'trainer', 'spa'];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const handleChange = (e, section, subsection) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [subsection ? subsection : name]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFacilityChange = (facility) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (formData.location.coordinates.coordinates[0] === 0 &&
                formData.location.coordinates.coordinates[1] === 0) {
                const addressString = `${formData.location.address}, ${formData.location.area}, ${formData.location.city}, ${formData.location.state}, ${formData.location.pincode}`;
                try {
                    const locationData = await getLocationFromAddress(addressString);
                    formData.location.coordinates = {
                        type: 'Point',
                        coordinates: [
                            locationData.coordinates.longitude,  // Longitude first
                            locationData.coordinates.latitude    // Latitude second
                        ]
                    };
                } catch (error) {
                    showToast({
                        type: 'error',
                        message: 'Please provide valid location details or use detect location',
                        playSound: true
                    });
                    setLoading(false);
                    return;
                }
            }

            // Proceed with gym registration
            const response = await registerGym(formData);
            if (response && response.data && response.data?.gym?._id) {
                navigate('/user-dashboard/payment', {
                    state: {
                        gymId: response.data?.gym?._id, // Use the correct path to gym ID
                        gymName: formData.name,
                        subscriptionPlans: [
                            {
                                name: 'Basic',
                                amount: 999,
                                duration: '1 month',
                                features: ['Basic listing', 'Email support']
                            },
                            {
                                name: 'Premium',
                                amount: 2999,
                                duration: '3 months',
                                features: ['Featured listing', 'Priority support', 'Analytics']
                            },
                            {
                                name: 'Pro',
                                amount: 4999,
                                duration: '6 months',
                                features: ['Premium listing', '24/7 support', 'Advanced Analytics', 'Marketing Tools']
                            }
                        
                        ]
                    }
                });
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            showToast({
                type: 'error',
                message: error.message || 'Failed to register gym',
                playSound: true
            });
        } finally {
            setLoading(false);
        }
    };
    const handleBulkTimingChange = (e) => {
        const { name, value } = e.target;
        setBulkTiming(prev => ({ ...prev, [name]: value }));
    };
    const applyBulkTiming = () => {
        setFormData(prev => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                ...selectedDays.reduce((acc, day) => ({
                    ...acc,
                    [day]: { ...bulkTiming }
                }), {})
            }
        }));
        setSelectedDays([]);
    };
    const handleHolidayChange = (day) => {
        if (holidays.includes(day)) {
            setHolidays(prev => prev.filter(d => d !== day));
            setFormData(prev => ({
                ...prev,
                operatingHours: {
                    ...prev.operatingHours,
                    [day]: { open: '06:00', close: '22:00' }
                }
            }));
        } else {
            setHolidays(prev => [...prev, day]);
            setFormData(prev => ({
                ...prev,
                operatingHours: {
                    ...prev.operatingHours,
                    [day]: { open: 'closed', close: 'closed' }
                }
            }));
        }
    };
    const handleAreaSearch = async (e) => {
        const areaValue = e.target.value;
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                area: areaValue
            }
        }));

        if (areaValue.length > 3) {
            try {
                const locationData = await getLocationFromAddress(areaValue);
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        city: locationData?.address.city,
                        state: locationData?.address.state,
                        pincode: locationData?.address.pincode || locationData?.address?.postcode,
                        coordinates: {
                            type: 'Point',
                            coordinates: [
                                locationData?.coordinates.latitude  ,
                                locationData?.coordinates.longitude,
                                 
                            ]
                        }
                    }
                }));
            } catch (error) {
                showToast({
                    type: 'error',
                    message: 'Failed to fetch location details',
                    playSound: true
                });
            }
        }
    };
    const detectCurrentLocation = async () => {
        if (!navigator.geolocation) {
            showToast({
                type: 'error',
                message: 'Geolocation is not supported by your browser',
                playSound: true
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const locationData = await getLocationDetails(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    setFormData(prev => ({
                        ...prev,
                        location: {
                            ...prev.location,
                            address: locationData.display_name,
                            area: locationData.address?.suburb || locationData.address?.village || '',
                            city: locationData.address?.city || locationData.address?.county || '',
                            state: locationData.address?.state || '',
                            pincode: locationData.address?.postcode || locationData.address?.pincode ||'',
                            coordinates: {
                                type: 'Point',
                                coordinates: [
                                    parseFloat(locationData.lon),    // Longitude first
                                    parseFloat(locationData.lat)     // Latitude second
                                ]
                            }
                        }
                    }));

                    showToast({
                        type: 'success',
                        message: 'Location detected successfully!',
                        playSound: true
                    });
                } catch (error) {
                    showToast({
                        type: 'error',
                        message: 'Failed to fetch location details',
                        playSound: true
                    });
                }
            },
            (error) => {
                let errorMessage = 'Failed to detect location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Please allow location access to use this feature';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred';
                }
                showToast({
                    type: 'error',
                    message: errorMessage,
                    playSound: true
                });
            }
        );
    };
    return (
        <div className="register-gym-container">
            <form onSubmit={handleSubmit} className="register-gym-form" autoComplete="off"
                spellCheck="false">
                <h2> Register Your Gym</h2>

                <div className="form-section">
                    <h3> Basic Information</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Gym Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        spellCheck="false"
                    />
                    <textarea
                        name="description"
                        placeholder="Gym Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        spellCheck="false"
                    />
                </div>

                <div className="form-section">
                    <div className="location-head">
                        <h3> Location Details</h3>
                        <p
                            onClick={detectCurrentLocation}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                // gap: '5px',
                                margin:'0'
                              
                            }}
                        >
                            <FaMapMarkerAlt /> Detect My Location
                        </p>
                    </div>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.location.address}
                        onChange={(e) => handleChange(e, 'location')}
                        required
                        autoComplete="new-password"
                        spellCheck="false"
                    />
                    <div className="form-row">
                        <div className="input-with-icon">
                            <input
                                type="text"
                                name="area"
                                placeholder="Area"
                                value={formData.location.area}
                                onChange={handleAreaSearch}
                                required
                                autoComplete="new-password"
                                spellCheck="false"
                            />
                        </div>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.location.city}
                            onChange={(e) => handleChange(e, 'location')}
                            required
                            autoComplete="new-password"
                            spellCheck="false"
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.location.state}
                            onChange={(e) => handleChange(e, 'location')}
                            required
                            autoComplete="new-password"
                            spellCheck="false"
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.location.pincode}
                            onChange={(e) => handleChange(e, 'location')}
                            required
                            autoComplete="new-password"
                            spellCheck="false"
                        />
                    </div>
                </div>
                <div className="contact-business-info">

                    <div className="form-section contact-info">
                        <h3><FaPhone /> Contact Information</h3>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.contactInfo.email}
                            onChange={(e) => handleChange(e, 'contactInfo')}
                            required
                            autoComplete="new-password"

                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.contactInfo.phone}
                            onChange={(e) => handleChange(e, 'contactInfo')}
                            required
                            autoComplete="new-password"
                        />
                        <input
                            type="url"
                            name="website"
                            placeholder="Website"
                            value={formData.contactInfo.website}
                            onChange={(e) => handleChange(e, 'contactInfo')}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-section business-info">
                        <h3><FaBusinessTime /> Business Details</h3>
                        <input
                            type="text"
                            name="registrationNumber"
                            placeholder="Registration Number"
                            value={formData.businessDetails.registrationNumber}
                            onChange={(e) => handleChange(e, 'businessDetails')}
                            required
                            autoComplete="new-password"
                        />
                        <input
                            type="text"
                            name="gstNumber"
                            placeholder="GST Number"
                            value={formData.businessDetails.gstNumber}
                            onChange={(e) => handleChange(e, 'businessDetails')}
                            required
                            autoComplete="new-password"
                        />
                        <input
                            type="text"
                            name="licenseNumber"
                            placeholder="License Number"
                            value={formData.businessDetails.licenseNumber}
                            onChange={(e) => handleChange(e, 'businessDetails')}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Facilities</h3>
                    <div className="facilities-grid">
                        {facilities.map(facility => (
                            <label key={facility} className="facility-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.facilities.includes(facility)}
                                    onChange={() => handleFacilityChange(facility)}
                                />
                                {facility.charAt(0).toUpperCase() + facility.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3><FaClock /> Operating Hours</h3>

                    <div className="bulk-timing-section">
                        <h4>Bulk Update Timings</h4>
                        <div className="bulk-timing-controls">
                            <div className="time-inputs">
                                <input
                                    type="time"
                                    name="open"
                                    value={bulkTiming.open}
                                    onChange={handleBulkTimingChange}
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    name="close"
                                    value={bulkTiming.close}
                                    onChange={handleBulkTimingChange}
                                />
                            </div>
                            <div className="day-selection">
                                {days.map(day => (
                                    <label key={`bulk-${day}`} className="day-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(day)}
                                            onChange={() => {
                                                setSelectedDays(prev =>
                                                    prev.includes(day)
                                                        ? prev.filter(d => d !== day)
                                                        : [...prev, day]
                                                );
                                            }}
                                        />
                                        <p>{day.charAt(0).toUpperCase() + day.slice(1)}</p>
                                    </label>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="apply-bulk-btn"
                                onClick={applyBulkTiming}
                                disabled={selectedDays.length === 0}
                            >
                                <FaCopy /> Apply to Selected Days
                            </button>
                        </div>
                    </div>

                    <div className="operating-hours-grid">
                        {days.map(day => (
                            <div key={day} className="day-hours">
                                <div className="day-header">
                                    <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                                    <select
                                        value={holidays.includes(day) ? 'holiday' : 'open'}
                                        onChange={() => handleHolidayChange(day)}
                                        className="holiday-select"
                                    >
                                        <option value="open">Open</option>
                                        <option value="holiday">Holiday</option>
                                    </select>
                                </div>
                                {!holidays.includes(day) ? (
                                    <div className="hours-inputs">
                                        <input
                                            type="time"
                                            value={formData.operatingHours[day].open}
                                            onChange={(e) => handleChange(e, 'operatingHours', day)}
                                            name="open"
                                        />
                                        <span>to</span>
                                        <input
                                            type="time"
                                            value={formData.operatingHours[day].close}
                                            onChange={(e) => handleChange(e, 'operatingHours', day)}
                                            name="close"
                                        />
                                    </div>
                                ) : (
                                    <div className="holiday-indicator">Closed</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="loading-spinner">
                                Registering...
                            </span>
                        </>
                    ) : (
                        'Register Gym'
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegisterOwnGym;