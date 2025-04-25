
// Ce service simule l'envoi d'emails dans l'environnement frontend
// En production, cela serait géré par un service backend

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  // Simuler l'envoi d'un email
  sendEmail: async (options: EmailOptions): Promise<boolean> => {
    console.log(`Simulation d'envoi d'email:`);
    console.log(`Destinataire: ${options.to}`);
    console.log(`Sujet: ${options.subject}`);
    console.log(`Contenu HTML: ${options.html}`);
    
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En production, cela appellerait une API ou un service d'email
    return true;
  },
  
  // Envoyer un email de bienvenue avec les informations de connexion
  sendWelcomeEmail: async (to: string, username: string, password: string): Promise<boolean> => {
    const subject = "Bienvenue dans l'application Ticket AI Wizard";
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Bienvenue dans l'application Ticket AI Wizard!</h2>
        <p>Bonjour ${username},</p>
        <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion :</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Nom d'utilisateur :</strong> ${username}</p>
          <p><strong>Mot de passe temporaire :</strong> ${password}</p>
          <p><strong>Lien de connexion :</strong> <a href="http://localhost:3000/login" style="color: #4F46E5;">Cliquez ici pour vous connecter</a></p>
        </div>
        <p>Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
        <p>Si vous avez des questions, n'hésitez pas à contacter l'administrateur.</p>
        <p>Cordialement,<br />L'équipe Ticket AI Wizard</p>
      </div>
    `;
    
    return emailService.sendEmail({ to, subject, html });
  },
  
  // Envoyer un email de réinitialisation de mot de passe
  sendPasswordResetEmail: async (to: string, username: string, newPassword: string): Promise<boolean> => {
    const subject = "Réinitialisation de votre mot de passe - Ticket AI Wizard";
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Réinitialisation de votre mot de passe</h2>
        <p>Bonjour ${username},</p>
        <p>Votre mot de passe a été réinitialisé avec succès. Voici vos nouveaux identifiants de connexion :</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Nom d'utilisateur :</strong> ${username}</p>
          <p><strong>Nouveau mot de passe :</strong> ${newPassword}</p>
          <p><strong>Lien de connexion :</strong> <a href="http://localhost:3000/login" style="color: #4F46E5;">Cliquez ici pour vous connecter</a></p>
        </div>
        <p>Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre connexion.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez contacter immédiatement l'administrateur.</p>
        <p>Cordialement,<br />L'équipe Ticket AI Wizard</p>
      </div>
    `;
    
    return emailService.sendEmail({ to, subject, html });
  }
};
