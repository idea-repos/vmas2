import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';


interface SideNavigationProps {
    isOpen : boolean;
    toggleSidebar : () => void
}

const SideNavigation = ({isOpen, toggleSidebar} : SideNavigationProps) => {
  const sidebarClass = isOpen ? "sidebar open" : "sidebar";
  const [open, setOpen] = useState(false);

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
                <div className="card">
                    <div className="card-header" id="headingFour">
                        <h5 className="mb-0">
                            <a 
                                aria-controls="example-collapse-text"
                                aria-expanded={open}
                                onClick={() => setOpen(!open)} className="btn btn-link">Dict Management <i className="fa fa-plus ml-3" aria-hidden="true"></i>
                            </a>
                            <Collapse in={open}>
                                <div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/country">COUNTRY
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/source">SOURCE
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/category">CATEGORY
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/region">REGION
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/language">LANGUAGE
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/keyword">KEYWORD
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/receiver">RECEIVER
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/precedence">PRECEDENCE
                                        </a>
                                    </div>
                                    <div>
                                        <a className="btn btn-link collapsed" href="/dir_mgmt/dict/listing/speaker">SPEAKER
                                        </a>
                                    </div>
                                </div>
                            </Collapse>
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