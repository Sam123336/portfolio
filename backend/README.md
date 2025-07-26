# Portfolio Project - Backend

This is the backend portion of the Portfolio Project, built using Node.js, Express, and MongoDB. The backend serves as an API for the frontend application, handling authentication, project management, media storage, and more.

## Features

- **User Authentication**: Secure login and registration with JWT.
- **Admin Dashboard**: Admins can manage projects, images, and music.
- **Media Storage**: Integration with Cloudinary for media uploads and retrieval.
- **Role-Based Access**: Different access levels for admins and viewers.

## Project Structure

```
backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers           # Contains controller functions
│   │   └── index.js
│   ├── models                # Mongoose models for MongoDB
│   │   └── index.js
│   ├── routes                # Route definitions
│   │   └── index.js
│   ├── middleware            # Middleware for authentication
│   │   └── auth.js
│   └── utils                 # Utility functions
│       └── cloudinary.js
├── package.json              # NPM configuration file
└── README.md                 # Documentation for the backend
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd portfolio-project/backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root of the backend directory and add the necessary environment variables (e.g., MongoDB URI, Cloudinary credentials).

4. **Run the application**:
   ```
   npm start
   ```

## API Endpoints

- **Authentication**: `/auth`
- **Projects**: `/projects`
- **Images**: `/images`
- **Music**: `/music`
- **Contact**: `/contact`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.# portfolio
