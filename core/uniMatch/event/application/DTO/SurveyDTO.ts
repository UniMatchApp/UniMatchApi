
import { Survey } from "../../domain/Survey";
import { CreateSurveyDTO } from "./CreateSurveyDTO";

export interface SurveyDTO {
    title: string;
    options: { [option: string]: string[] };
  }
  
export class SurveyMapper {
  static map(survey: Survey): SurveyDTO {
    return {
      title: survey.title,
      options: Object.fromEntries(
        Array.from(survey.options.entries()).map(([option, users]) => [option, Array.from(users)])
      )
    };
  }

  static toDomain(surveyDTO: CreateSurveyDTO): Survey {
    return new Survey(surveyDTO.title, surveyDTO.options);
  }

}

