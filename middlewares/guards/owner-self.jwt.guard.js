const { sendErrorResponse } = require("../../helpers/send_error_res");

module.exports = (req, res, next) => {
  try {

    if (req.params.id != req.owner.id) {
        return res.status(403).send({message: "Ruxsat etilmagan foydalanuvchi. Faqat shaxsiy ma'lumotlarni ko'rish mumkin"})
    }

    next();
  } catch (error) {
    sendErrorResponse(error, res, 400);
  } 
};
