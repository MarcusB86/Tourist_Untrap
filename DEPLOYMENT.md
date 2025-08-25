# Deployment Guide

## Connecting Frontend to Backend

### 1. Deploy Your Backend

You need to deploy your backend to a cloud service. Here are some options:

**Render (Recommended - Free tier available):**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set the build command: `npm install`
5. Set the start command: `npm start`
6. Add environment variables from your `.env` file
7. Deploy

**Other options:**
- Heroku
- Railway
- AWS
- DigitalOcean

### 2. Set Environment Variable on Netlify

Once your backend is deployed, you'll get a URL like `https://your-app.onrender.com`.

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add a new variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.com` (replace with your actual backend URL)
5. Save and redeploy

### 3. Update CORS in Backend

Make sure your backend allows requests from your Netlify domain:

```javascript
// In your backend server.js
const cors = require('cors');

app.use(cors({
  origin: ['https://your-site.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

### 4. Redeploy Frontend

After setting the environment variable, trigger a redeploy on Netlify.

### 5. Test

Your frontend should now connect to your deployed backend instead of localhost.

## Troubleshooting

- **CORS errors**: Make sure your backend CORS settings include your Netlify domain
- **Environment variable not working**: Check that the variable name starts with `REACT_APP_`
- **Backend not responding**: Verify your backend is running and accessible
