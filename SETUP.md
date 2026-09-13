# Setup Guide - AI UI Generator

Step-by-step guide to set up the AI UI Generator with Express backend and Google Gemini.

## Prerequisites

Before you start, make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** installed ([Download here](https://git-scm.com/))
- **Google Gemini API key** ([Get one free here](https://makersuite.google.com/app/apikey))

---

## Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/devrelify/gen-ui.git
cd gen-ui
cd ai-ui-generator
```

---

## Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install dependencies for both the frontend and backend.

---

## Step 3: Set Up Environment Variables

### 3.1 Copy the Example Environment File

```bash
cp .env.example .env
```

### 3.2 Add Your Gemini API Key

Open the `.env` file in your text editor and add your Google Gemini API key:

```env
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-2.5-pro
BACKEND_PORT=4000
```

**Where to get your API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key" or "Create API Key"
3. Copy the key and paste it in your `.env` file

**Important:** Replace `your-api-key-here` with your actual API key!

---

## Step 4: Generate Component Schemas

Before starting the servers, generate the component schemas:

```bash
npm run generate-schema
```

This creates the `docs/component-library-schema.json` file needed by the backend.

---

## Step 5: Start the Application

You can start both frontend and backend together:

```bash
npm run dev
```

**What this does:**
- Starts the backend server on `http://localhost:4000`
- Starts the frontend development server on `http://localhost:5173`
- Both run concurrently in the same terminal

**Alternative:** Run them separately in different terminals:

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

---

## Step 6: Open the Application

Open your browser and go to:

```
http://localhost:5173
```

You should see the AI UI Generator welcome page!

---

## Step 7: Test the Application

### 7.1 Try Generating a Component

1. Click on **Chat** in the sidebar
2. Type a prompt like: `"Create a login form with email and password fields"`
3. Press **Enter** or click the **Send** button
4. Wait for the AI to generate the component (usually 10-30 seconds)
5. The component should appear with a live preview!

### 7.2 Check Connection Status

Look at the top-right corner of the navigation bar. You should see:
- **Green dot** with "Connected" = Everything is working! ✅
- **Red dot** with "Disconnected" = Backend is not running ❌

---

## Troubleshooting

### Problem: "Disconnected" Status

**Solution:**
1. Make sure backend is running: You should see logs in the terminal
2. Check if port 4000 is available:
   ```bash
   lsof -i :4000
   ```
3. If another app is using port 4000, change it in `.env`:
   ```env
   BACKEND_PORT=4001
   ```

### Problem: "GEMINI_API_KEY is not set" Error

**Solution:**
1. Check that `.env` file exists in the root directory
2. Verify your API key is correct (no extra spaces)
3. Restart the backend server:
   ```bash
   # Press Ctrl+C to stop, then run:
   npm run dev:backend
   ```

### Problem: "Component schema not found"

**Solution:**
Run the schema generation command:
```bash
npm run generate-schema
```

### Problem: npm install fails

**Solution:**
1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```
2. Install again:
   ```bash
   npm install
   ```

### Problem: Port already in use

**Solution:**
Kill the process using the port:
```bash
# For port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# For port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

---

## Project Structure

After setup, your project should look like this:

```
gen-ui/
├── src/                    # Frontend React code
├── backend/                # Express backend
│   ├── server.js          # Main server file
│   ├── logger.js          # Logging utility
│   ├── docs/              # Component schemas
│   └── prompts/           # AI prompts
├── docs/                   # Component schemas (generated)
├── .env                    # Your environment variables (YOU CREATE THIS)
├── .env.example           # Example environment file
└── package.json           # Project dependencies
```

---

## Building for Production

### Frontend Build

Build the frontend for production:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Backend Deployment

The backend is ready to deploy to:
- **Vercel** (recommended for serverless)
- **Heroku**
- **Railway**
- **Any Node.js hosting**

See [backend/README.md](./backend/README.md) for deployment instructions.

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start only frontend |
| `npm run dev:backend` | Start only backend |
| `npm run build` | Build frontend for production |
| `npm run generate-schema` | Generate component schemas |
| `npm run lint` | Run ESLint |

---

## Next Steps

Now that you're set up:

1. **Explore the Template Gallery** - Pre-built UI patterns to get started
2. **Read the Documentation** - Check `docs/` folder for detailed guides
3. **Customize Components** - Add your own components in `src/templates/`
4. **Deploy to Production** - See backend/README.md for deployment

---

## Getting Help

If you're stuck:

1. **Check the terminal logs** - Look for error messages
2. **Check browser console** - Press F12 and look at the Console tab
3. **Review this guide** - Make sure you completed all steps
4. **Check backend logs** - See what the backend is doing

---

## API Endpoints (For Reference)

Once running, the backend exposes these endpoints:

- `POST /api/agent` - Submit a new generation job
- `GET /api/agent/:jobId` - Check job status
- `GET /api/queue/status` - View queue statistics
- `GET /health` - Check backend health

---

## Additional Resources

- [Backend API Documentation](./backend/README.md)
- [Component Schema Reference](./docs/SCHEMA.md)
- [Frontend Documentation](./README.md)
- [Google Gemini API Docs](https://ai.google.dev/docs)

---

**You're all set!** 🎉

Start creating amazing UIs with AI. Happy coding!
