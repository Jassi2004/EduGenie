import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Zap, StarIcon, TicketCheck, X } from 'lucide-react';

const GenerationsExhaustedModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        navigate('/payments');
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="
          relative w-full max-w-md mx-4 bg-gradient-to-br 
          from-cyan-50 to-blue-100 rounded-2xl shadow-2xl 
          border border-cyan-200/50 overflow-hidden
        "
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-cyan-100 transition-colors z-10"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                <div
                    className="absolute inset-0 opacity-10 pointer-events-none animate-pulse"
                    style={{
                        background: `
              radial-gradient(circle at top right, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
              radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.1) 0%, transparent 50%)
            `,
                    }}
                />

                <div className="relative z-10 p-8 space-y-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-cyan-100 p-4 rounded-full animate-bounce-slow shadow-lg">
                            <Rocket className="text-cyan-600 w-16 h-16 transform hover:rotate-12" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
                        Generations Exhausted
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Unlock Unlimited Potential with Our Weekly Exam Prep!
                    </p>

                    <div className="space-y-4 bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-cyan-100">
                        <div className="flex items-center space-x-4 text-cyan-700">
                            <Zap className="w-8 h-8" />
                            <span className="text-lg font-semibold">Unlimited AI Test Generation</span>
                        </div>
                        <div className="flex items-center space-x-4 text-cyan-700">
                            <StarIcon className="w-8 h-8" />
                            <span className="text-lg font-semibold">Advanced Learning Insights</span>
                        </div>
                        <div className="flex items-center space-x-4 text-cyan-700">
                            <TicketCheck className="w-8 h-8" />
                            <span className="text-lg font-semibold">Weekly Exam Prep Package</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 mb-2">
                            ₹10
                            <span className="text-2xl text-gray-500 ml-2">/ Week</span>
                        </p>
                        <p className="text-sm text-gray-500">Transform Your Study Strategy</p>
                    </div>

                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-full text-cyan-600 border-2 border-cyan-300 hover:bg-cyan-50 transition-all"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleUpgrade}
                            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-2xl"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerationsExhaustedModal;
