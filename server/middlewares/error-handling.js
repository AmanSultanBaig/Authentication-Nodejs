const notFound = (req, res) => res.status(404).json({ status: false, message: "Route not found!" })

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(err.status || 500).json({ status: false, message: err.message })
}

module.exports = { notFound, errorHandler }