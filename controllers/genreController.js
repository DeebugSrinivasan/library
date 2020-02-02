var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var validator = require('express-validator');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre.find().exec(function(err, list_genre) {
        if(err) {
            return next(err);
        }
        res.render('genre_list', {title: 'Genre list', genre_list: list_genre});
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({genre: req.params.id}).exec(callback);
        }
    }, function(err, results) {
        if(err) {
            return next(err);
        }
        if(results.genre == null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_details', {title: 'Genre Details', genre: results.genre, genre_books: results.genre_books});
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.render('genre_form', {title: "Create Genre"});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    validator.body('name', "Genre name required*").isLength({min: 1}).trim(),
    validator.sanitizeBody('name').escape(),
    (req, res, next) => {
        const errors = validator.validationResult(req);
        var genre = new Genre(
            {name: req.body.name}
        );
        if(!errors.isEmpty()) {
            res.render('genre_form', {title: "Create Genre", genre: genre, errors: errors.array()});
            return;
        } else {
            Genre.findOne({name: req.body.name}).exec(function(err, foundGenre) {
                if(err) {
                    return next(err);
                }
                if(foundGenre) {
                    res.redirect(foundGenre.url);
                } else {
                    genre.save(function(err) {
                        if(err) {
                            return next(err);
                        }
                        res.redirect(genre.url);
                    }); 
                }
            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};