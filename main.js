import { displayNotes, editNote } from "./components/notes.js"

// deal with note overflow so you can just scroll it seems easy to do

const createNoteBtn = document.querySelector("[data-create-note-btn]")
createNoteBtn.addEventListener("click", editNote)



displayNotes()


