import { ICommand } from "@/core/shared/application/ICommand";
import { Result } from "@/core/shared/domain/Result";
import { Event } from "../../domain/Event";
import { CreateNewEventDTO } from "../DTO/CreateNewEventDTO";
import { IEventRepository } from "../ports/IEventRepository";
import { IEventBus } from "@/core/shared/application/IEventBus";
import { Location } from "@/core/shared/domain/Location";
import { IFileHandler } from "@/core/shared/application/IFileHandler";
import { FileError } from "@/core/shared/exceptions/FileError";
import { EventDTO, EventMapper } from "../DTO/EventDTO";
import { Survey } from "../../domain/Survey";
import { SurveyDTO, SurveyMapper } from "../DTO/SurveyDTO";
import { CreateSurveyDTO } from "../DTO/CreateSurveyDTO";

export class CreateNewEventCommand implements ICommand<CreateNewEventDTO, EventDTO> {
    private repository: IEventRepository;
    private fileHandler: IFileHandler;
    private eventBus: IEventBus;


    constructor(repository: IEventRepository, fileHandler: IFileHandler, eventBus: IEventBus) {
        this.repository = repository;
        this.fileHandler = fileHandler;
        this.eventBus = eventBus;
    }

    async run(request: CreateNewEventDTO): Promise<Result<EventDTO>> {
         
       try {
            console.log("Request date: ", request);
            const location = new Location(
                request.latitude,
                request.longitude,
                request.altitude
            )
            
            const attachment = request.attachment;
            if (attachment && !attachment.name) {
                return Result.failure<EventDTO>(new FileError("attachment name is invalid"));
            }

            let attachmentPath: string | undefined = undefined;
            if(attachment) {
                attachmentPath = await this.fileHandler.save(attachment.name, attachment);
            }
            
            let date = new Date(request.date);
            console.log("new date", date);
            const event = new Event(
                request.title,
                location,
                date,
                request.ownerId,
                [request.ownerId],
                [],
                request.price,
                attachmentPath
            )

            

            if (request.surveys) {
                // Parseamos si es string, o usamos el objeto directamente
                let surveysDTO: any = typeof request.surveys === "string" ? JSON.parse(request.surveys) : request.surveys;
                
                if (surveysDTO.surveys) {
                  surveysDTO = surveysDTO.surveys;
                }


                surveysDTO.forEach((surveyDTO: CreateSurveyDTO) => {
                  const survey = SurveyMapper.toDomain(surveyDTO);
                  event.addSurvey(survey);
                });
            }
            
            await this.repository.create(event);

            this.eventBus.publish(event.pullDomainEvents());

            const mappedEvent = EventMapper.map(event);
            return Result.success<EventDTO>(mappedEvent);
        } catch (error : any) {
            return Result.failure<EventDTO>(error);
        }
    }
}