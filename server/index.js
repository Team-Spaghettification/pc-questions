const express = require('express')
const bodyParser = require('body-parser')
const db = require('../database/db.js');
const app = express();
const port = 3306;

const Moment = require('moment')

app.use(express.json());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));

var time = Moment().format();

app.get('/', (req, res) => {
  res.json('Hello');
})

app.get('/qa/questions/:product_id/:count', (req, res) => {
  if (req.params.count && !req.query.page) {
    db.query(`SELECT * FROM questions WHERE product_id = ${req.params.product_id}
    AND reported = false ORDER BY id Limit ${req.params.count}`,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
      return;
    })
  } else if (req.query.page && req.params.count) {
    db.query(`SELECT * FROM questions WHERE product_id = ${req.params.product_id} AND
    reported = false ORDER BY id Limit ${req.query.page * (req.params.count) - req.params.count},
    ${req.params.count} `,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
      return;
    })
  }
})

app.get('/qa/answers/:question_id', (req, res) => {
  // if (req.query.count && !req.query.page) {
  //   db.query(`SELECT * FROM answers WHERE question_id = ${req.query.question_id}
  //   AND reported = false ORDER BY id Limit ${req.query.page}`,
  //   (err, result) => {
  //     if (err) {
  //       throw err;
  //     }
  //     res.json(result);
  //   })
  // }
  if (req.query.count && !req.query.page) {
    db.query(`SELECT * FROM answers WHERE question_id = ${req.params.question_id}
    AND reported = false ORDER BY id Limit ${req.query.count}`,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
      return;
    })
  } else if (req.query.page && req.query.count) {
    db.query(`SELECT * FROM answers WHERE question_id = ${req.params.question_id}
    AND reported = false ORDER BY id Limit ${req.query.page * (req.query.count) - req.query.count},
    ${req.query.count} `,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
      return;
    })
  } else {
    db.query(`SELECT * FROM answers WHERE question_id = ${req.params.question_id} AND reported = false`,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
      return;
    })
  }
})

app.post('/qa/questions', (req, res) => {
  var obj = {
    body: req.body.body,
    name:  req.body.name,
    email:  req.body.email,
    product_id: req.body.product_id
  }

  db.query(`INSERT INTO questions (product_id, body, date_written,
    asker_name, asker_email, reported, helpful) VALUES (${obj.product_id}, '${obj.body}',
    '${time}', '${obj.name}', '${obj.email}', false, 0)`, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json(result);
      }
    })
})

app.post('/qa/answers/:question_id', (req, res) => {
  var obj = {
    body: req.body.body,
    name: req.body.name,
    email: req.body.email,
    photos: req.body.photos,
  }
  db.query(`INSERT INTO answers (question_id, body, date_written,
    answerer_name, answerer_email, reported, helpful) VALUES (${req.params.question_id}, '${obj.body}',
    '${time}', '${obj.name}', '${obj.email}', false, 0)`, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.json(result);
      }
    })
  if (obj.photos) {
    for (var i = 0; i < obj.photos.length; i++) {
      db.query(`INSERT INTO answers_photos (answer_id, url) VALUES (${obj.photos[i].answer_id}, ${obj.photos[i].url})`,
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json(result);
        }
      }
    )}
  }
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  db.query(`UPDATE questions SET helpful = helpful + 1 WHERE id = ${req.params.question_id}`,
  (err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  })
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  db.query(`UPDATE questions SET reported = true WHERE id = ${req.params.question_id}`,
  (err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  })
})

app.put('/qa/answers/:answer_id/helpful', (req,res) => {
  db.query(`UPDATE answers SET helpful = helpful + 1 WHERE id = ${req.params.answer_id}`,
  (err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  })
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  db.query(`UPDATE answers SET reported = true WHERE id = ${req.params.answer_id}`,
  (err, result) => {
    if (err) {
      throw err;
    } else {
      res.json(result);
    }
  })
})

app.listen(port, () => {
  console.log('listening at port 3306');
})



