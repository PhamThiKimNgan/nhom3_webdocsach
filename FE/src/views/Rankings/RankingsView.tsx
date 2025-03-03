import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Chip,
  Paper,
  Skeleton,
} from "@mui/material";
import { getNovelTopRating } from "../../api/apiStory";
import { Story } from "../../models/Story";
import RankingFilters from "./RankingFilters";
import { Link } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import "./RankingsView.scss";

const RankingsView: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    sortBy: "rating",
    state: "",
    minRating: 0,
  });

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await getNovelTopRating({});
        setStories(data);
        setError(null);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredStories = stories
    .filter((story) => (filters.state ? story.state === filters.state : true))
    .filter((story) => story.rating >= filters.minRating)
    .sort((a, b) => {
      if (filters.sortBy === "rating") {
        return b.rating - a.rating;
      } else if (filters.sortBy === "reads") {
        return b.reads - a.reads;
      } else if (filters.sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

  const getRankClass = (index: number) => {
    if (index === 0) return "rank-first";
    if (index === 1) return "rank-second";
    if (index === 2) return "rank-third";
    return "";
  };

  const getRankIcon = (index: number) => {
    if (index <= 2) {
      return <EmojiEventsIcon className={`rank-icon ${getRankClass(index)}`} />;
    }
    return null;
  };

  return (
    <Container maxWidth="lg" className="rankings-container">
      <Box className="rankings-header">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          className="page-title"
        >
          Bảng Xếp Hạng Truyện
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          className="page-subtitle"
        >
          Khám phá những tác phẩm được yêu thích nhất
        </Typography>
      </Box>

      <Box className="filters-section">
        <RankingFilters filters={filters} onFilterChange={handleFilterChange} />
      </Box>

      {loading ? (
        <Box className="loading-container">
          <Grid container spacing={3}>
            {[...Array(6)].map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper className="story-card loading">
                  <Box display="flex" gap={2} p={2}>
                    <Skeleton variant="rectangular" width={100} height={150} />
                    <Box width="100%">
                      <Skeleton variant="text" width="80%" height={30} />
                      <Skeleton variant="text" width="60%" />
                      <Box mt={2}>
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="50%" />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : error ? (
        <Box className="error-container">
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          <Box className="results-info">
            <Typography variant="body1">
              Hiển thị{" "}
              <span className="highlight">{filteredStories.length}</span> truyện
            </Typography>
          </Box>

          <Grid container spacing={3} className="stories-grid">
            {filteredStories.map((story, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={story._id}
                className="story-grid-item"
              >
                <Paper className={`story-card ${getRankClass(index)}`}>
                  <Box className="rank-badge">
                    {getRankIcon(index)}
                    <Typography variant="h6">{index + 1}</Typography>
                  </Box>

                  <Box className="story-content">
                    <Box className="story-image-container">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="story-image"
                      />
                      <Chip
                        label={story.state}
                        size="small"
                        color={
                          story.state === "Đang ra" ? "success" : "default"
                        }
                        className="state-chip"
                      />
                    </Box>

                    <Box className="story-details">
                      <Box className="story-meta-top">
                        <Link
                          to={`/truyen/${story.url}`}
                          className="story-title-link"
                        >
                          <Typography
                            variant="h6"
                            className="story-title"
                            title={story.name}
                          >
                            {story.name}
                          </Typography>
                        </Link>

                        <Box className="story-author">
                          <PersonIcon fontSize="small" />
                          <Typography variant="body2">
                            {story.author}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="story-meta-bottom">
                        <Box className="story-stats">
                          <Box className="stat-item">
                            <StarIcon className="star-icon" />
                            <Typography variant="body2">
                              {story.rating.toFixed(1)}{" "}
                              <span className="rating-count">
                                ({story.numberofrating})
                              </span>
                            </Typography>
                          </Box>

                          <Box className="stat-item">
                            <BookIcon fontSize="small" />
                            <Typography variant="body2">
                              {story.reads.toLocaleString()} lượt đọc
                            </Typography>
                          </Box>
                        </Box>

                        <Box className="story-chapters">
                          <Chip
                            label={`${story.numberofchapter} chương`}
                            size="small"
                            variant="outlined"
                            className="chapter-chip"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default RankingsView;
