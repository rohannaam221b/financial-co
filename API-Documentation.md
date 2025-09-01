# Financial Concierge Bot - API Documentation

## Overview
The Financial Concierge Bot is a React-based chat interface that provides 6 core financial services through a conversational AI experience. This documentation covers the data structures, authentication flow, and API patterns used in the application.

## Table of Contents
1. [Authentication API](#authentication-api)
2. [Chat Management API](#chat-management-api)
3. [Financial Services API](#financial-services-api)
4. [Data Structures](#data-structures)
5. [Local Storage Patterns](#local-storage-patterns)
6. [Frontend-Backend Integration Guide](#frontend-backend-integration-guide)

---

## Authentication API

### Authentication Flow
The application uses a 3-step authentication process:

#### 1. Role Selection
```typescript
interface RoleSelection {
  role: "customer" | "staff"
}
```

#### 2. Mobile Input & OTP Generation
```typescript
interface MobileInputRequest {
  phoneNumber: string
  role: "customer" | "staff"
}

interface OTPResponse {
  success: boolean
  message: string
  sessionId?: string
}
```

#### 3. OTP Verification
```typescript
interface OTPVerificationRequest {
  phoneNumber: string
  otp: string
  sessionId: string
}

interface AuthenticationResponse {
  success: boolean
  token?: string
  user: {
    phoneNumber: string
    role: "customer" | "staff"
    isAuthenticated: boolean
  }
}
```

### Authentication State
```typescript
interface AuthState {
  isAuthenticated: boolean
  phoneNumber: string
  role: "customer" | "staff"
  step: "role-selection" | "mobile-input" | "otp-verification" | "authenticated"
}
```

---

## Chat Management API

### Message Structure
```typescript
interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  actions?: Array<{
    id: string
    label: string
    emoji: string
  }>
}
```

### Chat Session Management
```typescript
interface ChatSession {
  id: string
  title: string
  messages: Message[]
  chatState: ChatState
  timestamp: Date
}

interface ChatState {
  currentFlow: string
  subFlow?: string
  context?: any
}
```

### API Endpoints (Suggested Backend Implementation)

#### Get Chat Sessions
```
GET /api/chat/sessions
Authorization: Bearer {token}

Response:
{
  "sessions": ChatSession[],
  "total": number
}
```

#### Create New Chat Session
```
POST /api/chat/sessions
Authorization: Bearer {token}

Response:
{
  "session": ChatSession,
  "success": boolean
}
```

#### Get Chat Messages
```
GET /api/chat/sessions/{sessionId}/messages
Authorization: Bearer {token}

Response:
{
  "messages": Message[],
  "chatState": ChatState
}
```

#### Send Message
```
POST /api/chat/sessions/{sessionId}/messages
Authorization: Bearer {token}

Request:
{
  "content": string,
  "type": "user"
}

Response:
{
  "userMessage": Message,
  "botResponse": Message,
  "chatState": ChatState
}
```

#### Delete Chat Session
```
DELETE /api/chat/sessions/{sessionId}
Authorization: Bearer {token}

Response:
{
  "success": boolean
}
```

---

## Financial Services API

### Service Categories
The application provides 6 main financial service flows:

#### 1. Spending & Budget Tracking (`currentFlow: "spending"`)
```typescript
interface SpendingData {
  monthlySpending: {
    category: string
    amount: number
    change: number
  }[]
  budgetAlerts: BudgetAlert[]
  recommendations: string[]
}

interface BudgetAlert {
  category: string
  limit: number
  spent: number
  percentage: number
}
```

#### 2. Fixed Deposit Alerts & Investments (`currentFlow: "fd"`)
```typescript
interface FDData {
  fixedDeposits: {
    id: string
    amount: number
    maturityDate: Date
    interestRate: number
    interestEarned: number
  }[]
  investmentOptions: InvestmentOption[]
}

interface InvestmentOption {
  type: string
  expectedReturn: string
  riskLevel: "low" | "medium" | "high"
  description: string
}
```

#### 3. Reports & Documentation (`currentFlow: "reports"`)
```typescript
interface ReportData {
  availableReports: {
    id: string
    name: string
    description: string
    lastGenerated?: Date
  }[]
  taxSavingData: {
    utilized: number
    limit: number
    remaining: number
    potentialSavings: number
  }
}
```

#### 4. Loan & EMI Tracking (`currentFlow: "loans"`)
```typescript
interface LoanData {
  loans: {
    id: string
    type: "home" | "car" | "personal"
    emiAmount: number
    remainingTenure: number
    principalRemaining: number
    prepaymentEligible: boolean
  }[]
  emiToIncomeRatio: number
  recommendations: string[]
}
```

#### 5. Investments & Portfolio Insights (`currentFlow: "investments"`)
```typescript
interface PortfolioData {
  investments: {
    type: string
    amount: number
    returns: number
    performance: "positive" | "negative" | "neutral"
  }[]
  totalValue: number
  totalReturns: number
  missedSIPs: {
    amount: number
    month: string
  }[]
}
```

#### 6. Security & Fraud Alerts (`currentFlow: "security"`)
```typescript
interface SecurityData {
  recentTransactions: {
    id: string
    amount: number
    timestamp: Date
    location?: string
    flagged: boolean
  }[]
  securityAlerts: SecurityAlert[]
}

interface SecurityAlert {
  id: string
  type: "fraud" | "unusual_activity" | "large_transaction"
  description: string
  timestamp: Date
  action: "review" | "block" | "verify"
}
```

---

## Data Structures

### Welcome Screen Options
```typescript
interface WelcomeOption {
  id: string
  title: string
  description: string
  icon: React.ComponentType
  iconColor: string
  color: string
}

const welcomeOptions: WelcomeOption[] = [
  {
    id: "1",
    title: "Spending & Budget Tracking",
    description: "Track your expenses and set budget alerts",
    icon: BarChart3,
    iconColor: "text-blue-500",
    color: "white border-gray-100"
  },
  // ... other options
]
```

### Action Buttons
```typescript
interface ActionButton {
  id: string
  label: string
  emoji: string
}
```

### Session Management
```typescript
interface SessionStorageKeys {
  AUTH: "financialConciergeAuth"
  SESSIONS: "financialConciergeSessions"
  CURRENT_SESSION: "financialConciergeCurrentSession"
  THEME: "financialConciergeTheme"
}
```

---

## Local Storage Patterns

### Authentication Storage
```typescript
// Store authentication state
localStorage.setItem("financialConciergeAuth", JSON.stringify(authState))

// Retrieve authentication state
const savedAuth = localStorage.getItem("financialConciergeAuth")
const authData = savedAuth ? JSON.parse(savedAuth) : null
```

### Session Storage
```typescript
// Store chat sessions
localStorage.setItem("financialConciergeSessions", JSON.stringify(chatSessions))

// Store current session ID
localStorage.setItem("financialConciergeCurrentSession", currentSessionId)

// Store theme preference
localStorage.setItem("financialConciergeTheme", darkMode ? "dark" : "light")
```

### Data Persistence Pattern
```typescript
// Sessions are automatically saved when messages change
useEffect(() => {
  if (currentSessionId && messages.length > 0) {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId
          ? {
              ...session,
              messages,
              chatState,
              title: generateSessionTitle(messages),
              timestamp: new Date()
            }
          : session
      )
    )
  }
}, [messages, chatState, currentSessionId])
```

---

## Frontend-Backend Integration Guide

### Recommended Backend Architecture

#### 1. Authentication Service
- JWT-based authentication
- OTP generation and verification
- Session management
- Role-based access control

#### 2. Chat Service
- WebSocket connection for real-time messaging
- Message persistence
- Session management
- Bot response generation

#### 3. Financial Data Service
- Integration with banking APIs
- Real-time financial data
- Report generation
- Transaction analysis

#### 4. Notification Service
- Email notifications
- SMS alerts
- Push notifications
- Fraud alerts

### API Integration Points

#### Replace Simulated Responses
Current simulated bot responses should be replaced with actual API calls:

```typescript
// Current simulation
const handleMainMenuSelection = (actionId: string) => {
  // Simulated responses...
}

// Recommended API integration
const handleMainMenuSelection = async (actionId: string) => {
  try {
    const response = await fetch('/api/financial-services/menu', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        actionId,
        sessionId: currentSessionId,
        chatState
      })
    })
    
    const data = await response.json()
    addBotMessage(data.message, data.actions)
    setChatState(data.newChatState)
  } catch (error) {
    console.error('API Error:', error)
    addBotMessage('Sorry, I encountered an error. Please try again.')
  }
}
```

#### WebSocket Integration
For real-time chat experience:

```typescript
// WebSocket connection setup
const wsConnection = useWebSocket('/ws/chat', {
  onMessage: (message) => {
    const data = JSON.parse(message.data)
    if (data.type === 'bot_response') {
      addBotMessage(data.content, data.actions)
    }
  }
})

// Send message via WebSocket
const sendMessageToBot = (content: string) => {
  wsConnection.send(JSON.stringify({
    type: 'user_message',
    content,
    sessionId: currentSessionId,
    chatState
  }))
}
```

### Security Considerations

#### 1. Authentication
- Implement proper JWT token validation
- Add token refresh mechanism
- Secure OTP generation and validation

#### 2. Data Protection
- Encrypt sensitive financial data
- Implement proper CORS policies
- Add rate limiting
- Validate all user inputs

#### 3. Compliance
- Ensure GDPR compliance for data handling
- Implement audit logging
- Add data retention policies
- Follow banking security standards

### Performance Optimizations

#### 1. Caching
- Implement Redis for session caching
- Cache frequently accessed financial data
- Use CDN for static assets

#### 2. Database Optimization
- Index frequently queried fields
- Implement database connection pooling
- Use read replicas for reporting

#### 3. Real-time Updates
- Use WebSocket for real-time messaging
- Implement proper connection handling
- Add fallback to polling if WebSocket fails

---

## Environment Variables

### Required Environment Variables
```bash
# Authentication
JWT_SECRET=your_jwt_secret_here
OTP_EXPIRY_MINUTES=5

# Database
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# External APIs
BANKING_API_KEY=your_banking_api_key
SMS_API_KEY=your_sms_api_key
EMAIL_API_KEY=your_email_api_key

# Application
API_BASE_URL=your_api_base_url
WEBSOCKET_URL=your_websocket_url
```

### Frontend Environment Variables
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/ws
VITE_APP_NAME=Financial Concierge Bot

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_VOICE_INPUT=false
VITE_MAX_CHAT_SESSIONS=50
```

---

## Error Handling

### API Error Responses
```typescript
interface APIError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}

// Common error codes
enum ErrorCodes {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
  INTERNAL_ERROR = "INTERNAL_ERROR"
}
```

### Frontend Error Handling
```typescript
const handleAPIError = (error: APIError) => {
  switch (error.error.code) {
    case ErrorCodes.UNAUTHORIZED:
      // Redirect to login
      handleSignOut()
      break
    case ErrorCodes.RATE_LIMITED:
      // Show rate limit message
      addBotMessage("Please wait a moment before sending another message.")
      break
    default:
      // Generic error message
      addBotMessage("I encountered an error. Please try again or contact support.")
  }
}
```

---

## Testing Guidelines

### Unit Tests
- Test all data transformation functions
- Test authentication state management
- Test chat state transitions
- Test local storage operations

### Integration Tests
- Test API endpoint integration
- Test WebSocket connections
- Test authentication flow
- Test chat session management

### E2E Tests
- Test complete user journeys
- Test authentication flow
- Test each financial service flow
- Test responsive design

---

This documentation provides a comprehensive overview of the Financial Concierge Bot's architecture and API patterns. For backend implementation, follow the suggested API endpoints and data structures to ensure seamless integration with the existing frontend.