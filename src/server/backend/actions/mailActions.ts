"use server";
import transporter from "@/lib/nodemailer";

const styles = {
  container:
    "max-width:500px;margin-20px auto;padding-20px;border:1px solid #ddd;border-radius:4px;",
  heading: "font-size:20px;color:#333",
  paragraph: "font-size:16px",
  link: "display:inline-block;margin-top:15px;padding:10px;background:#007aff;color:#fff;text-decoration:none",
};

export const sendEmailAction = async ({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: {
    description: string;
    link: string;
  };
}) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `BetterAuth| ${subject}`,
    html: `
      <div style="${styles.container}">
        <h1 style="${styles.heading}">${subject}</h1>
        <p style="${styles.paragraph}">${meta.description}</p>
        <a style="${styles.link}" href="${meta.link}">Click here</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.log("sendEmailAction", error);
    return { success: false };
  }
};
