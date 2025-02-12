import { SurveyEntity } from '../models/SurveyEntity';
import { Survey } from '../../../domain/Survey';

export class SurveyMapper {
  static toDomain(entity: SurveyEntity): Survey {
    const survey = new Survey(entity.title, []);
    entity.options.forEach(optionSet => {
        optionSet.forEach(option => {
            survey.addOption(option);
        });
    });
    return survey;
  }

  static toEntity(survey: Survey): SurveyEntity {
    const entity = new SurveyEntity();
    entity.title = survey.title;
    entity.options = survey.options;
    return entity;
  }
}
