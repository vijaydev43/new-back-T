let config = new Object();

config = {
  app: {
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 8000,
  },
  dataBase: {
    url: process.env.MONGO_URL ||"mongodb+srv://Grocery_Shop:Shop_01@cluster0.vaxdo.mongodb.net/tifto"
  },
};

module.exports = config;