const database = require('../infra/database');

exports.getPosts = function () {
    return database.query('SELECT * FROM posts');
};

exports.getPost = function (id) {
    return database.oneOrNone('SELECT * FROM posts WHERE id = $1', [id]);
};

exports.getPostByTitle = function (title) {
    return database.oneOrNone('SELECT * FROM posts WHERE title = $1', [title]);
};

exports.savePost = function (post) {
    return database.one('INSERT INTO posts (title, content) values ($1, $2) returning *', [post.title, post.content]);
};

exports.updatePost = function (id, post) {
    return database.none('UPDATE posts set title = $1, content = $2 where id = $3', [post.title, post.content, id]);
};

exports.deletePost = function (id) {
    return database.none('DELETE FROM posts where id = $1', [id]);
};