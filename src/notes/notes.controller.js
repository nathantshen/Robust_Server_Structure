const notes = require("../data/notes-data");


//Malware
function bodyDataHas(text) {
  return function (req, res, next) {
    const { data: {text} = {} } = req.body;
    if (text) {
      return next();
    }
    next({
        status: 400,
        message: "Must include a text"
    });
  };
}

function noteExists(req, res, next) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  if (foundNote) {
    return next();
  }
  next({
    status: 404,
    message: `Note id not found: ${noteId}`,
  });
}

//List 
function list(req, res) {
  res.json({ data: notes });
}

//Create
let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0)

function create(req, res) {
  const { data: { text } = {} } = req.body;
  const newNote = {
    id: ++lastNoteId,
    text: text,
  };
  notes.push(newNote);
  res.status(201).json({ data: newNote });
}

//read
function read(req, res) {
  const noteId  = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  res.status(200).json({ data: foundNote });
}

// update 
function update(req, res) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  const { data: { text } = {} } = req.body;
  foundNote.text = text;
  res.json({ data: foundNote });
}

  //delete
  function destroy(req, res) {
  const { noteId } = req.params;
  const index = notes.findIndex((note) => note.id === Number(noteId));
  const deletedNotes = notes.splice(index, 1);
  res.sendStatus(204);
}


module.exports = {
  create: [
      bodyDataHas("text"),
      create
  ],
  list,
  read: [noteExists, read],
  update: [
      noteExists,
      bodyDataHas("text"),
      update
  ],
  delete: [noteExists, destroy],
}