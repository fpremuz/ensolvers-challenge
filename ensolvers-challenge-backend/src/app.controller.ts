import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import type { Todo } from './app.service';

@Controller('/api/todos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTodos(): Todo[] {
    return this.appService.getTodos();
  }

  @Post()
  addToDo(@Body() todo: Todo) {
    this.appService.addToDo(todo);
  }

  @Put(':id')
  replaceToDo(@Param('id') id: string, @Body() todo: Todo) {
    this.appService.replaceToDo(id, todo);
  }
}
