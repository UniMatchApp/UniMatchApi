import { SurveyDTO } from "./SurveyDTO";

export interface CreateSurveyDTO {
    eventId: string,
    userId: string,
    survey: SurveyDTO
}