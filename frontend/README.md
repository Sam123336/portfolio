# Frontend Portfolio Project

This is the frontend part of the portfolio project built using React, Tailwind CSS, and other modern web technologies. The application is designed to serve both admin and viewer roles, providing a seamless experience for managing and viewing portfolio content.

## Project Structure

```
frontend
├── src
│   ├── App.jsx                # Main application component with routing
│   ├── components
│   │   └── Navbar.jsx         # Navigation bar component
│   ├── pages
│   │   ├── AdminDashboard.jsx  # Admin dashboard for managing content
│   │   └── PortfolioViewer.jsx  # Viewer page for displaying portfolio
│   ├── hooks
│   │   └── useAuth.js         # Custom hook for authentication
│   ├── styles
│   │   └── tailwind.css       # Tailwind CSS styles
│   └── utils
│       └── api.js             # API utility for backend calls
├── package.json                # NPM configuration for frontend
└── tailwind.config.js          # Tailwind CSS configuration
```

## Installation

To get started with the frontend application, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd portfolio-project/frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Features

- **Admin Dashboard**: A dedicated interface for admins to manage projects, images, and music.
- **Portfolio Viewer**: A user-friendly page for viewers to explore the portfolio content.
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI.

## Technologies Used

- **React**: For building the user interface.
- **Tailwind CSS**: For styling the application.
- **Axios**: For making HTTP requests to the backend.
- **React Router**: For handling routing within the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.