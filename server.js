const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const cookieParser = require('cookie-parser')
const app = express();
const server = http.createServer(app);

/** Create socket connection */
global.io = module.exports.io = require('socket.io')(server)
const SocketManager = require('./utils/WebSockets')
global.io.on('connection', SocketManager)

// DB CONFIG AND .env FILE
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });

// Connect DB
connectDB();

//Import Routes

const bank_accountsRoute = require("./routes/bank_accounts");
const choiceRoute = require("./routes/choice");
const conversationRoute = require("./routes/conversation");
const messagesRoute = require("./routes/messages");
const facturaRoute = require("./routes/factura");
const questionRoute = require("./routes/question");
const reviewsRoute = require("./routes/reviews");
const specialtyRoute = require("./routes/specialty");
const testRoute = require("./routes/test");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const roleRoute = require("./routes/roles");
const emailRoute = require("./routes/emails");

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: [process.env.CLIENT_URL]
}));

app.use(cookieParser())

// Uploads user avatars
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single("image"));

// Muestra todos los request en la consola
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/bank-accounts", bank_accountsRoute);
app.use("/api/choice", choiceRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/factura", facturaRoute);
app.use("/api/question", questionRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/specialities", specialtyRoute);
app.use("/api/test", testRoute);
app.use("/api/roles", roleRoute);
app.use("/api/emails", emailRoute);
// Port
const PORT = process.env.PORT || 3000;

// Server Running
server.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
