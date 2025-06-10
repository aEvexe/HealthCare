const express = require("express");
const router = express.Router();

const {
  getServicesUsedInDateRange,
  getClientsUsedServicesInDateRange,
  getClientsCanceledInDateRange,
  getTopOwnersByServiceName,
  getPaymentsByClient
} = require("../controllers/analititcs.controller");

// 1. Services used in date range
router.get("/services-used", getServicesUsedInDateRange);

// 2. Clients who used services in date range
router.get("/clients-used", getClientsUsedServicesInDateRange);

// 3. Clients who canceled services in date range
router.get("/clients-canceled", getClientsCanceledInDateRange);

// 4. Top owners by service name
router.get("/top-owners-by-service", getTopOwnersByServiceName);

// 5. Payments made by a specific client
router.get("/payments-by-client/:clientId", getPaymentsByClient);

module.exports = router;
