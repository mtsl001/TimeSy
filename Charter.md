# Time Synx - Project Charter

## Project Context

**Project Goal:** Time Synx is a comprehensive global time zone coordination tool designed to help distributed teams and individuals schedule meetings and coordinate activities across multiple time zones with real-time synchronization, weather integration, and intuitive visual interfaces.

**Target Audience:** This documentation is intended for new developers onboarding to the team, experienced developers looking to contribute, and technically-inclined end-users who want to understand the application's architecture and capabilities.

**Key Technologies:** 
- **Frontend:** Next.js 15 with App Router, TypeScript 5, React 19
- **Styling:** Tailwind CSS 4 with shadcn/ui component library
- **State Management:** Zustand for client state, TanStack Query for server state
- **Database:** Prisma ORM with SQLite client
- **Real-time:** Socket.IO for WebSocket connections
- **UI Components:** Complete shadcn/ui component set with Lucide icons
- **Additional:** html2canvas for screenshot export, date-fns for date manipulation

---

## 1. Project Overview

Time Synx is a sophisticated web application that simplifies time zone coordination for global teams and individuals. The application provides real-time clock displays across multiple time zones, intelligent meeting time suggestions, weather integration, and comprehensive timezone management features.

### Core Features

- **World Clock Display:** Real-time digital and analog clock displays for 6 major cities worldwide
- **Weather Integration:** Dynamic weather data including temperature, conditions, and wind speed for each timezone
- **Sun Times:** Sunrise and sunset times for each location
- **Meeting Time Finder:** Interactive time slider with 30-minute precision for optimal meeting scheduling
- **Business Hours Analysis:** Visual indicators showing which timezones are in business hours
- **Time Sharing:** Exportable configurations and screenshot capabilities
- **Responsive Design:** Fully responsive interface that works across all devices

### Key Functionality

- Live time synchronization with automatic updates
- Time-focused mode for exploring specific times across zones
- Drag-and-drop timezone reordering
- URL-based configuration sharing
- Dark/light theme support
- Real-time weather updates
- Interactive meeting planning with overlap visualization

---

## 2. Getting Started

### Prerequisites

Before setting up the Time Synx project, ensure you have the following installed:

- **Node.js:** Version 18.0 or higher
- **npm:** Version 9.0 or higher (comes with Node.js)
- **Git:** For version control
- **VS Code** or any modern code editor with TypeScript support

### Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd time-synx
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   ```

4. **Environment Configuration**
   - Create a `.env.local` file in the root directory
   - Add any required environment variables (currently minimal setup)

### Running the Project

**Development Mode:**
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

**Production Build:**
```bash
npm run build
npm start
```

**Code Quality Checks:**
```bash
npm run lint
```

**Database Commands:**
```bash
npm run db:push      # Push schema changes
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:reset      # Reset database
```

---

## 3. Project Structure

```
time-synx/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── health/        # Health check endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main application page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── ClockDisplay.tsx  # Digital/analog clock component
│   │   ├── Footer.tsx        # Application footer
│   │   ├── MeetingTimeFinder.tsx # Meeting scheduler
│   │   ├── TimezoneSelector.tsx # Timezone selection
│   │   └── WorldClock.tsx    # World clock display
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.ts     # Mobile detection
│   │   └── use-toast.ts      # Toast notifications
│   └── lib/                  # Utility libraries
│       ├── db.ts            # Database connection
│       ├── socket.ts        # Socket.IO configuration
│       ├── timezone.ts      # Timezone utilities
│       ├── utils.ts         # General utilities
│       └── weather.ts       # Weather data integration
├── public/                   # Static assets
├── prisma/                  # Database schema
│   └── schema.prisma        # Prisma schema definition
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

### Key Directories Explained

- **`src/app/`**: Next.js 15 App Router structure containing pages and API routes
- **`src/components/`**: Reusable React components, with `ui/` containing shadcn/ui components
- **`src/lib/`**: Core business logic, utilities, and integrations
- **`src/hooks/`**: Custom React hooks for shared functionality
- **`prisma/`**: Database schema and migration files

---

## 4. Core Concepts and Architecture

### Architectural Patterns

Time Synx follows a **component-based architecture** with these key patterns:

- **Server Components**: Next.js 15 App Router for optimal performance
- **Client Components**: Interactive UI elements with React hooks
- **Custom Hooks**: Reusable state logic and side effects
- **Utility Libraries**: Separated business logic from UI components

### Key Components and Responsibilities

#### WorldClock Component
- **Purpose**: Displays multiple timezone cards with real-time updates
- **Features**: Digital/analog clock modes, weather integration, sun times
- **State Management**: Local state for time updates and user interactions

#### MeetingTimeFinder Component
- **Purpose**: Interactive meeting scheduling across timezones
- **Features**: 30-minute precision slider, business hours overlap visualization
- **State Management**: Complex time state with play/pause functionality

#### Timezone Utilities (`src/lib/timezone.ts`)
- **Purpose**: Core timezone calculations and formatting
- **Features**: Time conversion, business hours detection, URL encoding/decoding
- **Functions**: `formatTimeInTimezone`, `isBusinessHours`, `getBusinessHoursOverlap`

#### Weather Integration (`src/lib/weather.ts`)
- **Purpose**: Mock weather data and sun time calculations
- **Features**: Temperature, conditions, wind speed, sunrise/sunset times
- **Note**: Currently uses mock data, ready for real weather API integration

### Data Flow Architecture

1. **Time Updates**: Real-time updates flow from browser `setInterval` → component state → UI updates
2. **User Interactions**: User actions → state updates → component re-renders → URL synchronization
3. **Timezone Management**: Selection changes → state updates → weather/time calculations → UI updates
4. **Meeting Planning**: Time slider → overlap calculations → visual feedback → timezone details

