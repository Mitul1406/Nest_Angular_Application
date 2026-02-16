import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateStatusDto } from './dto/update-task.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto, @Req() req) {
    return this.tasksService.create(dto, req.user.userId);
  }

  @Get()
findAll(@Req() req) {
  return this.tasksService.findAll(
    req.user.userId,
    req.user.role,
  );
}

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    return this.tasksService.findOne(+id, req.user.userId);
  }

  // @Put(':id')
  // update(@Param('id') id: number, @Body() dto, @Req() req) {
  //   return this.tasksService.update(+id, dto, req.user.userId);
  // }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.tasksService.remove(+id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Put(':id/status')
updateStatus(
  @Param('id') id: number,
  @Body() dto: UpdateStatusDto,
) {
  return this.tasksService.updateStatus(+id, dto);
}
}