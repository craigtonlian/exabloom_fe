# Exabloom Frontend

A React-based visual workflow editor that allows users to create, edit, and manage conditional logic using If-Else nodes, branches, and custom actions.

## 🛠 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/craigtonlian/exabloom_fe.git
cd exabloom_fe
```

### 2. Install dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Start the development server

Run the following command to start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```markdown
exabloom_fe/
├── src/
│ ├── config/
│ │ └── db.js # Database connection setup
│ └── routes/
│ └── conversations.js # Routes for retrieving recent conversations
├── scripts/
│ ├── test_db.js # Script to test DB connection
│ ├── create_tables.js # Script to create tables, triggers, and indexes
│ ├── populate_tables.js # Script to populate tables with sample data
│ ├── generate_contacts.js # Script to generate sample contact data
│ └── generate_messages.js # Script to generate sample message data
├── data/
│ └── message_content.csv # Sample message data
├── .env # Environment variables
├── .gitignore # Ignore node_modules, .env, etc.
├── package.json # Project dependencies
├── README.md # Documentation
└── server.js # Entry point for the backend server
```

---

## 📋 Tech Stack

- **React**
- **TypeScript**
- **React Flow**
- **Vite**
- **TailwindCSS**
