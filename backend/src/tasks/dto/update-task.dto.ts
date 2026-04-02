import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/common/enum/status.enum';

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class UpdateTaskDto{
  title:string;
  description:string;
}