const express = require("express");

const router = express.Router();

const isUser = require("../MiddleWare/isUser");

const {
    sendRequest,
    receivedRequests,
    sentRequests,
    getSingleRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    completeRequest,
    deleteRequest,
} = require("../Controller/ExchangeController");

router.post("/send", isUser, sendRequest);

router.get("/received", isUser, receivedRequests);

router.get("/sent", isUser, sentRequests);

router.get("/:id", isUser, getSingleRequest);

router.patch("/accept/:id", isUser, acceptRequest);

router.patch("/reject/:id", isUser, rejectRequest);

router.patch("/cancel/:id", isUser, cancelRequest);

router.patch("/complete/:id", isUser, completeRequest);

router.delete("/:id", isUser, deleteRequest);

module.exports = router;