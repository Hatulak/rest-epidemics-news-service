import * as mongoose from 'mongoose';

export enum NewsStatus {
  CREATED = 'CREATED',
  PUBLISHED = 'PUBLISHED',
}

export const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  nconst: { type: String, required: true },
  cconst: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: NewsStatus, required: true },
});

export interface News extends mongoose.Document {
  id: string;
  nconst: string;
  cconst: string;
  title: string;
  description: string;
  date: Date;
  status: NewsStatus;
}
