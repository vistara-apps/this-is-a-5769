# SimuTrade - Master Trading, Risk-Free

A comprehensive web application that empowers aspiring traders to learn and practice trading strategies risk-free using virtual currency and receiving instant AI-powered feedback.

## 🚀 Features

### Core Features
- **Simulated Trading Environment**: Virtual trading platform with real-time market data simulation
- **Instant AI Feedback**: OpenAI-powered analysis of trading decisions with actionable insights
- **Guided Practice Scenarios**: Interactive modules simulating specific market events
- **Contextual Trading Tutorials**: Educational content triggered by user actions and market events
- **Subscription Tiers**: Free, Premium, and Pro plans with progressive feature unlocking

### Key Components
- **Real-time Market Data**: Live price updates and market simulation
- **Advanced Charting**: Interactive charts with technical indicators
- **Risk Management Tools**: Position sizing, stop-loss guidance, and portfolio analysis
- **Progress Tracking**: Tutorial completion and trading performance analytics
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **AI Integration**: OpenAI API for trading feedback and coaching
- **Backend Services**: Supabase (planned), Stripe (planned)
- **Deployment**: Docker-ready with multi-stage builds

## 📋 Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for AI feedback features)
- Modern web browser with JavaScript enabled

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simutrade
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── FeedbackCard.jsx     # AI feedback display
│   ├── Header.jsx           # App header with user info
│   ├── MarketOverview.jsx   # Market data display
│   ├── ScenarioModal.jsx    # Practice scenarios
│   ├── SubscriptionModal.jsx # Subscription management
│   ├── TradeForm.jsx        # Trading interface
│   ├── TradeHistory.jsx     # Trade history display
│   ├── TradingChart.jsx     # Price charts
│   ├── TradingDashboard.jsx # Main dashboard layout
│   ├── TutorialModal.jsx    # Interactive tutorials
│   ├── TutorialPanel.jsx    # Learning center
│   └── WelcomeModal.jsx     # Onboarding
├── context/              # React Context providers
│   ├── MarketContext.jsx    # Market data state
│   └── UserContext.jsx      # User state management
├── services/             # API services
│   └── api.js              # OpenAI, Supabase, Stripe integrations
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## 🎯 Usage Guide

### Getting Started
1. **Welcome**: New users see an onboarding modal explaining the platform
2. **Virtual Balance**: Start with $100,000 in virtual currency
3. **First Trade**: Place your first buy/sell order to get AI feedback
4. **Learn**: Access tutorials and practice scenarios in the Learning Center

### Trading Features
- **Market Orders**: Execute trades at current market prices
- **Real-time Data**: Prices update every 3 seconds with realistic volatility
- **AI Feedback**: Get instant analysis of your trading decisions
- **Trade History**: Review all past trades with performance metrics

### Learning System
- **Tutorials**: Step-by-step guides on trading concepts
- **Practice Scenarios**: Simulated market events (earnings, volatility, breakouts)
- **Progressive Learning**: Content unlocks based on experience level
- **Subscription Tiers**: Advanced features available with Premium/Pro plans

## 🔧 Configuration

### Environment Variables
- `VITE_OPENAI_API_KEY`: Required for AI feedback features
- `VITE_SUPABASE_URL`: For data persistence (future)
- `VITE_SUPABASE_ANON_KEY`: For authentication (future)
- `VITE_STRIPE_PUBLISHABLE_KEY`: For payments (future)

### Subscription Tiers
- **Free**: 10 trades/day, basic feedback, limited scenarios
- **Premium ($15/month)**: Unlimited trades, advanced analytics, all scenarios
- **Pro ($30/month)**: Everything + personalized coaching, custom scenarios

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment
```bash
docker build -t simutrade .
docker run -p 3000:3000 simutrade
```

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core trading simulation
- ✅ AI feedback integration
- ✅ Practice scenarios
- ✅ Tutorial system
- ✅ Subscription UI

### Phase 2 (Planned)
- [ ] Supabase backend integration
- [ ] User authentication
- [ ] Data persistence
- [ ] Stripe payment processing
- [ ] Advanced analytics dashboard

### Phase 3 (Future)
- [ ] Social features (leaderboards, sharing)
- [ ] Mobile app (React Native)
- [ ] Advanced charting tools
- [ ] Paper trading competitions
- [ ] Mentor matching system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Feature Requests**: Submit via GitHub Issues with the "enhancement" label

## 🙏 Acknowledgments

- OpenAI for providing the GPT API for intelligent feedback
- Recharts for beautiful data visualization
- Lucide React for clean, modern icons
- Tailwind CSS for rapid UI development
- The React community for excellent tooling and resources

---

**SimuTrade** - Learn trading without the risk. Master the markets with AI-powered guidance.
