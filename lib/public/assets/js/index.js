let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn'); 
  noteList = document.querySelector('.list-container .list-group'); /
}


const show = (elem) => {
  elem.style.display = 'inline';
};


const hide = (elem) => {
  elem.style.display = 'none';
};


let activeNote = {};


const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });


const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });


const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });


const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};


const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};


const handleNoteDelete = (e) => {
  e.stopPropagation();
  const note = e.target.closest('.list-group-item'); 
  const noteId = JSON.parse(note.dataset.note).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};


const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.closest('.list-group-item').dataset.note);
  renderActiveNote();
};


const handleNewNoteView = (e) => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};


const handleRenderBtns = () => {
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(saveNoteBtn);
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
    show(clearBtn);
  } else {
    show(saveNoteBtn);
    show(clearBtn);
  }
};


const renderNoteList = async (notes) => {
  const jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.innerHTML = ''; 
  }

  const noteListItems = jsonNotes.length 
    ? jsonNotes.map(note => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);
        return li;
      })
    : [createLi('No saved Notes', false)];

  if (window.location.pathname === '/notes') {
    noteListItems.forEach(note => noteList.append(note));
  }
};

// Create list item element
const createLi = (text, delBtn = true) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item');

  const spanEl = document.createElement('span');
  spanEl.classList.add('list-item-title');
  spanEl.innerText = text;
  spanEl.addEventListener('click', handleNoteView);

  liEl.append(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
    delBtnEl.addEventListener('click', handleNoteDelete);

    liEl.append(delBtnEl);
  }

  return liEl;
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);


if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', () => {
    activeNote = {};
    renderActiveNote();
  });
  noteForm.addEventListener('input', handleRenderBtns);
}


getAndRenderNotes();
