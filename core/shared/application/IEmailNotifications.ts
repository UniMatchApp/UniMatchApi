export interface IEmailNotifications {
    checkEmailStatus(emailId: string): Promise<boolean>;
    changedEmail(email: string): void;
    changedPassword(email: string): void;
    welcomeEmail(email: string, code: string): void;
    forgotPasswordEmail(email: string, code: string): void;
    confirmLoginEmail(email: string, code: string): void;
    resendCodeEmail(email: string, code: string): void;
}
