import React, { useState } from 'react';
import { TrendingUp, User, Settings, Crown } from 'lucide-react';
import { useUser } from '../context/UserContext';
import SubscriptionModal from './SubscriptionModal';

const Header = () => {
  const { user } = useUser();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <header className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-white">SimuTrade</h1>
            <span className="text-sm text-white/70 hidden sm:block">
              Master trading, risk-free
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white/70">Virtual Balance</p>
              <p className="text-lg font-semibold text-accent">
                ${user.virtualBalance.toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Subscription Button */}
              {user.subscriptionTier === 'free' && (
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </button>
              )}
              
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user.username}</p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="text-xs text-white/70 capitalize hover:text-white transition-colors"
                >
                  {user.subscriptionTier}
                  {user.subscriptionTier !== 'free' && <Crown className="w-3 h-3 inline ml-1" />}
                </button>
              </div>
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </header>
  );
};

export default Header;
