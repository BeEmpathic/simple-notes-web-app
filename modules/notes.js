

const formatter = new Intl.DateTimeFormat("PL", {
    dateStyle: "short"
})

const FOLDERS_COLORS = []


const notesTemplate = document.querySelector("[data-note-template]")
const notesWrapper = document.querySelector("[data-notes-wrapper]")
let notes = []
let folders = []
let filter


export function displayNotes() {
    if (!localStorage.getItem("notes"))
        return


    notes = JSON.parse(localStorage.getItem("notes"))


    let notesToDisplay = notes


    // try to change that to update what has to be updated instead of updating the whole website
    notesWrapper.innerHTML = ""


    // I'm testing if this is working right now
    if (typeof filter === "object") {

        notesToDisplay = notesToDisplay.filter(n => filter.some(filterContent => n.id === filterContent.itemId))
    }

    notesToDisplay = sortByBoolean(notesToDisplay, "pinned")




    notesToDisplay.forEach((note) => {

        const template = notesTemplate.content.cloneNode(true)
        const createdAt = new Date(note.createdAt)
        const pinBtn = template.querySelector("[data-note-pin-btn]")
        const pinBtnImg = template.querySelector("[data-note-pin-btn] img")
        const noteDiv = template.querySelector("[data-note]")
        const noteContent = template.querySelector("[data-note-content]")
        const deleteButton = template.querySelector("[data-note-delete-btn]")
        const colorsPaletteBtn = template.querySelector("[data-note-colors-palette-btn]")
        const colorsPalette = template.querySelector("[data-colors-palette]")
        const addToFolderBtn = template.querySelector("[data-add-note-to-folder-btn]")
        const addToFolderDropdownMenuContent = template.querySelector("[data-add-note-to-folder-dropdown-menu-content]")


        template.querySelector("[data-note-title]").textContent = note.title
        noteContent.innerHTML = note.content
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
        // textOverFlowHandler(noteContent)

    })



}




// closing colors palette and addingfolders dropdown functionality
// now I don't know what it works when the colorsPalletteBtns are grabbed
//  only once that means that It shouldn't work at all or that it shouldn't work on the 
// newest notes I checked it. it wokrs 
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

    notes = JSON.parse(localStorage.getItem("notes")) || [];

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
    displayNotes(filter)
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


// I think this one should take the notes from local storage
function deleteNote(id) {
    if (id) {
        let notes = JSON.parse(localStorage.getItem("notes"))
        notes = notes.filter((note) => note.id !== id)
        localStorage.setItem("notes", JSON.stringify(notes))
        displayNotes()
    }
}

