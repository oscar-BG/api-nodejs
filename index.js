const express = require('express');
const cors = require('cors');
const sequelize = require('./database/connection');
const UserRoutes = require('./routes/user');
const FollowRoutes =  require('./routes/follow');
const PublicationRoutes = require('./routes/publication');


(async () => {
    try {
        await sequelize.sync({ alter: false, force: false });
        console.log('Database connected successfully');
    } catch (error) {
        console.error(error);
    }
})();


const PORT = 3000;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users', UserRoutes);
app.use('/api/follow', FollowRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on url http://localhost:${PORT}`);
});