# Financial Concierge Bot - Complete API List

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Chat Management APIs](#chat-management-apis)
3. [Financial Services APIs](#financial-services-apis)
4. [Banking Integration APIs](#banking-integration-apis)
5. [External Service APIs](#external-service-apis)
6. [Utility & System APIs](#utility--system-apis)
7. [WebSocket APIs](#websocket-apis)
8. [File & Document APIs](#file--document-apis)

---

## Authentication APIs

### Core Authentication Endpoints
```http
POST /api/auth/role-select
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/refresh-token
POST /api/auth/logout
GET  /api/auth/me
```

### Session Management
```http
GET  /api/auth/sessions
DELETE /api/auth/sessions/{sessionId}
POST /api/auth/sessions/extend
```

### User Profile
```http
GET  /api/users/profile
PUT  /api/users/profile
GET  /api/users/preferences
PUT  /api/users/preferences
```

---

## Chat Management APIs

### Chat Sessions
```http
GET    /api/chat/sessions              # Get all chat sessions
POST   /api/chat/sessions              # Create new chat session
GET    /api/chat/sessions/{id}         # Get specific chat session
PUT    /api/chat/sessions/{id}         # Update chat session
DELETE /api/chat/sessions/{id}         # Delete chat session
```

### Messages
```http
GET  /api/chat/sessions/{id}/messages     # Get chat messages
POST /api/chat/sessions/{id}/messages     # Send message
PUT  /api/chat/messages/{messageId}       # Update message
DELETE /api/chat/messages/{messageId}     # Delete message
```

### Bot Responses & AI
```http
POST /api/chat/bot-response               # Get bot response
POST /api/chat/analyze-intent             # Analyze user intent
POST /api/chat/generate-actions           # Generate action buttons
POST /api/chat/context-update             # Update chat context
```

---

## Financial Services APIs

### 1. Spending & Budget Tracking
```http
GET  /api/financial/spending/summary      # Monthly spending summary
GET  /api/financial/spending/categories   # Spending by category
GET  /api/financial/spending/trends       # Spending trends
POST /api/financial/budget/create         # Create budget alert
GET  /api/financial/budget/alerts         # Get budget alerts
PUT  /api/financial/budget/{id}           # Update budget
DELETE /api/financial/budget/{id}         # Delete budget
GET  /api/financial/cashback/suggestions  # Cashback card suggestions
```

### 2. Fixed Deposits & Investments
```http
GET  /api/financial/fd/list               # List all FDs
GET  /api/financial/fd/{id}               # Get specific FD
POST /api/financial/fd/auto-renew         # Set auto-renewal
POST /api/financial/fd/mature-action      # Set maturity action
GET  /api/financial/investments/options   # Get investment options
POST /api/financial/investments/compare   # Compare investment options
```

### 3. Reports & Documentation
```http
GET  /api/reports/available               # Available report types
POST /api/reports/generate                # Generate report
GET  /api/reports/{id}/download           # Download report
GET  /api/reports/gst                     # GST reports
GET  /api/reports/tax-saving              # Tax-saving reports
GET  /api/reports/loan-forecast           # Loan repayment forecast
GET  /api/reports/account-summary         # Account summary
POST /api/reports/schedule                # Schedule auto-reports
```

### 4. Loan & EMI Tracking
```http
GET  /api/loans/list                      # List all loans
GET  /api/loans/{id}                      # Get specific loan
GET  /api/loans/emi-summary               # EMI summary
GET  /api/loans/prepayment-eligibility    # Check prepayment eligibility
POST /api/loans/prepayment                # Make prepayment
POST /api/loans/restructure               # Loan restructuring
GET  /api/loans/advisor/schedule          # Schedule advisor call
```

### 5. Investments & Portfolio
```http
GET  /api/portfolio/summary               # Portfolio summary
GET  /api/portfolio/performance           # Performance metrics
GET  /api/portfolio/holdings              # Current holdings
GET  /api/portfolio/sip-status            # SIP status
POST /api/portfolio/rebalance             # Rebalance portfolio
GET  /api/portfolio/tax-saving            # Tax-saving opportunities
POST /api/portfolio/execute-trade         # Execute trade
```

### 6. Security & Fraud Alerts
```http
GET  /api/security/recent-transactions    # Recent transactions
GET  /api/security/alerts                 # Security alerts
POST /api/security/verify-transaction     # Verify transaction
POST /api/security/block-card             # Block card
POST /api/security/fraud-report           # Report fraud
GET  /api/security/callback-request       # Request callback
POST /api/security/emergency-cash         # Emergency cash access
```

---

## Banking Integration APIs

### Account Information
```http
GET  /api/banking/accounts                # List accounts
GET  /api/banking/accounts/{id}/balance   # Account balance
GET  /api/banking/accounts/{id}/transactions # Transaction history
GET  /api/banking/accounts/{id}/statements   # Account statements
```

### Transaction Processing
```http
POST /api/banking/transfer                # Fund transfer
POST /api/banking/bill-payment            # Bill payment
GET  /api/banking/beneficiaries           # Beneficiary list
POST /api/banking/beneficiaries           # Add beneficiary
```

### Card Management
```http
GET  /api/banking/cards                   # List cards
POST /api/banking/cards/{id}/block        # Block card
POST /api/banking/cards/{id}/unblock      # Unblock card
GET  /api/banking/cards/{id}/limits       # Card limits
PUT  /api/banking/cards/{id}/limits       # Update limits
```

---

## External Service APIs

### SMS & Communication
```http
POST /api/external/sms/send               # Send SMS
POST /api/external/sms/otp                # Send OTP SMS
GET  /api/external/sms/status/{id}        # SMS delivery status
```

### Email Services
```http
POST /api/external/email/send             # Send email
POST /api/external/email/report           # Send report via email
POST /api/external/email/alert            # Send alert email
GET  /api/external/email/templates        # Email templates
```

### Push Notifications
```http
POST /api/external/push/send              # Send push notification
POST /api/external/push/subscribe         # Subscribe to notifications
DELETE /api/external/push/unsubscribe     # Unsubscribe
```

### Document Generation
```http
POST /api/external/pdf/generate           # Generate PDF
POST /api/external/excel/generate         # Generate Excel
POST /api/external/doc/convert            # Convert document format
```

### Financial Data Providers
```http
GET  /api/external/market-data/stocks     # Stock market data
GET  /api/external/market-data/mutual-funds # Mutual fund data
GET  /api/external/rates/fd               # FD interest rates
GET  /api/external/rates/loan             # Loan interest rates
```

### Credit Score & Analysis
```http
GET  /api/external/credit-score           # Credit score
GET  /api/external/credit-report          # Credit report
POST /api/external/credit-analysis        # Credit analysis
```

---

## Utility & System APIs

### System Health & Monitoring
```http
GET  /api/health                          # System health check
GET  /api/status                          # Service status
GET  /api/metrics                         # System metrics
```

### Configuration & Settings
```http
GET  /api/config/app                      # App configuration
GET  /api/config/features                 # Feature flags
PUT  /api/config/update                   # Update configuration
```

### Audit & Logging
```http
GET  /api/audit/logs                      # Audit logs
POST /api/audit/log-event                 # Log event
GET  /api/audit/user-activity             # User activity logs
```

### Rate Limiting & Security
```http
GET  /api/rate-limit/status               # Rate limit status
POST /api/security/verify-request         # Verify request
GET  /api/security/threat-analysis        # Threat analysis
```

---

## WebSocket APIs

### Real-time Chat
```websocket
ws://localhost:3001/ws/chat               # Chat WebSocket connection

Message Types:
- user_message
- bot_response
- typing_indicator
- connection_status
- session_update
```

### Real-time Notifications
```websocket
ws://localhost:3001/ws/notifications      # Notification WebSocket

Message Types:
- fraud_alert
- transaction_alert
- budget_alert
- system_notification
```

### Real-time Financial Data
```websocket
ws://localhost:3001/ws/financial          # Financial data WebSocket

Message Types:
- market_update
- portfolio_change
- rate_change
- news_alert
```

---

## File & Document APIs

### File Upload & Management
```http
POST /api/files/upload                    # Upload file
GET  /api/files/{id}                      # Get file
DELETE /api/files/{id}                    # Delete file
GET  /api/files/list                      # List files
```

### Document Processing
```http
POST /api/documents/ocr                   # OCR processing
POST /api/documents/analyze               # Document analysis
POST /api/documents/extract-data          # Extract data from document
```

### Report Generation
```http
POST /api/documents/generate-pdf          # Generate PDF report
POST /api/documents/generate-excel        # Generate Excel report
GET  /api/documents/templates             # Report templates
```

---

## API Integration Examples

### Environment Variables for APIs
```bash
# Internal APIs
API_BASE_URL=https://api.financialconcierge.com
WS_BASE_URL=wss://ws.financialconcierge.com

# Banking APIs
BANKING_API_URL=https://api.bank.com/v2
BANKING_API_KEY=your_banking_api_key
BANKING_CLIENT_ID=your_client_id

# External Services
SMS_API_URL=https://api.sms-provider.com/v1
SMS_API_KEY=your_sms_api_key

EMAIL_API_URL=https://api.email-provider.com/v1
EMAIL_API_KEY=your_email_api_key

PUSH_NOTIFICATION_KEY=your_push_notification_key

# Financial Data
MARKET_DATA_URL=https://api.market-data.com/v1
MARKET_DATA_KEY=your_market_data_key

CREDIT_SCORE_URL=https://api.credit-score.com/v1
CREDIT_SCORE_KEY=your_credit_score_key

# Document Services
PDF_GENERATION_URL=https://api.pdf-generator.com/v1
PDF_API_KEY=your_pdf_api_key

OCR_SERVICE_URL=https://api.ocr-service.com/v1
OCR_API_KEY=your_ocr_api_key
```

### API Client Configuration
```typescript
// API Client Setup
export const apiClient = {
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  interceptors: {
    request: (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    response: (response) => {
      return response
    },
    error: (error) => {
      if (error.response?.status === 401) {
        // Handle authentication error
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  }
}
```

### WebSocket Client Configuration
```typescript
// WebSocket Client Setup
export class WebSocketClient {
  private ws: WebSocket | null = null
  
  connect(endpoint: string) {
    const token = localStorage.getItem('authToken')
    const wsUrl = `${process.env.VITE_WS_BASE_URL}${endpoint}?token=${token}`
    
    this.ws = new WebSocket(wsUrl)
    
    this.ws.onopen = () => {
      console.log('WebSocket connected')
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.reconnect(endpoint)
    }
  }
  
  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }
  
  private reconnect(endpoint: string) {
    setTimeout(() => {
      this.connect(endpoint)
    }, 5000)
  }
}
```

---

## API Security Requirements

### Authentication & Authorization
- JWT tokens for API authentication
- Role-based access control (Customer vs Staff)
- Token refresh mechanism
- Session management

### Data Protection
- HTTPS for all API calls
- Request/response encryption for sensitive data
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Rate Limiting
- API rate limiting per user/IP
- DDoS protection
- Request throttling
- Fair usage policies

### Compliance & Audit
- GDPR compliance for data handling
- Banking regulation compliance
- Audit logging for all transactions
- Data retention policies
- PCI DSS compliance for card data

---

## API Testing & Development

### Testing APIs
```bash
# Authentication
curl -X POST "https://api.financialconcierge.com/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210", "role": "customer"}'

# Chat Message
curl -X POST "https://api.financialconcierge.com/api/chat/sessions/123/messages" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Show my spending summary", "type": "user"}'

# Financial Data
curl -X GET "https://api.financialconcierge.com/api/financial/spending/summary" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### API Documentation Tools
- **Swagger/OpenAPI**: For API documentation
- **Postman**: For API testing and collection
- **Insomnia**: Alternative API testing tool
- **API Blueprint**: For API specification

### Monitoring & Analytics
- **Datadog**: API monitoring and alerting
- **New Relic**: Application performance monitoring
- **LogRocket**: Session replay and error tracking
- **Mixpanel**: User analytics and events

---

## Implementation Priority

### Phase 1 - Core APIs (Immediate)
1. Authentication APIs
2. Chat Management APIs
3. Basic Financial Service APIs
4. WebSocket for real-time chat

### Phase 2 - Extended Features (Short-term)
1. Banking Integration APIs
2. Report Generation APIs
3. Document Processing APIs
4. External Service Integrations

### Phase 3 - Advanced Features (Long-term)
1. AI/ML APIs for better responses
2. Advanced Analytics APIs
3. Third-party Financial APIs
4. Mobile-specific APIs

### Phase 4 - Enterprise Features (Future)
1. Multi-tenant APIs
2. White-label APIs
3. Partner Integration APIs
4. Advanced Security APIs

---

This comprehensive API list provides the foundation for transforming your Financial Concierge Bot from a frontend-only application to a fully-featured, production-ready financial services platform.