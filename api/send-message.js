import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, email, phone, role, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email address" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Map service codes to readable names
    const serviceNames = {
      "ai-mvp": "AI MVP Build",
      "ai-standard": "Standard AI Product — Core",
      "ai-custom": "Standard AI Product — Plus",
      "automation": "Workflow Automation",
      "website": "Website Development",
    };

    const serviceName = serviceNames[role] || role || "Not specified";

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || "anas@genaiworks.co",
      subject: "🚀 New Contact Form Submission - GenAIWorks",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .field {
              margin-bottom: 20px;
              background: white;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #667eea;
            }
            .field strong {
              display: block;
              color: #667eea;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .field p {
              margin: 0;
              color: #333;
              font-size: 16px;
            }
            .message-box {
              background: white;
              padding: 20px;
              border-radius: 5px;
              border-left: 4px solid #667eea;
              margin-top: 20px;
            }
            .message-box strong {
              display: block;
              color: #667eea;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 New Lead from GenAIWorks Website</h1>
          </div>
          <div class="content">
            <div class="field">
              <strong>Name</strong>
              <p>${name}</p>
            </div>
            
            <div class="field">
              <strong>Email</strong>
              <p><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
            </div>
            
            ${phone ? `
            <div class="field">
              <strong>Phone</strong>
              <p><a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a></p>
            </div>
            ` : ''}
            
            <div class="field">
              <strong>Service Interested In</strong>
              <p>${serviceName}</p>
            </div>
            
            <div class="message-box">
              <strong>Message</strong>
              <p>${(message || "").replace(/\n/g, "<br>")}</p>
            </div>
            
            <div class="footer">
              <p>This email was sent from the GenAIWorks contact form</p>
              <p>Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}