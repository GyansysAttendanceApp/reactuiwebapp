import { CenterFocusStrong } from "@mui/icons-material";
import React, { useEffect } from "react";
import { loginRequest } from "../../authConfig";
import { useMsal } from '@azure/msal-react';
import { Navigate, useNavigate } from "react-router-dom";

const MFALogin = ({ username }) => {
    const { instance } = useMsal();

    const handleLoginRedirect = async () => {

        await instance.loginRedirect();

    };

    return (
        <div style={{ display: "flex", justifyContent: "Center", alignItems: "center", flexDirection: "column" }}>
            <h2>Welcome to Gyansys Attendance Application</h2>
            <br />
            <div>
                {!username && (
                    <button onClick={handleLoginRedirect}>Click here to login with you Organization Email</button>
                )
                }

            </div>

        </div>
    )
}
export default MFALogin