const mongoose = require('mongoose');

/**
 * Configuração e conexão com MongoDB
 * Utiliza Mongoose para modelagem de dados
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Opções de conexão removidas em versões mais recentes do Mongoose
      // são tratadas automaticamente
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
