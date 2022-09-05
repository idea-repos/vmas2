import React from 'react';
import  Button  from 'react-bootstrap/Button';

interface PageBarProps {
    title: string,
    children?: any,
    havingChildren? : boolean
}

function PageBar({title, children, havingChildren} : PageBarProps) {
    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <p className="navbar-brand">{title}</p>
                {havingChildren &&  <div className="d-flex">{children}</div>}
            </div>
        </nav>
    );
}

export default PageBar;