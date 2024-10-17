import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import BlogCard from "./Elements/BlogCard";
import { useTheme } from "@mui/material/styles";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); 

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${base_url}/store/${brand_id}/blogs`);
      const data = await res.json();
      setBlogs(data); 
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBlogs = filteredBlogs.sort((a, b) => {
    if (sortOrder === "titleAsc") {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === "titleDesc") {
      return b.title.localeCompare(a.title);
    } else if (sortOrder === "createDateAsc") {
      return new Date(a.created) - new Date(b.created);
    } else if (sortOrder === "createDateDesc") {
      return new Date(b.created) - new Date(a.created);
    }
    return 0;
  });

  return (
    <Box sx={{ width: "80%", margin: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <TextField
          label="Search Blogs"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mr: 2 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="titleAsc">Title (Ascending)</MenuItem>
            <MenuItem value="titleDesc">Title (Descending)</MenuItem>
            <MenuItem value="createDateAsc">Created Date (Ascending)</MenuItem>
            <MenuItem value="createDateDesc">Created Date (Descending)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmallScreen ? "1fr" : "repeat(3, 1fr)", // Column for small screens
          gap: 2,
        }}
      >
        {sortedBlogs.map((blog) => (
          <BlogCard
            key={blog.slug}
            title={blog.title}
            snippet={blog.snippet}
            created={blog.created}
            image={blog.image}
            slug={blog.slug}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Blog;