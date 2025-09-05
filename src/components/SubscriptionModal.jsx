import React, { useState } from 'react';
import { X, Check, Crown, Zap, Star, CreditCard, Shield } from 'lucide-react';
import { stripeService } from '../services/api';
import { useUser } from '../context/UserContext';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('plans'); // 'plans', 'payment', 'success'
  const { user, setUser } = useUser();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-gray-600',
      features: [
        '10 trades per day',
        'Basic feedback',
        'Limited scenarios',
        'Community support'
      ],
      limitations: [
        'No advanced analytics',
        'No personalized coaching',
        'Limited tutorial access'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15,
      period: 'month',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-600',
      popular: true,
      features: [
        'Unlimited trades',
        'Advanced AI feedback',
        'All practice scenarios',
        'Advanced analytics',
        'Priority support',
        'Risk management tools'
      ],
      limitations: []
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 30,
      period: 'month',
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-purple-600',
      features: [
        'Everything in Premium',
        'Personalized AI coaching',
        'Custom scenarios',
        'Portfolio analysis',
        'Market alerts',
        '1-on-1 mentor sessions',
        'Advanced charting tools'
      ],
      limitations: []
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (selectedPlan === 'free') {
      // Handle free plan
      setUser(prev => ({ ...prev, subscriptionTier: 'free' }));
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      // In production, this would integrate with Stripe
      const result = await stripeService.createSubscription(user.userId, selectedPlan);
      
      if (result.success) {
        setUser(prev => ({ ...prev, subscriptionTier: selectedPlan }));
        setPaymentStep('success');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStep('plans');
    onClose();
  };

  if (!isOpen) return null;

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  const renderPlansStep = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-3">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-900">Choose Your Plan</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Current Plan */}
      <div className="p-6 bg-blue-50 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Current Plan</h3>
            <p className="text-sm text-gray-600 capitalize">{user.subscriptionTier}</p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div className={`${plan.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                  {plan.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-600">/{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limitations.length > 0 && (
                <ul className="space-y-1 pt-2 border-t border-gray-200">
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleSubscribe}
            disabled={isLoading || selectedPlan === user.subscriptionTier}
            className={`px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedPlan === 'free'
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : selectedPlan === 'premium'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : selectedPlan === user.subscriptionTier ? (
              'Current Plan'
            ) : selectedPlan === 'free' ? (
              'Continue with Free'
            ) : (
              `Upgrade to ${selectedPlanData?.name}`
            )}
          </button>
          
          {selectedPlan !== 'free' && (
            <p className="text-xs text-gray-500 mt-2">
              Cancel anytime. No hidden fees.
            </p>
          )}
        </div>
      </div>
    </>
  );

  const renderPaymentStep = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
        </div>
        <button
          onClick={() => setPaymentStep('plans')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Payment Form */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{selectedPlanData?.name} Plan</span>
            <span className="font-medium">${selectedPlanData?.price}/{selectedPlanData?.period}</span>
          </div>
        </div>

        {/* Mock Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => setPaymentStep('success')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Complete Payment
          </button>
        </div>
      </div>
    </>
  );

  const renderSuccessStep = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-3">
          <Check className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Payment Successful</h2>
        </div>
        <button
          onClick={handlePaymentSuccess}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Success Content */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to {selectedPlanData?.name}!
        </h3>
        
        <p className="text-gray-600 mb-6">
          Your subscription has been activated. You now have access to all {selectedPlanData?.name} features.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">What's New:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {selectedPlanData?.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handlePaymentSuccess}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Start Trading
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {paymentStep === 'plans' && renderPlansStep()}
        {paymentStep === 'payment' && renderPaymentStep()}
        {paymentStep === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
};

export default SubscriptionModal;
