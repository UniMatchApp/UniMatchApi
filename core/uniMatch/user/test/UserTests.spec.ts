import { User } from '@/core/uniMatch/user/domain/User';
import { ReportedUser } from '../domain/ReportedUser';
import { DomainError } from '@/core/shared/exceptions/DomainError';

describe('User', () => {
    let user: User;

    beforeEach(() => {
        user = new User(new Date(), 'test@example.com', 'Password123!', [], false);
    });

    it('should create a user with valid data', () => {
        expect(user.email).toBe('test@example.com');
        expect(user.password).toBe('Password123!');
        expect(user.registered).toBe(false);
    });

    it('should update the verification code', () => {
        const oldCode = user.code;
        user.updateVerificationCode();
        expect(user.code).not.toBe(oldCode);
    });

    it('should complete registration', () => {
        user.completeRegistration();
        expect(user.registered).toBe(true);
    });

    it('should throw error for invalid email format', () => {
        expect(() => {
            user.email = 'invalid-email';
        }).toThrow(DomainError);
    });

    it('should throw error for invalid password format', () => {
        expect(() => {
            user.password = 'short';
        }).toThrow(DomainError);
    });

    it('should block a user', () => {
        user.blockUser('user123');
        expect(user.blockedUsers).toContain('user123');
    });

    it('should unblock a user', () => {
        user.blockUser('user123');
        user.unblockUser('user123');
        expect(user.blockedUsers).not.toContain('user123');
    });

    it('should report a user', () => {
        const reportedUser = new ReportedUser('user123', 'spam', 'This user is spamming');
        user.reportUser(reportedUser);
        expect(user.getReportedUsers()).toContainEqual(reportedUser);
    });
});