import { SurveyDTO } from "./SurveyDTO";

export interface CreateNewEventDTO {
    title: string,
    date: string,
    latitude: number,
    longitude: number,
    altitude: number,
    ownerId: string,
    attachment?: File,
    price?: number,
    surveys?: SurveyDTO[]
}