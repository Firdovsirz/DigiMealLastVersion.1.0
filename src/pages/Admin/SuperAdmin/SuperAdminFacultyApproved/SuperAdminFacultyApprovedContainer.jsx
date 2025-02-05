import React, { useState } from 'react';
import SuperAdminAside from '../SuperAdminAside/SuperAdminAside';
import SuperAdminFacultyApproved from "./SuperAdminFacultyApproved";

export default function SuperAdminFacultyApprovedContainer() {
    const [faculty, setFaculty] = useState('');
    return (
        <main style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <SuperAdminAside setFaculty={setFaculty}/>
            <SuperAdminFacultyApproved faculty={faculty} />
        </main>
    )
}
