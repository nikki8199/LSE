import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";

const testimonials = [
  {
    id: 1,
    name: "Rohit Sharma",
    city: "Hyderabad",
    skill: "React Developer",
    image: "",
    review:
      "I taught React to another member and learned Photography in return. Amazing experience!",
  },
  {
    id: 2,
    name: "Priya Verma",
    city: "Bengaluru",
    skill: "Graphic Designer",
    image: "",
    review:
      "Instead of paying for expensive courses, I exchanged UI Design lessons for Spoken English.",
  },
  {
    id: 3,
    name: "Akash Kumar",
    city: "Chennai",
    skill: "Fitness Coach",
    image: "",
    review:
      "The community is supportive. I exchanged Fitness coaching for Web Development lessons.",
  },
];

function Testimonials() {
  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: "transparent",
      }}
    >
      <Container maxWidth="lg">

        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
        >
          Community Stories
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{ mt: 2, mb: 7 }}
        >
          Real experiences from people growing together through skill exchanges.
        </Typography>

        <Grid container spacing={4}>

          {testimonials.map((item) => (

            <Grid
              item
              xs={12}
              md={4}
              key={item.id}
            >

              <Card
                sx={{
                  height: "100%",
                  borderRadius: 5,
                  p: 2,
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: 10,
                  },
                }}
              >

                <CardContent>

                  <Rating
                    value={5}
                    readOnly
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  />

                  <Typography
                    color="text.secondary"
                    align="center"
                    sx={{
                      minHeight: 100,
                      fontStyle: "italic",
                    }}
                  >
                    "{item.review}"
                  </Typography>

                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    mt={3}
                  >

                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mb: 1.5,
                        bgcolor: "primary.main",
                      }}
                    >
                      {item.name[0]}
                    </Avatar>

                    <Box>

                      <Typography fontWeight="bold">
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.skill}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        📍 {item.city}
                      </Typography>

                    </Box>

                  </Box>

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>

      </Container>
    </Box>
  );
}

export default Testimonials;