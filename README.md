# 🔙 Zerodha Backend

A scalable Node.js & Express backend powering the Zerodha Clone ecosystem. It provides secure authentication, portfolio management, order processing, and trading data APIs built with production-ready architecture and best backend practices.

---

## 🚀 Features

* 🔐 JWT Authentication with HttpOnly Cookies & Bearer Token Support
* 🛡️ Secure Password Hashing using BcryptJS
* ⚡ Centralized Error Handling Architecture
* 🔄 Async Request Handling Middleware
* 📊 Portfolio, Holdings, Positions & Orders Management
* 🚦 Rate Limiting for API Protection
* 💾 MongoDB Database Integration using Mongoose
* 🚀 Redis-ready Caching Support
* 🌐 CORS-enabled Secure Cross-Origin Communication

---

## 🛠 Tech Stack

| Technology | Purpose             |
| ---------- | ------------------- |
| Node.js    | Runtime Environment |
| Express.js | Backend Framework   |
| MongoDB    | Database            |
| Mongoose   | ODM                 |
| JWT        | Authentication      |
| BcryptJS   | Password Security   |
| Redis      | Caching Layer       |

---

## 📂 Project Structure

```bash
backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── schema/
├── utils/
├── .env
├── index.js
└── package.json
```

### Controllers

* AuthController.js → User Authentication
* HoldingController.js → Portfolio Holdings
* OrderController.js → Orders Management
* NewOrderController.js → Order Creation
* PositionController.js → Positions Tracking

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| POST   | /auth/signup | Register User  |
| POST   | /auth/login  | Login User     |
| GET    | /auth/verify | Verify Session |
| POST   | /auth/logout | Logout User    |

### Trading Services

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | /allOrders    | Fetch User Orders    |
| GET    | /allPositions | Fetch User Positions |
| POST   | /allHoldings  | Fetch User Holdings  |

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3002
MONGO_URI=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret_key

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

NODE_ENV=development
```

---

## 🚀 Installation

```bash
# Clone Repository
git clone https://github.com/harshjdhv/zerodha-backend.git

# Navigate
cd zerodha-backend

# Install Dependencies
npm install

# Run Development Server
npm run dev
```

Server runs on:

```bash
http://localhost:3002
```

---

## 🔗 Related Projects

* Zerodha Frontend Dashboard
* Analytics Dashboard
* Zerodha Microservices Ecosystem

Main Repository:
https://github.com/harshjdhv/ZERODHA

---

## 👨‍💻 Author

Harsh Jadhav

Building scalable full-stack applications with MERN, Docker, System Design, and modern backend architectures.
