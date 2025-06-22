const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

describe('Pruebas de Conexión a MongoDB', () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("URI usada:", process.env.MONGODB_URI); // Para debug
        } catch (error) {
            console.error("Error de conexión:", error.message);
            throw error;
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('Debería estar conectado a MongoDB', () => {
        const estado = mongoose.connection.readyState;
        expect(estado).toBe(1);
    });
});

