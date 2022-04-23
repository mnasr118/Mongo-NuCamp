const express = require("express");
const Favorite = require("../models/favorite");
const favoriteRouter = express.Router();

const authenticate = require("../authenticate");
const cors = require("./cors");

favoriteRouter
	.route("/")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favorite.find({ user: req.user._id })
			.populate("user")
			.populate("campsites")
			.then((favorite) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(favorite);
			})
			.catch((err = next(err)));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.find({ user: req.user._id })
			.then((favorite) => {
				if (favorite) {
					req.body.forEach((fav) => {
						if (!favorite.campsites.includes(fav_id)) {
							favorite.campsites.push(fav_id);
						}
					});
					favorite
						.save()
						.then((favorite) => {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							res.json(favorite);
						})
						.catch((err = next(err)));
				} else {
					Favorite.create({ user: req.user._id })
						.then((favorite) => {
							req.body.forEach((fav) => {
								if (!favorite.campsites.includes(fav_id)) {
									favorite.campsites.push(fav_id);
								}
							});
							favorite
								.save()
								.then((favorite) => {
									res.statusCode = 200;
									res.setHeader("Content-Type", "application/json");
									res.json(favorite);
								})
								.catch((err = next(err)));
						})
						.catch((err = next(err)));
				}
			})
			.catch((err = next(err)));
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end("Put opperation not supported on Favorites");
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOneAndDelete({ user: req.user._id })
			.then((favorite) => {
				res.statusCode = 200;
				if (favorite) {
					res.setHeader = ("Content-Type", "application/json");
					res.json(favorite);
				} else {
					res.setHeader = ("Content-Type", "text/plain");
					res.end("You do not have any favorites to delete");
				}
			})
			.catch((err = next(err)));
	});

favoriteRouter
	.route("campsiteId")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end("Get opporation not suuported on campsiteId");
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favorite) => {
				if (favorite) {
					if (!favorite.campsites.includes(req.params.campsiteId)) {
						favorite.campsites.push(req.params.campsiteId);
						favorite
							.save()
							.then((favorite) => {
								res.statusCode = 200;
								res.setheader = ("Content-Type", "application/json");
								res.json(favorite);
							})
							.catch((err = next(err)));
					} else {
						res.statusCode = 200;
						res.setHeader("Content-Type", "text/plain");
						res.end("That campsite is already a favorite");
					}
				} else {
					Favorite.create({
						user: req.user._id,
						campsites: [req.params.campsiteId],
					})
						.then((favorite) => {
							res.statusCode = 200;
							res.setheader = ("Content-Type", "application/json");
							res.json(favorite);
						})
						.catch((err = next(err)));
				}
			})
			.catch((err = next(err)));
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end("Put opperation not supported on Favorites/campsiteId");
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favorite) => {
				if (favorite) {
					const index = favorites.campsites.indexOf(req.params.campsiteId);
					if (index >= 0) {
						favorite.campsites.splice(index, 1);
					}
					favorite
						.save()
						.then((favorite) => {
							res.statusCode = 200;
							res.setheader = ("Content-Type", "application/json");
							res.json(favorite);
						})
						.catch((err = next(err)));
				} else {
					res.statusCode = 200;
					res.setHeader("Content-Type", "text/plain");
					res.end("This favorite does not exist.");
				}
			})
			.catch((err = next(err)));
	});

module.exports = favoriteRouter;
