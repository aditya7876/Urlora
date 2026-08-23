import 'dotenv/config.js';

import express from 'express';
import userRoutes from './routes/user.routes.js';

import {authenticationMiddleware} from './middlewares/auth.middleware.js';

import urlRoutes from './routes/url.routes.js';

const app = express();
const PORT = process.env.PORT ?? 8000;
app.use(express.json());
app.use(authenticationMiddleware);
app.use('/url', urlRoutes);


app.get('/', (req, res) => {
    return res.json({
        status: 'Server is up and running...'
    })
})

app.use('/user', userRoutes);


app.use(urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});