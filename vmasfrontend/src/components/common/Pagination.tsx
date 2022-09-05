import React, { Component } from 'react';
import _ from 'lodash';

interface PaginationProps {
    pageSize : number,
    itemCount : number,
    currentPage: number,
    onPageChange : (page : number) => void,
}
 
function Pagination({itemCount, pageSize, currentPage, onPageChange} : PaginationProps) {
        const pageCount = Math.ceil(itemCount / pageSize);
        if (pageCount === 1) return null;
        const pages = _.range(1, pageCount+1);

        return (
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {pages.map(page => 
                                    <li 
                                        key={page} 
                                        className={(page === currentPage) ? "page-item active":"page-item"}>
                                        <a 
                                            onClick={() => onPageChange(page)} 
                                            className='page-link'>{page}
                                        </a>
                                    </li>)
                        }
                    </ul>
                </nav>
        );
}

export default Pagination;