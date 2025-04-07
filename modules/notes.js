

const formatter = new Intl.DateTimeFormat("PL", {
    dateStyle: "short"
})


const notesTemplate = document.querySelector("[data-note-template]")
const notesWrapper = document.querySelector("[data-notes-wrapper]")
export function displayNotes() {

    if (!localStorage.getItem("notes")) return

    let notes = JSON.parse(localStorage.getItem("notes"))
    notesWrapper.innerHTML = ""
    notes = sortByBoolean(notes, "pinned")

    notes.forEach((note) => {

        const template = notesTemplate.content.cloneNode(true)
        const createdAt = new Date(note.createdAt)


        template.querySelector("[data-note-title]").textContent = note.title
        template.querySelector("[data-note-content]").innerHTML = note.content
        template.querySelector("[data-note-date]").textContent = formatter.format(createdAt)
        template.querySelector("[data-note]").style.backgroundColor = note.bgColor
        template.querySelector("[data-note-pin-btn] img").src = note.pinned ? "./icons/pin-on.svg" : "./icons/pin-off.svg"


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


        template.querySelector("[data-note-pin-btn]").addEventListener("click", (e) => {

            pinNote(note.id)
            e.stopPropagation()
        })





        notesWrapper.append(template)


    })

    displayFolders()
    applyTextOverflowHandler()


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
        noteEditorCreatedAt.textContent = formatter.format(new Date())
        noteEditorModifiedAt.textContent = formatter.format(new Date())
        noteEditor.style.backgroundColor = "white"
    }
    noteEditor.showModal()
    noteEditor.style.display = "flex"
}


noteEditorTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        e.target.blur()
    }
})



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
    let notes = JSON.parse(localStorage.getItem("notes"))
    let noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].pinned = notes[noteIndex].pinned ? false : true;
        localStorage.setItem("notes", JSON.stringify(notes))
    }
    displayNotes()
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


const createNoteBtn = document.querySelector("[data-create-note-btn]")
createNoteBtn.addEventListener("click", () => {
    editNote()
})

const foldersContainer = document.querySelector("[data-folders-container]")
const folderTemplate = document.querySelector("[data-folder-template]")
function displayFolders() {
    if (!localStorage.getItem("folders")) return

    let folders = JSON.parse(localStorage.getItem("folders"))
    foldersContainer.innerHTML = ""

    folders.forEach((folder) => {
        const template = folderTemplate.content.cloneNode(true)
        template.querySelector("[data-folder-name]").textContent = folder.name // I think this is a mistake

        template.querySelector("[data-folder-content]").innerHTML = folder.content; // you will have to decode folder content cause of nesting

        template.querySelector("[data-folder-name]").addEventListener("dblclick", (e) => {
            e.target.setAttribute("contenteditable", "true")
            e.target.focus()
        })

        template.querySelector("[data-folder-name]").addEventListener("blur", (e) => {
            e.target.removeAttribute("contenteditable")
            changeFolderName(e.target.textContent, folder.id)
        })

        template.querySelector("[data-folder-name]").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                e.target.blur()
            }
        })


        foldersContainer.append(template)
    })


}

let currentFolderId
const createFolderbtn = document.querySelector("[data-create-folder-btn]")
const folderName = document.querySelector("[data-folder-name]")
function changeFolderName(name, id = self.crypto.randomUUID()) {
    // on stopping editing folder name
    let folders = JSON.parse(localStorage.getItem("folders")) || []

    let folderIndex = folders.findIndex(f => f.id === id)
    if (folderIndex !== -1) {
        folders[folderIndex].name = name
    } else {
        const folder = {
            id: id,
            name: name,
            content: []
        }
        folders.push(folder)
    }
    localStorage.setItem("folders", JSON.stringify(folders))
    displayFolders()
}

function saveFolderContent(content, id) {
    if (!content) return

    let folders = JSON.parse(localStorage.getItem("folders"))

    let folderIndex = folders.findIndex(f => f.id === id)
    if (folderIndex !== -1) {
        folders[folderIndex].content = content
    }
    localStorage.setItem("folders", JSON.stringify(folders))
    displayFolders()
}



function deleteFolder(id) {

}


createFolderbtn.addEventListener("click", () => changeFolderName("New Folder"))



function sortByBoolean(arr, key) {
    return arr.sort((a, b) => b[key] - a[key]);
}

function textOverFlowHandler(element) {
    let originalText = element.innerHTML;
    let textfullLength = originalText.length;


    const lineBreakPlaceholder = "[[BR]]";
    originalText = originalText.replace(/<div>/g, lineBreakPlaceholder).replace(/<\/div>/g, "");

    while ((element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) && textfullLength > 0) {
        textfullLength--;
        let trimmedText = originalText.slice(0, textfullLength);


        trimmedText = trimmedText.replace(/([\s]|\[\[BR\]\])+$/g, "");


        element.innerHTML = trimmedText.replaceAll(lineBreakPlaceholder, "<div></div>") + "...";
    }
}

function applyTextOverflowHandler() {
    document.querySelectorAll(".truncate-text").forEach(textOverFlowHandler);
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}


window.addEventListener("load", applyTextOverflowHandler);


window.addEventListener("resize", debounce(applyTextOverflowHandler, 200));