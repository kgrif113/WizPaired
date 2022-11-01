const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span> 
            <a href="/posts/${post.id}">${post.title}</a> 
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
        )
        .join("")}
    </div>
  </body>
</html>`;

  app.use(express.static("public"));

  res.send(html);

  app.get(`/posts/:id`, (req, res, next) => {
    const id = req.params.id;
    const post = postBank.find(id);

    if (!post.id) {
      // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
      res.status(404);
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
      <a href="/" id="homeButt" > Home </a>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <header><img src="/logo.png"/>Wizard News</header>
        <div class="not-found">
          <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
          <img src="/dumbledore-404.gif" />
        </div>
      </body>
      </html>`;
      res.send(html);
    } else {
      const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <a href="/" id="homeButt" > Home </a>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
          <div class='news-item'>
            <p>
             ${post.title}
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
            ${post.date}
            </small>
            <p>
            ${post.content}
            </p>
          </div>Thi
      </div>
    </body>
  </html>`;
      res.send(html);
    }
  });
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
