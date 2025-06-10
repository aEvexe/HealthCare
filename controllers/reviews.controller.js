const Review = require("../models/review.model");
const Client = require("../models/client.model");
const Service = require("../models/services.model");
const { reviewSchema } = require("../validations/review.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");

const createReview = async (req, res) => {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const client = await Client.findByPk(value.clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const service = await Service.findByPk(value.serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const newReview = await Review.create(value);
    res.status(201).json({ message: "Review created", newReview });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllReviews = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const reviews = await Review.findAll({
      limit,
      offset: (offset - 1) * limit,
      include: [Client, Service],
    });

    res.status(200).json({ reviews });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id, {
      include: [Client, Service],
    });

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ review });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Review.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: "Review not found" });

    const updatedReview = await Review.findByPk(id);
    res.status(200).json({ message: "Review updated", updatedReview });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
