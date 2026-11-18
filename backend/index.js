import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/authRoutes.js';
import { initDb } from './db.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

app.use('/auth', authRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    if (err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({ error: 'Invalid request body' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
});

await initDb();

const port = process.env.PORT || 4800;
app.listen(port, () => {
    console.log(`Sweety API running on http://localhost:${port}`);
});
