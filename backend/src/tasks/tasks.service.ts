import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const task = this.taskRepo.create({
      ...createTaskDto,
      user: { id: userId },
    });

    return await this.taskRepo.save(task);
  }

  async findAll(userId: number, role: string) {
  if (role === 'ADMIN') {
    return await this.taskRepo.find({
      relations: ['user'], 
      order: { createdAt: 'DESC' },
    });
  }

  return await this.taskRepo.find({
    where: { user: { id: userId } },
    order: { createdAt: 'DESC' },
  });
}

  async findOne(id: number, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task)
      throw new NotFoundException('Task not found');

    return task;
  }

  // async update(
  //   id: number,
  //   updateTaskDto: UpdateTaskDto,
  //   userId: number,
  // ) {
  //   const task = await this.findOne(id, userId);

  //   Object.assign(task, updateTaskDto);

  //   return await this.taskRepo.save(task);
  // }

  async updateStatus(
  id: number,
  dto: UpdateStatusDto,
) {
  const task = await this.taskRepo.findOne({
    where: { id },
  });

  if (!task)
    throw new NotFoundException('Task not found');

  task.status = dto.status;

  return await this.taskRepo.save(task);
}

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);
    await this.taskRepo.remove(task);

    return { message: 'Task deleted successfully' };
  }
}