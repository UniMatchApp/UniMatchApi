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

    it('should allow adding participants', () => {
        event.addParticipant('participant1');
        expect(event.participants).toContain('participant1');
    });

    it('should not allow removing the owner as a participant', () => {
        expect(() => {
            event.removeParticipant('owner123');
        }).toThrow(DomainError);
    });

    it('should allow liking an event', () => {
        event.like('user123');
        expect(event.likes).toContain('user123');
    });

    it('should allow disliking an event', () => {
        event.like('user123');
        event.dislike('user123');
        expect(event.likes).not.toContain('user123');
    });
    //
    // it('should validate a thumbnail file correctly', () => {
    //     const validFile = new File([''], 'image.png', { type: 'image/png', size: 500000 });
    //     expect(event.isValidThumbnail(validFile)).toBe(true);
    // });
    //
    // it('should throw error for invalid thumbnail file size', () => {
    //     const largeFile = new File([''], 'large_image.png', { type: 'image/png', size: 1500000 });
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