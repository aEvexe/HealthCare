const sendErrorResponse = (error, res, status) => {
    console.log(error)
    res.status(status).send({ message: error.message });
}

module.exports = {
    sendErrorResponse
}