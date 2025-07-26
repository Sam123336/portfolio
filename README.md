# Portfolio Project

This is a full-stack portfolio project built with the following technologies:

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Media Storage**: Cloudinary

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

### Frontend

The frontend is built using React and styled with Tailwind CSS. It includes the following key components:

- **App.jsx**: The main component that sets up routing for the application.
- **Navbar.jsx**: A navigation bar for easy access to different sections of the portfolio.
- **AdminDashboard.jsx**: A component for admin users to manage projects, images, and music.
- **PortfolioViewer.jsx**: A component for viewers to browse the portfolio content.

### Backend

The backend is built with Node.js and Express, providing a RESTful API for the frontend. Key files include:

- **app.js**: The entry point of the backend application, setting up the server and routes.
- **controllers/index.js**: Contains controller functions for handling various requests.
- **models/index.js**: Defines Mongoose models for the database.
- **routes/index.js**: Contains route definitions linking endpoints to controller functions.
- **middleware/auth.js**: Middleware for JWT authentication and role verification.
- **utils/cloudinary.js**: Functions for interacting with the Cloudinary API for media management.

## Features

- **Admin Role**: Admins can manage projects, images, and music through the Admin Dashboard.
- **Viewer Role**: Viewers can browse and view the portfolio content.

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables for the backend (e.g., MongoDB URI, Cloudinary credentials).

5. Start the backend server:
   ```
   cd backend
   npm start
   ```

6. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.# portfolio
