export interface EditEventDTO {
    eventId: string,
    title: string,
    date: Date,
    latitude: number,
    longitude: number,
    altitude: number,
    ownerId: string,
    attachment?: File,
    price?: number,
}
