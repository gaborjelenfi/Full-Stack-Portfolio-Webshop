const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const auth = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');
const Product = require('./models/product');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const multer = require('multer');
const path = require('path');
const { clearImage } = require('./util/clearImg');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();

const graphqlSchema = require('./graphql/schema');

const app = express();

// set up image storage and name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

// for image upload
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// use multer to image upload
const upload = multer({ storage: storage, fileFilter: fileFilter });

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {
    flags: 'a',
  }
);

app.use(bodyParser.json());

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(compression());
app.use(morgan('combined', {stream: accessLogStream }));

app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// serving images statically
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(auth); // check if customer authenticated
app.use(adminAuth); // check if admin authenticated

// REST api endpoint to image upload, graphql doesn't like images
app.post('/upload-image', upload.single('imgPath'), (req, res, next) => {
  // only admin can upload an image
  if (!req.isAdminAuth) {
    throw new Error('Not authenticated!');
  }
  // if no image found send an error message
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  // if image changed then delete the old image
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  // store the image
  return res
    .status(201)
    .json({ message: 'File stored.', filePath: req.file.path });
});

// set up GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// connect to mongoDB with mongoose
const connectionString = process.env.DATABASE_URL;
mongoose
  .connect(connectionString)
  .then(result => {
    console.log('connected');
  })
  .catch(err => console.log(err));

// setp up Stripe demo payment
app.post('/stripe-checkout', async (req, res) => {
  try {
    const dbProducts = await Product.find();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.map(cartItem => {
        const product = dbProducts.find(
          dbProduct => dbProduct._id.toString() === cartItem._id
        );
        if (product.quantity <= 0) {
          res.status(404).send('Product is out of stock');
        }
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: (product.price * 100).toFixed(0),
          },
          quantity: cartItem.cartQty,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/failed`,
    });
    res.json({ url: session.url, isRouteAccess: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

module.exports = app;
