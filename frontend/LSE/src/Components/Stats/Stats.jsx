import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress
} from "@mui/material";

import {
    Star,
    Handshake,
    EmojiEvents,
    CalendarMonth
} from "@mui/icons-material";

import { useAuth } from "../../Context/AuthContext";
import { getUserStats } from "../../Services/userService";

function StatsSection() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user._id) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getUserStats(user._id);
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error("Error fetching user stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    const items = [
        {
            title: "Rating",
            value: stats?.rating || "New Member",
            icon: <Star />,
            description: "Community Rating"
        },
        {
            title: "Exchanges",
            value: stats?.completedExchanges || 0,
            icon: <Handshake />,
            description: "Skill Exchanges"
        },
        {
            title: "Reputation",
            value: stats?.rating ? `${Math.round(stats.rating * 20)}%` : "N/A",
            icon: <EmojiEvents />,
            description: "Trust Score"
        },
        {
            title: "Joined",
            value: stats?.joined ? new Date(stats.joined).toLocaleString("default", { month: "long", year: "numeric" }) : "Recent",
            icon: <CalendarMonth />,
            description: "Member Since"
        }
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
            >
                Community Stats
            </Typography>

            <Grid container spacing={3}>
                {
                    items.map((item, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={index}
                        >
                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: 8
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            mb: 2
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 45,
                                                height: 45,
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                background:
                                                    "linear-gradient(135deg,#667eea,#764ba2)",
                                                color: "white"
                                            }}
                                        >
                                            {item.icon}
                                        </Box>

                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            {item.title}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                    >
                                        {item.value}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        mt={1}
                                    >
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
}

export default StatsSection;