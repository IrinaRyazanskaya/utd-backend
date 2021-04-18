import express from 'express';
import multer from 'multer';
import { orderCall } from './handlers/calls.js';
import { applyRequest } from './handlers/requests.js';

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3000;

app.use(express.json());

app.post('/api/calls', orderCall);
app.post('/api/requests', upload.single('order'), applyRequest);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
