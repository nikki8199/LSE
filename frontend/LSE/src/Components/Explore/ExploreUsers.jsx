import { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { exploreUsers, searchUsers } from "../../Services/userService";

import UserCard from "./UserCard";

function ExploreUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get("search") || "";

  useEffect(() => {
    loadUsers();
  }, [searchKeyword]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = searchKeyword
        ? await searchUsers(searchKeyword)
        : await exploreUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <CircularProgress />;

  if (users.length === 0)
    return (
      <Typography>
        No users found.
      </Typography>
    );

  return (
    <Grid container spacing={3}>
      {users.map((user) => (
        <Grid
          item
          xs={12}
          sm={6}
          lg={4}
          key={user._id}
        >
          <UserCard user={user} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ExploreUsers;