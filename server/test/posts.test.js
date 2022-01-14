const axios = require('axios');
const crypto = require('crypto');
const postsService = require('../service/postsService');

// Exemplo
// test('Should get posts', async function () {
//     const response = await axios({
//         url: 'http://localhost:3000/posts',
//         method: 'get'
//     });

//     const posts = response.data;

//     // testando o tamanho do array
//     expect(posts).toHaveLength(4);

//     const [firstPost] = posts;

//     // testando se o id do primeiro post é igual a 1
//     expect(firstPost.id).toBe(1);

//     // testando se o title do primeiro post é igual a Post 1
//     expect(firstPost.title).toBe('Post 1');
// });

// criando valores randômicos para fins de teste
const generate = function () {
    return crypto.randomBytes(20).toString('hex');
}

const request = function (url, method, data) {
    // return axios({
    //     url: url,
    //     method: method,
    //     data: data
    // });

    // código melhorado, pois { url => url } = url
    return axios({
        url,
        method,
        data,
        validateStatus: false
    });
}

test('Should get posts', async function () {
    //  given - dado que
    const post1 = await postsService.savePost({
        title: generate(),
        content: generate()
    });

    const post2 = await postsService.savePost({
        title: generate(),
        content: generate()
    });

    const post3 = await postsService.savePost({
        title: generate(),
        content: generate()
    });

    // when - quando acontecer
    const response = await request('http://localhost:3000/posts', 'get');

    expect(response.status).toBe(200);

    const posts = response.data;

    // then - então
    expect(posts).toHaveLength(3);

    await postsService.deletePost(post1.id);
    await postsService.deletePost(post2.id);
    await postsService.deletePost(post3.id);
});


test('Should save posts', async function () {
    const data = { title: generate(), content: generate() };
    const response = await request('http://localhost:3000/posts', 'post', data);
    
    expect(response.status).toBe(201);
    
    const post = response.data;
    
    expect(post.title).toBe(data.title);
    expect(post.content).toBe(data.content);

    await postsService.deletePost(post.id);
});


// simulando erro 409
test('Should not save posts', async function () {
    const data = { title: generate(), content: generate() };
    const response1 = await request('http://localhost:3000/posts', 'post', data);
    const response2 = await request('http://localhost:3000/posts', 'post', data);
    
    expect(response2.status).toBe(409);
    
    const post = response1.data;

    await postsService.deletePost(post.id);
});


test('Should update a post', async function () {
    const post = await postsService.savePost({
        title: generate(),
        content: generate()
    });

    post.title = generate();
    post.content = generate();

    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    
    expect(response.status).toBe(204);

    const updatedPost = await postsService.getPost(post.id);

    expect(updatedPost.title).toBe(post.title);
    expect(updatedPost.content).toBe(post.content);

    await postsService.deletePost(post.id);
});


test('Should not update a post', async function () {
    const post = {
        id: 1
    };

    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    expect(response.status).toBe(404);
});


test('Should delete a post', async function () {
    const post = await postsService.savePost({
        title: generate(),
        content: generate()
    });

    const response = await request(`http://localhost:3000/posts/${post.id}`, 'delete', post);
    
    expect(response.status).toBe(204);

    const posts = await postsService.getPosts();

    expect(posts).toHaveLength(0);
});