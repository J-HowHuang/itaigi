var path = require('path');
var express = require('express');
var template = require('./html/seoTemplate');

if ((parseInt(process.versions.node[0]) == 0) && (parseInt(process.versions.node.slice(2)) <= 12)) {
  console.log(
    'Node.js version ' + process.versions.node + ' too old; please upgrade to Node.js 4.0 or later.'
  );
  process.exit();
}

var app = express();

app.get('/:Iah([kt])/:Su', function (req, res) {
  let { Iah, Su } = req.params;
  res.send(template.render({
    url: `https://itaigi.tw/${Iah}/${Su}`,
    title: `${Su} - iTaigi 愛台語`,
    image: `https://www.moedict.tw/${encodeURI(Su)}.png?font=wt064`,
  }));
});

app.get('/:Iah([kt])/:HuaSu/:TaiSu/:Im', function (req, res) {
  let { Iah, HuaSu, TaiSu, Im } = req.params;
  res.send(template.render({
    url: `https://itaigi.tw/${Iah}/${HuaSu}/${TaiSu}/${Im}`,
    title: `${TaiSu} - iTaigi 愛台語`,
    image: `https://www.moedict.tw/${encodeURI(TaiSu)}.png?font=wt064`,
  }));
});

app.get('/:file(*.(png|jpg|gif|svg))', function (req, res) {
  let { file } = req.params;
  res.redirect(301, `https://g0v.github.io/itaigi/${encodeURI(file)}`);
});

app.get('*', function (req, res) {
  res.send(template.render({
    url: 'https://itaigi.tw/',
    title: 'iTaigi 愛台語',
    image: 'https://g0v.github.io/itaigi/design/logo_og.png',
  }));
});

app.listen(3000, '127.0.0.1', function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
