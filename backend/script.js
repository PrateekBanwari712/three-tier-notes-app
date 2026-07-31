import express from 'express';
import cors from 'cors';
import userRoute from './routes/auth.route.js';
import noteRoute from './routes/notes.route.js';

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Notes API is running');
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/notes', noteRoute);

app.listen(3000, () => {
  console.log('server listening at port 3000');
});