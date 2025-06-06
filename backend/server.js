const app = require('../backend/config/app');
const PORT = 8080; // TO DO: alterar porta

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
})