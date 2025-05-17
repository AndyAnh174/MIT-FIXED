import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  useMediaQuery,
  Link,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

// Đường dẫn chính xác đến các file trong public/assets
const backgroundImage = "/assets/background-homepage.png";
const cubeImage1 = "/assets/Cube-1.png";
const cubeImage2 = "/assets/Cube-2.png";
const cubeImage3 = "/assets/Cube-3.png";
const cubeImage4 = "/assets/Cube-4.png";

// Enhanced Font styles
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', 'Inter', sans-serif",
  textAlign: "center",
  fontWeight: 800,
  color: "#FFFFFF",
  fontSize: { xs: "2.5rem", md: "3.8rem" },
  textTransform: "uppercase",
  letterSpacing: "4px",
  marginBottom: "1.5rem",
  textShadow: "0 4px 15px rgba(0,0,0,0.5)",
  position: "relative",
  display: "inline-block",
  backgroundImage:
    "linear-gradient(135deg, #FFFFFF 0%, #E0E0FF 100%)",
  backgroundClip: "text",
  "-webkit-background-clip": "text",
  color: "transparent",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "4px",
    background:
      "linear-gradient(90deg, rgba(170,75,255,0.2), rgba(170,75,255,1), rgba(170,75,255,0.2))",
    borderRadius: "2px",
  },
  animation: "fadeInUp 1s ease-out",
  "@keyframes fadeInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(30px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', 'Inter', sans-serif",
  textAlign: "center",
  fontWeight: 400,
  color: "rgba(255,255,255,0.9)",
  maxWidth: "800px",
  margin: "0 auto",
  marginTop: "35px",
  marginBottom: "5rem",
  fontSize: { xs: "1.1rem", md: "1.3rem" },
  lineHeight: 1.7,
  letterSpacing: "0.5px",
  animation: "fadeIn 1.2s ease-out",
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
}));

const RootWrapper = styled(Box)(({ theme }) => ({
  width: "100vw",
  minHeight: "100vh",
  margin: 0,
  padding: 0,
  overflow: "hidden",
  position: "relative",
  fontFamily: "'Montserrat', 'Inter', sans-serif",
  color: "#FFFFFF",
}));

const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100vh",
  width: "100vw",
  margin: 0,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(20, 30, 48, 0.7) 0%, rgba(36, 59, 85, 0.7) 100%)",
    zIndex: 1,
  },
}));

const FloatingCube = styled("img")(({ theme, position }) => ({
  position: "absolute",
  ...position,
  animation:
    "float 8s ease-in-out infinite, glow 3s alternate infinite",
  filter: "drop-shadow(0 0 15px rgba(170, 75, 255, 0.7))",
  "@keyframes float": {
    "0%": {
      transform: "translateY(0px) rotate(0deg)",
    },
    "50%": {
      transform: "translateY(-30px) rotate(10deg)",
    },
    "100%": {
      transform: "translateY(0px) rotate(0deg)",
    },
  },
  "@keyframes glow": {
    "0%": {
      filter: "drop-shadow(0 0 8px rgba(170, 75, 255, 0.5))",
    },
    "100%": {
      filter: "drop-shadow(0 0 20px rgba(170, 75, 255, 0.9))",
    },
  },
}));

const RotatingCube = styled("img")(({ theme, position }) => ({
  position: "absolute",
  ...position,
  animation: "rotate 15s linear infinite, glow 3s alternate infinite",
  filter: "drop-shadow(0 0 15px rgba(170, 75, 255, 0.7))",
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  "@keyframes glow": {
    "0%": {
      filter: "drop-shadow(0 0 8px rgba(170, 75, 255, 0.5))",
    },
    "100%": {
      filter: "drop-shadow(0 0 20px rgba(170, 75, 255, 0.9))",
    },
  },
}));

