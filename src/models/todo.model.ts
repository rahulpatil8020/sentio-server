import mongoose, { Document, Schema, Model } from "mongoose";

// --------------------
// Todo Interface
// --------------------
export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
  dueDate?: Date;
  createdBy: "AI" | "USER";
  createdAt: Date;
  priority: number; // Priority: 1 (highest) to 10 (lowest)
}

// --------------------
// Static Methods Interface
// --------------------
interface ITodoModel extends Model<ITodo> {
  findByUserId(userId: string): Promise<ITodo[]>;
  findIncompleteTodoByUserId(userId: string): Promise<ITodo[]>;
  createTodo(data: Partial<ITodo>): Promise<ITodo>;
  insertManyTodos(userId: string, todos: Partial<ITodo>[]): Promise<ITodo[]>;
  markCompletedTodos(userId: string, titles: string[]): Promise<number>;
  updateTodoById(id: string, data: Partial<ITodo>): Promise<ITodo | null>;
  deleteTodoById(id: string): Promise<ITodo | null>;
  findByRange(userId: string, start: Date, end: Date): Promise<ITodo[]>;
}

// --------------------
// Schema Definition
// --------------------
const TodoSchema: Schema<ITodo> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    createdBy: { type: String, enum: ["AI", "USER"], default: "USER" },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // Automatically delete after 30 days (TTL index)
    },
    priority: { type: Number, min: 1, max: 10, default: 5 },
  },
  {
    versionKey: false,
  }
);

// --------------------
// Static Methods
// --------------------
TodoSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId });
};

TodoSchema.statics.findIncompleteTodoByUserId = function (userId: string) {
  return this.find({
    userId,
    completed: false,
  }).sort({ dueDate: 1, createdAt: -1 });
};

TodoSchema.statics.createTodo = function (data: Partial<ITodo>) {
  return this.create(data);
};

TodoSchema.statics.updateTodoById = function (
  id: string,
  data: Partial<ITodo>
) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

TodoSchema.statics.deleteTodoById = function (id: string) {
  return this.findByIdAndDelete(id);
};

TodoSchema.statics.insertManyTodos = async function (
  userId: string,
  todos: Partial<ITodo>[]
) {
  const todosToInsert = todos.map((t) => ({
    userId,
    title: t.title,
    dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
    createdBy: "AI",
    priority: 5,
  }));

  return this.insertMany(todosToInsert);
};

TodoSchema.statics.markCompletedTodos = async function (
  userId: string,
  titles: string[]
) {
  if (!titles?.length) return 0;

  const result = await this.updateMany(
    {
      userId,
      title: { $in: titles },
      completed: false,
    },
    { $set: { completed: true } }
  );

  return result.modifiedCount;
};

TodoSchema.statics.findByRange = async function (
  userId: string,
  start: Date,
  end: Date
) {
  return this.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  });
};

// --------------------
// Model
// --------------------
const Todo = mongoose.model<ITodo, ITodoModel>("Todo", TodoSchema);
export default Todo;