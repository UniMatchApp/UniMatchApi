import { IEmailNotifications } from "@/core/shared/application/IEmailNotifications";
import { UUID } from "../../domain/UUID";

export class MockEmailNotifications implements IEmailNotifications {
    private readonly emailLog: Map<string, {
        to: string | string[];
        subject: string;
        body: string;
        attachments?: string[];
        status: boolean;
    }> = new Map();

    changedEmail(email: string): void {
        this.sendEmailToOne(
            email,
            "Your email address has been updated",
            "We wanted to let you know that your email address has been successfully updated."
        );
    }

    changedPassword(email: string): void {
        this.sendEmailToOne(
            email,
            "Your password has been changed",
            "Your password was recently updated. If you did not make this change, please contact support immediately."
        );
    }

    welcomeEmail(email: string, code: string): void {
        this.sendEmailToOne(
            email,
            "Welcome to Our Service",
            `Welcome! Please use the following code to verify your account: ${code}`
        );
    }

    forgotPasswordEmail(email: string, code: string): void {
        this.sendEmailToOne(
            email,
            "Reset Your Password",
            `We received a request to reset your password. Use the following code to proceed: ${code}`
        );
    }

    confirmLoginEmail(email: string, code: string): void {
        this.sendEmailToOne(
            email,
            "Confirm Your Login",
            `A login attempt was made with your account. Use the following code to confirm: ${code}`
        );
    }

    resendCodeEmail(email: string, code: string): void {
        this.sendEmailToOne(
            email,
            "Resend Verification Code",
            `Here is your verification code: ${code}`
        );
    }

    private async sendEmailToOne(to: string, subject: string, body: string, attachments?: string[]): Promise<void> {
        const emailId = this.generateEmailId();
        console.log(`Mock: Sending email to ${to} with subject "${subject}"`);
        this.emailLog.set(emailId, { to, subject, body, attachments, status: true });
    }

    private async sendEmailToMany(to: string[], subject: string, body: string, attachments?: string[]): Promise<void> {
        const emailId = this.generateEmailId();
        console.log(`Mock: Sending email to ${to.join(", ")} with subject "${subject}"`);
        this.emailLog.set(emailId, { to, subject, body, attachments, status: true });
    }

    async checkEmailStatus(emailId: string): Promise<boolean> {
        console.log(`Mock: Checking status for email ID ${emailId}`);
        const email = this.emailLog.get(emailId);
        return email ? email.status : false;
    }

    private generateEmailId(): string {
        return UUID.generate().toString();
    }
}
