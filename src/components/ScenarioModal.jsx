import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { aiService } from '../services/api';
import { useUser } from '../context/UserContext';
import { useMarket } from '../context/MarketContext';

const ScenarioModal = ({ scenario, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAction, setUserAction] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { user } = useUser();
  const { marketData, selectedSymbol } = useMarket();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setUserAction('');
      setFeedback('');
      setCompleted(false);
    }
  }, [isOpen]);

  const handleActionSubmit = async (action) => {
    setUserAction(action);
    setIsLoading(true);

    try {
      const guidance = await aiService.generateScenarioGuidance(scenario, action);
      setFeedback(guidance);
      setCompleted(true);
    } catch (error) {
      console.error('Error getting scenario guidance:', error);
      setFeedback('Great attempt! Consider the market conditions and your risk tolerance when making trading decisions.');
      setCompleted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete(scenario.scenarioId, {
      action: userAction,
      feedback: feedback,
      completedAt: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen || !scenario) return null;

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getActionButtons = () => {
    switch (scenario.type) {
      case 'earnings':
        return [
          { action: 'buy', label: 'Buy Before Earnings', color: 'bg-green-600 hover:bg-green-700' },
          { action: 'sell', label: 'Sell Before Earnings', color: 'bg-red-600 hover:bg-red-700' },
          { action: 'hold', label: 'Hold Position', color: 'bg-blue-600 hover:bg-blue-700' },
          { action: 'wait', label: 'Wait for Results', color: 'bg-gray-600 hover:bg-gray-700' }
        ];
      case 'news':
        return [
          { action: 'buy_dip', label: 'Buy the Dip', color: 'bg-green-600 hover:bg-green-700' },
          { action: 'sell_panic', label: 'Sell to Avoid Loss', color: 'bg-red-600 hover:bg-red-700' },
          { action: 'hedge', label: 'Hedge Position', color: 'bg-purple-600 hover:bg-purple-700' },
          { action: 'analyze', label: 'Analyze Further', color: 'bg-blue-600 hover:bg-blue-700' }
        ];
      case 'technical':
        return [
          { action: 'breakout_buy', label: 'Buy Breakout', color: 'bg-green-600 hover:bg-green-700' },
          { action: 'wait_confirmation', label: 'Wait for Confirmation', color: 'bg-yellow-600 hover:bg-yellow-700' },
          { action: 'short_resistance', label: 'Short at Resistance', color: 'bg-red-600 hover:bg-red-700' },
          { action: 'set_alerts', label: 'Set Price Alerts', color: 'bg-blue-600 hover:bg-blue-700' }
        ];
      default:
        return [
          { action: 'buy', label: 'Buy', color: 'bg-green-600 hover:bg-green-700' },
          { action: 'sell', label: 'Sell', color: 'bg-red-600 hover:bg-red-700' },
          { action: 'hold', label: 'Hold', color: 'bg-blue-600 hover:bg-blue-700' }
        ];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Play className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Practice Scenario</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Scenario Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              {getImpactIcon(scenario.impact)}
              <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{scenario.description}</p>
            
            {/* Market Context */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Market Context</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Symbol:</span>
                  <span className="ml-2 font-medium">{selectedSymbol}</span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <span className="ml-2 font-medium">${marketData[selectedSymbol]?.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Change:</span>
                  <span className={`ml-2 font-medium ${marketData[selectedSymbol]?.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {marketData[selectedSymbol]?.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Your Balance:</span>
                  <span className="ml-2 font-medium">${user.virtualBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Selection */}
          {!completed && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">What would you do in this situation?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getActionButtons().map((button) => (
                  <button
                    key={button.action}
                    onClick={() => handleActionSubmit(button.action)}
                    disabled={isLoading}
                    className={`${button.color} text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your decision...</p>
            </div>
          )}

          {/* Feedback */}
          {feedback && !isLoading && (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">AI Mentor Feedback</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">{feedback}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completion */}
          {completed && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-900 mb-1">Scenario Complete!</h4>
                <p className="text-green-800 text-sm">You've successfully completed this practice scenario.</p>
              </div>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continue Learning
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioModal;
