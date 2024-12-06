import nodemailer, { Transporter } from 'nodemailer';
import { IEmailNotifications } from '../../application/IEmailNotifications';
import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(__dirname, 'shared.env');
dotenv.config({ path: envFilePath });

export class EmailNotifications implements IEmailNotifications {
    private readonly transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587', 10),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        this.transporter.verify((error, success) => {
            if (error) {
                console.error('Error de conexión al servidor SMTP:', error);
            } else {
                console.log('Conexión al servidor SMTP exitosa');
            }
        });
    }

    private async sendEmailToOne(to: string, subject: string, body: string, attachments?: string[]): Promise<void> {

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: body,
            attachments: attachments ? attachments.map(file => ({ path: file })) : [],
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Correo enviado exitosamente a ${to}`);
        } catch (error) {
            console.error('Error al enviar correo:', error);
        }
    }

    private async sendEmailToMany(to: string[], subject: string, body: string, attachments?: string[]): Promise<void> {

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to.join(','),
            subject,
            html: body,
            attachments: attachments ? attachments.map(file => ({ path: file })) : [],
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Correo enviado exitosamente a ${to.join(', ')}`);
        } catch (error) {
            console.error('Error al enviar correo:', error);
        }
    }

    async checkEmailStatus(emailId: string): Promise<boolean> {
        try {
            return true; 
        } catch (error) {
            console.error('Error al comprobar el estado del correo:', error);
            return false;
        }
    }

    changedEmail(email: string): void {
        const content = `
            <p>Hola,</p>
            <p>Tu correo electrónico ha sido actualizado correctamente. Si no realizaste este cambio, por favor contáctanos de inmediato.</p>
            <p>Gracias por confiar en UniMatch.</p>
        `;
        const body = this.generateEmailBody(content);
        this.sendEmailToOne(email, 'Actualización de correo electrónico', body);
    }

    changedPassword(email: string): void {
        const content = `
            <p>Hola,</p>
            <p>Tu contraseña ha sido cambiada correctamente. Si no realizaste este cambio, por favor contáctanos de inmediato.</p>
            <p>Gracias por confiar en UniMatch.</p>
        `;
        const body = this.generateEmailBody(content);
        this.sendEmailToOne(email, 'Cambio de contraseña', body);
    }

    welcomeEmail(email: string, code: string): void {
        const content = `
            <p>¡Bienvenido a UniMatch!</p>
            <p>Estamos encantados de tenerte con nosotros. Tu código de verificación es:</p>
            <h3>${code}</h3>
            <p>Por favor, úsalo para completar tu registro.</p>
            <p>Gracias por unirte a UniMatch.</p>
        `;
        const body = this.generateEmailBody(content);
        this.sendEmailToOne(email, 'Bienvenido a UniMatch', body);
    }

    forgotPasswordEmail(email: string, code: string): void {
        const content = `
            <p>Hola,</p>
            <p>Parece que olvidaste tu contraseña. No te preocupes, utiliza el siguiente código para restablecerla:</p>
            <h3>${code}</h3>
            <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>
        `;
        const body = this.generateEmailBody(content);
        this.sendEmailToOne(email, 'Restablecimiento de contraseña', body);
    }

    confirmLoginEmail(email: string, code: string): void {
        const content = `
            <p>Hola,</p>
            <p>Detectamos un intento de inicio de sesión en tu cuenta. Por favor, utiliza el siguiente código para confirmar que fuiste tú:</p>
            <h3>${code}</h3>
            <p>Si no reconoces esta actividad, por favor contáctanos de inmediato.</p>
        `;
        const body = this.generateEmailBody(content);
        this.sendEmailToOne(email, 'Confirmación de inicio de sesión', body);
    }

    resendCodeEmail(email: string, code: string): void {
        const content = `
            <p>Hola,</p>
            <p>Aquí está tu código de verificación solicitado:</p>
            <h3>${code}</h3>
            <p>Gracias por confiar en UniMatch.</p>
        `;
        const body = this.generateEmailBody(content);
        this.sendEmailToOne(email, 'Reenvío de código de verificación', body);
    }


    private generateEmailBody(content: string): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>UniMatch Email</title>
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              line-height: 1.6;
              background-color: #f4f4f4;
              color: #333;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .header {
              color: #ffffff;
              text-align: center;
              padding: 20px 10px;
            }
            .header img {
              max-width: 50px;
              margin-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .body {
              padding: 20px;
              color: #333;
            }
            .body p {
              margin: 0 0 15px;
            }
            .footer {
              background: #f9f9f9;
              text-align: center;
              padding: 15px 10px;
              font-size: 14px;
              color: #777;
            }
            .footer a {
              color: #4CAF50;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="https://drive.google.com/thumbnail?id=1Ez39Cd0u6mvd2cQDEHMncPmLMeGE8BRf&sz=w1000" alt="UniMatch Logo">
              <h1>UniMatch</h1>
            </div>
            <div class="body">
              ${content}
            </div>
            <div class="footer">
              <p>&copy; 2024 UniMatch. Todos los derechos reservados.</p>
              <p>¿Necesitas ayuda? Contáctanos en <a href="mailto:unimatch21@gmail.com">unimatch21@gmail.com</a>.</p>
            </div>
          </div>
        </body>
        </html>`;
    }
    
}
