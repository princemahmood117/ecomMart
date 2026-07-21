// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
// });

// export const sendWelcomeEmail = (to: string, name: string) =>
//   transporter.sendMail({
//     from: `"Cosmetics Store" <${process.env.SMTP_USER}>`,
//     to,
//     subject: "Welcome! 🎉",
//     html: `<h2>Congratulations, ${name}!</h2><p>Your account has been created successfully.</p>`,
//   });

// export const sendOrderEmail = (to: string, name: string, productName: string, productId: string) =>
//   transporter.sendMail({
//     from: `"Cosmetics Store" <${process.env.SMTP_USER}>`,
//     to,
//     subject: "Order Confirmation",
//     html: `<h2>Thank you, ${name}!</h2><p>Your order for <b>${productName}</b> (ID: ${productId}) has been placed.</p>`,
//   });




import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendWelcomeEmail = (to: string, name: string) => {
  transporter.sendMail({
    from: `"Cosmetics Store" <${process.env.SMTP_USER}>`,
    to,
    subject: "Welcome! 🎉",
    html: `<h2>Congratulations, ${name}!</h2><p>Your account has been created successfully.</p>`,
  }).catch((err) => console.error("Error sending welcome email:", err));
};

export const sendOrderEmail = (to: string, name: string, productName: string, productId: string) => {
  transporter.sendMail({
    from: `"Cosmetics Store" <${process.env.SMTP_USER}>`,
    to,
    subject: "Order Confirmation",
    html: `<h2>Thank you, ${name}!</h2><p>Your order for <b>${productName}</b> (ID: ${productId}) has been placed.</p>`,
  }).catch((err) => console.error("Error sending order email:", err));
};