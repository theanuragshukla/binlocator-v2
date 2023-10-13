import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./BottomNav.css";
import { ROUTES } from "../../constants";
import { AccountCircle, AddLocation, Tune } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
export default function BottomNav() {
    const [value, setValue] = React.useState("locate");
    const btns = [
        {
            label: "Locate",
            path: ROUTES.LOCATE,
            Icon: LocationOnIcon,
        },
        {
            label: "Add bin",
            path: ROUTES.ADD,
            Icon: AddLocation,
        },
        {
            label: "Tune",
            path: ROUTES.TUNE,
            Icon: Tune,
        },
        {
            label: "Account",
            path: ROUTES.ACCOUNT,
            Icon: AccountCircle,
        },
    ];

    const navigate = useNavigate();

    return (
        <ThemeProvider theme={createTheme({})}>
            <BottomNavigation
                className="BottomNav"
                showLabels
                value={value}
                onChange={(_, e) => setValue(() => e)}
                sx={{
                    border: "none",
                    bgcolor: "rgba(255,255,255,0.92)",
                    "& .Mui-selected": {
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: (theme) => theme.typography.caption,
                            transition: "none",
                            fontWeight: "bold",
                            lineHeight: "20px",
                        },
                        "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label":
                            {
                                color: "#008000",
                            },
                    },
                }}
            >
                {btns.map((o) => (
                    <BottomNavigationAction
                        label={o.label}
                        value={o.label}
                        icon={<o.Icon />}
                        onClick={() => {
                            navigate(o.path);
                        }}
                        key={o.label}
                    />
                ))}
            </BottomNavigation>
        </ThemeProvider>
    );
}
