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
const { MONGO_URI, PORT } = process.env;


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



app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.use("/",authRoute);

app.use("/image", imageRoute)
app.use("/product", productRoute)








