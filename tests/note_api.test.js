const supertest = require("supertest");
const { test, after, beforeEach } = require("node:test");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const assert = require("node:assert");
const Note = require("../models/note");
const { initialNotes, notesInDB } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");
  assert.strictEqual(response.body.length, initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);
  assert(contents.includes("HTML is easy"));
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await notesInDB();
  const contents = notesAtEnd.map((note) => note.content);

  assert.strictEqual(notesAtEnd.length, initialNotes.length + 1);
  assert(contents.includes("async/await simplifies making async calls"));
});

test("a note without content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api.post("/api/notes").send(newNote).expect(400);

  const notesAtEnd = await notesInDB();

  assert.strictEqual(notesAtEnd.length, initialNotes.length);
});

test("a specific note can be viewed", async () => {
  const notesAtStart = await notesInDB();
  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(resultNote.body, noteToView);
});

test("a note can be deleted", async () => {
  const notesAtStart = await notesInDB();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await notesInDB();
  const ids = notesAtEnd.map((note) => note.id);

  assert(!ids.includes(noteToDelete.id));
  assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1);
});

after(async () => {
  await mongoose.connection.close();
});
