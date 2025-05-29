
"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(1, "Message is required."),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

interface SendEmailResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<SendEmailResult> {
  const validatedFields = ContactFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    // Concatenate all error messages
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(" ");
    return { success: false, error: `Invalid form data: ${errorMessages}` };
  }

  const { name, email, message } = validatedFields.data;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error("[Contact Action] ADMIN_EMAIL environment variable is not set.");
    return { success: false, error: "Server configuration error: Admin email not set." };
  }

  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailFrom = process.env.EMAIL_FROM;

  if (!emailHost || !emailPort || !emailUser || !emailPass || !emailFrom) {
    console.error("[Contact Action] Email server configuration environment variables are missing.");
    return { success: false, error: "Server configuration error: Email settings incomplete." };
  }

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort),
    secure: parseInt(emailPort) === 465, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: emailFrom,
    to: adminEmail, // Send to the admin email
    replyTo: email, // So admin can reply directly to the user
    subject: `Nuevo Contacto Web - ${name}`, // Changed subject line
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `
      <h2>Nuevo Contacto Web</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    await transporter.verify(); // Verify connection configuration
    console.log("[Contact Action] Nodemailer transporter verified successfully.");
    await transporter.sendMail(mailOptions);
    console.log("[Contact Action] Email sent successfully via Nodemailer.");
    return { success: true };
  } catch (error: any) {
    console.error("[Contact Action] Failed to send email via Nodemailer:", error);
    let errorMessage = "Failed to send message. Please try again later.";
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
        errorMessage = "Could not connect to email server. Please try again later.";
    } else if (error.responseCode === 535) { // Authentication credentials invalid
        errorMessage = "Email server authentication failed. Please contact support.";
    } else if (error.message) {
        errorMessage = `Failed to send message: ${error.message}`;
    }
    return { success: false, error: errorMessage };
  }
}
