import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  details: { type: String, required: true },
  nconst: { type: String, required: true },
  date: { type: Date, required: true },
});

export interface Comment extends mongoose.Document {
  id: string;
  nconst: string;
  details: string;
  date: Date;
}
