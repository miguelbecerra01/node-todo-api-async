const expect = require('expect');
const request = require('supertest');

//desctructing ES6 feature
const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{ text: 'First Todo' }, { text: 'Second Todo' }];

//testing lifecycle, settup the database to be useful
beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
});

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

    describe('GET /todo', () => {

        it('Should get all todos', (done)=>{

            request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);

        });

    });


});