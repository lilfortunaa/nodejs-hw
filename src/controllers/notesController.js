import { Note } from "../models/note.js";
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
  }

  res.status(200).send(note);
};


export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findByIdAndUpdate(
    {_id: noteId},
    req.body,
    {new: true},
  );

  if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
  }

    res.status(200).send(note);
};
