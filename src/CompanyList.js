import React, {useEffect, useState} from 'react';
import {API, Storage} from "aws-amplify";
import {listCompanies} from './graphql/queries';
import {deleteCompany as deleteCompanyMutation} from "./graphql/mutations";
import Company from "./Company";

const CompanyList = (props) => {
    const { isUpdated, update, setCurrentCompany } = props;
    const [companies, setCompanies ] = useState([]);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (isUpdated) {
            fetchCompanies();
            update(false);
        }
    }, [isUpdated]);

    async function fetchCompanies() {
        const apiData = await API.graphql({ query: listCompanies });
        const companiesFromApi = apiData.data.listCompanies.items;
        await Promise.all(companiesFromApi.map(async company => {
            if (company.image) {
                company.image = await Storage.get(company.image);
            }
            return company;
        }));
        setCompanies(sortCompanies(apiData.data.listCompanies.items));
    }

    async function deleteCompany(id) {
        const newCompaniesArray = companies.filter(company => company.id !== id);
        setCompanies(newCompaniesArray);
        await API.graphql({ query: deleteCompanyMutation, variables: { input: { id }}})
    }

    function sortCompanies(companies) {
        return companies.sort((a,b) => a.nextInterview === "" ? 1
            : b.nextInterview === "" ? -1
                : a.nextInterview > b.nextInterview ? 1
                    : b.nextInterview > a.nextInterview ? -1
                        : 0)
    }

    return(
        <div style={{marginBottom: 30, display: 'flex', flexFlow: 'column', alignItems: 'center'}}>
            {companies.map(company => (
                <Company key={company.id}  data={company} deleteCompany={deleteCompany} setCurrentCompany={setCurrentCompany} />
            ))}
        </div>
    )
}

export default CompanyList;