### State Management Strategy

- **Local Component State**: For UI-specific state (analog/digital mode, selected time)
- **URL State**: For shareable configurations using URL parameters
- **No Global State**: Currently uses prop drilling, ready for Zustand integration if needed

---

## 5. API Reference

### Health Check Endpoint

**GET** `/api/health`

**Description**: Returns the health status of the application

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### WebSocket Connection

**Connection**: `ws://localhost:3000/api/socketio`

**Description**: Real-time socket connection for live updates

**Events**:
- `connect`: Client connects to server
- `disconnect`: Client disconnects from server
- `time-update`: Broadcast time updates (future feature)

---

## 6. Usage Guide

### Basic Usage

1. **View World Clocks**: The main screen displays 6 timezone cards with current time, weather, and sun times
2. **Switch Clock Modes**: Toggle between digital and analog displays using the switch in the header
3. **Time Focus Mode**: Click "Time Focused" to explore specific times across all zones
4. **Schedule Meetings**: Use the Meeting Time Finder to identify optimal meeting times

### Advanced Features

#### Sharing Configurations
```javascript
// Share current setup
const handleShare = () => {
  const encoded = encodeTimezonesToURL(timezones, selectedTime);
  const url = `${window.location.origin}?data=${encoded}`;
  navigator.clipboard.writeText(url);
};
```

#### Export Screenshots
```javascript
// Export current view as PNG
const handleExportScreenshot = async () => {
  const html2canvas = (await import('html2canvas')).default;
  const element = document.getElementById('main-content');
  const canvas = await html2canvas(element);
  // Download logic...
};
```

#### Custom Timezone Management
```javascript
// Update timezone properties
const handleTimezoneChange = (id, updates) => {
  setTimezones(prev => prev.map(tz => 
    tz.id === id ? { ...tz, ...updates } : tz
  ));
};
```

### Component Usage Examples

#### WorldClock Component
```tsx
<WorldClock
  timezones={timezones}
  selectedTime={selectedTime}
  isLiveMode={!isTimeFocused}
  showAnalog={showAnalog}
  onTimezoneChange={handleTimezoneChange}
  onReorder={handleReorder}
  onTimeSelect={handleTimeSelect}
/>
```

#### MeetingTimeFinder Component
```tsx
<MeetingTimeFinder
  timezones={activeTimezones}
  selectedTime={selectedTime}
  isLiveMode={!isTimeFocused}
  onTimeSelect={handleTimeSelect}
/>
```

---

## 7. Troubleshooting

### Common Issues and Solutions

#### 1. Development Server Not Starting
**Problem**: `npm run dev` fails to start
**Solution**: 
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install`
- Check port 3000 is not in use

#### 2. Database Connection Issues
**Problem**: Prisma database errors
**Solution**:
```bash
npm run db:generate
npm run db:push
```

#### 3. Timezone Display Issues
**Problem**: Incorrect time display
**Solution**:
- Check browser timezone settings
- Verify timezone data in `DEFAULT_TIMEZONES`
- Ensure `Intl.DateTimeFormat` is supported

#### 4. Build Failures
**Problem**: `npm run build` fails
**Solution**:
- Run `npm run lint` to check for code issues
- Ensure all TypeScript types are correct
- Check for missing dependencies

#### 5. Styling Issues
**Problem**: Tailwind CSS not working
**Solution**:
- Restart development server
- Check `tailwind.config.ts` configuration
- Verify CSS imports in `globals.css`

### Performance Optimization

#### Memory Usage
- Use `useEffect` cleanup for intervals
- Implement debouncing for frequent updates
- Optimize re-renders with `useMemo` and `useCallback`

#### Bundle Size
- Dynamic imports for large libraries (html2canvas)
- Tree shaking for unused components
- Optimize images and assets

---

## 8. Contributing

### Development Workflow

1. **Fork the Repository** and create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes** following the coding standards
   - Use TypeScript for all new code
   - Follow existing component patterns
   - Add proper error handling

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run dev
   ```

4. **Commit Changes** with descriptive messages
   ```bash
   git commit -m "feat: add new timezone selector component"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Coding Standards

#### TypeScript Guidelines
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` types
- Use proper type annotations

#### Component Guidelines
- Use functional components with hooks
- Implement proper prop types
- Follow naming conventions (PascalCase for components)
- Add JSDoc comments for complex logic

#### CSS/Styling Guidelines
- Use Tailwind CSS classes
- Follow responsive design patterns
- Use semantic HTML elements
- Implement dark mode support

#### Code Organization
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use utility functions for complex calculations
- Maintain consistent file structure

### Pull Request Process

1. **Description**: Clearly describe what changes were made and why
2. **Testing**: Explain how the changes were tested
3. **Screenshots**: Include screenshots for UI changes
4. **Breaking Changes**: Highlight any breaking changes
5. **Documentation**: Update relevant documentation

### Code Review Guidelines

- Review for functionality, performance, and maintainability
- Ensure TypeScript types are correct
- Check for proper error handling
- Verify responsive design
- Test accessibility features

---

## Future Enhancements

### Planned Features
- Real weather API integration
- Persistent user preferences
- Team collaboration features
- Calendar integration
- Mobile app development
- Advanced analytics dashboard

### Technical Improvements
- Implement global state management (Zustand)
- Add comprehensive error boundaries
- Improve accessibility (ARIA labels, keyboard navigation)
- Add comprehensive unit and integration tests
- Implement caching strategies
- Optimize for Core Web Vitals

---

## Support and Contact

For questions, issues, or contributions:
- Create an issue in the GitHub repository
- Join our Discord community
- Email the development team

---

*This document is maintained by the Time Synx development team and updated regularly to reflect changes in the codebase and project direction.*