const Star = styled(Box)(({ size, top, left, delay }) => ({
  position: "absolute",
  width: size,
  height: size,
  background: "white",
  borderRadius: "50%",
  top: top,
  left: left,
  animation: "twinkle 3s infinite",
  animationDelay: delay,
  boxShadow: "0 0 10px 2px rgba(170, 75, 255, 0.7)",
  zIndex: 1,
  opacity: 0.7,
  "@keyframes twinkle": {
    "0%": { opacity: 0.2, transform: "scale(0.8)" },
    "50%": { opacity: 1, transform: "scale(1.2)" },
    "100%": { opacity: 0.2, transform: "scale(0.8)" },
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  marginTop: "2rem",
  padding: "16px 48px",
  fontSize: "1.5rem",
  fontWeight: 700,
  fontFamily: "'Poppins', sans-serif",
  borderRadius: "50px",
  boxShadow: "0 5px 25px rgba(170, 75, 255, 0.6)",
  background: "linear-gradient(90deg, #9C27B0 0%, #673AB7 100%)",
  color: "#FFFFFF",
  textTransform: "uppercase",
  letterSpacing: "3px",
  "&:hover": {
    background: "linear-gradient(90deg, #673AB7 0%, #9C27B0 100%)",
    transform: "translateY(-3px) scale(1.05)",
    boxShadow: "0 8px 30px rgba(170, 75, 255, 0.8)",
  },
  transition: "all 0.3s ease",
  animation: "pulse 2s infinite, fadeInUp 1s ease-out",
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 0 0 rgba(170, 75, 255, 0.7)",
    },
    "70%": {
      boxShadow: "0 0 0 15px rgba(170, 75, 255, 0)",
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(170, 75, 255, 0)",
    },
  },
  "@keyframes fadeInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(30px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

// Thiết kế mới cho AboutSection
const AboutSection = styled(Box)(({ theme }) => ({
  padding: "8rem 0",
  background:
    "linear-gradient(135deg, #1A1F35 0%, #2D3A57 50%, #1A1F35 100%)",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "url('/assets/Cube-4.png')",
    backgroundSize: "300px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right -100px bottom -100px",
    opacity: 0.1,
    zIndex: 0,
  },
}));

// Card hiện đại cho các tính năng
const ModernFeatureCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
  transition: "all 0.5s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
    background: "rgba(255, 255, 255, 0.07)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "5px",
    background: "linear-gradient(90deg, #9C27B0, #673AB7)",
  },
  animation: "fadeInUp 0.8s ease-out forwards",
  opacity: 0,
  "&:nth-of-type(1)": {
    animationDelay: "0.2s",
  },
  "&:nth-of-type(2)": {
    animationDelay: "0.4s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "0.6s",
  },
}));

