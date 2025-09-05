import React, { useState, useEffect } from 'react';
import { X, Play, BookOpen, Video, FileText, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useUser } from '../context/UserContext';

const TutorialModal = ({ tutorial, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { user, setUser } = useUser();

  useEffect(() => {
    if (isOpen && tutorial) {
      setCurrentStep(0);
      setCompleted(false);
    }
  }, [isOpen, tutorial]);

  const handleComplete = () => {
    if (tutorial && onComplete) {
      onComplete(tutorial.tutorialId);
      
      // Update user tutorial progress
      setUser(prev => ({
        ...prev,
        tutorialProgress: prev.tutorialProgress + 1
      }));
    }
    setCompleted(true);
  };

  const handleNext = () => {
    if (tutorial && currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen || !tutorial) return null;

  const currentTutorialStep = tutorial.steps[currentStep];
  const isLastStep = currentStep === tutorial.steps.length - 1;

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'text':
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-purple-600" />;
    }
  };

  const renderContent = () => {
    if (!currentTutorialStep) return null;

    switch (tutorial.contentType) {
      case 'video':
        return (
          <div className="mb-6">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Video content would be embedded here</p>
                <p className="text-xs opacity-50 mt-1">Duration: {tutorial.duration || '5:30'}</p>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentTutorialStep.title}</h3>
              <p className="text-gray-600 leading-relaxed">{currentTutorialStep.content}</p>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentTutorialStep.title}</h3>
              <p className="text-gray-600 mb-4">{currentTutorialStep.content}</p>
              
              {/* Interactive Elements */}
              {currentTutorialStep.interactive && (
                <div className="space-y-3">
                  {currentTutorialStep.interactive.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="mb-6">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentTutorialStep.title}</h3>
              <div className="text-gray-600 leading-relaxed space-y-3">
                {currentTutorialStep.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {/* Key Points */}
              {currentTutorialStep.keyPoints && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Key Points:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                    {currentTutorialStep.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {getContentTypeIcon(tutorial.contentType)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{tutorial.title}</h2>
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {tutorial.steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorial.steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!completed ? (
            <>
              {renderContent()}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {tutorial.steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>{isLastStep ? 'Complete' : 'Next'}</span>
                  {!isLastStep && <ArrowRight className="w-4 h-4" />}
                  {isLastStep && <CheckCircle className="w-4 h-4" />}
                </button>
              </div>
            </>
          ) : (
            /* Completion Screen */
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tutorial Complete!</h3>
              <p className="text-gray-600 mb-6">
                Great job! You've completed "{tutorial.title}". 
                Keep practicing to master these concepts.
              </p>
              
              {/* Achievement Badge */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 mb-6 inline-block">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Tutorial Completed</span>
                </div>
              </div>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continue Trading
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Default tutorial data
export const defaultTutorials = [
  {
    tutorialId: 'basics-1',
    title: 'Trading Basics: Buy and Sell Orders',
    contentType: 'text',
    triggerEvent: 'first_trade',
    steps: [
      {
        title: 'Understanding Buy Orders',
        content: 'A buy order is an instruction to purchase a security at or below a specified price. When you place a buy order, you\'re expressing your willingness to acquire shares of a stock.\n\nThere are two main types of buy orders:\n• Market Order: Executes immediately at the current market price\n• Limit Order: Executes only at your specified price or better',
        keyPoints: [
          'Market orders execute immediately but price is not guaranteed',
          'Limit orders give you price control but may not execute',
          'Always consider the bid-ask spread when placing orders'
        ]
      },
      {
        title: 'Understanding Sell Orders',
        content: 'A sell order is an instruction to sell a security you own at or above a specified price. This allows you to exit a position and realize profits or limit losses.\n\nSell order types:\n• Market Order: Sells immediately at current market price\n• Limit Order: Sells only at your specified price or better\n• Stop-Loss Order: Sells when price drops to a certain level',
        keyPoints: [
          'Stop-loss orders help limit your losses',
          'Limit sell orders can help you capture target profits',
          'Consider market volatility when choosing order types'
        ]
      },
      {
        title: 'Order Execution and Timing',
        content: 'Understanding when and how your orders execute is crucial for successful trading. Market conditions, order type, and timing all affect execution.\n\nKey factors affecting execution:\n• Market hours vs. after-hours trading\n• Order size and market liquidity\n• Price volatility and market conditions',
        keyPoints: [
          'Market orders execute faster but at uncertain prices',
          'Large orders may face slippage in volatile markets',
          'Pre-market and after-hours trading have different rules'
        ]
      }
    ]
  },
  {
    tutorialId: 'risk-management-1',
    title: 'Risk Management Fundamentals',
    contentType: 'interactive',
    triggerEvent: 'large_loss',
    steps: [
      {
        title: 'Position Sizing',
        content: 'Position sizing is one of the most important aspects of risk management. It determines how much of your capital you risk on each trade.',
        interactive: [
          {
            title: '2% Rule',
            description: 'Never risk more than 2% of your total capital on a single trade'
          },
          {
            title: 'Calculate Position Size',
            description: 'Position Size = (Account Size × Risk %) ÷ (Entry Price - Stop Loss Price)'
          },
          {
            title: 'Diversification',
            description: 'Spread risk across multiple positions and sectors'
          }
        ]
      },
      {
        title: 'Stop-Loss Strategies',
        content: 'Stop-loss orders are essential tools for limiting losses and protecting your capital.',
        interactive: [
          {
            title: 'Percentage Stop-Loss',
            description: 'Set stop-loss at a fixed percentage below entry price (e.g., 5%)'
          },
          {
            title: 'Technical Stop-Loss',
            description: 'Place stop-loss below key support levels or technical indicators'
          },
          {
            title: 'Trailing Stop-Loss',
            description: 'Automatically adjust stop-loss as price moves in your favor'
          }
        ]
      }
    ]
  },
  {
    tutorialId: 'market-analysis-1',
    title: 'Reading Market Trends',
    contentType: 'video',
    triggerEvent: 'market_volatility',
    duration: '7:45',
    steps: [
      {
        title: 'Identifying Trends',
        content: 'Market trends are the general direction of price movement over time. Understanding trends helps you make better trading decisions.\n\nTypes of trends:\n• Uptrend: Series of higher highs and higher lows\n• Downtrend: Series of lower highs and lower lows\n• Sideways: Price moves within a range without clear direction'
      },
      {
        title: 'Support and Resistance',
        content: 'Support and resistance levels are key price points where buying or selling pressure tends to emerge.\n\nSupport: Price level where buying interest is strong enough to prevent further decline\nResistance: Price level where selling pressure prevents further advance'
      },
      {
        title: 'Volume Analysis',
        content: 'Volume confirms price movements and provides insight into the strength of trends.\n\nKey volume concepts:\n• High volume confirms strong moves\n• Low volume suggests weak conviction\n• Volume spikes often occur at trend reversals'
      }
    ]
  }
];

export default TutorialModal;
