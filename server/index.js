const express = require('express');
const bodyParser = require('body-parser');
const Account = require('./models/Account');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

app.get('/accounts', (req, res) => {
   Account.find({}, (error, accounts) => {
       console.log(error);
        if(error) {
            res.status(422).json({ error: 'whoops something happened'});
            return;
        }
        res.status(200).json({accounts});
   });
});

app.get('/accounts/:id', (req, res) => {
  const { id } = req.params;
  
  res.status(200);
});

app.post('/accounts', (req, res) => {
  const { name, description, budgetedAmount, isActive } = req.body;
  const values = { name, description, budgetedAmount, isActive };
  const errors = Object.keys(values)
                       .filter(key => values[key] === undefined)
                       .reduce((errors, key) => {
                          const error = { type: 'isRequired', messsage: `Missing ${key} please povide value`};
                          return errors ? [...errors, error] : [error];
                       }, null);
  if(errors) {
    res.status(422).json({ errors });
    return;
  }

  const account = new Account({ name, description});

  account.save((error, account) => {
    if(error) {
      res.status(422).json({ error });
      return;
    }
    res.status(201).json({ account });
  });
});

app.put('/accounts/:id', (req, res) => {
  const { id } = req.params;
  if (id === undefined ) {
    res.status(422).json({ errors: [{ message: 'An id needs to be provided'}]});
    return;
  }

  const { name, description, budgetedAmount, isActive } = req.body;  
  const values = { name, description, budgetedAmount, isActive };
  const updateBody = Object.keys(values).filter(key => values[key] !== undefined)
                                        .reduce((updateBody, key) => {
                                          updateBody[key] = values[key];
                                          return updateBody;
                                        }, {});
  Account.findOneAndUpdate({ _id: id }, updateBody, { new: true }, (err, account) => {
    if(err) {
      res.status(422).json({ errors: [err]});
      return;
    }
    res.status(200).json({ account });
    return;
  });

})

app.delete('/accounts/:id', (req, res) => {
  const { id } = req.params;
  if(!id) {
    res.status(422).json({ errors: [{message: 'An id needs to be provided'}]});
    return; 
  }
  Account.find( { _id: id }).remove((err) => {
    if(err) {
      res.status(422).json({ errors: [{message: 'whoops something happened'}]});
      return;
    }
    res.status(200).json({success: true});
  });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/users',
  { useMongoClient: true }
);

/* eslint no-console: 0 */
connect.then(() => {
  const port = 3000;
  app.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});