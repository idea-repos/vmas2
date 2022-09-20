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
                            <a href="/roles" className="btn btn-link collapsed">Role Management</a>
                        </h5>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h5 className="mb-0">
                            <a className="btn btn-link collapsed" href="/target">Target Management
                            </a>
                        </h5>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingThree">
                        <h5 className="mb-0">
                            <a className="btn btn-link collapsed" href="/users">User Management
                            </a>
                        </h5>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingFour">
                        <h5 className="mb-0">
                            <a className="btn btn-link collapsed" href="/sections">Section Management
                            </a>
                        </h5>
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