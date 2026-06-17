import express from "express";
import nodemailer from "nodemailer";

const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

console.log(nodemailer);
// transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pratyushmishra286@gmail.com",
    pass: "ycxe kegt jhgs bkev",
  },
});
const mailOptions = {
  from: "pratyushmishra286@gmail.com",
  to: "abhinavpundir182005@gmail.com",
  subject: "Test Email from Node.js",
  text: "This is a test email sent from Node.js , Ar kya haal chal hai bhai aapka , class me padh bhi liya kaaro",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});