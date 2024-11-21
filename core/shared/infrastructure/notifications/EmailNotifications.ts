import nodemailer, { Transporter } from 'nodemailer';
import { IEmailNotifications } from '../../application/IEmailNotifications';
import dotenv from 'dotenv';

dotenv.config({ path: 'shared.env' });

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
    }

    async sendEmailToOne(to: string, subject: string, body: string, attachments?: string[]): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: body,
            attachments: attachments ? attachments.map(file => ({ path: file })) : [],
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendEmailToMany(to: string[], subject: string, body: string, attachments?: string[]): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to.join(','),
            subject,
            text: body,
            attachments: attachments ? attachments.map(file => ({ path: file })) : [],
        };

        await this.transporter.sendMail(mailOptions);
    }

    async checkEmailStatus(emailId: string): Promise<boolean> {
        return true;
    }
}
