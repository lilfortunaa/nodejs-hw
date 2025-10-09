import mongoose from "mongoose";
import {  model } from "mongoose";

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
      enum: [
        "Work",
        "Personal",
        "Meeting",
        "Shopping",
        "Ideas",
        "Travel",
        "Finance",
        "Health",
        "Important",
        "Todo",
      ],
      default: "Todo",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "notes",
  }
);

noteSchema.index({title: 'text'});

export const Note = model("Note", noteSchema);




