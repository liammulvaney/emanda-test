import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private tasksRepo: Repository<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    if (createTaskDto.parentId) {
      task.parent = (await this.tasksRepo.findOneBy({ id: createTaskDto.parentId })) ?? undefined;
    }
    return await this.tasksRepo.save(task);
  }

  /**
   * Commented methods work, but the UI was not clean because I had to render the subtask button always and it bothered me.
   * The query builder functions output a column with the number of subtasks, so I can use it to conditionally render the subtask button.
   * That is the reason I switched to query builder. 
   */

  // async findAll(): Promise<Task[]> {
  //   // fetches all tasks that do not have a parent (top-level tasks). Will be loading subtasks in an eager way. 
  //   const tasks = await this.tasksRepo.find({ where: { parent: IsNull() }, relations: ['subtasks', 'parent']});
  //   return tasks
  // }

  async findAll(): Promise<Task[]> {
    const tasks = await this.tasksRepo
      .createQueryBuilder('task')
      .where('task.parentId IS NULL')
      .loadRelationCountAndMap('task.subtaskCount', 'task.subtasks')
      .getMany();

    return tasks;
  }
  
  // Still good however, I need to know how many subtasks a subtask has, so I will be able to influence a button.
  // async findSubtasksByParentId(parentId: number): Promise<Task[]> {
  //   // fetches all subtasks for a given parent task
  //   const task = await this.tasksRepo.findOne({ where: { id: parentId }, relations: ['subtasks', 'parent'] });
  //   return task ? task.subtasks : [];
  // }

  async findSubtasksByParentId(parentId: number): Promise<Task[]> {
    const subtasks = await this.tasksRepo
    .createQueryBuilder('task')
    .where('task.parentId = :parentId', {  parentId: Number(parentId) })
    .loadRelationCountAndMap('task.subtaskCount', 'task.subtasks')
    .getMany();
    
    return subtasks;
  }
}