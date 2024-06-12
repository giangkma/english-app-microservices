const blogApi = require("express").Router();
const {
  jwtAuthentication,
} = require("../../../../middlewares/auth.middleware");
const blogController = require("../controllers/blog.controller");

blogApi.get("/blog-list", jwtAuthentication, blogController.getBlogList);

blogApi.get("/blog-html", jwtAuthentication, blogController.getBlogHtml);

module.exports = blogApi;
