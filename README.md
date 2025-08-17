# BrainQuest Backend API

![BrainQuest Logo](logo-url-here)

A robust backend system for BrainQuest - an interactive learning platform with quizzes, real-time features, and social learning capabilities.

## 🚀 Features

- **Authentication & Authorization**
  - Email/Password Registration with OTP verification
  - Google OAuth Integration
  - JWT-based Authentication
  - Password Reset with Email
  - Avatar Management

- **Quiz System**
  - Dynamic Quiz Generation
  - AI-Powered Questions (OpenAI & Google Gemini)
  - Multiple Difficulty Levels
  - Real-time Score Calculation
  - Detailed Results & Analytics

- **Social Features**
  - User Profiles
  - Friend System
  - Global Leaderboard
  - Real-time Notifications

- **Additional Features**
  - AI Chatbot Integration
  - Contact & Support System
  - User Feedback System
  - Performance Analytics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Google OAuth
- **Real-time**: Socket.io
- **AI Integration**: OpenAI API, Google Gemini
- **Email**: Nodemailer
- **File Upload**: Cloudinary
- **View Engine**: EJS (for password reset pages)

## 📋 Prerequisites

```bash
node -v  # v18 or higher
npm -v   # v8 or higher
mongodb  # v4.4 or higher
```

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brainquest-backend.git
cd brainquest-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
EMAIL_USER=your_gmail
EMAIL_APP_PASSWORD=your_gmail_app_password
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 📁 Project Structure

```
Backend/
├── app.js              # Application entry point
├── socket.js           # Socket.io configuration
├── config/            
│   └── cloudinary.js   # Cloudinary configuration
├── controllers/        # Route controllers
├── middlewares/        # Custom middlewares
├── models/            # Mongoose models
├── routes/            # API routes
├── views/             # EJS templates
└── data/              # Static data/seeds
```

## 📚 API Documentation

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/user-register` | Register new user | No |
| POST | `/users/send-otp` | Send OTP for verification | No |
| POST | `/users/verify-otp` | Verify OTP | No |
| POST | `/users/user-login` | Login user | No |
| POST | `/users/google-auth` | Google OAuth login | No |
| GET | `/users/user-logout` | Logout user | Yes |
| POST | `/users/forgot-password` | Request password reset | No |
| GET | `/users/reset-password/:token` | Reset password page | No |
| POST | `/users/reset-password/:token` | Update password | No |

### Profile Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/user-profile` | Get user profile | Yes |
| POST | `/users/user-update` | Update profile | Yes |
| POST | `/users/update-avatar` | Update avatar | Yes |
| DELETE | `/users/delete-account` | Delete account | Yes |

### Quiz Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/quiz/start` | Start new quiz | Yes |
| POST | `/quiz/submit` | Submit quiz answers | Yes |
| GET | `/quiz/past` | Get past quizzes | Yes |
| GET | `/quiz/result/:quizId` | Get quiz result | Yes |

### Leaderboard Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/leaderboard` | Get global leaderboard | Yes |

### Contact & Support Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/contact/submit-query` | Submit contact query | Yes |
| GET | `/contact/past-queries` | Get past queries | Yes |
| PUT | `/contact/update-query-status` | Update query status | Yes |

### Chatbot Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/chatbot/generate` | Generate chatbot response | Yes |

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in requests:

```javascript
headers: {
  'Authorization': 'Bearer <your_token_here>'
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📦 Models

### User Model
- Basic Info (name, email, password)
- Profile (avatar, location, bio)
- Quiz History & Statistics
- Social Connections

### Quiz Model
- Questions & Answers
- User Responses
- Timing Information
- Score Calculation

### Leaderboard Model
- User Rankings
- Quiz Performance
- Historical Data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- OpenAI for GPT integration
- Google for Gemini AI
- MongoDB Atlas
- Cloudinary
