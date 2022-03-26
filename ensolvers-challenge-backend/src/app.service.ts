import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type Todo = {
  id?: string;
  text: string;
  isCompleted: boolean;
};

@Injectable()
export class AppService {
  private readonly todos: Todo[] = [];
  getTodos(): Todo[] {
    return this.todos;
  }

  addToDo(todo: Todo) {
    this.todos.push({ ...todo, id: uuidv4() });
  }

  replaceToDo(id: string, todo: Todo) {
    const asd = this.todos.find((t) => t.id === id);
    if (asd === undefined) throw Error();
    asd.isCompleted = todo.isCompleted;
    asd.text = todo.text;
  }
}
