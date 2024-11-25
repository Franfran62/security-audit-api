
# Vulnerable Node.js App

This is a deliberately vulnerable Node.js application for learning purposes.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the database in `.env` file.

3. Import the database schema:
   ```bash
   mysql -u root -p securite_web < database.sql
   ```

4. Run the application:
   ```bash
   npm start
   ```

5. Open your browser at [http://localhost:3000](http://localhost:3000).
