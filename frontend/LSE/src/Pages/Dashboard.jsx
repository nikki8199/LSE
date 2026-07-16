import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box } from "@mui/material";
import RecommendedSkills from "../Components/Dashboard/RecomendedSkills";
import WelcomeCard from "../Components/Dashboard/Welcome";
import Sidebar from "../Components/SideBar/SideBar";
import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Statistics from "../Components/Stats/Stats";
import RecentRequests from "../Components/Dashboard/RecentRequest";
import TrendingSkills from "../Components/Dashboard/TrendingSkills";

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === "admin") {
            navigate("/admin");
        }
    }, [user, navigate]);

    if (user && user.role === "admin") {
        return null;
    }

    return (
        <>
            <DashboardNavbar />

            <Box
                sx={{
                    bgcolor: "transparent",
                    minHeight: "100vh",
                    pt: "64px",
                    display: "flex",
                }}
            >
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <Box
                    sx={{
                        flex: 1,
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                    }}
                >
                    <WelcomeCard />

                    <Box mt={4}>
                        <Statistics />
                    </Box>

                    <Box mt={5}>
                        <RecommendedSkills />
                    </Box>
                    <Box mt={5}>
                        <RecentRequests />
                    </Box>
                    <Box mt={5}>
                        <TrendingSkills />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Dashboard;