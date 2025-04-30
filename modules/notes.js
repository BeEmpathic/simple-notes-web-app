

const formatter = new Intl.DateTimeFormat("PL", {
    dateStyle: "short"
})

const FOLDERS_COLORS = []


const notesTemplate = document.querySelector("[data-note-template]")
const notesWrapper = document.querySelector("[data-notes-wrapper]")
let notes = JSON.parse(localStorage.getItem("notes")) || []
let folders = JSON.parse(localStorage.getItem("folders")) || []
let filter


export function displayNotes() {
    if (!localStorage.getItem("notes"))
        return


    notes = JSON.parse(localStorage.getItem("notes"))


    let notesToDisplay = notes
    // it's needed for the notes button 
    let foldersToDisplay = folders.filter(f => f.id !== "All Notes")




    // try to change that to update what has to be updated instead of updating the whole website
    notesWrapper.innerHTML = ""


    // I'm testing if this is working right now
    if (typeof filter === "object") {

        notesToDisplay = notesToDisplay.filter(n => filter.some(filterContent => n.id === filterContent.itemId))
    }

    // sort the by date the newest one on top
    notesToDisplay = notesToDisplay

    notesToDisplay = sortByDate(notesToDisplay, "createdAt")
    notesToDisplay = sortByDate(notesToDisplay, "pinned")




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

        if (foldersToDisplay) {
            foldersToDisplay.forEach(folder => {
                const folderItem = document.createElement("li")

                folderItem.classList.add("note-btn")
                folderItem.classList.add("note-folder-li")

                folderItem.innerHTML = `<input type="checkbox" ${folder.content.find(i => i.itemId === note.id) ? "checked" : ""} >${folder.name}`
                const folderItemCheckbox = folderItem.querySelector("input")

                folderItem.addEventListener("click", (e) => {
                    if (!folderItemCheckbox.checked) {
                        addItemToFolder(folder.id, false, note.id)
                        folderItemCheckbox.checked = true

                    }
                    else if (folderItemCheckbox.checked) {
                        removeItemFromFolder(folder.id, false, note.id)
                        folderItemCheckbox.checked = false

                    }

                    e.stopPropagation()
                })
                addToFolderDropdownMenuContent.appendChild(folderItem)
            })


        }

        notesWrapper.appendChild(template)
        // textOverFlowHandler(noteContent)

    })
}

function folderCheckBoxHandler() {

}


const searchNotesInput = document.querySelector("[data-notes-search-bar-input]")
let notesOnScreen

searchNotesInput.addEventListener("click", () => {
    notesOnScreen = document.querySelectorAll("[data-note]")
    console.log(notesOnScreen)
})

searchNotesInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    if (notesOnScreen) {
        notesOnScreen.forEach(noteOnScreen => {
            const title = noteOnScreen.querySelector("[data-note-title]")
            const content = noteOnScreen.querySelector("[data-note-content]")
            const isVisible = title.textContent.toLowerCase().includes(value) || content.textContent.toLowerCase().includes(value)

            noteOnScreen.classList.toggle("hidden", !isVisible)
        })
    }
})




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
            pinned: false,
        }
        notes.push(note)
    }

    localStorage.setItem("notes", JSON.stringify(notes))
    displayFolders()
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
        notes[noteIndex].pinned = notes[noteIndex].pinned ? false : new Date();
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
        displayFolders()
    }
}

function addItemToFolder(folderId, isAFolder, itemId) {

    folders = JSON.parse(localStorage.getItem("folders"))
    if (!folders) return

    // change this so it find's whole folder folder

    const folder = folders.find(f => f.id === folderId)


    folder.content.push({
        itemId,
        isAFolder
    })


    localStorage.setItem("folders", JSON.stringify(folders))

    displayFolders()
}

