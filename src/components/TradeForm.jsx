import React, { useState } from 'react';
import { ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { useUser } from '../context/UserContext';
import FeedbackCard from './FeedbackCard';

const TradeForm = () => {
  const { marketData, selectedSymbol } = useMarket();
  const { user, addTrade, updateBalance } = useUser();
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = marketData[selectedSymbol]?.price || 0;
  const totalValue = quantity ? parseFloat(quantity) * currentPrice : 0;

  const generateAIFeedback = async (trade) => {
    setIsLoading(true);
    try {
      // Import AI service
      const { aiService } = await import('../services/api');
      
      // Get market context for AI analysis
      const marketContext = {
        currentPrice: currentPrice,
        changePercent: marketData[selectedSymbol]?.changePercent || 0,
        symbol: selectedSymbol
      };

      // Generate AI feedback
      const feedbackData = await aiService.generateTradeFeedback(trade, marketContext);
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback({
        message: "Trade executed successfully! Keep practicing to improve your skills.",
        sentiment: 'neutral',
        tips: ["Continue learning trading fundamentals"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!quantity || parseFloat(quantity) <= 0) return;

    const tradeQuantity = parseFloat(quantity);
    const tradeValue = tradeQuantity * currentPrice;

    // Check if user has enough balance for buy orders
    if (tradeType === 'buy' && tradeValue > user.virtualBalance) {
      alert('Insufficient virtual balance!');
      return;
    }

    // Simulate profit/loss (random for demo)
    const profitLoss = tradeType === 'buy' 
      ? -tradeValue // Subtract cost for buy
      : tradeValue * (0.95 + Math.random() * 0.1); // Random profit for sell

    const trade = {
      symbol: selectedSymbol,
      type: tradeType,
      quantity: tradeQuantity,
      entryPrice: currentPrice,
      exitPrice: tradeType === 'sell' ? currentPrice : null,
      profitLoss: profitLoss,
    };

    const completedTrade = addTrade(trade);
    await generateAIFeedback(completedTrade);
    setQuantity('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Place Trade</h2>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              tradeType === 'buy'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
            <span>Buy</span>
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              tradeType === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
            <span>Sell</span>
          </button>
        </div>

        <form onSubmit={handleTrade} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Symbol
            </label>
            <input
              type="text"
              value={selectedSymbol}
              disabled
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Price per Share
            </label>
            <input
              type="text"
              value={`$${currentPrice.toFixed(2)}`}
              disabled
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Total Value:</span>
              <span className="text-white font-medium">
                ${totalValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-white/70">Available Balance:</span>
              <span className="text-accent font-medium">
                ${user.virtualBalance.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!quantity || parseFloat(quantity) <= 0 || isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              tradeType === 'buy'
                ? 'bg-accent hover:bg-accent/80 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedSymbol}`}
          </button>
        </form>
      </div>

      {feedback && (
        <FeedbackCard 
          feedback={feedback} 
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
};

export default TradeForm;
