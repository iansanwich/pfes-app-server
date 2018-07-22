const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Log model
const DomesticLog = require("../../models/DomesticLog");
const InternationalLog = require("../../models/InternationalLog");

// User model
const User = require("../../models/User");

// Log validation
const validateLogInput = require("../../validation/log");

// ////////////////////////////////////
// @route   GET api/logs/test
// @desc    Test logs route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Logs works" }));

// ////////////////////////////////////
// @route   GET api/logs/domestic
// @desc    Get domestic logs
// @access  Private
// router.get("/domestic")

// ////////////////////////////////////
// @route   POST api/logs/domestic
// @desc    Create domestic log
// @access  Private
router.post(
  "/domestic",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    // Only admin and sales can create logs
    if (req.user.userType !== "admin" && req.user.userType !== "sales") {
      return res.json({ unauthorized: "Unauthorized" });
    }

    const { errors, isValid } = validateLogInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newDomesticLog = new DomesticLog({
      domJo: req.body.domJo,
      shipperConsignee: req.body.shipperConsignee,
      associate: req.body.associate,
      modeOfTransport: req.body.modeOfTransport,
      commodity: req.body.commodity,
      blAwb: req.body.associate,
      origin: req.body.origin,
      destination: req.body.destination,
      etd: new Date(Date.now()).toISOString(),
      eta: new Date(Date.now()).toISOString(),
      status: req.body.status,
      // operations: {},
      rating: req.body.rating,
      user: req.user.id
    });

    DomesticLog.findOne({ domJo: req.body.domJo }).then(log => {
      if (log) {
        errors.domJo = "That DOM/JO# already exists";
        return res.status(400).json(errors);
      }

      newDomesticLog.save().then(log => res.json(log));
    });
  }
);

// ////////////////////////////////////
// @route   POST api/logs/international
// @desc    Create international log
// @access  Private
router.post(
  "/international",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    // Only admin and sales can create logs
    if (req.user.userType !== "admin" && req.user.userType !== "sales") {
      return res.json({ unauthorized: "Unauthorized" });
    }

    const { errors, isValid } = validateLogInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newInternationalLog = new InternationalLog({
      domJo: req.body.domJo,
      shipperConsignee: req.body.shipperConsignee,
      associate: req.body.associate,
      modeOfTransport: req.body.modeOfTransport,
      commodity: req.body.commodity,
      blAwb: req.body.associate,
      origin: req.body.origin,
      destination: req.body.destination,
      etd: new Date(Date.now()).toISOString(),
      eta: new Date(Date.now()).toISOString(),
      status: req.body.status,
      operations: {},
      rating: req.body.rating,
      user: req.user.id
    });

    InternationalLog.findOne({ domJo: req.body.domJo }).then(log => {
      if (log) {
        errors.domJo = "That DOM/JO# already exists";
        return res.status(400).json(errors);
      }

      newInternationalLog.save().then(log => res.json(log));
    });
  }
);

// ////////////////////////////////////
// @route   POST api/logs/domestic/edit
// @desc    Edit domestic log
// @access  Private
router.post(
  "/domestic/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    // Only admin and sales can edit logs
    if (req.user.userType !== "admin" && req.user.userType !== "sales") {
      return res.json({ unauthorized: "Unauthorized" });
    }

    const { errors, isValid } = validateLogInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newDomesticLog = {
      domJo: req.body.domJo,
      shipperConsignee: req.body.shipperConsignee,
      associate: req.body.associate,
      modeOfTransport: req.body.modeOfTransport,
      commodity: req.body.commodity,
      blAwb: req.body.associate,
      origin: req.body.origin,
      destination: req.body.destination,
      etd: new Date(Date.now()).toISOString(),
      eta: new Date(Date.now()).toISOString(),
      status: req.body.status,
      operations: {},
      rating: req.body.rating,
      user: req.user.id
    };

    DomesticLog.findOne({ domJo: req.body.domJo }).then(log => {
      if (log) {
        // Update
        DomesticLog.findOneAndUpdate(
          { domJo: req.body.domJo },
          { $set: newDomesticLog },
          { new: true }
        ).then(log => res.json(log));
      }
    });
  }
);

