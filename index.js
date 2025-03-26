const express = require('express');
const cors = require('cors');
const sequelize = require('./database/connection');
const UserRoutes = require('./routes/user');


const PORT = 3000;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', UserRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on url http://localhost:${PORT}`);
});