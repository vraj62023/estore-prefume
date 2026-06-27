import nodemailer from 'nodemailer';

let transporter;

const connectMail = () => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("WARNING: SMTP credentials missing in .env. Email notifications will be mocked and logged to the console.");
        
        // Create mock transporter that logs mail to console
        transporter = {
            sendMail: async (options) => {
                console.log("---------------- MOCK EMAIL SENT ----------------");
                console.log(`To: ${options.to}`);
                console.log(`Subject: ${options.subject}`);
                console.log(`HTML Body: ${options.html ? options.html.substring(0, 300) : ''}...`);
                console.log("-------------------------------------------------");
                return { messageId: "mock-id-" + Date.now() };
            }
        };
        return;
    }

    try {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
            port: Number(process.env.SMTP_PORT) || 2525,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        console.log("SMTP Mail Transport Configured Successfully");
    } catch (error) {
        console.error("Nodemailer configuration error:", error);
        // Fallback mock
        transporter = {
            sendMail: async (options) => {
                console.log("---------------- MOCK EMAIL (FALLBACK) SENT ----------------");
                console.log(`To: ${options.to}`);
                console.log(`Subject: ${options.subject}`);
                console.log("-------------------------------------------------");
                return { messageId: "mock-id-" + Date.now() };
            }
        };
    }
};

export { connectMail, transporter };
