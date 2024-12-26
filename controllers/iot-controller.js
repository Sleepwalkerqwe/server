exports.getMessage = async (topic, message) => {
  if (topic === MQTT_TOPIC) {
    const messageData = JSON.parse(message.toString());
    console.log(`Отримано повідомлення з топіка ${topic}: ${message.toString()}`);

    const { temperature, heartRate, steps } = messageData;

    // Create a new object with data for the user
    const data = new Data({
      userId: "67682ac15ab74a6348a0debc", // Bind the data to a specific user
      temperature,
      heartRate,
      steps,
    });

    try {
      // Save the data to the database
      await data.save();
      console.log("Data was successfully saved to the database");
    } catch (err) {
      console.error("Storing data:", err);
    }
  }
};
