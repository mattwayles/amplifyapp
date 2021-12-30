import React from 'react';

const Company = (props) => {
    const { data, deleteCompany, setCurrentCompany } = props;
    return (
        <div style={
            {
                width: '95%',
                border: '1px solid black',
                borderRadius: '25px',
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1vh',
                padding: '1vw'
            }}>
            {data.image && <img src={data.image} style={{width: 150}} alt="Image Missing" />}
            <div style={{display: 'flex', flexFlow: 'column', maxWidth: '25%', whiteSpace: 'pre-line', textAlign: 'left'}}>
                <h2>{data.name}</h2>
                <p>{data.description}</p>
            </div>
            <div style={{display: 'flex', flexFlow: 'column', margin: '0 1vw', textAlign: 'left'}}>
                {data.salary ? new Intl.NumberFormat('en-US',
                    {style: 'currency', currency: 'USD'}).format(data.salary)
                    : <em>No salary recorded</em>}
                <p><strong>Status:</strong> {data.status.split("_").join(" ")}</p>
                <p><strong>Next Interview:</strong>&nbsp;
                    {data.nextInterview ?
                        data.nextInterview.replace("T", " @ ")
                        : <em style={{color: "red"}}>Not scheduled</em>}</p>
            </div>
            {data.notes && <div style={{maxWidth: '25%', whiteSpace: 'pre-line', textAlign: 'left'}}>
                <strong>Notes:</strong> {"\n" + data.notes}
            </div>}
            <div style={{display: 'flex', flexFlow: 'column'}}>
                <button style={{width: '5vw', height: '3vh'}} onClick={() => {
                    window.scrollTo(0, 0);
                    const updateData = {...data};
                    delete updateData.createdAt;
                    delete updateData.updatedAt;
                    setCurrentCompany(updateData);
                }}>Edit</button>
                <button style={{width: '5vw', height: '3vh', marginTop: '1vh'}} onClick={() => deleteCompany(data.id)}>Delete</button>
            </div>
        </div>
    )
}

export default Company;
