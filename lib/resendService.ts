import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export const resendService = {
  // Send contact form notification to admin
  async sendContactNotification(data: ContactFormData): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    try {
      
      const result = await resend.emails.send({
        from: 'Portfolio Contact Form <onboarding@resend.dev>',
        to: ['sanjulagihan94@gmail.com'],
        replyTo: data.email,
        subject: `New Contact Form Message from ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Message
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
              <h3 style="color: #495057; margin-top: 0;">Message</h3>
              <div style="white-space: pre-wrap; line-height: 1.6; color: #333;">
                ${data.message}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                This message was sent from your portfolio contact form.
              </p>
              <p style="margin: 5px 0 0 0;">
                <a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">
                  Reply to ${data.name}
                </a>
              </p>
            </div>
          </div>
        `,
        text: `
          New Contact Form Message
          
          Name: ${data.name}
          Email: ${data.email}
          ${data.subject ? `Subject: ${data.subject}` : ''}
          Date: ${new Date().toLocaleString()}
          
          Message:
          ${data.message}
          
          ---
          This message was sent from your portfolio contact form.
          Reply to: ${data.email}
        `
      });

    } catch (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email notification via Resend');
    }
  },

  // Send auto-reply to the person who submitted the form
  async sendAutoReply(data: ContactFormData): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    try {
      const result = await resend.emails.send({
        from: 'Sanjula Gihan <onboarding@resend.dev>',
        to: [data.email],
        subject: 'Thank you for your message!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Thank You for Your Message!
            </h2>
            
            <p style="color: #333; line-height: 1.6;">
              Hi ${data.name},
            </p>
            
            <p style="color: #333; line-height: 1.6;">
              Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible, usually within 24 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">
              In the meantime, feel free to check out my latest projects and blog posts on my portfolio.
            </p>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #e9ecef; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #6c757d;">
                Best regards,<br>
                <strong>Sanjula Gihan</strong><br>
                <a href="mailto:sanjulagihan94@gmail.com" style="color: #007bff; text-decoration: none;">
                  sanjulagihan94@gmail.com
                </a>
              </p>
            </div>
          </div>
        `,
        text: `
          Thank You for Your Message!
          
          Hi ${data.name},
          
          Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible, usually within 24 hours.
          
          Your Message Summary:
          Subject: ${data.subject || 'No subject'}
          Date: ${new Date().toLocaleString()}
          
          In the meantime, feel free to check out my latest projects and blog posts on my portfolio.
          
          Best regards,
          Sanjula Gihan
          sanjulagihan94@gmail.com
        `
      });

    } catch (error) {
      console.error('Resend auto-reply error:', error);
      // Don't throw error for auto-reply failures, just log them
    }
  }
};
