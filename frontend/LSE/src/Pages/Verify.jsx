import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../Services/authService";
import { useAuth } from "../Context/AuthContext";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return alert("Please enter the 6-digit OTP.");
    }

    try {
      setLoading(true);

      const data = await verifyOTP({
        email,
        otp,
      });

      login(data.token, data.user);

      alert(data.message);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: 5,
          }}
          elevation={8}
        >
          <CardContent sx={{ p: 5 }}>
            <Box textAlign="center">

              <VerifiedUserIcon
                color="primary"
                sx={{
                  fontSize: 70,
                  mb: 2,
                }}
              />

              <Typography variant="h4" fontWeight="bold">
                Verify Email
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                We have sent a verification code to
              </Typography>

              <Typography
                fontWeight="bold"
                color="primary"
                sx={{ mb: 4 }}
              >
                {email}
              </Typography>

              <TextField
                fullWidth
                label="Enter 6 Digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 3,
                }}
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Verify OTP"
                )}
              </Button>

            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default VerifyOTP;