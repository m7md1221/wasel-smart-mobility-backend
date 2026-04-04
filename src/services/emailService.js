 const nodemailer = require("nodemailer");

 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: PROCESS.env.EMAIL,
    pass: PROCESS.env.PASSWORD
  }
});

const mailOptions={
 from : process.env.EMAIL,
 to:"s12216999@stu.najah.edu",
 subject:"Test Email from Wasel Smart Mobility",
 text:"This is a test email sent from the Wasel Smart Mobility backend service."
}

transporter.sendMail(mailOptions,(error,info)=>{
 if(error){
  console.log(error);
 }
 else{
  console.log("Email sent: "+info.response);
 }
})