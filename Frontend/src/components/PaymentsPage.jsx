import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { CreditCard, Crown, CheckCircle, ArrowRight } from 'lucide-react';

const PricingTier = ({
    title,
    price,
    description,
    features,
    recommended = false,
    onPurchase,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="perspective-1000 transform-style-3d"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card
                className={`
                    relative overflow-hidden 
                    bg-white border-2 border-transparent
                    rounded-3xl shadow-2xl 
                    transition-all duration-500 ease-in-out pop-up-2
                    ${isHovered ? 'border-cyan-300 shadow-[0_0_40px_rgba(14,165,233,0.3)]' : ''}
                    hover:scale-[1.03]
                    transform origin-center
                    w-full max-w-sm mx-auto
                    ${recommended ? 'ring-4 ring-cyan-300/50' : ''}
                `}
            >
                <CardHeader
                    className="relative z-10 flex flex-col items-center justify-center text-center pt-8 pb-4"
                >
                    <div
                        className={`
                            bg-cyan-100 p-4 rounded-full mb-4 
                            transition-all duration-500
                            ${isHovered ? 'rotate-[360deg] scale-110' : ''}
                        `}
                    >
                        {recommended ? (
                            <Crown className="text-cyan-600 w-12 h-12 transition-all duration-500" />
                        ) : (
                            <CreditCard className="text-cyan-600 w-12 h-12 transition-all duration-500" />
                        )}
                    </div>
                    <h2
                        className="
                            text-3xl font-extrabold 
                            bg-clip-text text-transparent 
                            bg-gradient-to-r from-cyan-500 to-blue-600 
                            tracking-tight
                        "
                    >
                        {title}
                    </h2>
                    <p
                        className="
                            text-2xl font-bold mt-2
                            text-gray-800
                        "
                    >
                        Rs. {price}/month
                    </p>
                </CardHeader>

                <CardBody className="relative z-10 flex flex-col items-center justify-center space-y-4 px-6 pb-8">
                    <p
                        className="
                            text-gray-600 text-center text-sm 
                            tracking-wide leading-relaxed
                        "
                    >
                        {description}
                    </p>

                    <div className="w-full space-y-2">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 text-gray-700"
                            >
                                <CheckCircle className="w-5 h-5 text-cyan-500" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={onPurchase}
                        className="
                            px-8 py-3 rounded-full 
                            bg-gradient-to-r from-cyan-500 to-blue-600 
                            text-white font-bold 
                            hover:from-cyan-600 hover:to-blue-700 
                            transition-all duration-300 
                            shadow-lg hover:shadow-2xl 
                            active:scale-95
                        "
                    >
                        <ArrowRight className="w-5 h-5" />
                        Choose Plan
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};

const PaymentsPage = () => {
    const handlePayment = async (planType) => {
        const userId = localStorage.getItem('userId');  // Assuming user ID is stored in localStorage
        const token = localStorage.getItem('token');    // Assuming token is stored in localStorage

        if (!userId || !token) {
            alert("User is not authenticated.");
            return;
        }

        // Call the backend to create the Razorpay order
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ planType, userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json(); // Parse the response

            if (data.orderId) {
                const options = {
                    key: "rzp_test_Yp5q54vNGZI2qG", // Your Razorpay test key ID
                    amount: planType === 'weekly' ? 1000 : 3500, // Amount in paise
                    currency: "INR",
                    order_id: data.orderId, // Order ID from backend
                    handler: function (response) {
                        // Payment successful, send payment details to backend to update user plan
                        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment-success`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                userId,
                                planType,
                            }),
                        })
                            .then(res => res.json())
                            .then(data => {
                                alert(data.message);  // Notify success/failure
                            })
                            .catch(err => alert("Error updating plan."));
                    },
                    prefill: {
                        name: "User Name",  // Replace with actual user data
                        email: "user@example.com",  // Replace with actual user email
                        contact: "9999999999",  // Replace with actual user contact
                    },
                    theme: {
                        color: "#F37254",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                alert("Error creating Razorpay order.");
            }
        } catch (error) {
            alert("Error occurred: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 mt-14">
            <div className="container mx-auto">
                <div className="text-center mb-16 space-y-4 pop-up-2">
                    <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700">
                        Unlock Your Learning Potential
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose a plan that empowers your academic journey with advanced AI-driven tools
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingTier
                        title="Free"
                        price={0}
                        description="Get started with basic features and explore our platform"
                        features={["Limited Test Generation", "Basic Note Creation", "Community Notes Access"]}
                        onPurchase={() => alert("Free plan selected. No payment required.")}
                    />

                    <PricingTier
                        title="Weekly"
                        price={10}
                        description="Enhance your learning with advanced AI-powered tools"
                        features={["Unlimited Test Generation", "Advanced Note Creation", "AI-Enhanced Study Insights", "Priority Support"]}
                        recommended={true}
                        onPurchase={() => handlePayment("weekly")}
                    />

                    <PricingTier
                        title="Monthly"
                        price={34}
                        description="Comprehensive solution for teams and institutions"
                        features={["Unlimited Everything", "Custom AI Model Training", "Team Collaboration Tools", "Dedicated Support", "Data Analytics Dashboard"]}
                        onPurchase={() => handlePayment("monthly")}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
