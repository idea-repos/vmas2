import React from 'react';

interface PageBarProps {
    title: string,
    children?: any,
    havingChildren? : boolean
}

function PageBar({title, children} : PageBarProps) {
    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <p className="navbar-brand">{title}</p>
                {children &&  <div className="d-flex">{children}</div>}
            </div>
        </nav>
    );
}

export default PageBar;