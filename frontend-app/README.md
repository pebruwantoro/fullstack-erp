# Frontend React + Vite Application

This is a frontend application built with React and Vite.

## Prerequisites

- Node.js (v20 or higher)
- npm

## Environment Variables

Create a `.env` file in the root of the `frontend-app` directory and add the following environment variable. You can use the `.env.example` file as a template.

```
VITE_API_BACKEND_PATH=http://localhost:8080
```

## Running the Project

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run the application in development mode**
    ```bash
    npm run dev
    ```
    The application will be running on `http://localhost:3000` by default.

3.  **Build for production**
    ```bash
    npm run build
    ```

4.  **Preview the production build**
    ```bash
    npm run preview
