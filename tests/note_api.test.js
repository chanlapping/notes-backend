const supertest = require("supertest");
const { test, after, beforeEach } = require("node:test");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const assert = require("node:assert");
const Note = require("../models/note");

const api = supertest(app);

const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "Browser can execute only JavaScript",
    important: true,
  },
];

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

after(async () => {
  await mongoose.connection.close();
});
