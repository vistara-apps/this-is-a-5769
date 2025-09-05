import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Target, Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ScenarioModal from './ScenarioModal';
import TutorialModal, { defaultTutorials } from './TutorialModal';
import { marketService } from '../services/api';

const TutorialPanel = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('basics');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  // Practice scenarios data
  const scenarios = [
    {
      scenarioId: 'earnings-1',
      title: 'Quarterly Earnings Report',
      description: 'A major tech company is about to announce quarterly earnings. Market expectations are high.',
      type: 'earnings',
      impact: 'positive',
      difficulty: 'beginner',
      estimatedTime: '5 min'
    },
    {
      scenarioId: 'market-crash-1',
      title: 'Market Volatility Spike',
      description: 'Breaking news causes sudden market volatility. How do you protect your portfolio?',
      type: 'news',
      impact: 'negative',
      difficulty: 'intermediate',
      estimatedTime: '7 min'
    },
    {
      scenarioId: 'breakout-1',
      title: 'Technical Breakout',
      description: 'A stock breaks through a key resistance level with high volume. What\'s your move?',
      type: 'technical',
      impact: 'positive',
      difficulty: 'advanced',
      estimatedTime: '6 min'
    }
  ];

  // Event handlers
  const handleScenarioStart = (scenario) => {
    setSelectedScenario(scenario);
    setShowScenarioModal(true);
  };

  const handleTutorialStart = (tutorialId) => {
    const tutorial = defaultTutorials.find(t => t.tutorialId === tutorialId);
    if (tutorial) {
      setSelectedTutorial(tutorial);
      setShowTutorialModal(true);
    }
  };

  const handleScenarioComplete = (scenarioId, result) => {
    console.log('Scenario completed:', scenarioId, result);
    // In production, save to backend
  };

  const handleTutorialComplete = (tutorialId) => {
    console.log('Tutorial completed:', tutorialId);
    // In production, save progress to backend
  };

  const tutorials = {
    basics: [
      {
        id: 1,
        title: "Understanding Market Orders",
        description: "Learn the difference between market orders and limit orders",
        duration: "3 min",
        completed: true,
        free: true,
      },
      {
        id: 2,
        title: "Reading Stock Charts",
        description: "Basics of candlestick charts and technical indicators",
        duration: "5 min",
        completed: false,
        free: true,
      },
      {
        id: 3,
        title: "Risk Management Fundamentals",
        description: "How to set stop-losses and manage position sizes",
        duration: "4 min",
        completed: false,
        free: false,
      },
    ],
    strategies: [
      {
        id: 4,
        title: "Day Trading Basics",
        description: "Introduction to short-term trading strategies",
        duration: "8 min",
        completed: false,
        free: false,
      },
      {
        id: 5,
        title: "Swing Trading Techniques",
        description: "Medium-term trading approaches and analysis",
        duration: "10 min",
        completed: false,
        free: false,
      },
    ],
    scenarios: [
      {
        id: 6,
        title: "Market Crash Simulation",
        description: "Practice trading during volatile market conditions",
        duration: "15 min",
        completed: false,
        free: user.subscriptionTier !== 'free',
      },
      {
        id: 7,
        title: "Earnings Season Trading",
        description: "Navigate trading around company earnings announcements",
        duration: "12 min",
        completed: false,
        free: false,
      },
    ],
  };

  const isPremiumContent = (tutorial) => {
    return !tutorial.free && user.subscriptionTier === 'free';
  };

  const handleTutorialClick = (tutorial) => {
    if (isPremiumContent(tutorial)) {
      alert('This tutorial requires a Premium subscription. Upgrade to access advanced content!');
      return;
    }
    
    // Map old tutorial IDs to new tutorial system
    const tutorialMapping = {
      1: 'basics-1',
      2: 'risk-management-1',
      3: 'risk-management-1',
      4: 'market-analysis-1',
      5: 'market-analysis-1'
    };
    
    const tutorialId = tutorialMapping[tutorial.id] || 'basics-1';
    handleTutorialStart(tutorialId);
  };

  return (
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="w-5 h-5 text-white" />
        <h2 className="text-xl font-semibold text-white">Learning Center</h2>
      </div>
      
      <div className="flex space-x-1 mb-4">
        {['basics', 'strategies', 'scenarios'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors capitalize ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab === 'scenarios' ? 'Practice' : tab}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activeTab === 'scenarios' ? (
          scenarios.map((scenario) => (
            <div
              key={scenario.scenarioId}
              onClick={() => handleScenarioStart(scenario)}
              className="p-4 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <h3 className="font-medium text-white">{scenario.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      scenario.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      scenario.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-2">{scenario.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-white/50">
                    <span>{scenario.estimatedTime}</span>
                    <span className="capitalize">{scenario.type}</span>
                  </div>
                </div>
                <Play className="w-5 h-5 text-blue-400 ml-3" />
              </div>
            </div>
          ))
        ) : (
          tutorials[activeTab].map((tutorial) => (
          <div
            key={tutorial.id}
            onClick={() => handleTutorialClick(tutorial)}
            className={`p-4 rounded-lg border border-white/20 transition-all cursor-pointer ${
              isPremiumContent(tutorial)
                ? 'bg-white/5 opacity-60'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-white text-sm">{tutorial.title}</h3>
              <div className="flex items-center space-x-2">
                {tutorial.completed ? (
                  <CheckCircle className="w-4 h-4 text-accent" />
                ) : isPremiumContent(tutorial) ? (
                  <Lock className="w-4 h-4 text-white/50" />
                ) : (
                  <Play className="w-4 h-4 text-white/70" />
                )}
              </div>
            </div>
            <p className="text-xs text-white/60 mb-2">{tutorial.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">{tutorial.duration}</span>
              {isPremiumContent(tutorial) && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                  Premium
                </span>
              )}
            </div>
          </div>
          ))
        )}
      </div>

      {user.subscriptionTier === 'free' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border border-primary/30">
          <h4 className="font-medium text-white mb-2">Unlock All Tutorials</h4>
          <p className="text-sm text-white/70 mb-3">
            Get access to advanced strategies, practice scenarios, and personalized AI coaching.
          </p>
          <button className="w-full py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors">
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Modals */}
      <ScenarioModal
        scenario={selectedScenario}
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        onComplete={handleScenarioComplete}
      />
      
      <TutorialModal
        tutorial={selectedTutorial}
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onComplete={handleTutorialComplete}
      />
    </div>
  );
};

export default TutorialPanel;
