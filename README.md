# Client Management Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure database:
   - Update `.env` with your PostgreSQL credentials
   - Create database: `createdb client_management`

3. Run migrations:
```bash
npm run migrate
```

4. Start server:
```bash
npm run dev
```

## API Endpoints

- GET `/api/clients` - Get all clients
- GET `/api/clients/:id` - Get client by ID
- POST `/api/clients` - Create new client
- PUT `/api/clients/:id` - Update client
- DELETE `/api/clients/:id` - Delete client
