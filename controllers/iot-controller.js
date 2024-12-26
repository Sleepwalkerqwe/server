exports.getMessage = async (topic, message) => {
  if (topic === MQTT_TOPIC) {
    const messageData = JSON.parse(message.toString());
    console.log(`Отримано повідомлення з топіка ${topic}: ${message.toString()}`);

    const { temperature, heartRate, steps } = messageData;

    // Создаем новый объект с данными для пользователя
    const data = new Data({
      userId: "67682ac15ab74a6348a0debc", // Привязываем данные к конкретному пользователю
      temperature,
      heartRate,
      steps,
    });

    try {
      // Сохраняем данные в базу данных
      await data.save();
      console.log("Дані успішно збережені у базі даних");
    } catch (err) {
      console.error("Помилка збереження даних:", err);
    }
  }
};
