import 'dotenv/config';
import app from './app.js';

const PORT = Number(process.env.PORT);
console.log(PORT)

app.listen(PORT, () => {
  console.log(`Learniee backend running on http://localhost:${PORT}`);
});
