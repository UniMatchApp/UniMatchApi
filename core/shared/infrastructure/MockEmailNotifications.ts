import {IEmailNotifications} from "@/core/shared/application/IEmailNotifications";
import {UUID} from "../domain/UUID";

export class MockEmailNotifications implements IEmailNotifications {
    private emailLog: Map<string, {
        to: string | string[];
        subject: string;
        body: string;
        attachments?: string[];
        status: boolean
    }> = new Map();

    async sendEmailToOne(to: string, subject: string, body: string, attachments?: string[]): Promise<void> {
        const emailId = this.generateEmailId();
        console.log(`Mock: Sending email to ${to} with subject "${subject}"`);
        this.emailLog.set(emailId, {to, subject, body, attachments, status: true});
    }

    async sendEmailToMany(to: string[], subject: string, body: string, attachments?: string[]): Promise<void> {
        const emailId = this.generateEmailId();
        console.log(`Mock: Sending email to ${to.join(", ")} with subject "${subject}"`);
        this.emailLog.set(emailId, {to, subject, body, attachments, status: true});
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
