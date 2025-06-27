# Tourist Untrap 🏛️

Help tourists find the best times to visit local attractions to avoid large crowds and long wait times.

## 🚀 Features

- **Crowd Prediction**: Analyze historical data to predict crowd levels
- **Optimal Timing**: Get recommendations for the best times to visit
- **Real-time Updates**: Live crowd level information
- **Alternative Suggestions**: Find less crowded alternatives
- **Interactive Maps**: Visualize attraction locations and crowd patterns

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Google Places API integration
- Weather API integration

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Query for state management
- React Router for navigation
- Chart.js for data visualization

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tourist_Untrap
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories
   - Add your API keys and database configuration

4. **Set up the database**
   ```bash
   cd backend
   npm run db:setup
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔧 Development

- **Backend**: Runs on `http://localhost:5000`
- **Frontend**: Runs on `http://localhost:3000`
- **Database**: PostgreSQL on `localhost:5432`

## 📁 Project Structure

```
Tourist_Untrap/
├── backend/           # Express.js API server
├── frontend/          # React TypeScript application
├── docs/             # Documentation
└── README.md
```

## 🚀 Deployment

Instructions for deploying to production will be added here.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 