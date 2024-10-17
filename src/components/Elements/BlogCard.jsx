import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/Info";
import logo from "../../Image/logo.png";
import Link from "next/link";

const BlogCard = ({ title, snippet, created, image, slug }) => {
  return (
    <Link href={`/blog/${slug}`} passHref>
      <Card className="w-full mt-2 p-2 shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto">
        <Box className="flex">
          <IconButton className="ml-auto">
            <ModeEditOutlineIcon className="text-yellow-600" />
          </IconButton>
        </Box>
        <CardHeader
          avatar={
            <Avatar
              className="bg-inherit"
              aria-label="blog"
              src={image || logo.src}
            />
          }
          title={<Typography className="font-semibold">{title}</Typography>}
          subheader={
            <Typography className="text-sm text-gray-500">{created}</Typography>
          }
        />
        <CardContent>
          <hr className="my-2" />
          <Typography className="text-gray-600 text-sm">{snippet}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
