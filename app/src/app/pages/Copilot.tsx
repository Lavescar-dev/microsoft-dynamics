import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { BrainCircuit24Regular } from '@fluentui/react-icons';
import { Send, Sparkles, TrendingUp, Users, Target, Calendar, FileText, BarChart } from 'lucide-react';
import { useState } from 'react';

const sampleInsights = [
  {
    icon: TrendingUp,
    title: 'Sales Performance Alert',
    description: 'Your sales team exceeded targets by 23% this month. Top performer: Sarah Johnson with $450K in closed deals.',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Users,
    title: 'Customer Engagement Trend',
    description: '5 high-value accounts haven\'t been contacted in 30+ days. Recommended action: Schedule follow-up calls.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Target,
    title: 'Opportunity Analysis',
    description: '12 opportunities in "Proposal" stage for 60+ days. Win rate increases by 34% with timely follow-up.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
];

const quickActions = [
  { icon: BarChart, label: 'Generate Sales Report', action: 'sales-report' },
  { icon: Calendar, label: 'Schedule Team Meeting', action: 'schedule-meeting' },
  { icon: FileText, label: 'Draft Email Campaign', action: 'email-campaign' },
  { icon: Target, label: 'Forecast Next Quarter', action: 'forecast' },
];

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Dynamics 365 Copilot assistant. I can help you analyze data, generate insights, automate workflows, and answer questions about your business. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'Show me my top opportunities this month',
    'Summarize recent customer interactions',
    'Generate a sales forecast report',
    'Find contacts in the technology industry',
    'What are my team\'s pending activities?',
    'Analyze win/loss trends for Q1'
  ];

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { role: 'user', content: input };
      const responseMessage = { 
        role: 'assistant', 
        content: `Based on your query "${input}", here's what I found: Your current pipeline shows strong momentum with 15 active opportunities totaling $2.1M. The technology sector accounts for 45% of your opportunities. Would you like me to provide a detailed breakdown?`
      };
      setMessages([...messages, userMessage, responseMessage]);
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#0B71C7] to-[#37BEF3] mb-4 shadow-lg">
              <BrainCircuit24Regular className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-semibold mb-2 bg-gradient-to-r from-[#0B71C7] to-[#37BEF3] bg-clip-text text-transparent">
              Dynamics 365 Copilot
            </h1>
            <p className="text-gray-600 text-lg">Your AI-powered business intelligence assistant</p>
          </div>

          {/* AI Insights Section */}
          {messages.length === 1 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#0B71C7]" />
                <h2 className="text-lg font-semibold">AI-Powered Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {sampleInsights.map((insight, index) => (
                  <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className={`${insight.bgColor} ${insight.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                        <insight.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold mb-2 text-sm">{insight.title}</h3>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-[#0B71C7]"
                    >
                      <action.icon className="w-5 h-5 text-[#0B71C7]" />
                      <span className="text-xs text-center">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4 mb-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <Card className={`max-w-2xl ${message.role === 'user' ? 'bg-gradient-to-r from-[#0B71C7] to-[#37BEF3] text-white border-none' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0B71C7] to-[#37BEF3] flex items-center justify-center">
                          <BrainCircuit24Regular className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">Copilot</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3 font-medium">Try asking me:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto p-3 whitespace-normal hover:bg-blue-50 hover:border-[#0B71C7] text-sm"
                    onClick={() => setInput(suggestion)}
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-[#0B71C7] flex-shrink-0" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot anything about your business data, insights, or tasks..."
              className="flex-1 border-gray-300 focus:border-[#0B71C7] focus:ring-2 focus:ring-[#0B71C7]/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <Button 
              className="bg-gradient-to-r from-[#0B71C7] to-[#37BEF3] hover:from-[#106ebe] hover:to-[#2DB5E8] shadow-md"
              onClick={handleSend}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Copilot can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}