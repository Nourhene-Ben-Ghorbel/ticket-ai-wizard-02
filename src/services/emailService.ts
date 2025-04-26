
interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async sendEmail(config: EmailConfig): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: { email: this.fromEmail },
          to: [{ email: config.to }],
          subject: config.subject,
          textContent: config.text,
          htmlContent: config.html,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService(
  process.env.EMAIL_API_KEY || '',
  process.env.FROM_EMAIL || 'noreply@ticketwizard.com'
);
