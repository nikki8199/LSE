import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import {login as loginUser} from "../Services/authService";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      login(data.token, data.user);

      alert(data.message);

      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 10,
          display: "flex",
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
          <CardContent sx={{ p: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              mb={3}
            >
              <LoginIcon
                color="primary"
                sx={{ fontSize: 35 }}
              />

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                Login
              </Typography>
            </Box>

            <Typography
              color="text.secondary"
              mb={3}
            >
              Welcome back to SkillSwap.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                name="password"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  py: 1.5,
                }}
              >
                Login
              </Button>

              <Typography
                align="center"
                mt={3}
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Link>
              </Typography>

              <Typography
                align="center"
                mt={1.5}
              >
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{ fontWeight: "bold" }}
                >
                  Forgot Password?
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Login;