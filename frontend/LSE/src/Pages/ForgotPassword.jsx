import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: request reset, 2: reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      const response = await axios.post("http://localhost:5000/Authentication/forgot-password", {
        email,
      });

      setStatus({ type: "success", message: response.data.message });
      setStep(2);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to send reset code",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      const response = await axios.post("http://localhost:5000/Authentication/reset-password", {
        email,
        otp,
        newPassword,
      });

      setStatus({ type: "success", message: response.data.message });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to reset password",
      });
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
          justifyContent: "center",
        }}
      >
        <Card
          elevation={8}
          sx={{
            width: "100%",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
              <LockResetIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4" fontWeight="bold">
                Reset Password
              </Typography>
            </Box>

            {status.message && (
              <Alert severity={status.type} sx={{ mb: 3 }}>
                {status.message}
              </Alert>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOTP}>
                <Typography color="text.secondary" mb={3}>
                  Enter your registered email address, and we will send you a 6-digit OTP code to reset your password.
                </Typography>

                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, py: 1.5, borderRadius: 3, fontWeight: "bold" }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <Typography color="text.secondary" mb={3}>
                  We have sent a verification code to <strong>{email}</strong>. Please enter the code along with your new password below.
                </Typography>

                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    required
                    label="Enter 6-Digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </Stack>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 4, py: 1.5, borderRadius: 3, fontWeight: "bold" }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Reset"}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  sx={{ mt: 1, fontWeight: "bold" }}
                >
                  Resend OTP Code
                </Button>
              </form>
            )}

            <Typography align="center" mt={4}>
              Back to{" "}
              <Link component={RouterLink} to="/login" sx={{ fontWeight: "bold" }}>
                Login
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
