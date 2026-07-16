import { useState } from "react";
import { Paper, Button, Box } from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";

import ExchangeDialog from "../Exchange/ExchangeDialog";
import { useAuth } from "../../context/AuthContext";

function ExchangeButton({ user }) {
  const [open, setOpen] = useState(false);

  const { user: currentUser } = useAuth();

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<HandshakeIcon />}
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.5,
            }}
          >
            Send Skill Exchange Request
          </Button>
        </Box>
      </Paper>

      <ExchangeDialog
        open={open}
        onClose={() => setOpen(false)}
        receiver={user}
        currentUser={currentUser}
      />
    </>
  );
}

export default ExchangeButton;