import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { NewsStatus } from "../news.model";

export class NewsStatusValidationPipe implements PipeTransform{
    readonly allowedStatuses = [
        NewsStatus.CREATED,
        NewsStatus.PUBLISHED,
    ]


    transform(value:any, metadata: ArgumentMetadata){
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`"${value}" is invalid status`)
        }
        return value; 
    }

    private isStatusValid(status: any){
        const idx = this.allowedStatuses.indexOf(status);
        return idx !==-1;
    }
}