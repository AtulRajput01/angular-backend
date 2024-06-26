const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');
const schedule=require('../models/scheduleCartModel');
const user=require('../models/userModel')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const notification = async (title, body, name, scheduleDate, scheduleTime,deviceToken)=>{
  try {
    const message = {
        notification: {
          title: title,
          body: `${body} Name: ${name}, scheduled date ${scheduleDate} time ${scheduleTime}`
        },
        token:deviceToken
      };
      await admin.messaging().send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  } catch (e) {
    console.error(e);
  }
};

const checkAndSendNotifications = async () => {
  try {
    const now = new Date();
    const scheduleDate = now.toISOString().split('T')[0];
    const options = { hour: 'numeric', minute: '2-digit', hour12: true,timeZone: 'Asia/Kolkata' };
    const scheduleTime = now.toLocaleString('en-US', options);
    const taskData= await schedule.find({scheduleDate:scheduleDate, scheduleTime :scheduleTime, isSchedule:false },{name: 1, description: 1, activityId: 1 ,userId:1 })
    if (!taskData) {
      return res.status(404).json({ message: "schedule not found" });
    };
    
    if(taskData){
      taskData.forEach(async (doc) => {
        const name = doc.name;
        const userId=doc.userId;
        await schedule.findOneAndUpdate({ activityId: doc.activityId }, { isSchedule: true });
        const userData=await user.findOne({_id:userId});
        const deviceToken=userData.deviceToken;
        await notification('Hello!', 'this activites is', name, scheduleDate, scheduleTime,deviceToken);
       
      }
    )};

  } catch (error) {
    console.error('Error fetching documents:', error);
  }
};

module.exports={notification ,checkAndSendNotifications}