const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ссылка на пользователя, для которого уведомление
    required: true,
  },
  type: {
    type: String,
    enum: ["Reminder", "Alert", "Update"], // Типы уведомлений
    required: true,
  },
  message: {
    type: String,
    required: true, // Содержание уведомления
  },
  isRead: {
    type: Boolean,
    default: false, // Статус уведомления: прочитано/непрочитано
  },
  createdAt: {
    type: Date,
    default: Date.now, // Дата и время создания уведомления
  },
  dueDate: {
    type: Date, // Для уведомлений, связанных с конкретным временем
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
