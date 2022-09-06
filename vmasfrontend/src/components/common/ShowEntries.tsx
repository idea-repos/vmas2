import React from 'react';

interface ShowEntriesProps {
    pageSize: number,
    handlePageSize: ( e : any) => void,
}

function ShowEntries({pageSize, handlePageSize} : ShowEntriesProps) {
    return (
        <select className="form-select mt-3 mb-3" value={pageSize} onChange={handlePageSize}>
            {[5, 10, 20].map(page => <option key={page} value={page}>Per Page {page} Items</option>)}
        </select>
    );
}

export default ShowEntries;