function addItemToFolder(folderId, isAFolder, itemId) {

    folders = JSON.parse(localStorage.getItem("folders"))
    if (!folders) return

    // change this so it find's whole folder folder

    const folderIndex = folders.findIndex(f => f.id === folderId)

    folders[folderIndex].content.push({
        itemId,
        isAFolder
    })


    localStorage.setItem("folders", JSON.stringify(folders))

    displayFolders()
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

function allNotesFolder() {
    const allNotes = folders.find(f => f.id === "All Notes")
    allNotes.content = []
    notes.forEach(note => {
        allNotes.content.push({
            isAFolder: false,
            itemId: note.id
        })
    })

}


const foldersContainer = document.querySelector("[data-folders-container]")

foldersContainer.addEventListener("click", (e) => {
    const foldersOnSite = foldersContainer.querySelectorAll("[data-folder]")

    foldersOnSite.forEach((folder) => {
        if (e.target !== folder && folder.classList.contains("active")) {
            folder.classList.toggle("active")
        }
    })

})



const folderTemplate = document.querySelector("[data-folder-template]")
export function displayFolders() {

    if (!localStorage.getItem("folders")) {
        changeFolderName("All Notes", "All Notes")

        return
    }

    folders = JSON.parse(localStorage.getItem("folders"))


    allNotesFolder()

    foldersContainer.innerHTML = ""



    folders.forEach((folder) => {
        const template = folderTemplate.content.cloneNode(true)
        const folderDiv = template.querySelector("[data-folder]")
        const folderContent = template.querySelector("[data-folder-content]")
        const folderName = template.querySelector("[data-folder-name]")
        const folderItemsCount = folder.content.length
        const folderItemsCountElement = template.querySelector("[data-folder-items-count]")
        const folderFoldBtn = template.querySelector("[data-folder-fold-btn]")
        folderName.textContent = folder.name // I think this is a mistake

        folderFoldBtn.addEventListener("click", (e) => {
            folderContent.classList.toggle("active")
            folderFoldBtn.firstElementChild.classList.toggle("active")
            e.stopPropagation()
        })

        if (folder.content) {
            folder.content.forEach(item => {
                if (item.isAFolder) {
                    const folder = folders.find(f => f.id === item.itemId) // not finished putting folders in folders

                } else if (!(item.isAFolder)) {
                    const note = notes.find(n => n.id === item.itemId)
                    const noteDiv = document.createElement("div")
                    noteDiv.innerHTML = '<img src="./icons/note.svg" alt="note icon">' + (note.title ? note.title : '<span style="color: gray">(note without a title)</span>')
                    folderContent.append(noteDiv)

                }
                folderItemsCountElement.textContent = folderItemsCount
            })
        }



        let clickTimeout;
        let isDbClick = false
        folderDiv.addEventListener("click", (e) => {
            clickTimeout = setTimeout(() => {
                if (!isDbClick) {
                    filter = folder.content
                    displayNotes();
                    isDbClick = false
                }
                folderDiv.classList.toggle("active")
            }, 300); // Delay to allow dblclick to be detected
        });

        folderName.addEventListener("dblclick", (e) => {
            isDbClick = true

            e.target.setAttribute("contenteditable", "true");
            e.target.focus();
        });

        folderName.addEventListener("blur", (e) => {
            e.target.removeAttribute("contenteditable")
            changeFolderName(e.target.textContent, folder.id)
        })

        folderName.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                e.target.blur()
            }
        })


        foldersContainer.append(template)
    })


    // you need to put any functionality here cause otherwise it won't work

}




const createFolderbtn = document.querySelector("[data-create-folder-btn]")

function changeFolderName(name, id = self.crypto.randomUUID()) {

    folders = JSON.parse(localStorage.getItem("folders")) || []

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


// The function was improved It still doesn't work if someone give you unclosed div probably, but that's not my problem.
// function textOverFlowHandler(element) {
//     let isOverFlowing = false
//     while (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
//         isOverFlowing = true
//         if (element.lastElementChild && element.lastElementChild.nextSibling === null) {


//             if (element.lastElementChild.textContent !== "") {

//                 element.lastElementChild.textContent = element.lastElementChild.textContent.slice(0, -1)
//             } else if (element.lastElementChild.textContent === "") {
//                 element.removeChild(element.lastElementChild)
//             }
//         } else if (element.lastElement !== null) {

//             element.innerHTML = element.innerHTML.slice(0, -1)
//         }

//     }
//     if (element.lastElementChild && element.lastElementChild.nextSibling === null) {
//         if (element.lastElementChild.textContent !== '') {
//             element.lastElementChild.textContent = element.lastElementChild.textContent.slice(0, -3)
//             element.lastElementChild.textContent = element.lastElementChild.textContent + "..."
//         } else if (element.lastElementChild.textContent === "") {
//             element.removeChild(element.lastElementChild)
//             element.lastElementChild.textContent = element.lastElementChild.textContent.slice(0, -3)
//             element.lastElementChild.textContent = element.lastElementChild.textContent + "..."
//         }
//     } else if (element.lastElementChild !== null && element.lastElementChild.nextSibling !== null) {
//         element.innerHTML = element.innerHTML.slice(0, -3)
//         element.innerHTML = element.innerHTML + "..."
//     } else if (isOverFlowing) {
//         element.innerHTML = element.innerHTML.slice(0, -3)
//         element.innerHTML = element.innerHTML + "..."
//     }

// }
