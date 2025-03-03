import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import StarIcon from "@mui/icons-material/Star";
import "./RankingFilters.scss";

interface RankingFiltersProps {
  filters: {
    sortBy: string;
    state: string;
    minRating: number;
  };
  onFilterChange: (newFilters: any) => void;
}

const RankingFilters: React.FC<RankingFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleSortChange = (event: SelectChangeEvent) => {
    onFilterChange({ sortBy: event.target.value });
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    onFilterChange({ state: event.target.value });
  };

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    onFilterChange({ minRating: newValue as number });
  };

  return (
    <Paper className="ranking-filters">
      <Box className="filter-header">
        <FilterAltIcon />
        <Typography variant="h6">Bộ lọc truyện</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box className="filter-group">
            <Box className="filter-label">
              <SortIcon />
              <Typography variant="subtitle2">Sắp xếp theo</Typography>
            </Box>
            <FormControl fullWidth size="small">
              <Select
                value={filters.sortBy}
                onChange={handleSortChange}
                displayEmpty
                className="filter-select"
              >
                <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
                <MenuItem value="reads">Lượt đọc nhiều nhất</MenuItem>
                <MenuItem value="newest">Mới cập nhật</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="filter-group">
            <Box className="filter-label">
              <FilterAltIcon />
              <Typography variant="subtitle2">Tình trạng</Typography>
            </Box>
            <FormControl fullWidth size="small">
              <Select
                value={filters.state}
                onChange={handleStateChange}
                displayEmpty
                className="filter-select"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Đang ra">Đang ra</MenuItem>
                <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="filter-group">
            <Box className="filter-label">
              <StarIcon />
              <Typography variant="subtitle2">
                Đánh giá tối thiểu: {filters.minRating}
              </Typography>
            </Box>
            <Box px={1}>
              <Slider
                value={filters.minRating}
                onChange={handleRatingChange}
                step={0.5}
                marks
                min={0}
                max={5}
                valueLabelDisplay="auto"
                className="rating-slider"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RankingFilters;
