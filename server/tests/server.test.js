const expect = require('expect');
const request = require('supertest');

//desctructing ES6 feature

const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

//testing lifecycle, settup the database to be useful
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create a new Todo', (done) => {

        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                //find in mongodb if the todo exists
                Todo.find({ text }).then((todos) => {
                    //  console.log(todos);
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                });
            })

    });

    it('shoudl not create todo with invalid body data', (done) => {
        var textEmpty = '';

        request(app)
            .post('/todos')
            .send(textEmpty)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    //  console.log(todos);
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    describe('GET /todos', () => {

        it('Should get all todos', (done) => {

            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);

        });

    });

    describe('GET /todos/:id', () => {
        it('Should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('Should return 404 if todo not found', (done) => {
            request(app)
                .get(`/todos/${new ObjectID().toHexString()}`)
                .expect(404)
                .end(done);
        });

        it('Should return 400 if Todo ID is not valid', (done) => {
            request(app)
                .get('/todos/123')
                .expect(404)
                .expect((res) => {
                    // console.log(res.text);
                    expect(res.text).toBe('ID Not Valid');
                })
                .end(done);
        });


    });


    describe('DELETE /todos/:id', () => {

        it('should remove a todo', (done) => {

            var id = todos[1]._id.toHexString();

            request(app)
                .delete(`/todos/${id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(id);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(id).then((todo) => {
                        expect(todo).toNotExist;
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                });

        });

        it('should return 404 if todo not found', (done) => {
            var id = new ObjectID().toHexString();

            request(app)
                .delete(`/todos/${id}`)
                .expect(404)
                .end(done);

        });

        it('should return 404 if object id is invalid', (done) => {
            request(app)
                .delete('/todos/123asd')
                .expect(404)
                .end(done);
        });

    });

    describe('PATCH /todos/:id', () => {

        it('should update the todo', (done) => {
            var id = todos[0]._id.toHexString();
            todos[0].text = 'New task';
            todos[0].completed = true;


            request(app)
                .patch(`/todos/${id}`)
                .send(todos[0])
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(typeof res.body.todo.completedAt).toBe('number');
                })
                .end(done);

        });

        it('should clear completedAt when todo is not completed', (done) => {

            todos[0].completed = false;

            request(app)
                .patch(`/todos/${todos[0]._id}`)
                .send(todos[0])
                .expect(200)
                .expect((res) => {
                    // console.log(res.body);
                    expect(res.body.todo.completedAt).toNotExist
                })
                .end(done);
        });
    });

    describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                }).end(done)
        });

        it('should return 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                }).end(done);
        });
    });

    describe('POST /users', () => {


        it('should create a user', (done) => {
            var newUser = {
                email: 'email@email.com',
                password: 'asdxcv'
            };

            request(app)
                .post('/users')
                .send(newUser)
                .expect(200)
                .expect((res) => {
                    expect(res.header['x-auth']).toExist;
                    expect(res.body._id).toExist;
                    expect(res.body.email).toExist;
                })
                .end((err) => {
                    if (err) {
                        return done(err);
                    }

                    User.findOne({ email: newUser.email }).then((user) => {
                        expect(user).toExist;
                        expect(user.password).not.toBe(newUser.password);
                        done();
                    });
                });

        });

        it('should return validation errors if request is invalid', (done) => {
            var newUser = {
                email: 'email@emailcom',
                password: 'asd'
            };

            request(app)
                .post('/users')
                .send(newUser)
                .expect(400)
                 .expect((res)=>{
                    expect(res.body.errors.email).toExist;
                    expect(res.body.errors.password).toExist;
                 })              
                .end(done);
        });

        it('should not create user if email is in use', (done) => {
            var newUser = {
                email: users[0].email,
                password: 'asd123123'
            };

            request(app)
                .post('/users')
                .send(newUser)
                .expect(400)
                .expect((res)=>{
                    expect(res.body.code).toBe(11000); //E11000 duplicate key error collection
                })
                .end(done);
        });

    });

});