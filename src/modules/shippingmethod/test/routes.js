'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Shippingmethod = mongoose.model('Shippingmethod');

var credentials,
    token,
    mockup;

describe('Shippingmethod CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            title: "Flat rate",
            description: "Lets you charge a fixed rate for shipping."
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Shippingmethod get use token', (done)=>{
        request(app)
        .get('/api/shippingmethods')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            var resp = res.body;
            done();
        });
    });

    it('should be Shippingmethod get by id', function (done) {

        request(app)
            .post('/api/shippingmethods')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/shippingmethods/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.title, mockup.title);
                        assert.equal(resp.data.description, mockup.description);
                        done();
                    });
            });

    });

    it('should be Shippingmethod post use token', (done)=>{
        request(app)
            .post('/api/shippingmethods')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.title, mockup.title);
                assert.equal(resp.data.description, mockup.description);
                done();
            });
    });

    it('should be shippingmethod put use token', function (done) {

        request(app)
            .post('/api/shippingmethods')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    title: "Flat rate",
                    description: "Lets you charge a fixed rate for shipping."
                }
                request(app)
                    .put('/api/shippingmethods/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.title, update.title);
                        assert.equal(resp.data.description, update.description);
                        done();
                    });
            });

    });

    it('should be shippingmethod delete use token', function (done) {

        request(app)
            .post('/api/shippingmethods')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/shippingmethods/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be shippingmethod get not use token', (done)=>{
        request(app)
        .get('/api/shippingmethods')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    it('should be shippingmethod post not use token', function (done) {

        request(app)
            .post('/api/shippingmethods')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be shippingmethod put not use token', function (done) {

        request(app)
            .post('/api/shippingmethods')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/shippingmethods/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be shippingmethod delete not use token', function (done) {

        request(app)
            .post('/api/shippingmethods')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/shippingmethods/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Shippingmethod.remove().exec(done);
    });

});