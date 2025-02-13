import { Survey } from "../../domain/Survey";

export interface SurveyDTO {
    title: string;
    options: string[];
    selections: { [option: string]: string[] } | undefined;
  }
  
  export class SurveyMapper {
    static map(survey: Survey): SurveyDTO {
      return {
        title: survey.title,
        options: Array.from(survey.options.keys()),
        selections: survey.selections,
      };
    }
  }