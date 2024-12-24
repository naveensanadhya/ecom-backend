# Backend Project (ecom-frontend)

This is a Ecommerce backend project built with Node.js, Express, and MongoDB.

## Prerequisites

Make sure you have the following installed on your system:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   git clone https://github.com/naveensanadhya/ecom-backend.git

2. Navigate to the project directory:

   cd ecom-backend

3. Install the dependencies:

   npm install

4. Create a .env file and fill in the required environment variables:

   cp env.example .env

5. Fill in the .env file with your specific configuration:

   - PORT=your-port
   - MONGODB_CONNECTION_STRING=your-mongodb-connection-string
   - JWT_SECRET=your-jwt-secret

## Running the Application

6. To start the application in development mode with nodemon:

   npm run dev

7. To start the application in production mode:

   npm start
