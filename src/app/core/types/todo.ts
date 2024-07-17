export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
  user: number;
};

export type TodosApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Todo[];
};

export type TodoPayload = {
  title: string;
  user: number;
  completed: boolean;
};