// Card hiện đại cho lịch trình
const TimelineCard = styled(Card)(({ theme, active }) => ({
  background: active
    ? "rgba(170, 75, 255, 0.1)"
    : "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  border: `1px solid ${
    active ? "rgba(170, 75, 255, 0.3)" : "rgba(255, 255, 255, 0.05)"
  }`,
  boxShadow: active
    ? "0 10px 30px rgba(170, 75, 255, 0.2)"
    : "0 10px 30px rgba(0, 0, 0, 0.2)",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  height: "100%",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: active
      ? "0 15px 40px rgba(170, 75, 255, 0.3)"
      : "0 15px 40px rgba(0, 0, 0, 0.3)",
  },
  animation: "fadeInUp 0.8s ease-out forwards",
  opacity: 0,
  "&:nth-of-type(1)": {
    animationDelay: "0.3s",
  },
  "&:nth-of-type(2)": {
    animationDelay: "0.6s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "0.9s",
  },
}));

// Đường kẻ nối giữa các mốc thời gian
const TimelineLine = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: 0,
  width: "100%",
  height: "2px",
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(170,75,255,0.5), rgba(255,255,255,0.1))",
  zIndex: 0,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  animation: "growLine 1.5s ease-out forwards",
  transformOrigin: "left center",
  "@keyframes growLine": {
    "0%": {
      transform: "scaleX(0)",
    },
    "100%": {
      transform: "scaleX(1)",
    },
  },
}));

// Chấm tròn trên timeline
const TimelineDot = styled(Box)(({ theme, active }) => ({
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  background: active ? "#9C27B0" : "rgba(255, 255, 255, 0.5)",
  boxShadow: active
    ? "0 0 15px #9C27B0"
    : "0 0 10px rgba(255, 255, 255, 0.3)",
  margin: "0 auto 15px",
  animation: "popIn 0.5s ease-out forwards",
  transform: "scale(0)",
  "@keyframes popIn": {
    "0%": {
      transform: "scale(0)",
    },
    "70%": {
      transform: "scale(1.2)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
}));

const StatusBox = styled(Box)(({ theme, active }) => ({
  marginTop: "16px",
  backgroundColor: active
    ? "rgba(170,75,255,0.15)"
    : "rgba(255,255,255,0.05)",
  padding: "10px",
  borderRadius: "10px",
  border: active
    ? "1px solid rgba(170,75,255,0.3)"
    : "1px solid rgba(255,255,255,0.05)",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "40px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: active
      ? "rgba(170,75,255,0.25)"
      : "rgba(255,255,255,0.1)",
  },
}));

const StatusText = styled(Typography)(({ theme, active }) => ({
  fontFamily: "'Montserrat', sans-serif",
  color: active ? "#BB86FC" : "rgba(255,255,255,0.6)",
  fontWeight: active ? "bold" : "normal",
  fontSize: "0.9rem",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
}));

// Nút cuộn xuống
const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: "30px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
  color: "#fff",
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: "rgba(170, 75, 255, 0.2)",
  backdropFilter: "blur(5px)",
  border: "2px solid rgba(170, 75, 255, 0.3)",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    background: "rgba(170, 75, 255, 0.3)",
    transform: "translateX(-50%) translateY(-5px)",
  },
  transition: "all 0.3s ease",
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateX(-50%) translateY(0)",
    },
    "40%": {
      transform: "translateX(-50%) translateY(-10px)",
    },
    "60%": {
      transform: "translateX(-50%) translateY(-5px)",
    },
  },
}));

// Icon mũi tên xuống
const ArrowIcon = styled(Box)(({ theme }) => ({
  width: "15px",
  height: "15px",
  borderRight: "3px solid #fff",
  borderBottom: "3px solid #fff",
  transform: "rotate(45deg)",
}));

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const aboutSectionRef = useRef(null);

  const handleStartClick = () => {
    navigate("/login");
  };

  const handleScrollDown = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Tạo ngôi sao ngẫu nhiên
  const stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      id: i,
      size: Math.random() * 3 + 1,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    });
  }

  return (
    <RootWrapper>
      <HeroSection>
        {/* Stars background */}
        {stars.map(star => (
          <Star
            key={star.id}
            size={`${star.size}px`}
            top={star.top}
            left={star.left}
            delay={star.delay}
          />
        ))}

        {/* Floating cubes for decoration */}
        <FloatingCube
          src={cubeImage1}
          position={{
            top: "15%",
            right: "2%",
            width: isMobile ? "250px" : "350px",
            zIndex: 2,
          }}
          alt="Cube decoration"
          style={{ animationDelay: "0s" }}
        />
        <RotatingCube
          src={cubeImage2}
          position={{
            bottom: "20%",
            left: "10%",
            width: isMobile ? "220px" : "300px",
            zIndex: 2,
          }}
          alt="Cube decoration"
        />
        <FloatingCube
          src={cubeImage3}
          position={{
            top: "35%",
            left: "22%",
            width: isMobile ? "360px" : "480px",
            zIndex: 2,
          }}
          alt="Cube decoration"
          style={{ animationDelay: "2s" }}
        />
        <RotatingCube
          src={cubeImage4}
          position={{
            bottom: "15%",
            right: "12%",
            width: isMobile ? "220px" : "300px",
            zIndex: 2,
          }}
          alt="Cube decoration"
        />

        {/* Đặt nút ở chính giữa màn hình, bỏ container để căn giữa tuyệt đối */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StartButton onClick={handleStartClick} variant="contained">
            BẮT ĐẦU NGAY
          </StartButton>
        </Box>

        {/* Nút cuộn xuống */}
        <ScrollDownButton onClick={handleScrollDown}>
          <ArrowIcon />
        </ScrollDownButton>
      </HeroSection>

      {/* Phần VỀ CUỘC THI được thiết kế lại hiện đại hơn */}
      <AboutSection id="about" ref={aboutSectionRef}>
        <Container maxWidth="lg">
          {/* Tiêu đề chính */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
            }}
          >
            <SectionTitle variant="h2" component="h2">
              VỀ CUỘC THI
            </SectionTitle>

            <SectionSubtitle variant="h5">
              Thử thách bản thân, khám phá tiềm năng và tỏa sáng cùng
              cuộc thi công nghệ hàng đầu
            </SectionSubtitle>
          </Box>

          {/* Các tính năng */}
          <Grid
            container
            spacing={4}
            sx={{ mb: 10, position: "relative", zIndex: 1 }}
          >
            <Grid item xs={12} md={4}>
              <ModernFeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      background:
                        "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      fontSize: "2.5rem",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    🏆
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "#FFD700",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Thách Thức
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.8,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Thử thách kiến thức và kỹ năng lập trình của bạn
                    qua các bài toán thực tế, giải thuật phức tạp và
                    tình huống công nghệ hiện đại. Cơ hội để bạn chứng
                    minh khả năng giải quyết vấn đề.
                  </Typography>
                </CardContent>
              </ModernFeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <ModernFeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      background:
                        "linear-gradient(135deg, #FF057C 0%, #8D0B93 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      fontSize: "2.5rem",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    🚀
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "#FFD700",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Phát Triển
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.8,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Cơ hội học hỏi từ chuyên gia công nghệ, kết nối
                    với cộng đồng và phát triển kỹ năng chuyên môn. Mở
                    rộng tầm nhìn và nâng cao năng lực trong lĩnh vực
                    công nghệ.
                  </Typography>
                </CardContent>
              </ModernFeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <ModernFeatureCard>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      background:
                        "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      fontSize: "2.5rem",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    🔗
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "#FFD700",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Kết Nối
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.8,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Kết nối với các doanh nghiệp công nghệ hàng đầu,
                    mở ra cơ hội việc làm và xây dựng mạng lưới quan
                    hệ chuyên nghiệp. Tạo dựng mối quan hệ bền vững
                    trong ngành.
                  </Typography>
                </CardContent>
              </ModernFeatureCard>
            </Grid>
          </Grid>

          {/* Lịch trình cuộc thi - thiết kế hiện đại */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              mt: 10,
              mb: 5,
              textAlign: "center",
            }}
          >
            <SectionTitle variant="h2" component="h2">
              LỊCH TRÌNH CUỘC THI
            </SectionTitle>

            <SectionSubtitle variant="h5">
              Hành trình chinh phục thử thách và khẳng định bản thân
            </SectionSubtitle>
          </Box>

          {/* Timeline hiện đại */}
          <Box sx={{ position: "relative", mb: 10 }}>
            <TimelineLine />
            <Grid
              container
              spacing={4}
              justifyContent="center"
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <TimelineDot />
                </Box>
                <TimelineCard>
                  <CardContent
                    sx={{
                      p: 4,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "#FFD700",
                        mb: 1,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      VÒNG SƠ KHẢO
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        mb: 3,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      09/05/2025 - 10/05/2025
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        mb: 2,
                        flex: 1,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Thử thách kiến thức nền tảng và tư duy lập trình
                      cơ bản
                    </Typography>
                    <StatusBox>
                      <StatusText>Đã hoàn thành</StatusText>
                    </StatusBox>
                  </CardContent>
                </TimelineCard>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <TimelineDot active={true} />
                </Box>
                <TimelineCard active={true}>
                  <CardContent
                    sx={{
                      p: 4,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "#FFD700",
                        mb: 1,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      VÒNG CHUNG KẾT
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "rgba(255,255,255,0.9)", mb: 3 }}
                    >
                      18/05/2025
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        mb: 2,
                        flex: 1,
                      }}
                    >
                      Đối đầu trực tiếp và trình diễn giải pháp trước
                      ban giám khảo
                    </Typography>
                    <StatusBox active={true}>
                      <StatusText active={true}>
                        Đang diễn ra
                      </StatusText>
                    </StatusBox>
                  </CardContent>
                </TimelineCard>
              </Grid>
            </Grid>
          </Box>

          {/* Nút đăng ký tham gia */}

          {/* Footer với thông tin bổ sung */}
          <Box
            sx={{
              textAlign: "center",
              mt: 10,
              pt: 5,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box sx={{ mb: { xs: 4, md: 0 }, textAlign: "left" }}>
              <Typography
                variant="h6"
                sx={{ color: "#FFD700", mb: 2, fontWeight: 700 }}
              >
                LIÊN HỆ
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}
              >
                Email: yit@hcmute.edu.vn
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}
              >
                Điện thoại: 0764396306
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                Địa chỉ: 01 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức,
                TP. HCM
              </Typography>
            </Box>

            <Box
              sx={{
                mb: { xs: 4, md: 0 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#FFD700", mb: 2, fontWeight: 700 }}
              >
                THEO DÕI
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                  gap: 2,
                }}
              >
                <Link
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  Facebook
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  Twitter
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  LinkedIn
                </Link>
              </Box>
            </Box>

            <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
              <Typography
                variant="h6"
                sx={{ color: "#FFD700", mb: 2, fontWeight: 700 }}
              >
                THÔNG TIN
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}
              >
                <Link
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  Điều khoản sử dụng
                </Link>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}
              >
                <Link
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  Chính sách bảo mật
                </Link>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                <Link
                  href="#"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  Trợ giúp
                </Link>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "center", mt: 5, pb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.5)" }}
            >
              © 2025 MASTERING IT - Trường Đại học Sư phạm Kỹ thuật
              TP.HCM
            </Typography>
          </Box>
        </Container>
      </AboutSection>
    </RootWrapper>
  );
};

export default HomePage;
