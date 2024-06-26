require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const { checkAndSendNotifications } = require('./controllers/notificationController')
const roleRoute = require('./routes/roleRoute')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const bodyParser = require('body-parser')
const inDrActRoute = require('./routes/inDrActRoute')
const otdrActRoute = require('./routes/otdrActRoute');
const mngPlaceRoute = require('./routes/mngPlaceRoute');
const eventsRoute = require('./routes/eventsRoute');
const cartRoutes = require('./routes/cartRoute');
const policyRoute = require('./routes/policyRoute');
const termsConditionsRoute = require('./routes/termsConditionsRoute');

//activityTEST

const activityRoute = require('./routes/activityRoute');
const cartTESTroute = require('./routes/cartTESTroute');
const profileRoutes = require('./routes/profileRoutes');
const weatherRoute = require('./routes/weatherRoute');
const scheduleR = require('./routes/scheduleRoute');
const memberR = require('./routes/membersRoute');


// const errorMiddleware = require('./middleware/errorMiddleware')
const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL
const FRONTEND = process.env.FRONTEND
const cookieParser = require('cookie-parser')
var cors = require('cors')
var app = express();
var corsOptions = {
    origin: FRONTEND,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    Credentials: true
}
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use('/api/login', companyLoginRoutes)

//to create roles
app.use('/api/role', roleRoute)
//to register and login
app.use('/api/auth', authRoute)
app.use('/api/schedule', scheduleR)


//to list users
app.use('/api/user', userRoute)
// to add indoor Acvtivity
app.use('/api/indoorAct', inDrActRoute)
// to add Outdoor Acvtivity
app.use('/api/otdoorAct', otdrActRoute)
// ot add places
app.use('/api/place', mngPlaceRoute)
// ot add places
app.use('/api/events', eventsRoute)
// to add cart/checklist
app.use('/api/cart', cartRoutes);
app.use('/api/member', memberR);


//test
// app.use('/uploads', express.static('uploads'));
app.use('/api/profiles', profileRoutes);
app.use('/api/activityRoute', activityRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/carttest', cartTESTroute);
app.use('/api/weather', weatherRoute);
app.use('/api/policy', policyRoute)
app.use('/api/terms', termsConditionsRoute);


//Response handler Middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    })
})

cron.schedule('* * * * * *', async () => {
    await checkAndSendNotifications();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

//database connect
mongoose.set("strictQuery", false)
mongoose.
    connect(MONGO_URL)
    .then(() => {
        console.log('connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Node API app is running on port ${PORT}`)
        });
    }).catch((error) => {
        console.log(error)
    })

