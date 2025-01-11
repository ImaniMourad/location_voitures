// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Afficher les informations de débogage (à supprimer en production)
    console.log('Tentative de connexion avec:', {
      user: process.env.EMAIL_FROM,
      passLength: process.env.EMAIL_PASSWORD?.length
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'oamaformation@gmail.com', // Votre adresse Gmail
        pass: process.env.EMAIL_PASSWORD // Le mot de passe d'application généré
      }
    });

    // Tester la connexion
    await transporter.verify();
    console.log('Connexion SMTP vérifiée');

    const mailOptions = {
      from: 'oamaformation@gmail.com',
      to: 'oama@gmail.com',
      subject: `Nouveau message de ${name}`,
      text: `
        Nom: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: 'Échec de l\'envoi', details: errorMessage },
      { status: 500 }
    );
  }
}