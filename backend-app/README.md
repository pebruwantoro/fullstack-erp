# Backend Node.js Service

A robust backend service using Node.js, Clean Architecture, Docker, Postgres, and Redis.

## Prerequisites

- Node.js (v20 or higher)
- npm
- Docker
- Docker Compose

## Environment Variables

Create a `.env` file in the root of the `backend-app` directory and add the following environment variables. You can use the `env.example` file as a template.

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
APP_PORT=8080
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Project Locally

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run the application in development mode**
    ```bash
    npm run dev
    ```
    The application will be running on `http://localhost:8080`.

3.  **Run the application in production mode**
    ```bash
    npm start
    ```

## Running the Project with Docker

1.  **Create `.env` file**
    Create a `.env` file in the root of the `backend-app` directory with the following content:
    ```
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    ```

2.  **Build and run the containers**
    ```bash
    docker-compose up -d --build
    ```
    The application will be running on `http://localhost:8080`.

3.  **To stop the containers**
    ```bash
    docker-compose down

3.  **To delete the containers volume**
    ```bash
    docker-compose down -v

## API Docs

This is backend-app contains of Swagger API Docs on `http://localhost:8080/api-docs`.