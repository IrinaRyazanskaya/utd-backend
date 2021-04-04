import express from 'express';
import { orderCall } from './handlers/calls.js';
import { applyRequest } from './handlers/requests.js';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/calls', orderCall);
app.post('/api/requests', applyRequest);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
