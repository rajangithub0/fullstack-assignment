const express = require('express')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors')

dotenv.config() // config of dot env file using for data hidding
const app = express();
app.use(express.json())
connectDB();
app.use(cors())

app.use("/api/user", require('./routes/userRoute'))
const PORT = process.env.PORT;// reading the file in env file
app.listen(PORT, () => console.log(`Application is listen in ${PORT}`));