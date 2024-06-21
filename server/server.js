const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./db');
const formRoutes = require('./dbController');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use('/api', formRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
