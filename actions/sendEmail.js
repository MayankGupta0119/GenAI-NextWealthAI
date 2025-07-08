import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");

  try {
    console.log("hi inside the try block");
    const data = await resend.emails.send({
      from: "Finance App <onboarding@resend.dev>",
      to,
      subject,
      react,
    });
    console.log("data = ", data);
    return { success: true, data };
  } catch (error) {
    console.log("error aagya");
    console.error("Error sending email:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}
