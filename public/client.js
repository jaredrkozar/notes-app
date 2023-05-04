let noNoteView = document.getElementsByClassName("noNoteSelected")[0]
let noteTextView = document.getElementsByClassName("textFields")[0]
let notesTableView = document.getElementsByClassName("notesTable")[0]

let titleTextView = document.getElementById("notetitlefield")
let bodyTextView = document.getElementById("notetextfield")

let foldersSidebarList = document.getElementsByClassName('foldersList')[0]
let folderName = undefined
let selectedFolderName = undefined
let currentNoteID = undefined
let dropdown = document.getElementsByClassName("selectFolderButton")[0]

async function getNotes() {
    const arrayStrings = window.location.href.split("/");
    while (notesTableView.hasChildNodes()) {
        notesTableView.removeChild(notesTableView.firstChild)
    }

    $.get("/" + arrayStrings[3] + '/' + selectedFolderName + '/fetchNotes', function(data){
        for(let i = 0; i<data.length;i++) {
            let currentNote = document.createElement("div");
            currentNote.classList.add('noteCell')
            let noteTitle = document.createElement('h2')
            noteTitle.classList.add('noteTitle')
            noteTitle.innerHTML = `<h2>${data[i].title}</h2>`;
            let noteText = document.createElement('h2')
            noteText.classList.add('noteText')
            noteText.innerHTML = `<h2>${data[i].noteText}</h2>`;
            currentNote.appendChild(noteTitle)
            currentNote.appendChild(noteText)

            notesTableView.appendChild(currentNote)
            currentNote.addEventListener("click", function() {
                let selectedNote = document.getElementsByClassName("selectedNote")
                if (selectedNote.length > 0) {
                    selectedNote[0].classList.remove('selectedNote')
                }

                selectNote(data[i].title, data[i].noteText, data[i].folderName, data[i].note_id)
                currentNote.classList.add('selectedNote')
            })
        }
    })
}

function newNote() {
    currentNoteID = undefined
    document.getElementById("deleteNoteButton").style.display = "none"
    noteTextView.style.display = "flex"
    noNoteView.style.display = "none"
    titleTextView.value = ""
    bodyTextView.value = ""
}

window.onload = async () => {
    noNoteView.style.display = "block"
    noteTextView.style.display = "none"
    await getNotes();
    await populateFolderValues();
};

async function saveNote() {
    const arrayStrings = window.location.href.split("/");
    $.post("/saveNote", {body: {title: titleTextView.value, text: bodyTextView.value, folderName: folderName, userid: arrayStrings[3], noteid: currentNoteID ?? undefined}})
    await getNotes();
}

async function deleteNote() {
    const arrayStrings = window.location.href.split("/");
    $.post("/deleteNote", {body: {userid: arrayStrings[3], noteid: currentNoteID ?? undefined}});

    noNoteView.style.display = "block"
    noteTextView.style.display = "none"

    await getNotes();
}

function selectNote(noteTitle, noteText, folderName, noteID) {
    currentNoteID = noteID
    noteTextView.style.display = "flex"
    noNoteView.style.display = "none"
    document.getElementById("deleteNoteButton").style.display = "block"

    for (var i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].text === folderName) {
            dropdown.selectedIndex = i;
            break;
        }
    }
    titleTextView.value = noteTitle
    bodyTextView.value = noteText
}

function folderSelected() {
    if (dropdown.value == "newfolder") {
        folderName = prompt("Please enter a name for this folder");
        addFolderSection(folderName, 99)

    } else if (dropdown.value == "nofolder") {
        folderName = "none"
    } else {
        folderName = dropdown.value;
    }
}

async function populateFolderValues() {

    addFolderSection("All Notes", 0);
    const arrayStrings = window.location.href.split("/");
    $.get("/" + arrayStrings[3] + '/fetchAllFolders', function(data){

        for (let i = 0; i<data.length;i++) {
            addFolderSection(data[i].folderName, i+1)
        }
    })
}

function addFolderSection(name, id) {

    if (id != 0) {
        let option = document.createElement("option");
        option.text = name;
        dropdown.add(option);
    }
    let item = document.createElement('h2')
    item.classList.add('section')
    item.innerHTML = `<h2>${name}</h2>`;
    item.addEventListener("click", async function() {
        if (id == 0) {
            selectedFolderName = undefined
        } else {
            selectedFolderName = name
        }
        await getNotes()
    })
    foldersSidebarList.appendChild(item)
}