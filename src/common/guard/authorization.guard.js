const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const userModel = require("../../USER/modules/user/user.model");
require("dotenv").config();
const Authorization = async (req, res, next) => {
  try {
    const headers = req.headers;
    const [bearer, token] = headers?.["authorization"]?.split(" ") || [];
    if (token && ["bearer", "Bearer"].includes(bearer)) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err)
          return next(
            createHttpError.Unauthorized("توکن نادرست است")
          );
        const { mobile, userId } = payload;
        const user = await userModel.findOne(
          { mobile },
          {
            updatedAt: 0,
            createdAt: 0,
            _id: 0,
          }
        ).lean();
        if (!user)
          return next(createHttpError.Unauthorized("کاربر یافت نشد"));
        req.user = { mobile, userId };
        return next();
      });
    } else
      return next(createHttpError.Unauthorized("توکن نادرست است"));
  } catch (error) {
    next(error);
  }
};

module.exports = Authorization;
