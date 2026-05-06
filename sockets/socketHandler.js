module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    //  Join room
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    //  Place order
    socket.on("placeOrder", async (data) => {
      const { userId } = data;

      // 1. Pending
      io.to(userId).emit("orderUpdate", {
        status: "PENDING",
        data,
      });

      // 2. Process
      setTimeout(async () => {
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
          // TODO: call DB logic here

          io.to(userId).emit("orderUpdate", {
            status: "EXECUTED",
            data,
          });

          io.to(userId).emit("holdings_update");
          io.to(userId).emit("positions_update");
        } else {
          io.to(userId).emit("orderUpdate", {
            status: "REJECTED",
            data,
          });
        }
      }, 2000);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};