const path = require("path");

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const ConnectDB = require("./Config/ConnectionDB");

const AuthRouter = require("./Routes/Auth");
const UserRoutes = require("./Routes/User");
const ExchangeRoutes = require("./Routes/Exchange");
const NotificationRoutes = require("./Routes/Notification");
const ReviewRoutes = require("./Routes/Review");
const VideoRoutes = require("./Routes/Video");
const MessageRoutes = require("./Routes/Message");
const ComplaintRoutes = require("./Routes/Complaint");

// const ReviewRoutes = require("./Routes/Review")





const app = express();

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.use(cors());

app.use(express.json());

ConnectDB();

app.use("/Authentication", AuthRouter);
app.use("/users", UserRoutes);
app.use("/exchange", ExchangeRoutes);
app.use("/notification", NotificationRoutes);
app.use("/review", ReviewRoutes);
app.use("/videos", VideoRoutes);
app.use("/messages", MessageRoutes);
app.use("/complaints", ComplaintRoutes);


app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Server Running"
    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running on ${PORT}`);

});