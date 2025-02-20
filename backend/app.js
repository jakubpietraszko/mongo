const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const commentRoutes = require("./routes/comment");
const medicRoutes = require("./routes/medic");
const patientRoutes = require("./routes/patient");
const ratingRoutes = require("./routes/rating");
const visitRoutes = require("./routes/visit");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200", // Angular app URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://{insert your MongoDB connection string here}",
  )
  .then(() => {
    console.log("Connected to MongoDB");

    const commentsCollection = mongoose.connection.collection("comments");
    const medicCollection = mongoose.connection.collection("medics");
    const patientsCollection = mongoose.connection.collection("patients");
    const ratingsCollection = mongoose.connection.collection("ratings");
    const visitsCollection = mongoose.connection.collection("visits");

    const changeStreamComments = commentsCollection.watch();
    const changeStreamMedics = medicCollection.watch();
    const changeStreamPatients = patientsCollection.watch();
    const changeStreamRatings = ratingsCollection.watch();
    const changeStreamVisits = visitsCollection.watch();

    if (changeStreamComments && typeof changeStreamComments.on === "function") {
      changeStreamComments.on("change", (change) => {
        // Emit the change to all connected clients
        console.log("Change detected in 'comments' collection:", change);
        io.emit("commentChange", change);
      });
    } else {
      console.error("Change stream is not supported on this collection");
    }

    if (changeStreamMedics && typeof changeStreamMedics.on === "function") {
      changeStreamMedics.on("change", (change) => {
        // Emit the change to all connected clients
        console.log("Change detected in 'medics' collection:", change);
        io.emit("medicChange", change);
      });
    } else {
      console.error("Change stream is not supported on this collection");
    }

    if (changeStreamPatients && typeof changeStreamPatients.on === "function") {
      changeStreamPatients.on("change", (change) => {
        // Emit the change to all connected clients
        console.log("Change detected in 'patients' collection:", change);
        io.emit("patientChange", change);
      });
    } else {
      console.error("Change stream is not supported on this collection");
    }

    if (changeStreamRatings && typeof changeStreamRatings.on === "function") {
      changeStreamRatings.on("change", (change) => {
        // Emit the change to all connected clients
        console.log("Change detected in 'ratings' collection:", change);
        io.emit("ratingChange", change);
      });
    } else {
      console.error("Change stream is not supported on this collection");
    }

    if (changeStreamVisits && typeof changeStreamVisits.on === "function") {
      changeStreamVisits.on("change", (change) => {
        // Emit the change to all connected clients
        console.log("Change detected in 'visits' collection:", change);
        io.emit("visitChange", change);
      });
    } else {
      console.error("Change stream is not supported on this collection");
    }
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/", commentRoutes);
app.use("/api/", medicRoutes);
app.use("/api/", patientRoutes);
app.use("/api/", ratingRoutes);
app.use("/api/", visitRoutes);

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
