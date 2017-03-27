const express = require('express');
const bodyParser = require('body-parser');
const requestLib = require('request');

const publicPath = `${__dirname}/public`;

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicPath));

app.post('/api/login', (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  const url = `https://${username}:${password}@www.pivotaltracker.com/services/v5/me`;

  requestLib({ url: url }, (error, apiResponse, body) => {
    const result = JSON.parse(body);

    if (error || result.kind === 'error') {
      return response.status(401)
        .json('Are you really sure? I mean REALLY sure?');
    }

    response.json(result);
  });
});
app.get('*', (request, response) => {
  response.sendFile(`${publicPath}/index.html`);
});

app.listen(3000);
