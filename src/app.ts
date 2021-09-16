import express from 'express';
import path from 'path';
import dotenv from 'dotenv'

import userRoutes from './routes/user.routes';
import cardRoues from './routes/card.routes'
import p2pRoutes from './routes/p2p.routes'
// Create Express server
const app: express.Express = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
dotenv.config()


app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', userRoutes);
app.use('/api', cardRoues);
app.use('/api', p2pRoutes);


app.use((_req, res): void => {
  res.status(404).send({
    success: false,
    error: 'resource not found',
  });
});

export default app;
