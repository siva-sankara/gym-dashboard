import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = ({ amount, planName, onSuccess, onFailure }) => {
    const navigate = useNavigate();

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load');
            return;
        }

        // Replace with your actual API call to get order details from backend
        const orderData = await fetch('your-backend-api/create-order', {
            method: 'POST',
            body: JSON.stringify({
                amount: amount * 100, // Razorpay expects amount in paise
                planName: planName
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(t => t.json());

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: amount * 100,
            currency: "INR",
            name: "Gym Dashboard",
            description: `Payment for ${planName} Plan`,
            order_id: orderData.id,
            handler: async function (response) {
                try {
                    // Verify payment with backend
                    const verifyData = await fetch('your-backend-api/verify-payment', {
                        method: 'POST',
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(t => t.json());

                    if (verifyData.success) {
                        onSuccess(response);
                        navigate('/payment-success');
                    } else {
                        onFailure('Payment verification failed');
                    }
                } catch (error) {
                    onFailure(error.message);
                }
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "9999999999"
            },
            theme: {
                color: "#3887be"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className="payment-container">
            <button onClick={displayRazorpay} className="payment-button">
                Pay ₹{amount}
            </button>
        </div>
    );
};

export default Payment;