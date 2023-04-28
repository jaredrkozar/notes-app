let noNoteView = document.getElementsByClassName("noNoteSelected")[0]
let noteTextView = document.getElementsByClassName("textFields")[0]

function getNotes() {
    const arrayStrings = window.location.href.split("/");
    console.log("arrayStrings[3]")
}

function newNote() {
    noteTextView.style.display = "flex"
    noNoteView.style.display = "none"
}

window.onload = () => {
    console.log(document.getElementsByClassName("col-rev")[0])
    noNoteView.style.display = "block"
    noteTextView.style.display = "none"
    getNotes();
};