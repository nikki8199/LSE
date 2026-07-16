import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ForumIcon from "@mui/icons-material/Forum";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getConversations, getMessageThread, sendMessage } from "../Services/messageService";
import { getUserProfile } from "../Services/userService";

function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const chatUserId = searchParams.get("chat");

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversations list
  useEffect(() => {
    fetchConversations();
    // Poll conversations list every 6 seconds
    const interval = setInterval(fetchConversations, 6000);
    return () => clearInterval(interval);
  }, []);

  // Set active conversation from URL or default to first conversation
  useEffect(() => {
    if (chatUserId) {
      handleChatQueryUser(chatUserId);
    } else if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [chatUserId, conversations]);

  // Load message thread when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      fetchMessageThread(activeConvId);
      // Poll active message thread every 3 seconds for live chat simulation
      const interval = setInterval(() => {
        fetchMessageThread(activeConvId, true);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatQueryUser = async (userId) => {
    // If user is already in conversation list, just make them active
    const exist = conversations.find((c) => c.id === userId);
    if (exist) {
      setActiveConvId(userId);
      return;
    }

    try {
      setLoadingThread(true);
      // Fetch details of the new chat partner to add a temporary conversation entry
      const data = await getUserProfile(userId);
      if (data.success && data.user) {
        const newPartner = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          profileImage: data.user.profileImage,
          role: data.user.role,
          lastMessage: "Start a new conversation",
          time: new Date(),
          unread: false,
        };
        setConversations((prev) => [newPartner, ...prev]);
        setActiveConvId(userId);
      }
    } catch (err) {
      console.error("Error loading chat user profile:", err);
    } finally {
      setLoadingThread(false);
    }
  };

  const fetchMessageThread = async (partnerId, isSilent = false) => {
    try {
      if (!isSilent) setLoadingThread(true);
      const data = await getMessageThread(partnerId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error loading thread:", err);
    } finally {
      if (!isSilent) setLoadingThread(false);
    }
  };

  useEffect(() => {
    let interval;
    if (activeConvId) {
      interval = setInterval(() => {
        fetchMessageThread(activeConvId, true);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeConvId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeConvId) return;

    const messageText = typedMessage.trim();
    setTypedMessage("");

    try {
      await sendMessage({
        receiver: activeConvId,
        text: messageText,
      });

      // Instantly load new message
      fetchMessageThread(activeConvId, true);
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <>
      <DashboardNavbar />
      <Box sx={{ display: "flex", bgcolor: "transparent", minHeight: "100vh", pt: 8 }}>
        <Sidebar />

        <Container maxWidth="xl" sx={{ py: 4, flex: 1, minWidth: 0 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Back
          </Button>

          <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden", height: "75vh" }}>
            <Grid container sx={{ height: "100%" }}>
              
              {/* Chat List (Left Column) */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <Box p={3}>
                  <Typography variant="h5" fontWeight="bold">
                    Direct Chats
                  </Typography>
                </Box>
                <Divider />

                {loading ? (
                  <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
                    {conversations.length === 0 ? (
                      <Typography p={3} align="center" color="text.secondary">
                        No conversations yet. Go to explore to message members!
                      </Typography>
                    ) : (
                      conversations.map((conv) => (
                        <React.Fragment key={conv.id}>
                          <ListItem
                            button
                            selected={activeConvId === conv.id}
                            onClick={() => {
                              setActiveConvId(conv.id);
                              // Clear query params to keep URL clean
                              if (chatUserId) navigate("/messages");
                            }}
                            sx={{
                              py: 2.2,
                              px: 3,
                              "&.Mui-selected": {
                                bgcolor: "action.selected",
                              },
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={conv.profileImage} sx={{ bgcolor: "primary.main", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                                {conv.name?.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography fontWeight={conv.unread ? "bold" : "600"} noWrap sx={{ color: "text.primary", fontSize: "0.95rem" }}>
                                  {conv.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0 }}>
                                  {new Date(conv.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="body2"
                                color={conv.unread ? "text.primary" : "text.secondary"}
                                noWrap
                                fontWeight={conv.unread ? "bold" : "normal"}
                                sx={{ mt: 0.5, fontSize: "0.85rem" }}
                              >
                                {conv.lastMessage}
                              </Typography>
                            </Box>
                          </ListItem>
                          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />
                        </React.Fragment>
                      ))
                    )}
                  </List>
                )}
              </Grid>

              {/* Chat Thread (Right Column) */}
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  bgcolor: "transparent",
                }}
              >
                {activeConv ? (
                  <>
                    {/* Header */}
                    <Box sx={{ p: 2.5, bgcolor: "rgba(10, 15, 30, 0.45)", borderBottom: "1px solid rgba(6, 182, 212, 0.2)" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={activeConv.profileImage} sx={{ bgcolor: "primary.main", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                            {activeConv.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="bold">{activeConv.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activeConv.email}
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<VideoCameraBackIcon />}
                          onClick={() => {
                            const roomIds = [activeConv.id, user?._id].sort().join("_");
                            window.open(`https://meet.jit.si/SkillSwapExchange_${roomIds}`, "_blank");
                          }}
                          sx={{ borderRadius: 2 }}
                        >
                          Join Call
                        </Button>
                      </Stack>
                    </Box>

                    {/* Messages Body */}
                    <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                      {loadingThread ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                          <CircularProgress />
                        </Box>
                      ) : (
                        <>
                          {messages.map((msg) => {
                            const isMe = msg.sender === user?._id;
                            return (
                              <Box
                                key={msg._id}
                                sx={{
                                  alignSelf: isMe ? "flex-end" : "flex-start",
                                  maxWidth: "70%",
                                }}
                              >
                                <Paper
                                  sx={{
                                    p: 2,
                                    borderRadius: isMe ? "18px 18px 0px 18px" : "18px 18px 18px 0px",
                                    bgcolor: isMe ? "primary.main" : "rgba(255, 255, 255, 0.08)",
                                    color: isMe ? "white" : "text.primary",
                                    boxShadow: 1,
                                  }}
                                >
                                  <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                              </Box>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </Box>

                    {/* Input Area */}
                    <Box sx={{ p: 2.5, bgcolor: "background.paper", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <form onSubmit={handleSendMessage}>
                        <Stack direction="row" spacing={2}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            disabled={loadingThread}
                          />
                          <IconButton type="submit" color="primary" disabled={loadingThread || !typedMessage.trim()}>
                            <SendIcon />
                          </IconButton>
                        </Stack>
                      </form>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", p: 3 }}>
                    <ForumIcon sx={{ fontSize: 70, color: "text.secondary", mb: 2 }} />
                    <Typography color="text.secondary" variant="h6">
                      No active chat.
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Select a contact or navigate to Explore to message user peers.
                    </Typography>
                  </Box>
                )}
              </Grid>

            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Messages;
