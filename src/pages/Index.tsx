import { useState, useCallback } from "react";
import { agents } from "@/data/agents";
import { Message, Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Sparkles, ChevronRight, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { agent1API } from "@/services/api-mock"; // MOCK MODE - No backend needed!

const Index = () => {
  const [activeAgentId, setActiveAgentId] = useState(agents[0].id);
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [userId] = useState("user_" + Date.now()); // Generate user ID on mount
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const activeAgent = agents.find(a => a.id === activeAgentId)!;
  const messages = messagesByAgent[activeAgentId] || [];

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsLoading(true);

    try {
      // Upload resume to Agent 1
      const result = await agent1API.parseResume(userId, file);
      
      const fileMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `✅ **Resume Analyzed Successfully!**\n\n📄 **${file.name}**\n\n**Profile Extracted:**\n• **Name:** ${result.data.profile.full_name}\n• **Role:** ${result.data.profile.current_role}\n• **Experience:** ${result.data.profile.years_of_experience} years\n• **Email:** ${result.data.profile.email}\n\n**Skills Found:** ${result.data.extracted_data.skills.slice(0, 6).map((s: any) => s.name).join(', ')}\n\n**Recent Experience:**\n${result.data.extracted_data.experience[0]?.company} - ${result.data.extracted_data.experience[0]?.role}\n\n🎯 Your profile has been updated! Ask me to analyze your career readiness.`,
        timestamp: new Date(),
        agentId: activeAgentId,
      };

      setMessagesByAgent(prev => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] || []), fileMessage]
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `❌ Failed to upload resume: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        agentId: activeAgentId,
      };

      setMessagesByAgent(prev => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] || []), errorMessage]
      }));
    } finally {
      setIsLoading(false);
      setUploadedFile(null);
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      agentId: activeAgentId,
    };

    setMessagesByAgent(prev => ({
      ...prev,
      [activeAgentId]: [...(prev[activeAgentId] || []), userMessage]
    }));
    setInput("");
    setIsLoading(true);

    // Connect to real Agent 1 API when on career-profiling agent
    if (activeAgentId === "career-profiling") {
      try {
        // Check if user profile exists, if not create one
        let profile;
        try {
          profile = await agent1API.getProfile(userId);
        } catch {
          // Create profile if doesn't exist
          await agent1API.createProfile({
            user_id: userId,
            email: `${userId}@careercompass.ai`,
            full_name: "Career Compass User",
            career_level: "mid-level",
            skills: [
              { name: "JavaScript", category: "Programming", proficiency_level: "advanced" },
              { name: "React", category: "Frontend", proficiency_level: "advanced" },
              { name: "Python", category: "Programming", proficiency_level: "intermediate" }
            ],
            education: [
              {
                degree: "Bachelor of Science",
                field_of_study: "Computer Science",
                institution: "University",
                graduation_year: 2020
              }
            ],
            career_interests: ["Software Development", "AI/ML", "Web Development"],
            target_roles: ["Senior Developer", "Tech Lead"],
          });
          profile = await agent1API.getProfile(userId);
        }

        // Generate AI analysis using Gemini 2.5 Flash
        const response = await agent1API.generateAnalysis(userId);
        const analysis = response.data || response; // Handle both wrapped and direct responses
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `🤖 **Career Profiling Analysis (Powered by Gemini 2.5 Flash)**\n\n${analysis.analysis}\n\n**📊 Readiness Score:** ${analysis.readiness_score}/100\n\n**💪 Your Strengths:**\n${(analysis.strengths || []).map(s => `• ${s}`).join('\n')}\n\n**📈 Areas for Improvement:**\n${(analysis.areas_for_improvement || []).map(a => `• ${a}`).join('\n')}\n\n**🎯 Recommended Actions:**\n${(analysis.recommended_actions || []).map(r => `• ${r}`).join('\n')}\n\n💡 *Tip: Upload your resume using the 📎 icon for more accurate analysis!*`,
          timestamp: new Date(),
          agentId: activeAgentId,
        };

        setMessagesByAgent(prev => ({
          ...prev,
          [activeAgentId]: [...(prev[activeAgentId] || []), assistantMessage]
        }));
      } catch (error) {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `⚠️ ${error instanceof Error ? error.message : 'An error occurred'}. Please try again.`,
          timestamp: new Date(),
          agentId: activeAgentId,
        };

        setMessagesByAgent(prev => ({
          ...prev,
          [activeAgentId]: [...(prev[activeAgentId] || []), errorMessage]
        }));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate responses for other agents (not yet implemented)
      setTimeout(() => {
        const responses: Record<string, string> = {
          "market-intelligence": "📊 **Market Intelligence Report**\n\nCurrent market shows strong demand for your skills:\n\n📈 47 matching positions this week\n💰 Avg. salary: $120-150k\n🏢 Top hiring: Meta, Google, startups\n\nWant me to dive deeper into specific companies?",
          "skill-roadmap": "🎯 **Your 12-Week Learning Roadmap**\n\n📚 **Weeks 1-4: System Design**\n• Design patterns\n• Scalability principles\n• Microservices architecture\n\n🛠️ **Weeks 5-8: Cloud Architecture**\n• AWS/Azure fundamentals\n• Serverless computing\n• Container orchestration\n\n🚀 **Weeks 9-12: Technical Leadership**\n• Team collaboration\n• Code review best practices\n• Project management\n\nReady to start?",
          "action-application": "🎯 **Job Matches Found**\n\nI found 12 excellent matches:\n\n🌟 **Senior Frontend Engineer @ Stripe**\n   💰 $150-180k | 📍 Remote\n   Match: 95%\n\n🌟 **Staff Developer @ Vercel**\n   💰 $160-200k | 📍 San Francisco\n   Match: 92%\n\n🌟 **Lead Frontend Engineer @ Linear**\n   💰 $140-170k | 📍 Remote\n   Match: 90%\n\nWhich position interests you most?",
          "feedback-learning": "📈 **Your Progress Report**\n\nAnalyzing your career journey...\n\n✅ 8/10 milestones completed\n📊 Interview success rate: +40%\n💪 Skill confidence: +25%\n🎯 Applications sent: 15\n✨ Responses received: 6\n\nYou're doing great! Keep up the momentum! 🚀",
          "progress-motivation": "🎯 **Your Progress Dashboard**\n\n**📊 This Week's Status:**\n✅ 4/5 milestones completed (80%)\n🔥 7-day learning streak!\n⏰ 2 upcoming deadlines\n\n**🎓 Learning Velocity:**\n📚 System Design: 65% complete\n☁️ AWS Fundamentals: 40% complete\n🚀 Next milestone: Due in 2 days\n\n**💪 Motivation Score: 8.5/10**\nYou're crushing it! You've completed 70% of this week's roadmap - exactly the pace needed for your target role at Google.\n\n**🔔 Smart Reminders Active:**\n• Tomorrow 9 AM: Continue AWS Lambda tutorial\n• Friday: Complete system design case study\n• Weekend: Build mini-project #2\n\n**🏆 Recent Achievements:**\n✨ Completed 3 LeetCode problems\n✨ Finished Redux deep-dive\n✨ Updated LinkedIn profile\n\n**⚡ Action Items:**\n1. Keep your streak alive - 15 min study today maintains momentum\n2. Review job application for Vercel (deadline: 3 days)\n3. Schedule mock interview practice\n\nYou're only 6 weeks away from job-ready status. Stay focused! 💫"
        };

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: responses[activeAgentId] || "How can I help with your career today?",
          timestamp: new Date(),
          agentId: activeAgentId,
        };

        setMessagesByAgent(prev => ({
          ...prev,
          [activeAgentId]: [...(prev[activeAgentId] || []), assistantMessage]
        }));
        setIsLoading(false);
      }, 1000);
    }
  }, [input, activeAgentId, userId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border/50 flex flex-col bg-gradient-to-b from-card to-muted/30">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CareerAI</h1>
              <p className="text-xs text-muted-foreground">Intelligent Career Companion</p>
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
            AI Agents
          </p>
          <div className="space-y-2">
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              const isActive = agent.id === activeAgentId;
              
              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgentId(agent.id)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all duration-200 group",
                    "animate-slide-up",
                    isActive 
                      ? "bg-lavender-light/40 border border-lavender-deep/20 shadow-soft" 
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                      isActive 
                        ? "gradient-primary shadow-soft" 
                        : "bg-lavender-light/50 group-hover:bg-lavender-light/70"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-lavender-deep"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-semibold text-sm truncate",
                        isActive ? "text-lavender-deep" : "text-foreground"
                      )}>
                        {agent.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.description}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-all",
                      isActive ? "text-lavender-deep opacity-100" : "opacity-0 group-hover:opacity-50"
                    )} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-lavender-light/50 flex items-center justify-center">
              <activeAgent.icon className="w-5 h-5 text-lavender-deep" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{activeAgent.name}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-elevated mb-6">
                <activeAgent.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Chat with {activeAgent.name}
              </h3>
              <p className="text-muted-foreground max-w-md mb-8">
                {activeAgent.description}
              </p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {["Analyze my resume", "Find jobs", "Skill tips", "Interview prep"].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInput(action);
                      setTimeout(handleSend, 100);
                    }}
                    className="px-4 py-2 rounded-full bg-lavender-light/40 text-sm font-medium text-lavender-deep 
                             hover:bg-lavender-light/60 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 animate-slide-up",
                    msg.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    msg.role === "user" ? "bg-lavender-deep" : "gradient-primary"
                  )}>
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[70%] px-4 py-3 rounded-2xl",
                    msg.role === "user"
                      ? "bg-lavender-deep text-white rounded-br-md"
                      : "bg-card border border-border/50 text-foreground rounded-bl-md shadow-soft"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] mt-2 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50 bg-card/30">
          <div className="max-w-3xl mx-auto flex items-center gap-3 bg-card rounded-xl border border-border/50 p-2 shadow-soft">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="text-muted-foreground hover:text-lavender-deep"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isLoading || activeAgentId !== "career-profiling"}
              title="Upload Resume (PDF, DOC, TXT)"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Processing..." : `Message ${activeAgent.name}...`}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
            />
            <Button 
              variant="send" 
              size="icon-sm"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            {activeAgentId === "career-profiling" 
              ? "Press Enter to send • Click 📎 to upload resume" 
              : "Press Enter to send"}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
