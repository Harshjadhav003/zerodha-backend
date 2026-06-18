Markdown
# 🔙 Zerodha Backend

A high-performance, production-ready Node.js & Express microservice powering the core trading engine, secure authentication pipelines, and data management for the Zerodha Clone ecosystem.

---

## 🚀 Key Engineering Features

* **Centralized Error Architecture:** Built with a custom `ErrorHandler` operational utility and an `asyncHandler` wrapper pipeline to eliminate cluttered `try-catch` blocks and guarantee clean, predictable JSON error responses.
* **Dual-Layer Production Auth:** Secure JWT-based authentication system supporting hybrid fallback extraction from both **HttpOnly Cookies** (configured with cross-origin `SameSite: "none"` and `secure: true` for production environments) and standard HTTP Bearer headers.
* **Secure Data Layer:** Built on top of Mongoose/MongoDB, tracking user states, execution orders, and account portfolios securely with `bcryptjs` credential hashing.
* **Production Caching:** Fully prepared to hook into Redis clusters with password/TLS auth flags enabled for lightning-fast data retrieval.

---

## 🛠️ Tech Stack

* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js
* **Database & Modeling:** MongoDB via Mongoose Object Modeling
* **Session & Security:** JSON Web Tokens (JWT), BcryptJS
* **Caching & Real-Time:** Redis Caching System

---

## 📂 Architecture Structure

```text
backend/
├── config/             # Database initialization & Redis connect clients
├── controllers/        # Pure request handlers containing core platform logic
│   ├── AuthController.js       # Centralized, error-safe user authentication processes
│   ├── HoldingController.js    # Comprehensive long-term security asset handlers
│   ├── NewOrderController.js   # Fast execution order creation systems
│   ├── OrderController.js      # Historically executed ledger queries
│   └── PositionController.js   # Dynamic open intraday tracking models
├── middlewares/        # Express pipeline intercepts
│   ├── asyncHandler.js         # Global Promise rejection adapter
│   ├── errorMiddleware.js      # Unified error payload parser and dispatch center
│   └── rateLimiter.js          # Route-specific brute force/DDoS protection
├── utils/              # Operational framework helper tools
│   ├── ErrorHandler.js         # Dedicated operational API error extensions
│   └── SecretToken.js          # Cryptographically secure JWT sign mechanisms
📡 API Endpoints
All endpoints route traffic dynamically through the centralized error monitoring middleware layers.

🔐 Authentication Service
Endpoint	Method	Security	Payload Required	Description
/auth/signup	POST	Public	{username, email, password}	Registers users, hashes credentials, and drops valid HttpOnly cookies.
/auth/login	POST	Public	{email, password}	Validates user signature and instantiates a stateful session.
/auth/verify	GET	Private	None (Cookie/Header)	Decodes JWT parameters to authenticate runtime session validity.
/auth/logout	POST	Private	None	Flushes browser/client tokens and destroys active user sessions.
📊 Trading & Portfolio Service
Endpoint	Method	Security	Description
/allOrders	GET	Private	Fetches comprehensive historically executed user order books.
/allPositions	GET	Private	Dynamically tracks volatile active open intraday margin metrics.
/allHoldings	POST	Private	Fetches long-term stock portfolio asset holdings optimized via cache layers.
⚙️ Setup Instructions
1. Environment Configuration
Create a .env file in the root backend directory and configure the following blocks:

Code snippet
PORT=3002
MONGO_URI=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret_signing_key
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_auth_password
NODE_ENV=development
2. Native System Installation
Ensure you have Node.js and MongoDB instances configured locally or on cloud providers before launching:

Bash
# Clone this repository individually
git clone [https://github.com/harshjdhv/zerodha-backend.git](https://github.com/harshjdhv/zerodha-backend.git)
cd zerodha-backend

# Install structural dependencies
npm install

# Run the backend system engine in active development watch mode
npm run dev
The system engine will boot and host on: 👉 http://localhost:3002

🔗 Connected Microservices
Frontend Engine: Renders the modular trading dashboard and hooks into backend WebSockets.

Analytics Dashboard: Reads database logs for visualizations.

👉 Part of the Zerodha Microservices Project. 🔗 Main Orchestration Root Repo: https://github.com/harshjdhv/ZERODHA