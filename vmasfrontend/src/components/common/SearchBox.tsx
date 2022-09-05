import React from 'react';

interface SearchBoxProps {
    value : string,
    onChange : (input : string) => void
}

function SearchBox({value, onChange} : SearchBoxProps) {
    return (
        <input 
            type='text'
            name='query'
            className='form-control my-3'
            placeholder='search'
            value={value}
            onChange={e => onChange(e.currentTarget.value)}/>
    );
}

export default SearchBox;