// ////////////////////////////////////
// @route   POST api/logs/international/edit
// @desc    Edit international log
// @access  Private
router.post(
  "/international/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    // Only admin and sales can edit logs
    if (req.user.userType !== "admin" && req.user.userType !== "sales") {
      return res.json({ unauthorized: "Unauthorized" });
    }

    const { errors, isValid } = validateLogInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newInternationalLog = {
      domJo: req.body.domJo,
      shipperConsignee: req.body.shipperConsignee,
      associate: req.body.associate,
      modeOfTransport: req.body.modeOfTransport,
      commodity: req.body.commodity,
      blAwb: req.body.associate,
      origin: req.body.origin,
      destination: req.body.destination,
      etd: new Date(Date.now()).toISOString(),
      eta: new Date(Date.now()).toISOString(),
      status: req.body.status,
      operations: {},
      rating: req.body.rating,
      user: req.user.id
    };

    InternationalLog.findOne({ domJo: req.body.domJo }).then(log => {
      if (log) {
        // Update
        InternationalLog.findOneAndUpdate(
          { domJo: req.body.domJo },
          { $set: newInternationalLog },
          { new: true }
        ).then(log => res.json(log));
      }
    });
  }
);

// ////////////////////////////////////
// @route   POST api/logs/domestic/operations/
// @desc    Edit domestic operations log
// @access  Private
router.post(
  "/domestic/operations/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req.user);
    // Only admin and operations can edit operations status
    // if (req.user.userType !== "admin" && req.user.userType !== "operations") {
    //   return res.json({ unauthorized: "Unauthorized" });
    // }

    const update = {};

    update.operations = {};
    update.operations.preloading = {};
    update.operations.loading = {};
    update.operations.unloading = {};

    if (req.body.preloadingStatus)
      update.operations.preloading.status = req.body.preloadingStatus;
    if (req.body.preloadingRemarks)
      update.operations.preloading.remarks = req.body.preloadingRemarks;

    if (req.body.loadingStatus)
      update.operations.loading.status = req.body.loadingStatus;
    if (req.body.loadingRemarks)
      update.operations.loading.remarks = req.body.loadingRemarks;

    if (req.body.unloadingStatus)
      update.operations.unloading.status = req.body.unloadingStatus;
    if (req.body.unloadingRemarks)
      update.operations.unloading.remarks = req.body.unloadingRemarks;

    DomesticLog.findOne({ domJo: req.body.domJo }).then(log => {
      if (log) {
        // Update
        DomesticLog.findOneAndUpdate(
          { domJo: req.body.domJo },
          { $set: update },
          { new: true }
        ).then(log => res.json(log));
      }
    });
  }
);

// ////////////////////////////////////
// @route   POST api/logs/international/operations/
// @desc    Edit international operations log
// @access  Private
router.post(
  "/international/operations/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Only admin and operations can edit operations status
    if (req.user.userType !== "admin" && req.user.userType !== "operations") {
      return res.json({ unauthorized: "Unauthorized" });
    }

    const update = {};

    update.operations = {};
    update.operations.preloading = {};
    update.operations.loading = {};
    update.operations.unloading = {};

    if (req.body.preloadingStatus)
      update.operations.preloading.status = req.body.preloadingStatus;
    if (req.body.preloadingRemarks)
      update.operations.preloading.remarks = req.body.preloadingRemarks;

    if (req.body.loadingStatus)
      update.operations.loading.status = req.body.loadingStatus;
    if (req.body.loadingRemarks)
      update.operations.loading.remarks = req.body.loadingRemarks;

    if (req.body.unloadingStatus)
      update.operations.unloading.status = req.body.unloadingStatus;
    if (req.body.unloadingRemarks)
      update.operations.unloading.remarks = req.body.unloadingRemarks;

    InternationalLog.findOne({ domJo: req.body.domJo }).then(log => {
      if (log) {
        // Update
        InternationalLog.findOneAndUpdate(
          { domJo: req.body.domJo },
          { $set: update },
          { new: true }
        ).then(log => res.json(log));
      }
    });
  }
);

// ////////////////////////////////////
// @route   DELETE api/logs/domestic
// @desc    Delete domestic log
// @access  Private
router.delete(
  "/domestic",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Only admin can delete logs
    if (req.user.userType !== "admin") {
      return res.json({ unauthorized: "Unauthorized" });
    }

    DomesticLog.remove({ domJo: req.body.domJo }).then(() => {
      res.json({ success: true });
    });
  }
);

module.exports = router;
