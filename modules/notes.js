const notesTemplate = document.querySelector("[data-note-template]")





const formatter = new Intl.DateTimeFormat("PL", {
    dateStyle: "short"
})

export function displayNotes() {
    const notesWrapper = document.querySelector("[data-notes-wrapper]")
    let notes = JSON.parse(localStorage.getItem("notes"))
    notesWrapper.innerHTML = ""

    if (notes) {

        notes.forEach((note) => {

            const template = notesTemplate.content.cloneNode(true)
            const createdAt = new Date(note.createdAt)


            template.querySelector("[data-note-title]").textContent = note.title
            template.querySelector("[data-note-content]").innerHTML = note.content
            template.querySelector("[data-note-date]").textContent = formatter.format(createdAt)
            template.querySelector("[data-note]").style.backgroundColor = note.bgColor

            template.querySelector("[data-note]").addEventListener("click", () => {

                editNote(note.id)
            })
            template.querySelector("[data-note-delete-btn]").addEventListener("click", (e) => {

                deleteNote(note.id)
                e.stopPropagation()
            })



            const colorsbtns = template.querySelectorAll("[data-color]")
            colorsbtns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const color = btn.style.backgroundColor
                    changeNoteBackgroundColor(note.id, color)
                    e.stopPropagation()
                })

            })


            notesWrapper.append(template)
        })

    }

}

export function saveNote(title, content = "", id = self.crypto.randomUUID()) {
    const now = new Date()

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    let noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].modifiedAt = now;
    } else {
        const note = {
            id,
            title,
            content,
            bgColor: "white",
            createdAt: now,
            modifiedAt: now,
            pinned: false
        }
        notes.push(note)
    }

    localStorage.setItem("notes", JSON.stringify(notes))
    displayNotes()
}


const noteEditor = document.querySelector("[data-note-editor]")
const noteEditorTitle = noteEditor.querySelector("[data-note-editor-title]")
const noteEditorContent = noteEditor.querySelector("[data-note-editor-content]")
const noteEditorCreatedAt = noteEditor.querySelector("[data-note-editor-createdAt]")
const noteEditorModifiedAt = noteEditor.querySelector("[data-note-editor-modifiedAt]")

let currentNoteId

const createNoteBtn = document.querySelector("[data-create-note-btn]")
export function editNote(id) {

    let notes = JSON.parse(localStorage.getItem("notes"))
    noteEditorTitle.innerHTML = ""
    noteEditorContent.innerHTML = ""
    if (id) {
        currentNoteId = id
        let note = notes.find(n => n.id === id);

        noteEditorTitle.textContent = note.title
        noteEditorContent.innerHTML = note.content
        noteEditorCreatedAt.textContent = formatter.format(new Date(note.createdAt))
        noteEditorModifiedAt.textContent = formatter.format(new Date(note.modifiedAt))
        noteEditor.style.backgroundColor = note.bgColor

    } else {
        currentNoteId = undefined
    }
    noteEditor.showModal()
    noteEditor.style.display = "grid"
}






export function deleteNote(id) {
    if (id) {
        let notes = JSON.parse(localStorage.getItem("notes"))
        notes = notes.filter((note) => note.id !== id)
        localStorage.setItem("notes", JSON.stringify(notes))
        displayNotes()
    }
}

export function changeNoteBackgroundColor(id, color) {

    if (id) {
        let notes = JSON.parse(localStorage.getItem("notes"))
        let noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex !== -1) {
            notes[noteIndex].bgColor = color;
            localStorage.setItem("notes", JSON.stringify(notes))
        }

        displayNotes()
    }

}

export function pinNote(id) {

}



function handleEditorClose() {
    if (noteEditorTitle.textContent || noteEditorContent.textContent)
        saveNote(noteEditorTitle.textContent, noteEditorContent.innerHTML, currentNoteId)
    noteEditor.style.display = "none"
}

noteEditor.addEventListener("close", handleEditorClose)

noteEditor.querySelector("[data-note-editor-close-btn]").addEventListener("click", () => {
    editNote
    noteEditor.close()
})