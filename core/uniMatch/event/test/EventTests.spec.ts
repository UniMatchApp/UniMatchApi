import { Event } from '@/core/uniMatch/event/domain/Event';
import { Location } from '@/core/shared/domain/Location';
import { DomainError } from '@/core/shared/exceptions/DomainError';

describe('Event', () => {
    let event: Event;
    let location: Location;

    beforeEach(() => {
        location = new Location(40.7128, -74.0060);
        event = new Event('Test Event', location, new Date(), 'owner123');
    });

    it('should create an event with valid data', () => {
        expect(event.title).toBe('Test Event');
        expect(event.location).toBe(location);
        expect(event.ownerId).toBe('owner123');
    });

    describe('Event', () => {
        let event: Event;
        let location: Location;

        beforeEach(() => {
            location = new Location(40.7128, -74.0060);
            event = new Event('Test Event', location, new Date(), 'owner123');
        });

        it('should create an event with valid data', () => {
            expect(event.title).toBe('Test Event');
            expect(event.location).toBe(location);
            expect(event.ownerId).toBe('owner123');
        });

        it('should allow disliking an event', () => {
            event.like('user123');
            event.dislike('user123');
            expect(event.likes).not.toContain('user123');
        });

        it('should allow modify an event', () => {
            event.edit('Test Event 2', location, new Date(), 20.0, 'photo.png');
            expect(event.title).toBe('Test Event 2');
            expect(event.price).toBe(20.0);
            expect(event.thumbnail).toBe('photo.png');
        });

        it('should allow liking an event', () => {
            event.like('user123');
            expect(event.likes).toContain('user123');
        });

        it('should allow adding participants', () => {
            event.addParticipant('participant1');
            expect(event.participants).toContain('participant1');
        });

        it('should not allow removing the owner as a participant', () => {
            expect(() => {
                event.removeParticipant('owner123');
            }).toThrow(DomainError);
        });

        it('should not allow liking an event multiple times by the same user', () => {
            event.like('user123');
            event.like('user123');
            expect(event.likes.filter(userId => userId === 'user123').length).toBe(1);
        });

        it('should not allow adding the same participant multiple times', () => {
            event.addParticipant('participant1');
            event.addParticipant('participant1');
            expect(event.participants.filter(participantId => participantId === 'participant1').length).toBe(1);
        });

        it('should allow removing a participant', () => {
            event.addParticipant('participant1');
            event.removeParticipant('participant1');
            expect(event.participants).not.toContain('participant1');
        });

        it('should throw error when editing with invalid data', () => {
            expect(() => {
                event.edit('', location, new Date(), -10, 'invalid_thumbnail');
            }).toThrow(DomainError);
        });

        it('should not allow setting a negative price', () => {
            expect(() => {
                event.price = -5;
            }).toThrow(DomainError);
        });

        it('should not allow setting an empty title', () => {
            expect(() => {
                event.title = '';
            }).toThrow(DomainError);
        });

        it('should not allow setting an invalid date', () => {
            expect(() => {
                event.date = new Date('invalid-date');
            }).toThrow(DomainError);
        });

        it('should not allow setting an invalid location', () => {
            expect(() => {
                event.location = new Location(NaN, NaN);
            }).toThrow(DomainError);
        });
    });
    //     expect(() => {
    //         event.isValidThumbnail(largeFile);
    //     }).toThrow(DomainError);
    // });
    //
    // it('should throw error for invalid thumbnail file type', () => {
    //     const invalidFile = new File([''], 'document.pdf', { type: 'application/pdf', size: 500000 });
    //     expect(() => {
    //         event.isValidThumbnail(invalidFile);
    //     }).toThrow(DomainError);
    // });
    //
    // it('should record the deletion event', () => {
    //     event.delete();
    //     expect(event.getUncommittedEvents()[0].eventName).toBe('EventIsDeleted');
    // });
    //
    // it('should record the modification event', () => {
    //     const newLocation = new Location(34.0522, -118.2437);
    //     event.edit('Updated Event', newLocation, new Date(), 25.0, 'new_thumbnail.png');
    //     expect(event.getUncommittedEvents()[0].eventName).toBe('EventIsModified');
    // });
});