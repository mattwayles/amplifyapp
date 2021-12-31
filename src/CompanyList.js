import React, {useState} from 'react';
import {API, Storage} from "aws-amplify";
import {listCompanies} from './graphql/queries';
import {deleteCompany as deleteCompanyMutation} from "./graphql/mutations";
import Company from "./Company";
import {useMutation, useQuery, useQueryClient} from "react-query";

function sortCompanies(companies) {
    return companies.sort((a,b) => a.nextInterview === "" ? 1
        : b.nextInterview === "" ? -1
            : a.nextInterview > b.nextInterview ? 1
                : b.nextInterview > a.nextInterview ? -1
                    : 0)
}

const CompanyList = (props) => {
    const { setCurrentCompany } = props;
    const queryClient = useQueryClient();
    const { isLoading, isError, data, error } = useQuery("companies",
        () => API.graphql({ query: listCompanies }));

    const mutation = useMutation(id => API.graphql({ query: deleteCompanyMutation, variables: { input: { id }}}),
        {onSuccess: () => queryClient.invalidateQueries("companies")});

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (isError) {
        return <p>ERROR: {error}</p>
    }

    const companies = sortCompanies(data.data.listCompanies.items);
    return(
        <div style={{marginBottom: 30, display: 'flex', flexFlow: 'column', alignItems: 'center'}}>
            {companies.map(company => (
                <Company key={company.id}  data={company} deleteCompany={() => mutation.mutate(company.id)} setCurrentCompany={setCurrentCompany} />
            ))}
        </div>
    )
}

export default CompanyList;
