const app = require('../backend/config/app');
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
})