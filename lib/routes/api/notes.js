
const fs = require('fs');
const path = require('path');
const randomId = require('../../utils/randomId');


const appDir = path.dirname(require.main.filename);


const dbPath = path.join(appDir, "/lib/db/db.json");


const router = require('express').Router();


module.exports = router;


router.get('/', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, dbData) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        res.json(JSON.parse(dbData));
    });
});


router.post('/', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, dbData) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }

        const notes = JSON.parse(dbData);
        const newNoteId = randomId();
        const newNote = { ...req.body, id: newNoteId };
        notes.push(newNote);

        fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save note' });
            }
            res.status(201).json({ message: "New note added successfully", id: newNoteId });
        });
    });
});


router.delete('/:id', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, dbData) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }

        const notes = JSON.parse(dbData);
        const newNotes = notes.filter(note => note.id !== req.params.id);

        fs.writeFile(dbPath, JSON.stringify(newNotes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to delete note' });
            }
            res.status(200).json({ message: `Note with id ${req.params.id} deleted successfully` });
        });
    });
});
