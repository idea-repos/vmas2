import React, { useState } from 'react';
import SideNavigation from './SideNavigation';
import TopNavigation from './TopNavigation';
require('../styles.css')

function Home() {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const handleViewSidebar = () => {
        setSideBarOpen(!sidebarOpen);
      };
    return (
        <div>
            <TopNavigation />
            <SideNavigation isOpen={sidebarOpen} toggleSidebar={handleViewSidebar}/>
            <div className="pane ui-layout-center center-panel">
                <div className="jumbotron"> 
                    <h1 className="pb-5">Welcome to VMAS - II Monitoring Analysis System</h1>
                    <p>A quick glance at what you can do</p><br />
                    <ol>
                        <li>Choose an area of your interest from the left navigation. Click on + to expand the grouping.</li>
                        <li>Your Operational area for various Information Type has been neatly stacked for you to make it easier for you to keep record of the incoming data.</li>
                        <li>All your targets are stacked in the Target Tab. You will be constantly reminded of any targets that need your attention through notifications.</li>
                        <li>You are expected to keep your tables clear, but in case, you want to keep a record for more insight as pending, you can move it in the Pending Tab.</li>
                        <li>While the system is designed to manage most of the file types you will get, yet you may get some files that need more investigation using external tools. Simply hit the Download button on top of the Popup. You will be able to download a Zip file which will have the metadata and the file.</li>
                    </ol>
                    <br /><br />
                    <strong>Lets Get Going!</strong>
                </div>
            </div>
        </div>
    );
}

export default Home;