// API service layer for SimuTrade
import OpenAI from 'openai';

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

// Supabase Configuration (placeholder for future implementation)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// OpenAI API Service
export const aiService = {
  async generateTradeFeedback(trade, marketContext) {
    try {
      const prompt = `
        Analyze this trading decision and provide constructive feedback:
        
        Trade Details:
        - Symbol: ${trade.symbol}
        - Type: ${trade.type}
        - Quantity: ${trade.quantity}
        - Price: $${trade.entryPrice}
        - Total Value: $${trade.quantity * trade.entryPrice}
        
        Market Context:
        - Current Price: $${marketContext.currentPrice}
        - Price Change: ${marketContext.changePercent}%
        - Market Trend: ${marketContext.changePercent > 0 ? 'Bullish' : 'Bearish'}
        
        Please provide:
        1. A brief assessment of the trade decision (2-3 sentences)
        2. Risk management suggestions
        3. Learning points for improvement
        
        Keep the response educational and encouraging, suitable for a learning trader.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an experienced trading mentor providing educational feedback to help users learn trading strategies and risk management."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return {
        message: response.choices[0].message.content,
        sentiment: this.analyzeSentiment(response.choices[0].message.content),
        tips: this.extractTips(response.choices[0].message.content)
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback to mock feedback
      return this.getMockFeedback(trade);
    }
  },

  async generateScenarioGuidance(scenario, userAction) {
    try {
      const prompt = `
        Trading Scenario: ${scenario.title}
        Description: ${scenario.description}
        Market Event: ${scenario.marketEvent}
        User Action: ${userAction}
        
        Provide guidance on whether this action is appropriate for the scenario.
        Include:
        1. Assessment of the user's decision
        2. Alternative strategies to consider
        3. Key learning points
        
        Keep response concise and educational.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a trading instructor guiding users through practice scenarios."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 250,
        temperature: 0.6
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "Great attempt! Consider the market conditions and your risk tolerance when making trading decisions.";
    }
  },

  getMockFeedback(trade) {
    const mockFeedbacks = {
      buy: [
        "Good timing! The stock is showing positive momentum. Consider setting a stop-loss at 5% below your entry price.",
        "Solid choice for a long position. The current trend supports your decision. Watch for resistance levels.",
        "Nice entry point! The technical indicators suggest potential upward movement. Consider taking profits at 10% gain."
      ],
      sell: [
        "Smart move to take profits! The stock was showing signs of resistance. Consider reinvesting in growing sectors.",
        "Good risk management by closing this position. Monitor the market for re-entry opportunities.",
        "Wise decision to exit. The momentum was shifting. Keep cash ready for better opportunities."
      ]
    };

    const feedbacks = mockFeedbacks[trade.type] || mockFeedbacks.buy;
    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

    return {
      message: randomFeedback,
      sentiment: Math.random() > 0.7 ? 'positive' : 'neutral',
      tips: [
        "Always set stop-loss orders to manage risk",
        "Diversify your portfolio across different sectors",
        "Keep learning about market fundamentals"
      ]
    };
  },

  analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'smart', 'wise', 'solid', 'nice'];
    const negativeWords = ['poor', 'bad', 'risky', 'dangerous', 'avoid', 'caution'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  },

  extractTips(text) {
    // Simple tip extraction - in production, this could be more sophisticated
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(-2).map(s => s.trim()).filter(s => s.length > 0);
  }
};

// Supabase API Service (placeholder for future implementation)
export const supabaseService = {
  async saveUser(userData) {
    // TODO: Implement Supabase user creation
    console.log('Saving user to Supabase:', userData);
    return { success: true, data: userData };
  },

  async saveTrade(tradeData) {
    // TODO: Implement Supabase trade storage
    console.log('Saving trade to Supabase:', tradeData);
    return { success: true, data: tradeData };
  },

  async getUserTrades(userId) {
    // TODO: Implement Supabase trade retrieval
    console.log('Fetching trades for user:', userId);
    return { success: true, data: [] };
  },

  async updateTutorialProgress(userId, progress) {
    // TODO: Implement Supabase progress tracking
    console.log('Updating tutorial progress:', userId, progress);
    return { success: true, data: progress };
  }
};

// Stripe API Service (placeholder for future implementation)
export const stripeService = {
  async createSubscription(userId, priceId) {
    // TODO: Implement Stripe subscription creation
    console.log('Creating subscription:', userId, priceId);
    return { success: true, subscriptionId: 'sub_mock_123' };
  },

  async cancelSubscription(subscriptionId) {
    // TODO: Implement Stripe subscription cancellation
    console.log('Cancelling subscription:', subscriptionId);
    return { success: true };
  },

  async updatePaymentMethod(customerId, paymentMethodId) {
    // TODO: Implement Stripe payment method update
    console.log('Updating payment method:', customerId, paymentMethodId);
    return { success: true };
  }
};

// Market Data Service (enhanced)
export const marketService = {
  // Simulate more realistic market data
  generateMarketEvent() {
    const events = [
      {
        type: 'earnings',
        title: 'Quarterly Earnings Report',
        description: 'Company reports better than expected earnings',
        impact: 'positive',
        volatility: 0.15
      },
      {
        type: 'news',
        title: 'Market Volatility Alert',
        description: 'Increased market volatility due to economic uncertainty',
        impact: 'negative',
        volatility: 0.25
      },
      {
        type: 'technical',
        title: 'Technical Breakout',
        description: 'Stock breaks through key resistance level',
        impact: 'positive',
        volatility: 0.12
      }
    ];

    return events[Math.floor(Math.random() * events.length)];
  },

  // Generate realistic price movements
  generatePriceMovement(currentPrice, volatility = 0.02) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    return {
      newPrice: currentPrice * (1 + change),
      change: change,
      changePercent: change * 100
    };
  }
};
