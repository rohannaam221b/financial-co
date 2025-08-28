# Financial Concierge Chat Application

A modern, AI-powered financial banking assistant built with React 18+, TypeScript, and Tailwind CSS v4.

## Features

- 🔐 **Complete Authentication Flow**: Role selection (Customer/Staff) → Mobile input → OTP verification
- 💬 **Interactive Chat Interface**: ChatGPT-inspired conversational UI with bot responses
- 📱 **Mobile-First Design**: Responsive design optimized for all devices
- 🏦 **Financial Services**: 6 comprehensive banking service flows
- 💾 **Session Persistence**: Chat history and authentication state persistence
- 🎨 **Modern UI**: Beautiful gradients, animations, and professional design
- ⚡ **Real-time Features**: Typing indicators, auto-scroll, and smooth transitions

## Financial Services Included

1. **Spending & Budget Tracking** - Expense tracking and budget alerts
2. **Fixed Deposit Alerts & Investments** - FD management and investment options  
3. **Reports & Documentation** - Financial reports and statement generation
4. **Loan & EMI Tracking** - Loan monitoring and EMI management
5. **Investments & Portfolio Insights** - Portfolio analysis and rebalancing
6. **Security & Fraud Alerts** - Account security and fraud protection

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **UI Components**: Custom shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation & Running

1. **Extract/Clone the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   # or
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

The application will be available at `http://localhost:5173`

## Authentication Demo

- **Phone Number**: Any valid 10-digit Indian mobile number (starting with 6-9)
- **OTP Code**: Use `123456` for demonstration purposes

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── AuthScreen.tsx   # Role selection screen
│   ├── SignInScreen.tsx # Mobile number input
│   └── OTPScreen.tsx    # OTP verification
├── styles/
│   └── globals.css      # Tailwind CSS v4 configuration
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Key Features

### Authentication Flow
- Clean 3-step authentication process
- Visual consistency across all screens
- Real-time form validation
- Professional loading states

### Chat Interface
- Conversation-based interaction
- Service-specific flows and responses
- Session management with history
- Professional banking-grade UI

### Design System
- Consistent typography and spacing
- Professional color scheme
- Smooth animations and transitions
- Mobile-responsive design

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is for demonstration purposes.