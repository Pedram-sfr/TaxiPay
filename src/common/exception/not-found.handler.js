function NotFoundHandler(app) {
    app.use((req,res,next) => {
        res.json({
            statusCode: 404,
            data: null,
            error: {
                message: "Not Found Route"
            }
        })
    })
}

module.exports = NotFoundHandler;