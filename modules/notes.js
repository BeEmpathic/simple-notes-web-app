

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
    let folders = JSON.parse(localStorage.getItem("folders")) // this doesn't work if there is no folders but is it a problem? 


    notes.forEach((note) => {

        const template = notesTemplate.content.cloneNode(true)
        const createdAt = new Date(note.createdAt)
        const pinBtn = template.querySelector("[data-note-pin-btn]")
        const pinBtnImg = template.querySelector("[data-note-pin-btn] img")
        const noteDiv = template.querySelector("[data-note]")
        const deleteButton = template.querySelector("[data-note-delete-btn]")
        const colorsPaletteBtn = template.querySelector("[data-note-colors-palette-btn]")
        const colorsPalette = template.querySelector("[data-colors-palette]")
        const addToFolderBtn = template.querySelector("[data-add-note-to-folder-btn]")
        const addToFolderDropdownMenuContent = template.querySelector("[data-add-note-to-folder-dropdown-menu-content]")


        template.querySelector("[data-note-title]").textContent = note.title
        template.querySelector("[data-note-content]").innerHTML = note.content
        template.querySelector("[data-note-date]").textContent = formatter.format(createdAt)
        template.querySelector("[data-note]").style.backgroundColor = note.bgColor
        pinBtnImg.src = note.pinned ? "./icons/pin-on.svg" : "./icons/pin-off.svg"

        // leave the returns alone they are good 
        noteDiv.addEventListener("click", (e) => {

            switch (e.target.parentElement) {

                case pinBtn: {
                    pinNote(note.id)
                    return
                }

                case colorsPaletteBtn: {
                    colorsPalette.classList.toggle("active")
                    colorsPaletteBtn.classList.toggle("active")
                    return
                }

                case deleteButton: {
                    deleteNote(note.id)
                    return
                }

                case pinBtn: {
                    pinNote(note.id)
                    return
                }


                // work on that
                case addToFolderBtn: {
                    addToFolderBtn.classList.toggle("active")
                    addToFolderDropdownMenuContent.classList.toggle("active")

                    return
                }

                default: {
                    editNote(note.id)
                    return;
                }

            }
        })

        const colorsbtns = template.querySelectorAll("[data-color]")
        colorsbtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const color = btn.style.backgroundColor
                changeNoteBackgroundColor(note.id, color)
                e.stopPropagation()
            })

        })

        if (folders) {
            folders.forEach(folder => {
                const folderBtn = document.createElement("button")
                folderBtn.classList.add("note-btn")
                folderBtn.innerHTML = `${folder.name}`
                folderBtn.addEventListener("click", (e) => {
                    addItemToFolder(folder.id, false, note.id)
                    e.stopPropagation()
                })
                addToFolderDropdownMenuContent.append(folderBtn)
            })


        }

        notesWrapper.append(template)

    })

    // It's not recurrenction
    displayFolders(folders, notes)

    // this function need to be optimized 
    applyTextOverflowHandler()


}




// closing colors palette functionality
document.addEventListener("click", (e) => {
    const colorsPaletteBtns = document.querySelectorAll("[data-note-colors-palette-btn]")
    const colorsPalette = document.querySelectorAll("[data-colors-palette]")
    const addNoteToFolderBtns = document.querySelectorAll("[data-add-note-to-folder-btn]")

    colorsPaletteBtns.forEach((colorsPaletteBtn) => {
        if (e.target.parentElement !== colorsPaletteBtn && colorsPaletteBtn.classList.contains("active")) {
            colorsPaletteBtn.classList.toggle("active")
            colorsPaletteBtn.nextElementSibling.classList.toggle("active")
        }
    })

    addNoteToFolderBtns.forEach(btn => {
        if (e.target.parentElement !== btn && btn.classList.contains("active")) {
            btn.classList.toggle("active")
            btn.nextElementSibling.classList.toggle("active")
        }
    })


})


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


function pinNote(id) {
    let notes = JSON.parse(localStorage.getItem("notes"))
    let noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].pinned = notes[noteIndex].pinned ? false : true;
        localStorage.setItem("notes", JSON.stringify(notes))
    }
    displayNotes()
}

function changeNoteBackgroundColor(id, color) {

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

function deleteNote(id) {
    if (id) {
        let notes = JSON.parse(localStorage.getItem("notes"))
        notes = notes.filter((note) => note.id !== id)
        localStorage.setItem("notes", JSON.stringify(notes))
        displayNotes()
    }
}

function addItemToFolder(folderId, isAFolder, itemId) {

    const folders = JSON.parse(localStorage.getItem("folders"))
    if (!folders) return

    const folderIndex = folders.findIndex(f => f.id === folderId)

    folders[folderIndex].content.push({
        itemId,
        isAFolder
    })


    localStorage.setItem("folders", JSON.stringify(folders))

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
function displayFolders(folders, notes) {

    if (!folders) {
        changeFolderName("All Notes", "All Notes")
        addItemToFolder("All notes", notes) // you need to put all notes in the folder and
        //  for some reason you don't accept whole notes table maybe use for each or 
        // run the function again and this function will make sure that this default folder always contains all notes
        return
    }



    foldersContainer.innerHTML = ""



    folders.forEach((folder) => {
        const template = folderTemplate.content.cloneNode(true)
        const folderContent = template.querySelector("[data-folder-content]")
        const folderItemsCount = folder.content.length
        const folderItemsCountElement = template.querySelector("[data-folder-items-count]")
        const folderFoldBtn = template.querySelector("[data-folder-fold-btn]")
        template.querySelector("[data-folder-name]").textContent = folder.name // I think this is a mistake

        folderFoldBtn.addEventListener("click", () => {
            folderContent.classList.toggle("active")
            folderFoldBtn.firstElementChild.classList.toggle("active")

        })

        if (folder.content) {
            folder.content.forEach(item => {
                if (item.isAFolder) {
                    const folder = folders.find(itemId => itemId === f.id)

                } else if (!item.isAFolder) {
                    const note = notes.find(n => n.id === item.itemId)
                    const noteDiv = document.createElement("div")
                    noteDiv.innerHTML = '<img src="./icons/note.svg" alt="note icon">' + (note.title ? note.title : '<span style="color: gray">(note without a title)</span>')
                    folderContent.append(noteDiv)

                }
                folderItemsCountElement.textContent = folderItemsCount
            })
        }



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

    // you need to put any functionality here cause otherwise it won't work

}



let currentFolderId
const createFolderbtn = document.querySelector("[data-create-folder-btn]")
const folderName = document.querySelector("[data-folder-name]")
function changeFolderName(name, id = self.crypto.randomUUID()) {

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
    displayNotes()
}


// probably you will delete this 
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



// this function need to be optimized
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