function removeItemFromFolder(folderId, isAFolder, itemId) {
    if (!folders) return
    const folder = folders.find(f => f.id === folderId)

    if (folder.content.find(i => i.itemId === itemId))
        folder.content = folder.content.filter(i => i.itemId !== itemId)



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
    if (notes) {
        notes.forEach(note => {
            allNotes.content.push({
                isAFolder: false,
                itemId: note.id
            })
        })
    }

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
        const folderName = template.querySelector("[data-folder-name]")// this won't work if you make it dynamic, but you will probably change the whole code in that case anyway
        const folderItemsCount = folder.content.length
        const folderItemsCountElement = template.querySelector("[data-folder-items-count]")
        const folderFoldBtn = template.querySelector("[data-folder-fold-btn]")
        const folderDeleteBtn = template.querySelector("[data-folder-delete-btn]")
        const folderRightSide = template.querySelector("[data-folder-right-side]")
        const folderNameWrapper = template.querySelector("[data-folder-name-wrapper]")
        folderName.textContent = folder.name // I think this is a mistake





        folderFoldBtn.addEventListener("click", (e) => {
            folderContent.classList.toggle("active")
            folderFoldBtn.firstElementChild.classList.toggle("active")
            e.stopPropagation()
        })

        if (notes) {
            if (folder.content) {
                folder.content.forEach(item => {
                    if (item.isAFolder) {
                        const folder = folders.find(f => f.id === item.itemId) // not finished putting folders in folders

                    } else if (!(item.isAFolder)) {

                        if (!notes.find(n => n.id === item.itemId)) {
                            folder.content = folder.content.filter(i => i.itemId !== item.itemId)
                            return
                        }
                        const note = notes.find(n => n.id === item.itemId)


                        const noteDiv = document.createElement("div")
                        noteDiv.classList.add("folder-item")
                        noteDiv.innerHTML = '<img src="./icons/note.svg" alt="note icon">' + (note.title ? note.title : '<span style="color: gray">(note without a title)</span>')
                        folderContent.append(noteDiv)

                    }
                    folderItemsCountElement.textContent = folderItemsCount
                })
            }
        }



        let clickTimeout;
        let isDbClick = false
        folderDiv.addEventListener("click", (e) => {
            clickTimeout = setTimeout(() => {
                if (!isDbClick) {
                    isDbClick = false
                    filter = folder.content
                    displayNotes();
                }
                folderDiv.classList.toggle("active")
            }, 150); // Delay to allow dblclick to be detected
        });

        folderName.addEventListener("dblclick", (e) => {
            isDbClick = true
            clearTimeout(clickTimeout)
            e.target.setAttribute("contenteditable", "true");
            e.target.focus();
        });

        // some folder validation is here cause of how lazy I'm please don't read the code 
        // I do it cause I want to make this project quick so I can go and learn next.js instead
        let errorTimeOut
        folderName.addEventListener("blur", (e) => {
            e.target.removeAttribute("contenteditable")
            const folderNameValidationResult = folderNameValidation(e.target.textContent, folder.id)

            switch (folderNameValidationResult) {
                case 'Folder name can\'t be "All Notes"': {
                    const errorDiv = document.createElement("div")
                    errorDiv.classList.add("error")
                    errorDiv.textContent = folderNameValidationResult
                    folderName.textContent = folder.name
                    folderName.parentElement.parentElement.after(errorDiv)
                    errorTimeOut = setTimeout(() => {
                        folderName.parentElement.parentElement.parentElement.removeChild(errorDiv) // this is disgusting 
                    }, 5000)
                    break
                }
                case 'Folder name can\'t be empty string': {
                    const errorDiv = document.createElement("div")
                    errorDiv.classList.add("error")
                    errorDiv.textContent = folderNameValidationResult
                    folderName.textContent = folder.name
                    folderName.parentElement.parentElement.after(errorDiv)

                    errorTimeOut = setTimeout(() => {
                        folderName.parentElement.parentElement.parentElement.removeChild(errorDiv) // this is disgusting 
                    }, 5000)

                    break
                }

                case true:

                    break

                default:
                    console.log("Something broke")
                    break
            }
        })

        folderName.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                e.target.blur()
            }
        })

        folderDeleteBtn.addEventListener("click", (e) => {
            console.log("delete btn was clicked")
            deleteFolder(folder.id)
            e.stopPropagation()
        })

        // all notes clearning section I probably should separate this better
        if (folder.id === "All Notes") {
            folderDiv.classList.toggle("active")
            folderDiv.id = "all-notes"
            folderRightSide.removeChild(folderDeleteBtn)
            const folderClearName = folderName.cloneNode(true)
            folderNameWrapper.replaceChild(folderClearName, folderName)
        }


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
    displayFolders()
    displayNotes() // I wouldn't say that it's good that you are refreshign folderrs like this
}


function folderNameValidation(folderName, folderId) {
    switch (folderName) {
        case "All Notes":
            return 'Folder name can\'t be "All Notes"'


        case "":
            return 'Folder name can\'t be empty string'

        default:
            changeFolderName(folderName, folderId)
            return true
    }

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
    folders = folders.filter(f => f.id !== id)
    localStorage.setItem("folders", JSON.stringify(folders))
    displayFolders()
    displayNotes()
}


createFolderbtn.addEventListener("click", () => changeFolderName("New Folder"))




function sortByDate(arr, key) {
    return arr.sort((a, b) => new Date(b[key]) - new Date(a[key]));
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
