import React from "react";

interface SideNavigationProps {
    isOpen : boolean;
    toggleSidebar : () => void
}

const SideNavigation = ({isOpen, toggleSidebar} : SideNavigationProps) => {
  const sidebarClass = isOpen ? "sidebar open" : "sidebar";
  return (
   
        <div className={sidebarClass}>
        <div> Azhar Uddin System Adm </div>
        
            <div id="accordion">
                <div className="card">
                    <div className="card-header" id="headingOne">
                        <h5 className="mb-0">
                            <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Rule Management
                            </button>
                        </h5>
                    </div>
                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                        <div className="card-body">
                            <a href="/roles" className="btn btn-secondary">Role Management</a>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h5 className="mb-0">
                            <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Target Management
                            </button>
                        </h5>
                    </div>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                        <div className="card-body">
                            Target Management
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingThree">
                        <h5 className="mb-0">
                            <a className="btn btn-link collapsed" href="/users">User Management
                            </a>
                        </h5>
                    </div>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                        <div className="card-body">
                            User Management
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={toggleSidebar} className="sidebar-toggle">
                Open
            </button>
        </div>
    
  );
};
export default SideNavigation;