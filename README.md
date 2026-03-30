# Love Connect

A real-time, multi-user romantic web application designed for long-distance couples to stay emotionally connected.

## Features

### Authentication & Pairing
- Secure email/password authentication
- Unique invite code system for couple pairing
- Real-time connection status

### Relationship Profile
- Comprehensive relationship data collection:
  - Partner names and pet names
  - Likes, dislikes, and favorites
  - Important dates (anniversaries, birthdays, first date, etc.)
  - Favorite movies, songs, and foods
- Real-time synchronization between partners

### Shared Dashboard
- Days together counter
- Countdown to next special date
- Quick access to all features
- Recent memories display

### Interactive Games
- **Who Knows Better?**: Test how well you know your partner
- **Truth or Dare (Couple Edition)**: Romantic questions and sweet dares
- Real-time gameplay with score tracking

### Movie Night
- Curated movie recommendations based on mood
- Shared watchlist with both partners
- Mark movies as watched with ratings
- Filter by mood (romantic, comedy, emotional)

### Memories
- Create and share notes, love letters, and special memories
- Mark favorites with star system
- Filter by type
- Edit and delete your own memories
- Real-time updates

### Reminders
- Set reminders for special dates
- Daily prompts for check-ins
- Recurring reminders (daily, weekly, monthly, yearly)
- Enable/disable reminders
- Categorize by type (birthday, anniversary, custom)

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. The application is already configured with Supabase credentials in the `.env` file

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## How It Works

1. **Sign Up**: Both partners create individual accounts
2. **Create/Join Couple**: One partner creates a couple space and gets an invite code
3. **Connect**: The other partner uses the invite code to join
4. **Set Up Profile**: Fill in relationship details and important dates
5. **Enjoy Together**: Access all features in your shared space

## Database Structure

The application uses a comprehensive database schema with:
- `couples`: Stores couple pairing information
- `couple_profiles`: Relationship data and milestones
- `games`: Game sessions and scores
- `game_responses`: Individual game answers
- `memories`: Notes, letters, and special memories
- `reminders`: Notifications and special date alerts
- `watchlist`: Shared movie list
- `movie_preferences`: Individual movie preferences

All tables have Row Level Security (RLS) enabled to ensure data privacy and security.

## Real-time Features

The application uses Supabase Realtime to provide instant updates:
- Profile changes sync immediately between partners
- New memories appear in real-time
- Watchlist updates are instant
- Reminders sync across devices
- Game progress updates live

## Design

The UI features:
- Romantic pastel color scheme (pink, purple, blue)
- Smooth animations and transitions
- Floating heart decorations
- Gradient backgrounds
- Clean, modern card-based layout
- Fully responsive design

## Security

- Email/password authentication
- Row Level Security on all database tables
- Secure couple pairing with unique codes
- User data isolated by couple relationship
- Protected API endpoints
