import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';
import { showToast } from '../../components/toast/Toast';
import { FaCheck, FaCrown } from 'react-icons/fa';
import { createGymPaymentOrder, getUserById, verifyGymPayment } from '../../apis/apis';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const { gymId, gymName, subscriptionPlans } = location.state || {};
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        console.log('Environment Variables:', {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            nodeEnv: process.env.NODE_ENV
        });
        const loadRazorpay = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpay();
    }, []);

    const handlePayment = async () => {
        if (!selectedPlan) {
            showToast({
                type: 'warning',
                message: 'Please select a subscription plan',
                playSound: true
            });
            return;
        }

        setLoading(true);
        try {
            const orderResponse = await createGymPaymentOrder(
                gymId,
                selectedPlan.amount * 100
            );

            if (!orderResponse.success) {
                throw new Error(orderResponse.message || 'Failed to create order');
            }

            const options = {
                key: orderResponse.data.key,
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency,
                name: orderResponse.data.name,
                description: orderResponse.data.description,
                order_id: orderResponse.data.razorpay_order_id,
                handler: async (response) => {
                    try {

                        const verifyData = await verifyGymPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            gymId: gymId
                        });
                        console.log(verifyData);
                        
                        if (verifyData.success) {
                            localStorage.setItem('userRole','gym_owner');
                            showToast({
                                type: 'success',
                                message: 'Payment successful!',
                                playSound: true
                            });
                            navigate('/user-dashboard');
                        }
                    } catch (error) {
                        showToast({
                            type: 'error',
                            message: 'Payment verification failed',
                            playSound: true
                        });
                    }
                },
                prefill: orderResponse.data.prefill,
                theme: {
                    color: "#3887be"
                },
                modal: {
                    ondismiss: function () {
                        showToast({
                            type: 'warning',
                            message: 'Payment cancelled',
                            playSound: true
                        });
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            showToast({
                type: 'error',
                message: error.message || 'Failed to initialize payment',
                playSound: true
            });
        } finally {
            setLoading(false);
        }
    };


    if (!subscriptionPlans) {
        return <div className="payment-error">Invalid payment details</div>;
    }

    return (
        <div className="payment-screen">
            <div className="payment-container">
                <h2>Choose Your Subscription Plan</h2>
                <p className="gym-name">for {gymName}</p>

                <div className="subscription-plans">
                    {subscriptionPlans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`plan-card ${selectedPlan?.name === plan.name ? 'selected' : ''} ${plan.name === 'Premium' ? 'popular' : ''}`}
                            onClick={() => setSelectedPlan(plan)}
                        >
                            {plan.name === 'Premium' && <div className="popular-tag"><FaCrown /> Popular</div>}
                            <h3>{plan.name}</h3>
                            <div className="prices">
                                <span className="currency">₹</span>
                                <span className="amount">{plan.amount}</span>
                                <span className="duration">/{plan.duration}</span>
                            </div>
                            <div className="features-list-f">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="feature">
                                        <FaCheck /> {feature}
                                    </div>
                                ))}
                            </div>
                            <button
                                className={`select-plan-btn ${selectedPlan?.name === plan.name ? 'selected' : ''}`}
                                onClick={() => setSelectedPlan(plan)}
                            >
                                {selectedPlan?.name === plan.name ? 'Selected' : 'Select Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handlePayment}
                    className="payment-button"
                    disabled={loading || !selectedPlan}
                >
                    {loading ? 'Processing...' : `Pay ₹${selectedPlan?.amount || '0'}`}
                </button>
            </div>
        </div>
    );
};

export default Payment;