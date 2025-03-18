import { today } from "../modules/dateFormatter.js"

const notesWrapper = document.querySelector("[data-notes-wrapper]")
const notes = JSON.parse(localStorage.getItem("notes"))
const notesTemplate = document.querySelector("[data-note-template]")

export function renderNotes() {


    notesWrapper.innerHTML = ""
    notes.forEach((note) => {
        const template = notesTemplate.content.cloneNode(true)
        template.querySelector("[data-note-title]").textContent = note.title
        template.querySelector("[data-note-content]").textContent = note.content
        template.querySelector("[data-note-date]").textContent = note.date


        notesWrapper.append(template)
    })

}




// this might become a problem when you will need more than 1 date



const now = today()

export function setNote(title, content, bgColor, createdAt = now, modifiedAt = now) {

    if (localStorage.getItem("notes")) {

        const notes = JSON.parse(localStorage.getItem("notes"))
        const note = {
            id: notes.length ? notes[notes.length - 1].id + 1 : 1,
            title: title,
            content: content,
            bgColor: bgColor,
            createdAt: createdAt,
            modifiedAt: modifiedAt,
            pinned: false
        }

        notes.push(note)

        localStorage.getItem("notes", JSON.stringify(notes))

    } else {
        localStorage.setItem('notes', "[]")
        setNote(title, content, bgColor)
    }
}


const noteModal = document.querySelector("[data-note-editor]")
const createNoteBtn = document.querySelector("[data-create-note-btn]")
createNoteBtn.addEventListener('click', () => {
    noteModal.showModal()
})

export function noteEditor() {

}



function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value;
}