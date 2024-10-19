import nodemailer, { Transporter } from 'nodemailer';
import { IEmailNotifications } from '../application/IEmailNotifications';

export class EmailNotifications implements IEmailNotifications {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.example.com', //TODO: Cambia esto por el host de tu servidor SMTP
            port: 587, //TODO: Cambia esto si usas otro puerto
            secure: false,
            auth: {
                user: 'your-email@example.com', //TODO: Cambia esto por tu dirección de correo
                pass: 'your-email-password', //TODO: Cambia esto por tu contraseña
            },
        });
    }

    async sendEmailToOne(to: string, subject: string, body: string, attachments?: string[]): Promise<void> {
        const mailOptions = {
            from: 'your-email@example.com',
            to,
            subject,
            text: body,
            attachments: attachments ? attachments.map(file => ({ path: file })) : [],
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendEmailToMany(to: string[], subject: string, body: string, attachments?: string[]): Promise<void> {
        const mailOptions = {
            from: 'your-email@example.com',
            to: to.join(','),
            subject,
            text: body,
            attachments: attachments ? attachments.map(file => ({ path: file })) : [],
        };

        await this.transporter.sendMail(mailOptions);
    }

    async checkEmailStatus(emailId: string): Promise<boolean> {
        //TODO: La verificación del estado del correo depende del proveedor de correo que uses.
        return true;
    }
}
