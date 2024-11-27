const express = require("express");
const cors = require("cors");
const morgan = require('morgan')
const env = require('./src/configs/env.config')
const connectDB = require('./src/configs/db.config')

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-app-frontend-tau.vercel.app",
    ],
    credentials: true,
  })
);
app.use(morgan('dev'))

// routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/admin/admin.route");
const errorMiddleware = require( "./src/middlewares/errorMiddleware" );

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/", (req, res) => res.send("Book Store Server is running!"));
app.use(errorMiddleware);

connectDB()
  .then(() => console.log("DataBase connected successfully!"))
  .catch((err) => console.error(err));

app.listen(env.Port, () => {
  console.log(`Server listening on port ${env.Port}`);
});
