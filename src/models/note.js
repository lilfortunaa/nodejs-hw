import mongoose from "mongoose";
import {  model } from "mongoose";
import { TAGS } from '../constants/tags.js';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    tag: {
      type: String,
      enum: TAGS,
      default: "Todo",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "notes",
  }
);

noteSchema.index({title: 'text',content: 'text'});

export const Note = model("Note", noteSchema);




