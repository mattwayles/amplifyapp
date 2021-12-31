import React, {useState} from 'react';
import CompanyForm from "./CompanyForm";
import CompanyList from "./CompanyList";

const CompanyView = () => {
    const [isUpdated, update] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null);

    return (
        <div>
            <CompanyForm update={update} currentCompany={currentCompany} setCurrentCompany={setCurrentCompany} />
            <CompanyList setCurrentCompany={setCurrentCompany} />
        </div>
    )
}

export default CompanyView;
