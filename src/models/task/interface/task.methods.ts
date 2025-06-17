import { StateResponse } from "../../../lib/interfaces/state.response.interface";

export interface Task {
  id_task: number;
  id_country: number;
  task_name: string;
}

export interface ResponseTask extends StateResponse {
  data: Task[];
}


export interface TaskMethods {
  getTask(id_country: number): Promise<ResponseTask>;
}