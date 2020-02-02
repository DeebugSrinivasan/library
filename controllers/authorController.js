var async = require('async');
var Book = require('../models/book');
var Author = require('../models/author');
var mongoose = require('mongoose');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
var debug = require('debug')('author');

exports.author_list = function(req, res, next) {
    Author.find().sort([['family_name', 'ascending']]).exec(function(err, list_authors) {
        if(err) {
            next(err);
        }
        res.render('author_list', {title: "Author list", author_list: list_authors,});
    });
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id)
              .exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id },'title summary')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { debug("Update error: " + err);
                    return next(err); } // Error in API usage.
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            debug("Author not found deepakh" + err);
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });

};

exports.author_create_get = function(req, res) {
    res.render('author_form', {title: "Create author"});
};
exports.author_create_post = [
    body('first_name').isLength({min: 1}).trim().withMessage('First name required').isAlphanumeric().withMessage('First name has non-alphanumeric charaters'),
    body('family_name').isLength({min: 1}).trim().withMessage('family name required').isAlphanumeric().withMessage("Should contain alphabets only"),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render('author_form', {title: "Create Author", author: req.body, errors:errors.array()});
            return;
        } else {
            var author = new Author ({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];
exports.author_delete_get = function(req, res, next) {
    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res, next) {
    async.parallel({
        author: function(callback) {
            Author.findById(req.body.aithorid).exec(callback)
        },
        author_books: function(callback) {
            Book.find({"author": req.body.authorid}).exec(callback)
        },
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.author_books.length > 0) {
            res.render('author_delete', {title: "Delete author", author: results.author, author_books:results.author_books});
            return;
        } else {
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if(err) {
                    return next(err);
                }
                res.redirect('/catalog/authors');
            })
        }
    }); 

};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};