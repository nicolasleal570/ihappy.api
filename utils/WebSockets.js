let users = [];

module.exports = function (client) {
  client.on("identity", (userId) => {
    if (userId) {
      const existUser = users.find((user) => user.userId === userId);
      if (!existUser) {
        users.push({
          socketId: client.id,
          userId: userId,
        });
      } else {
        const newUsers = users.filter((user) => user.userId !== userId);
        existUser.socketId = client.id;
        newUsers.push(existUser);
      }
    }
  });

  client.on("subscribe", (roomID) => {
    client.join(roomID);
  });

  client.on("logout", (userId) => {
    client.disconnect();
  });

  client.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== client.id);
  });
};
