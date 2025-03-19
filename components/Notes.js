import { today } from "../modules/dateFormatter.js"

const notesWrapper = document.querySelector("[data-notes-wrapper]")
const notes = JSON.parse(localStorage.getItem("notes"))
const notesTemplate = document.querySelector("[data-note-template]")

export function renderNotes() {


    notesWrapper.innerHTML = ""
    if (notes) {
        notes.forEach((note) => {
            const template = notesTemplate.content.cloneNode(true)
            const createdAt = note.date
            const formatter = new Intl.DateTimeFormat("PL", {
                dateStyle: "short"
            })
            console.log(note.createdAt)
            template.querySelector("[data-note-title]").textContent = note.title
            template.querySelector("[data-note-content]").textContent = note.content
            template.querySelector("[data-note-date]").textContent = formatter.format(note.date)


            notesWrapper.append(template)
        })
    }

}


export function setNote(title, content, bgColor) {

    const now = new Date()
    const createdAt = now
    const modifiedAt = now
    console.log(createdAt)
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

        localStorage.setItem("notes", JSON.stringify(notes))

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