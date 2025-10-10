import { Note } from "../models/note.js";
import createHttpError from "http-errors";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find();

  if(tag) {
    notesQuery.where('tag').equals(tag);
  }
  if(search){
    notesQuery.where({
      $text: {$search:search}
    });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

const totalPages = Math.ceil(totalNotes / perPage);

res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });

  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, "Note not found");
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
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndUpdate(noteId, req.body, { new: true });

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
