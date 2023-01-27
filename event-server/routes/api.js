const express = require("express");
const router = express.Router();

const { events, status, uploads } = require("../handlers");

// path: /api/*
router.get("/events/progress", events.registerClient);
router.get("/status", status.getStatus);
router.post("/upload-audio", uploads.uploadAndTranscribeAudio);

module.exports = router;
