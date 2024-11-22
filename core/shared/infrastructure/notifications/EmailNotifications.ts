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

        console.log("Host: ", process.env.EMAIL_HOST);
        console.log("Port: ", process.env.EMAIL_PORT);
        console.log("User: ", process.env.EMAIL_USER);
        console.log("Pass: ", process.env.EMAIL_PASS);

        this.transporter.verify((error, success) => {
            if (error) {
                console.error('Error de conexión al servidor SMTP:', error);
            } else {
                console.log('Conexión al servidor SMTP exitosa');
            }
        });
    }

    async sendEmailToOne(to: string, subject: string, body: string, attachments?: string[]): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: body,
            attachments: attachments ? attachments.map(file => ({ path: file })) : [],
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Correo enviado exitosamente a ${to}`);
        } catch (error) {
            console.error('Error al enviar correo:', error);
        }
    }

    async sendEmailToMany(to: string[], subject: string, body: string, attachments?: string[]): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to.join(','),
            subject,
            text: body,
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
            console.log(`Comprobando el estado del correo con ID: ${emailId}`);
            return true; 
        } catch (error) {
            console.error('Error al comprobar el estado del correo:', error);
            return false;
        }
    }
}
