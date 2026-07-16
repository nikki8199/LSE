import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../Services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    currentOfferSkill: "",
    currentNeedSkill: "",
  });

  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsNeeded, setSkillsNeeded] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOfferedSkill = () => {
    if (
      formData.currentOfferSkill.trim() &&
      !skillsOffered.includes(formData.currentOfferSkill.trim())
    ) {
      setSkillsOffered([
        ...skillsOffered,
        formData.currentOfferSkill.trim(),
      ]);

      setFormData({
        ...formData,
        currentOfferSkill: "",
      });
    }
  };

  const handleAddNeededSkill = () => {
    if (
      formData.currentNeedSkill.trim() &&
      !skillsNeeded.includes(formData.currentNeedSkill.trim())
    ) {
      setSkillsNeeded([
        ...skillsNeeded,
        formData.currentNeedSkill.trim(),
      ]);

      setFormData({
        ...formData,
        currentNeedSkill: "",
      });
    }
  };

  const handleDeleteOffered = (skill) => {
    setSkillsOffered(skillsOffered.filter((item) => item !== skill));
  };

  const handleDeleteNeeded = (skill) => {
    setSkillsNeeded(skillsNeeded.filter((item) => item !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (skillsOffered.length === 0) {
      return alert("Please add at least one skill you can offer.");
    }

    if (skillsNeeded.length === 0) {
      return alert("Please add at least one skill you want to learn.");
    }

    const body = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      skillsOffered,
      skillsNeeded,
    };

    try {
      const data = await sendOTP(body);

      alert(data.message);

      navigate("/verify-otp", {
        state: {
          email: body.email,
        },
      });
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          elevation={6}
          sx={{
            width: "100%",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <GroupAddIcon color="primary" sx={{ fontSize: 38 }} />

              <Typography variant="h4" fontWeight="bold">
                Join SkillSwap
              </Typography>
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Create your account and connect with people to exchange skills in
              your local community.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={12}>
                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      label="Skill You Can Teach"
                      name="currentOfferSkill"
                      value={formData.currentOfferSkill}
                      onChange={handleChange}
                    />

                    <Button
                      variant="contained"
                      onClick={handleAddOfferedSkill}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box mt={2}>
                    {skillsOffered.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="primary"
                        onDelete={() => handleDeleteOffered(skill)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      label="Skill You Want To Learn"
                      name="currentNeedSkill"
                      value={formData.currentNeedSkill}
                      onChange={handleChange}
                    />

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleAddNeededSkill}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box mt={2}>
                    {skillsNeeded.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="secondary"
                        onDelete={() => handleDeleteNeeded(skill)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid size={12}>
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Send Verification OTP
                  </Button>
                </Grid>

                <Grid size={12}>
                  <Typography
                    align="center"
                    variant="body2"
                    color="text.secondary"
                  >
                    An OTP will be sent to your email to verify your account.
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;