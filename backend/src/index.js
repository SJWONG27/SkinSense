const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/AuthRoute");
const imageRoute = require("./routes/ImageRoute");
const productRoute = require("./routes/ProductRoute");
const userRoute = require("./routes/UserRoute");
const messageRoute = require("./routes/MessageRoute")
const profileRoute = require("./routes/ProfileRoute");
const stripeRoute = require("./routes/StripeRoute")

const { MONGO_URI, PORT } = process.env;
const path = require('path'); 


console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error', error);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(
  cors({
    origin: ['http://localhost:5173'], 
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true, 
  })
);


app.use(cookieParser());

app.use(express.json());

app.use("/",authRoute);
app.use("/image", imageRoute)
app.use('/uploads', profileRoute);
app.use("/product", productRoute)
app.use("/user", userRoute)
app.use("/chat", messageRoute)
app.use("/api/stripe",stripeRoute)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all route to serve React's index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});








