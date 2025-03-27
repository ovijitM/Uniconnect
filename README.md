
# Campus Connect - University Club & Event Management Platform

## Project Overview

Campus Connect is a comprehensive platform designed to streamline university club management and event organization. It connects students with clubs and events at their university, making campus life more accessible and engaging.

## Key Features

### For Students
- **Club Discovery**: Browse and join university clubs based on interests
- **Event Registration**: Register for upcoming events organized by clubs
- **Personal Dashboard**: Track joined clubs and registered events
- **University-specific Content**: View clubs and events specific to your university

### For Club Administrators
- **Club Management**: Create and manage club profiles with detailed information
- **Event Creation**: Organize and promote events to the student community
- **Member Management**: Track club membership and engagement
- **Collaboration**: Partner with other clubs for joint events

### For Administrators
- **University Management**: Add and manage university information
- **Content Moderation**: Review and approve clubs and events
- **User Management**: Manage user roles and permissions

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Query, Context API
- **Deployment**: Netlify/Vercel

## Database Structure

The application uses a PostgreSQL database managed through Supabase with the following key tables:

### Users & Profiles
- **profiles**: User information including name, university, role
  - Connected to Supabase Auth for authentication

### Clubs
- **clubs**: Club information including name, description, category, university
- **club_members**: Maps users to clubs they've joined
- **club_admins**: Maps users to clubs they administer
- **club_activity_posts**: Club announcements and activity updates
- **club_announcements**: Official announcements from clubs
- **club_collaborations**: Collaboration requests between clubs

### Events
- **events**: Event details including title, description, date, location, visibility
- **event_participants**: Tracks users registered for events
- **event_collaborators**: Maps collaborating clubs to events
- **event_reviews**: User reviews and ratings for past events

### Universities
- **universities**: University information for filtering clubs and events

## Row-Level Security

The database implements Row-Level Security (RLS) policies to ensure:
- Students can only see clubs and events appropriate for their university
- Club admins can only manage their own clubs and events
- Users can only edit their own profiles and manage their own memberships

## Getting Started

### Prerequisites
- Node.js & npm installed

### Installation

```sh
# Clone the repository
git clone <YOUR_REPO_URL>

# Navigate to the project directory
cd campus-connect

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Configuration

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## User Roles

The application supports three user roles:

1. **Student**: Can browse, join clubs, and register for events
2. **Club Admin**: Can create and manage clubs and events
3. **Admin**: Can moderate content and manage universities

## Data Flow

1. Users authenticate through Supabase Auth
2. User profiles store university affiliation
3. Content is filtered based on university and visibility settings
4. Changes to clubs or events update in real-time for all users

## Project Structure

- **/src/components**: UI components organized by feature
- **/src/hooks**: Custom hooks for data fetching and state management
- **/src/pages**: Main page components
- **/src/contexts**: React context providers
- **/src/utils**: Utility functions
- **/src/types**: TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
