import React, {useEffect, useState} from 'react';
import {API, Storage} from "aws-amplify";
import {createCompany as createCompanyMutation, updateCompany as updateCompanyMutation} from "./graphql/mutations";
import {listStatuses} from "./graphql/custom_queries";

const initialFormState = {
    name: '',
    description: '',
    salary: 0,
    notes: '',
    status: '',
    nextInterview: ''
};


const CompanyForm = (props) => {
    const {update, currentCompany, setCurrentCompany} = props;
    const [statuses, setStatuses] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchStatuses();
    }, []);

    useEffect(() => {
        if (currentCompany)
            setFormData(currentCompany);
        else
            setFormData(initialFormState);
    }, [currentCompany])

    async function fetchStatuses() {
        const apiData = await API.graphql({ query: listStatuses });
        const statuses = apiData.data.__type.enumValues.map(status => status.name);
        setStatuses(statuses);
    }

    async function mutateCompany() {
        await API.graphql({
            query: currentCompany ? updateCompanyMutation : createCompanyMutation, variables: { input: formData }});
        if (formData.image) {
            formData.image = await Storage.get(formData.image);
        }
        setCurrentCompany(null);
        setFormData(initialFormState);
        update(true);
    }

    async function addImage(e) {
        if (!e.target.files[0]) return;
        const file = e.target.files[0];
        setFormData({ ...formData, image: file.name });
        await Storage.put(file.name, file);
    }

    return (
        <div>
            <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{display: 'flex', flexFlow: 'column', width: '45%', margin: '2vw'}}>
                    <input style={{margin: '1vh 0', width: '50%'}}
                           onChange={e => setFormData({ ...formData, name: e.target.value})}
                           placeholder="Company Name"
                           value={formData.name}
                    />
                    <textarea style={{margin: '1vh 0', minHeight: 200}}
                              onChange={e => setFormData({ ...formData, description: e.target.value})}
                              placeholder="Company Description, Likes, Dislikes"
                              value={formData.description}
                    />
                    <input name="logo" type="file" onChange={addImage} />
                </div>
                <div style={{display: 'flex', flexFlow: 'column', width: '45%', margin: '2vw'}}>
                    <div style={{textAlign: 'left', margin: '1vh 0'}}>$<input
                        type="number"
                        placeholder="Salary"
                        step="0.01"
                        value={formData.salary}
                        onChange={e => setFormData({ ...formData, salary: parseInt(e.target.value)})}
                    /></div>
                    <select
                        style={{width: '36%', margin: '1vh 0'}}
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option selected disabled value={""}>Status</option>
                        {statuses.map(status =>
                            <option key={status} value={status}>{status.split("_").join(" ")}</option>
                        )}
                    </select>
                    <input style={{width: '35%', margin: '1vh 0'}}
                           type="datetime-local"
                           id="interview-time"
                           value={formData.nextInterview}
                           onChange={e => setFormData({ ...formData, nextInterview: e.target.value })}
                    />
                    <textarea style={{marginBottom: '1vh', minHeight: 128}}
                              onChange={e => setFormData({ ...formData, notes: e.target.value})}
                              placeholder="Additional Notes/Questions"
                              value={formData.notes}
                    />
                </div>
            </div>
            <div style={{display: 'flex', flexFlow: 'column', margin: '1vw'}}>
                <button style={{width: '5vw'}}
                    disabled={!(formData.name && formData.status)}
                    onClick={mutateCompany}
                >{currentCompany ? "Update" : "Create"}</button>
                {currentCompany && <button style={{width: '5vw', marginTop: '1vh'}} onClick={() => setCurrentCompany(null)}>Cancel</button>}
            </div>
        </div>
    )
}

export default CompanyForm;
