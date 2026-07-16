import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Avatar,
  Stack,
} from "@mui/material";

import {
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

import { sendExchangeRequest } from "../../Services/exchangeService";

function ExchangeDialog({
  open,
  onClose,
  receiver,
  currentUser,
}) {
  const [requestedSkill, setRequestedSkill] = useState("");

  const [offeredSkill, setOfferedSkill] = useState("");

  const [meetingMode, setMeetingMode] = useState("Either");

  const [preferredDate, setPreferredDate] = useState(dayjs());

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!requestedSkill || !offeredSkill) {
      alert("Please select both skills.");
      return;
    }

    try {
      setLoading(true);

      await sendExchangeRequest({
        receiver: receiver._id,
        requestedSkill,
        offeredSkill,
        meetingMode,
        preferredDate,
        message,
      });

      alert("Exchange request sent successfully!");

      onClose();

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Send Skill Exchange Request
      </DialogTitle>

      <DialogContent>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          mb={3}
        >
          <Avatar
            src={receiver.profileImage}
            sx={{ width: 60, height: 60 }}
          >
            {receiver.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography fontWeight="bold">
              {receiver.name}
            </Typography>

            <Typography variant="body2">
              Choose skills for the exchange.
            </Typography>
          </Box>
        </Stack>

        <FormControl
          fullWidth
          margin="normal"
        >
          <InputLabel>
            Skill I Want To Learn
          </InputLabel>

          <Select
            value={requestedSkill}
            label="Skill I Want To Learn"
            onChange={(e) =>
              setRequestedSkill(e.target.value)
            }
          >
            {receiver.skillsOffered.map((skill) => (
              <MenuItem
                key={skill}
                value={skill}
              >
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
        >
          <InputLabel>
            Skill I Can Teach
          </InputLabel>

          <Select
            value={offeredSkill}
            label="Skill I Can Teach"
            onChange={(e) =>
              setOfferedSkill(e.target.value)
            }
          >
            {currentUser.skillsOffered.map((skill) => (
              <MenuItem
                key={skill}
                value={skill}
              >
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography
          mt={2}
          mb={1}
        >
          Meeting Preference
        </Typography>

        <RadioGroup
          value={meetingMode}
          onChange={(e) =>
            setMeetingMode(e.target.value)
          }
        >
          <FormControlLabel
            value="Online"
            control={<Radio />}
            label="Online"
          />

          <FormControlLabel
            value="Offline"
            control={<Radio />}
            label="Offline"
          />

          <FormControlLabel
            value="Either"
            control={<Radio />}
            label="Either"
          />
        </RadioGroup>

        <LocalizationProvider
          dateAdapter={AdapterDayjs}
        >
          <DatePicker
            label="Preferred Date"
            value={preferredDate}
            onChange={(newValue) =>
              setPreferredDate(newValue)
            }
            sx={{
              width: "100%",
              mt: 2,
            }}
          />
        </LocalizationProvider>

        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="Message"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />
      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Request"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}

export default ExchangeDialog;