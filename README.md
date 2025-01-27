# DMY Furniture Backend

Welcome to the backend service of **DMY Furniture**, a platform designed to offer luxury, innovative, and durable furniture solutions. This application handles the server-side logic, database integration, and API services, ensuring seamless operation for the DMY Furniture system.

---

## 🚀 Features

- **User Management**: Registration, login, and profile management.
- **Product Management**: Create, update, delete, and fetch product details.
- **Order Management**: Secure checkout and order processing.
- **Payment Integration**: Cash on Delivery (COD) and Razorpay support.
- **Robust Security**: Token-based authentication using JWT.
- **Database**: Optimized CRUD operations with MySQL.

---

## 🛠️ Tech Stack

### Backend
- **Node.js**: Server-side runtime environment.
- **Express.js**: Framework for building RESTful APIs.
- **MONGODB**: database for storing Collection  data.
- **Sequelize**: ORM for database management.

### Other Tools
- **PHONEPAY,**: Payment gateway integration.
- **JWT**: Secure token-based authentication.
- **Dotenv**: Environment variable management.

---

## 📂 Project Structure

```
DmyFurnitureBackend/
├── components/       # Business logic
├── public/            # Static files
├── app.js             # Main application file
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

---

## ⚙️ Installation

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14+)
- **MONGODB** (v8+)
- **npm** (v6+)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/dmy-furniture-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd dmy-furniture-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=dmy_furniture
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   ```

5. Run database migrations (if using Sequelize):
   ```bash
   npm sequelize db:migrate
   ```

6. Start the server:
   ```bash
   npm start
   ```

---

## 📋 API Documentation

The API documentation is available in **Github**. Once the server is running, visit:
```
http://localhost:3000/api-docs
```

### Example Endpoints

#### User
- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Login and get a token

#### Product
- **GET** `/api/products` - Get all products
- **POST** `/api/products` - Add a new product (Admin only)

#### Order
- **POST** `/api/orders` - Place a new order
- **GET** `/api/orders/:id` - Get order details

---

## 🛡️ Security

- **Environment Variables**: Sensitive information is managed via `.env`.
- **Authentication**: JWT is used for secure user authentication.
- **Validation**: All incoming data is validated using middleware.

---

## 🛠️ Deployment

### Steps

1. Set up a MySQL database on your server.
2. Configure the `.env` file with production credentials.
3. Deploy the app to a platform like **Render**, **Heroku**, or **AWS**.
4. Use a process manager like **PM2** to keep the app running:
   ```bash
   pm2 start app.js
   ```

---

## 🤝 Contribution

We welcome contributions to enhance the backend of DMY Furniture. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Support

For any issues or queries, please contact:
- **Email**:dmyfurniture@gmail.com
- **Phone**: +91-9030664422
