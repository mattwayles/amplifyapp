import React from 'react';
import {API} from "aws-amplify";
import {listStatuses} from "./graphql/custom_queries";
import {useQuery} from "react-query";

const StatusDropdown = (props) => {
    const { formData, updateData} = props;
    const {isLoading, isError, data, error} = useQuery("statuses",
        () => API.graphql({ query: listStatuses }));

    if (isLoading)
        return <p>Loading...</p>
    if (isError)
        return <p>ERROR: {error}</p>

    const statuses = data.data.__type.enumValues.map(status => status.name);
    return (
        <select
            style={{width: '36%', margin: '1vh 0'}}
            name="status"
            id="status"
            value={formData.status}
            onChange={e => updateData({ ...formData, status: e.target.value })}>
            <option selected disabled value={""}>Status</option>
            {statuses.map(status =>
                <option key={status} value={status}>{status.split("_").join(" ")}</option>
            )}
        </select>
    )
}

export default StatusDropdown;
