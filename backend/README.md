# CloudKicks E-Commerce Platform

A full-stack e-commerce application built with Node.js, Express, MongoDB, and EJS templating. CloudKicks provides separate interfaces for customers and administrators to manage products and orders.

## Features

- **User Authentication**: Secure registration and login with JWT tokens and bcrypt password hashing
- **Role-Based Access**: Separate user and admin roles with different permissions
- **Product Management**: Admin panel for creating, viewing, and managing products
- **Shopping Cart**: Users can browse products and add items to their cart
- **Flash Messages**: Session-based notifications for user feedback
- **Responsive UI**: Built with Tailwind CSS for a modern look

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Session Management**: express-session, cookie-parser
- **View Engine**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cloudkicks
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
EXPRESS_SESSION_SECRET=your_session_secret_here
```

4. Ensure MongoDB is running on `mongodb://127.0.0.1:27017`

5. Start the application:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes

#### User Registration
- **POST** `/users/register`
- **Body**: 
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Redirects to `/shop` with JWT cookie set
- **Description**: Creates a new user account

#### User/Admin Login
- **POST** `/users/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Redirects to `/shop` (users) or `/admin/panel` (admins)
- **Description**: Authenticates users or admins

#### Admin Login (Alternative)
- **POST** `/admin/login`
- **Body**: Same as user login
- **Response**: Redirects to `/admin/panel`
- **Description**: Admin-specific login endpoint

#### Logout
- **GET** `/users/logout`
- **Response**: Redirects to `/`
- **Description**: Clears authentication token and logs out user

### Admin Routes

#### Create Admin (Development Only)
- **POST** `/admin/create`
- **Body**:
  ```json
  {
    "fullname": "Admin Name",
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```
- **Response**: JSON with admin details and JWT cookie
- **Description**: Creates the first admin account (only works if no admin exists)
- **Note**: Only available when `NODE_ENV=development`

#### Admin Panel
- **GET** `/admin/panel`
- **Response**: Admin panel page
- **Description**: Main admin dashboard

### Application Routes

#### Homepage
- **GET** `/`
- **Response**: Login/registration page
- **Description**: Landing page with user registration and login forms

#### Shop Page
- **GET** `/shop`
- **Auth Required**: Yes (isLoggedIn middleware)
- **Response**: Product listing page
- **Description**: Main shopping page for authenticated users

### Product Routes

#### Products Base
- **GET** `/products/`
- **Response**: "Admin Page" message
- **Description**: Base products endpoint (currently placeholder)

### User Routes

#### Users Base
- **GET** `/users/`
- **Response**: "User Page" message
- **Description**: Base users endpoint (currently placeholder)

## Middleware

### Authentication Middleware (`isLoggedIn`)

Protects routes that require authentication. Checks for valid JWT token in cookies and attaches user object to request.

**Usage**:
```javascript
router.get("/shop", isLoggedIn, (req, res) => {
  // Route handler
});
```

**Behavior**:
- Redirects to `/` with flash message if no token
- Validates JWT token
- Fetches user from database (excluding password)
- Attaches user to `req.user`
- Handles expired or invalid tokens

## Database Models

### User Model
- `fullname`: String (required, min 3 characters)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `cart`: Array (default: [])
- `orders`: Array (default: [])
- `contact`: Number
- `picture`: String

### Admin Model
- `fullname`: String (required, min 3 characters)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `products`: Array (default: [])
- `picture`: String
- `gstin`: String

### Product Model
- `name`: String
- `image`: String (base64 encoded)
- `price`: Number
- `discount`: Number (default: 0)
- `bgColor`: String
- `panelColor`: String
- `textColor`: String

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- HTTP-only cookies for token storage
- Role-based access control (user/admin)
- Session management with express-session
- CSRF protection through cookie-parser

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `EXPRESS_SESSION_SECRET` | Secret for session encryption | Yes |
| `MONGODB_URI` | MongoDB connection string | No (defaults to local) |

## Project Structure

```
backend/
├── config/
│   ├── connection.js       # MongoDB connection
│   └── development.json    # Development config
├── controllers/
│   └── authController.js   # Authentication logic
├── middlewares/
│   └── checkAuth.js        # Auth middleware
├── models/
│   ├── userModel.js        # User schema
│   ├── adminModel.js       # Admin schema
│   └── productModel.js     # Product schema
├── routes/
│   ├── userRoute.js        # User routes
│   ├── adminRoute.js       # Admin routes
│   ├── productRoute.js     # Product routes
│   └── appRoute.js         # General app routes
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs           # Landing page
│   ├── shop.ejs            # Shop page
│   ├── admin.ejs           # Admin dashboard
│   ├── cart.ejs            # Shopping cart
│   └── createproducts.ejs  # Product creation form
├── public/
│   └── css/
│       └── output.css      # Tailwind CSS
└── index.js                # Main application file
```

## Development

### Creating the First Admin

1. Ensure `NODE_ENV=development` in your `.env` file
2. Send a POST request to `/admin/create`:

```bash
curl -X POST http://localhost:3000/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Admin User",
    "email": "admin@cloudkicks.com",
    "password": "securepassword"
  }'
```

### Testing Authentication

1. Register a new user through the UI at `http://localhost:3000`
2. Login with the created credentials
3. Access the shop page at `http://localhost:3000/shop`

## Future Enhancements

- Product creation endpoint implementation
- Cart functionality (add/remove items)
- Order processing and checkout
- Payment gateway integration
- Product filtering and sorting
- Image upload handling
- Email verification
- Password reset functionality
- Admin product management (edit/delete)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.