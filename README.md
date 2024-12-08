```markdown
# Chat Application Backend

This is the backend service for a real-time chat application. It provides user authentication, messaging functionality, and a RESTful API for integration with the frontend. The application uses MongoDB as the database and includes WebSocket support via `socket.io` for real-time messaging.

---

## **Features**
- **JWT Authentication**: Secure login and signup.
- **User Management**: Retrieve user details and online status.
- **Chat Rooms**: Create and manage chat rooms.
- **Real-Time Messaging**: Real-time message delivery with `socket.io`.
- **API Documentation**: Clear and organized API endpoints for frontend integration.

---

## **Project Structure**

```
src/
│
├── config/          # Configuration for MongoDB, Cloudinary, and environment variables
├── controllers/     # Logic for handling API requests
├── middlewares/     # Custom middlewares (authentication, validation, error handling)
├── models/          # Mongoose models for User, Message, and Chat
├── routes/          # REST API routes
├── sockets/         # WebSocket logic for chat
├── utils/           # Utility functions (error handling, JWT, async wrappers)
└── index.js         # Entry point of the application
```

---

## **Setup Instructions**

### **Prerequisites**
- Node.js (v14 or later)
- MongoDB
- A Cloudinary account for image uploads

---

### **1. Clone the Repository**

```bash
git clone https://github.com/your-repo/chat-backend.git
cd chat-backend
```

---

### **2. Install Dependencies**

Run the following command to install all required packages:

```bash
npm install
```

---

### **3. Set Up Environment Variables**

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
CLOUDINARY_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

You can refer to `.env.example` for the template.

---

### **4. Start the Application**

#### **Development**
The server will restart automatically on changes using `nodemon`.

```bash
npm run dev
```

#### **Production**
```bash
npm start
```

---

### **5. Run Tests**

To run the Jest test suite:

```bash
npm test
```

---

## **API Documentation**

### **Authentication**
- **POST** `/api/v1/auth/signup`  
  **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "user123",
    "password": "password123",
    "dateOfBirth": "2000-01-01",
    "gender": "male",
    "profilePicture": "file path"
  }
  ```
  **Response**:
  ```json
  {
    "status": "success",
    "token": "jwt-token",
    "data": { "user": { ...userDetails } }
  }
  ```

- **POST** `/api/v1/auth/login`  
  Similar to the signup endpoint but only requires email and password.

---

### **Users**
- **GET** `/api/v1/users`  
  Retrieve all users. Requires a valid token in the `Authorization` header.

- **GET** `/api/v1/users/me`  
  Retrieve logged-in user details.

---

### **Chats**
- **GET** `/api/v1/chats`  
  Fetch all chat rooms for the logged-in user.

- **GET** `/api/v1/chats/:chatId`  
  Fetch all messages in a specific chat room.

---

### **Socket Events**
- **joinRoom**: Join a chat room.
- **sendMessage**: Send a message in a room.
- **deleteMessage**: Delete a specific message.
- **isUserOnline**: Check if a user is online.

---

## **Contributing**

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

---

## **License**
This project is licensed under the ISC License.
```