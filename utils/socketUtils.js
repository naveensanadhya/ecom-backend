import { Server as SocketIOServer } from "socket.io";

let io;

export const init = (httpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      pingTimeout: 60000,
      pingInterval: 10000,
    },
  });
  return io;
};

export const broadcastStockUpdate = (productId, newStock) => {
  io.emit(`stockUpdate`, { productId, newStock });
};

export const updateCartCount = (count) => {
  io.emit(`cartCount`, { cartCount: count });
};
