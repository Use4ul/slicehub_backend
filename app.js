const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bootstrap = async () => {
    try {
        startWebServer();
    } catch (error) {
        console.log('Application startup failed:', error);
    }
};

function startWebServer() {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

bootstrap().catch((e) => `Some error ${e}`);
