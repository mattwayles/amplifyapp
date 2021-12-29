import React, {useEffect, useState} from 'react';
import {API, Storage} from "aws-amplify";
import {listNotes} from './graphql/queries';
import {createNote as createNoteMutation, deleteNote as deleteNoteMutation} from "./graphql/mutations";

const initialFormState = { name: '', description: '' };

const NotesView = () => {
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        const apiData = await API.graphql({ query: listNotes });
        const notesFromApi = apiData.data.listNotes.items;
        await Promise.all(notesFromApi.map(async note => {
            if (note.image) {
                note.image = await Storage.get(note.image);
            }
            return note;
        }))
        setNotes(apiData.data.listNotes.items);
    }

    async function createNote() {
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createNoteMutation, variables: { input: formData }});
        if (formData.image) {
            formData.image = await Storage.get(formData.image);
        }
        setNotes([...notes, formData]);
        setFormData(initialFormState);
    }

    async function deleteNote(id) {
        const newNotesArray = notes.filter(note => note.id !== id);
        setNotes(newNotesArray);
        await API.graphql({ query: deleteNoteMutation, variables: { input: { id }}})
    }

    async function addImage(e) {
        if (!e.target.files[0]) return;
        const file = e.target.files[0];
        setFormData({ ...formData, image: file.name });
        await Storage.put(file.name, file);
        fetchNotes();
    }

    return(
        <div>
            <h1>My Notes</h1>
            <input
                onChange={e => setFormData({ ...formData, name: e.target.value})}
                placeholder="Note Name"
                value={formData.name}
            />
            <input
                onChange={e => setFormData({ ...formData, description: e.target.value})}
                placeholder="Description"
                value={formData.description}
            />
            <input
                type="file"
                onChange={addImage} />
            <button onClick={createNote}>Create Note</button>
            <div style={{marginBottom: 30}}>
                {notes.map(note => (
                    <div key={note.id || note.name}>
                        <h2>{note.name}</h2>
                        <p>{note.description}</p>
                        {note.image && <img src={note.image} style={{width: 400}} alt="Image Missing" />}
                        <button onClick={() => deleteNote(note.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NotesView;
