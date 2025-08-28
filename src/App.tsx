import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Paperclip,
  Plus,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  Bot,
  User,
  FileText,
  CreditCard,
  TrendingUp,
  Shield,
  PiggyBank,
  BookOpen,
  Trash2,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import AuthScreen from "./components/AuthScreen";
import SignInScreen from "./components/SignInScreen";
import OTPScreen from "./components/OTPScreen";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  actions?: Array<{ id: string; label: string; emoji: string }>;
}

interface ChatState {
  currentFlow: string;
  subFlow?: string;
  context?: any;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  chatState: ChatState;
  timestamp: Date;
}

interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string;
  role: "customer" | "staff";
  step:
    | "role-selection"
    | "mobile-input"
    | "otp-verification"
    | "authenticated";
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    phoneNumber: "",
    role: "customer",
    step: "role-selection",
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    currentFlow: "greeting",
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [chatSessions, setChatSessions] = useState<
    ChatSession[]
  >([]);
  const [currentSessionId, setCurrentSessionId] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize auth and chat from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem(
      "financialConciergeAuth",
    );
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setAuthState(authData);
    }

    if (savedAuth && JSON.parse(savedAuth).isAuthenticated) {
      const savedSessions = localStorage.getItem(
        "financialConciergeSessions",
      );
      const savedCurrentSession = localStorage.getItem(
        "financialConciergeCurrentSession",
      );
      const savedTheme = localStorage.getItem(
        "financialConciergeTheme",
      );

      if (savedSessions) {
        const sessions = JSON.parse(savedSessions).map(
          (session: any) => ({
            ...session,
            timestamp: new Date(session.timestamp),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }),
        );
        setChatSessions(sessions);

        if (
          savedCurrentSession &&
          sessions.find(
            (s: ChatSession) => s.id === savedCurrentSession,
          )
        ) {
          loadChatSession(savedCurrentSession, sessions);
        }
      }

      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      }
    }
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "financialConciergeAuth",
      JSON.stringify(authState),
    );
  }, [authState]);

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(
      "financialConciergeTheme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  // Save chat sessions to localStorage
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem(
        "financialConciergeSessions",
        JSON.stringify(chatSessions),
      );
    }
  }, [chatSessions]);

  // Save current session ID
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem(
        "financialConciergeCurrentSession",
        currentSessionId,
      );
    }
  }, [currentSessionId]);

  // Update current session when messages change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages,
                chatState,
                title: generateSessionTitle(messages),
                timestamp: new Date(),
              }
            : session,
        ),
      );
    }
  }, [messages, chatState, currentSessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Auth handlers
  const handleRoleSelection = (role: "customer" | "staff") => {
    setAuthState((prev) => ({
      ...prev,
      role,
      step: "mobile-input",
    }));
  };

  const handleSendOTP = (phoneNumber: string) => {
    setAuthState((prev) => ({
      ...prev,
      phoneNumber,
      step: "otp-verification",
    }));
  };

  const handleVerifyOTP = (otp: string) => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      step: "authenticated",
    }));
  };

  const handleAuthBack = () => {
    setAuthState((prev) => {
      if (prev.step === "otp-verification") {
        return { ...prev, step: "mobile-input" };
      } else if (prev.step === "mobile-input") {
        return { ...prev, step: "role-selection" };
      }
      return prev;
    });
  };

  const handleSignOut = () => {
    setAuthState({
      isAuthenticated: false,
      phoneNumber: "",
      role: "customer",
      step: "role-selection",
    });
    setChatSessions([]);
    setMessages([]);
    setShowWelcome(true);
    setCurrentSessionId(null);
    localStorage.removeItem("financialConciergeAuth");
    localStorage.removeItem("financialConciergeSessions");
    localStorage.removeItem("financialConciergeCurrentSession");
  };

  const generateSessionTitle = (
    messages: Message[],
  ): string => {
    const userMessages = messages.filter(
      (m) => m.type === "user",
    );
    if (userMessages.length === 0) return "New Chat";

    const firstUserMessage = userMessages[0].content;
    return firstUserMessage.length > 30
      ? firstUserMessage.substring(0, 30) + "..."
      : firstUserMessage;
  };

  const loadChatSession = (
    sessionId: string,
    sessions?: ChatSession[],
  ) => {
    const sessionsToUse = sessions || chatSessions;
    const session = sessionsToUse.find(
      (s) => s.id === sessionId,
    );
    if (session) {
      setMessages(session.messages);
      setChatState(session.chatState);
      setCurrentSessionId(sessionId);
      setShowWelcome(session.messages.length === 0);
    }
  };

  const startNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [],
      chatState: { currentFlow: "greeting" },
      timestamp: new Date(),
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setMessages([]);
    setShowWelcome(true);
    setChatState({ currentFlow: "greeting" });
    setCurrentSessionId(newSessionId);
  };

  const deleteChatSession = (
    sessionId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setChatSessions((prev) =>
      prev.filter((s) => s.id !== sessionId),
    );

    if (currentSessionId === sessionId) {
      const remainingSessions = chatSessions.filter(
        (s) => s.id !== sessionId,
      );
      if (remainingSessions.length > 0) {
        loadChatSession(remainingSessions[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const simulateTyping = (
    callback: () => void,
    delay = 1500,
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const addBotMessage = (
    content: string,
    actions?: Array<{
      id: string;
      label: string;
      emoji: string;
    }>,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content,
      timestamp: new Date(),
      actions,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleActionClick = (
    actionId: string,
    actionLabel: string,
  ) => {
    if (showWelcome) {
      setShowWelcome(false);
      addUserMessage(actionLabel);
      simulateTyping(() => {
        handleMainMenuSelection(actionId);
      });
    } else {
      addUserMessage(actionLabel);
      simulateTyping(() => {
        switch (chatState.currentFlow) {
          case "greeting":
            handleMainMenuSelection(actionId);
            break;
          case "spending":
            handleSpendingFlow(actionId);
            break;
          case "fd":
            handleFDFlow(actionId);
            break;
          case "reports":
            handleReportsFlow(actionId);
            break;
          case "loans":
            handleLoansFlow(actionId);
            break;
          case "investments":
            handleInvestmentsFlow(actionId);
            break;
          case "security":
            handleSecurityFlow(actionId);
            break;
        }
      });
    }
  };

  const handleMainMenuSelection = (actionId: string) => {
    switch (actionId) {
      case "1":
        setChatState({ currentFlow: "spending" });
        addBotMessage(
          `Here's your monthly update 📊:\n\n• You spent ₹12,500 more on online shopping\n• ₹3,000 more on food delivery compared to last month\n\nWould you like to:`,
          [
            {
              id: "1",
              label: "Set a monthly budget alert",
              emoji: "1️⃣",
            },
            {
              id: "2",
              label: "Create a spending report (PDF/Excel)",
              emoji: "2️⃣",
            },
            {
              id: "3",
              label: "Get cashback card suggestions",
              emoji: "3️⃣",
            },
          ],
        );
        break;
      case "2":
        setChatState({ currentFlow: "fd" });
        addBotMessage(
          `Your FD of ₹2,00,000 will mature on 10th September 2025.\n\nWould you like to:`,
          [
            {
              id: "1",
              label: "Auto-renew the FD",
              emoji: "1️⃣",
            },
            {
              id: "2",
              label: "Move money into savings",
              emoji: "2️⃣",
            },
            {
              id: "3",
              label: "Explore better investment options",
              emoji: "3️⃣",
            },
            {
              id: "4",
              label: "Connect with a Relationship Manager",
              emoji: "4️⃣",
            },
          ],
        );
        break;
      case "3":
        setChatState({ currentFlow: "reports" });
        addBotMessage(
          `Sure, I can generate reports instantly. Please select:`,
          [
            { id: "1", label: "GST Report", emoji: "1️⃣" },
            {
              id: "2",
              label: "Loan Repayment Forecast",
              emoji: "2️⃣",
            },
            {
              id: "3",
              label: "Tax-Saving (80C) Utilization Report",
              emoji: "3️⃣",
            },
            {
              id: "4",
              label: "Monthly Account Summary",
              emoji: "4️⃣",
            },
          ],
        );
        break;
      case "4":
        setChatState({ currentFlow: "loans" });
        addBotMessage(
          `Here's your EMI status 📑:\n\n• Home Loan: ₹25,000/month (till 2032)\n• Car Loan: ₹12,000/month (till 2026)\n⚠️ EMI-to-income ratio: 52% (slightly high).\n\nWould you like to:`,
          [
            {
              id: "1",
              label: "Explore loan restructuring",
              emoji: "1️⃣",
            },
            {
              id: "2",
              label: "Check prepayment eligibility",
              emoji: "2️⃣",
            },
            {
              id: "3",
              label: "Talk to a loan advisor",
              emoji: "3️⃣",
            },
          ],
        );
        break;
      case "5":
        setChatState({ currentFlow: "investments" });
        addBotMessage(
          `Here's your portfolio snapshot 📈:\n\n• Equity MF: +12% this year\n• FD returns: ₹18,000 earned\n• Missed SIP: ₹15,000 last month\n\nNext actions:`,
          [
            {
              id: "1",
              label: "Get detailed portfolio report",
              emoji: "1️⃣",
            },
            {
              id: "2",
              label: "See tax-saving suggestions",
              emoji: "2️⃣",
            },
            {
              id: "3",
              label: "Rebalance portfolio",
              emoji: "3️⃣",
            },
          ],
        );
        break;
      case "6":
        setChatState({ currentFlow: "security" });
        addBotMessage(
          `I noticed a debit of ₹50,000 yesterday. Was this you?\n\nOptions:`,
          [
            { id: "1", label: "Yes, it was me", emoji: "1️⃣" },
            {
              id: "2",
              label: "No → Block card + raise fraud ticket",
              emoji: "2️⃣",
            },
            {
              id: "3",
              label: "Call me back from support",
              emoji: "3️⃣",
            },
          ],
        );
        break;
    }
  };

  const handleSpendingFlow = (actionId: string) => {
    switch (actionId) {
      case "1":
        addBotMessage(
          "✅ Monthly budget alert set for ₹25,000. You'll get notifications when you reach 80% and 100% of your budget.",
        );
        break;
      case "2":
        addBotMessage(
          "📊 Your spending report has been generated and sent to your email. Would you like me to schedule monthly reports?",
        );
        break;
      case "3":
        addBotMessage(
          "💳 Based on your spending pattern, I recommend:\n\n• HDFC Cashback Card (5% on online shopping)\n• SBI SimplyCLICK (10X rewards on dining)\n\nShall I help you apply?",
        );
        break;
    }
  };

  const handleFDFlow = (actionId: string) => {
    switch (actionId) {
      case "1":
        addBotMessage(
          "✅ FD auto-renewal activated for ₹2,00,000 at current rates. You'll receive confirmation 7 days before maturity.",
        );
        break;
      case "2":
        addBotMessage(
          "💰 ₹2,00,000 will be transferred to your savings account on maturity date. Interest earned: ₹14,500.",
        );
        break;
      case "3":
        addBotMessage(
          "📈 Better options available:\n\n• Mutual Fund SIP: 12-15% returns\n• Tax-saving ELSS: 10-12% + 80C benefits\n\nWant me to show detailed comparison?",
        );
        break;
      case "4":
        addBotMessage(
          "📞 A Relationship Manager will call you within 2 hours to discuss investment options. Preferred time: 10 AM - 6 PM?",
        );
        break;
    }
  };

  const handleReportsFlow = (actionId: string) => {
    switch (actionId) {
      case "1":
        addBotMessage(
          "✅ Your GST summary for Q1 is ready. Sent via PDF + Excel on email.\n\nWould you like me to auto-schedule this every quarter?",
        );
        break;
      case "2":
        addBotMessage(
          "📋 Loan repayment forecast generated. You'll save ₹2.1L by prepaying ₹50K this year. Report sent to email.",
        );
        break;
      case "3":
        addBotMessage(
          "💰 80C Utilization: ₹1,20,000 / ₹1,50,000 used.\n\nRemaining ₹30,000 can save ₹9,300 in taxes. Want suggestions?",
        );
        break;
      case "4":
        addBotMessage(
          "📊 Monthly account summary prepared. Total inflow: ₹85,000 | Outflow: ₹62,000 | Savings: ₹23,000. Sent to email.",
        );
        break;
    }
  };

  const handleLoansFlow = (actionId: string) => {
    switch (actionId) {
      case "1":
        addBotMessage(
          "🔄 Loan restructuring options:\n\n• Extend tenure: EMI reduces to ₹28,000\n• Part prepayment: Save ₹1.8L interest\n\nShall I connect you with loan specialist?",
        );
        break;
      case "2":
        addBotMessage(
          "✅ Prepayment eligibility confirmed. Min amount: ₹1,00,000.\n\nBy paying ₹2,00,000 now, you'll save ₹3.2L and close loan 2 years early.",
        );
        break;
      case "3":
        addBotMessage(
          "📞 Loan advisor will call you in 1 hour. They'll help optimize your loan structure and reduce EMI burden.",
        );
        break;
    }
  };

  const handleInvestmentsFlow = (actionId: string) => {
    switch (actionId) {
      case "1":
        addBotMessage(
          "📈 Detailed portfolio report sent to email.\n\n• Best performer: Technology Fund (+18%)\n• Underperformer: Banking Fund (-2%)\n\nRebalancing suggested.",
        );
        break;
      case "2":
        addBotMessage(
          "💰 Tax-saving opportunities:\n\n• ELSS investment: ₹30,000 (saves ₹9,300)\n• PPF top-up: ₹20,000 (saves ₹6,200)\n\nShall I help you invest?",
        );
        break;
      case "3":
        addBotMessage(
          "⚖️ Portfolio rebalancing recommended:\n\n• Reduce large-cap exposure by 10%\n• Increase mid-cap by 15%\n\nExecute rebalancing?",
        );
        break;
    }
  };

  const handleSecurityFlow = (actionId: string) => {
    switch (actionId) {
      case "1":
        addBotMessage(
          "✅ Transaction confirmed as authorized. Thank you for the confirmation. Your account security is important to us.",
        );
        break;
      case "2":
        addBotMessage(
          "🚨 Card blocked immediately. Fraud ticket #FR789456 raised.\n\nNew card will be delivered in 3-5 days. Emergency cash available at any branch with ID.",
        );
        break;
      case "3":
        addBotMessage(
          "📞 Support will call you within 15 minutes to verify the transaction and take necessary action. Please keep your phone available.",
        );
        break;
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      if (showWelcome) {
        setShowWelcome(false);
        addUserMessage(inputValue);
        setInputValue("");
        simulateTyping(() => {
          addBotMessage(
            "Hello! 👋 I'm your Financial Concierge. For the best experience, please use the service options on the welcome screen to get started. Is there a specific financial service you'd like help with?",
          );
        });
      } else {
        addUserMessage(inputValue);
        setInputValue("");
        simulateTyping(() => {
          addBotMessage(
            "I understand you want to type a message. For the best experience, please use the numbered options above to navigate through our services. Is there a specific service you'd like help with?",
          );
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const welcomeOptions = [
    {
      id: "1",
      title: "Spending & Budget Tracking",
      description: "Track your expenses and set budget alerts",
      icon: BarChart3,
      iconColor: "text-blue-500",
      color: "white border-gray-100",
    },
    {
      id: "2",
      title: "Fixed Deposit Alerts & Investments",
      description: "Manage FDs and explore investment options",
      icon: PiggyBank,
      iconColor: "text-green-500",
      color: "white border-gray-100",
    },
    {
      id: "3",
      title: "Reports & Documentation",
      description: "Generate financial reports and statements",
      icon: FileText,
      iconColor: "text-purple-500",
      color: "white border-gray-100",
    },
    {
      id: "4",
      title: "Loan & EMI Tracking",
      description: "Monitor your loans and EMI payments",
      icon: CreditCard,
      iconColor: "text-orange-500",
      color: "white border-gray-100",
    },
    {
      id: "5",
      title: "Investments & Portfolio Insights",
      description:
        "Analyze your investment portfolio performance",
      icon: TrendingUp,
      iconColor: "text-indigo-500",
      color: "white border-gray-100",
    },
    {
      id: "6",
      title: "Security & Fraud Alerts",
      description:
        "Protect your account from unauthorized access",
      icon: Shield,
      iconColor: "text-red-500",
      color: "white border-gray-100",
    },
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Show authentication screens if not authenticated
  if (!authState.isAuthenticated) {
    if (authState.step === "role-selection") {
      return (
        <AuthScreen onRoleSelection={handleRoleSelection} />
      );
    } else if (authState.step === "mobile-input") {
      return (
        <SignInScreen
          role={authState.role}
          onSendOTP={handleSendOTP}
          onBack={handleAuthBack}
        />
      );
    } else if (authState.step === "otp-verification") {
      return (
        <OTPScreen
          phoneNumber={authState.phoneNumber}
          role={authState.role}
          onVerifyOTP={handleVerifyOTP}
          onBack={handleAuthBack}
        />
      );
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Financial Concierge
              </span>
              <span className="text-xs text-gray-500">
                {authState.role === "customer"
                  ? "Customer"
                  : "Bank Staff"}{" "}
                • {authState.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                  currentSessionId === session.id
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => loadChatSession(session.id)}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(session.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={(e) =>
                      deleteChatSession(session.id, e)
                    }
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full text-left p-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#e3eeff] bg-opacity-50 border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            Centraai 2.0
          </h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
            <Button
              onClick={startNewChat}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-[linear-gradient(to_top,_#f3e7e9_0%,_#e3eeff_100%)]">
          {showWelcome ? (
            /* Welcome Screen */
            <div className="h-full flex flex-col items-center justify-center px-8">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-gray-600 mb-2">
                  Hi, there 👋
                </h2>
                <h1 className="text-2xl font-semibold text-gray-900">
                  How can we help?
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
                {welcomeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Card
                      key={option.id}
                      className={`p-6 cursor-pointer transition-all hover:shadow-md border-2 ${option.color}`}
                      onClick={() =>
                        handleActionClick(
                          option.id,
                          option.title,
                        )
                      }
                    >
                      <div className="flex flex-col items-start gap-3">
                        <div className="p-2 rounded-lg">
                          <IconComponent
                            className={`w-6 h-6 ${option.iconColor}`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {option.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[70%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "bot"
                            ? "bg-black text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {message.type === "bot" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.type === "bot"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <p className="whitespace-pre-line">
                          {message.content}
                        </p>
                        {message.actions && (
                          <div className="grid grid-cols-1 gap-3 mt-4">
                            {message.actions.map((action) => {
                              let IconComponent = null;
                              if (
                                chatState.currentFlow ===
                                "greeting"
                              ) {
                                const iconMap: {
                                  [
                                    key: string
                                  ]: React.ComponentType<any>;
                                } = {
                                  "1": BarChart3,
                                  "2": PiggyBank,
                                  "3": FileText,
                                  "4": CreditCard,
                                  "5": TrendingUp,
                                  "6": Shield,
                                };
                                IconComponent =
                                  iconMap[action.id];
                              }

                              return (
                                <Card
                                  key={action.id}
                                  className="p-4 cursor-pointer transition-all hover:shadow-md border border-gray-200 bg-white"
                                  onClick={() =>
                                    handleActionClick(
                                      action.id,
                                      action.label,
                                    )
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    {IconComponent && (
                                      <div className="p-2 rounded-lg bg-gray-50">
                                        <IconComponent className="w-5 h-5 text-gray-600" />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-800">
                                        {action.label}
                                      </p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                      {action.emoji}
                                    </span>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((delay, index) => (
                        <motion.div
                          key={index}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      Bot is typing...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3 items-center max-w-3xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-13 h-13 p-0 border-gray-300"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </Button>

            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {!showWelcome && (
            <p className="text-xs text-gray-500 mt-3 text-center max-w-3xl mx-auto">
              Centra may display inaccurate info, so please
              double check its responses.{" "}
              <a href="#" className="underline">
                Your Privacy & Centra AI
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}