import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Rating,
    Stack,
    Typography,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useNavigate } from "react-router-dom";

function UserCard({ user }) {
    const navigate = useNavigate();
    return (
        <Card
            elevation={4}
            sx={{
                width: "100%",
                height: 600,
                borderRadius: 5,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: 10,
                },
            }}
        >
            {/* Banner */}
            <Box
                sx={{
                    height: 120,
                    background: "linear-gradient(135deg,#2563EB,#06B6D4)",
                }}
            />

            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    mt: -7,
                }}
            >
                <Stack spacing={2} alignItems="center" sx={{ flex: 1 }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            fontSize: 38,
                            bgcolor: "primary.main",
                            border: "4px solid white",
                        }}
                    >
                        {user.name.charAt(0)}
                    </Avatar>

                    <Typography variant="h5" fontWeight="bold">
                        {user.name}
                    </Typography>

                    <Typography color="text.secondary">
                        {user.title}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2">
                            {user.location}
                        </Typography>
                    </Stack>

                    <Rating value={user.rating} precision={0.5} readOnly />

                    <Divider flexItem />

                    {/* Skills Offered */}
                    <Box width="100%">
                        <Typography fontWeight="bold" mb={1} textAlign="center">
                            Skills Offered
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                            justifyContent="center"
                        >
                            {user.skillsOffered.map((skill) => (
                                <Chip
                                    key={skill}
                                    label={skill}
                                    color="success"
                                    size="small"
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Skills Needed */}
                    <Box width="100%">
                        <Typography fontWeight="bold" mb={1} textAlign="center">
                            Wants To Learn
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                            justifyContent="center"
                        >
                            {user.skillsNeeded.map((skill) => (
                                <Chip
                                    key={skill}
                                    label={skill}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Divider flexItem />

                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        width="100%"
                    >
                        <Box sx={{ flex: 1, textAlign: "center" }}>
                            <Typography variant="h6" fontWeight="bold">
                                {user.swaps}
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block" }}>
                                Skill Swaps
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1, textAlign: "center" }}>
                            <Typography variant="h6" fontWeight="bold">
                                {user.success}%
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block" }}>
                                Success
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Push button to bottom */}
                    <Box sx={{ mt: "auto", width: "100%" }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<SwapHorizIcon />}
                            onClick={() => navigate(`/profile/${user._id || user.id}`)}
                            sx={{
                                mt: 2,
                                py: 1.3,
                                borderRadius: 3,
                            }}
                        >
                            View Profile
                        </Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default UserCard;