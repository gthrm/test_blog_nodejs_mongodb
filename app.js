const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

var database = 'blogdbtest';
var express = require( 'express');
var bodyParser = require('body-parser');
var app = express();
var posts;
app.use( bodyParser.urlencoded( {extended: true } ) );
app.use( bodyParser.json() );

// var posts = [
//     { title: "My 1 post", content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur reprehenderit perferendis iure accusantium ipsam totam inventore magnam odit deserunt, magni minus laudantium exercitationem corporis, ut animi nulla commodi dolore possimus?" },
//     { title: "My 2 post", content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur reprehenderit perferendis iure accusantium ipsam totam inventore magnam odit deserunt, magni minus laudantium exercitationem corporis, ut animi nulla commodi dolore possimus?" },
//     { title: "My 3 post", content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur reprehenderit perferendis iure accusantium ipsam totam inventore magnam odit deserunt, magni minus laudantium exercitationem corporis, ut animi nulla commodi dolore possimus?" },
// ];

app.get( "/", function (req, res ) {

    MongoClient.connect(url, function (err, client) {
        if (err) throw err;
      
        var db = client.db(database); //database
      
        db.collection('post').find().toArray( function( err, res ) {
          console.log('********************************************');
          console.log(res);
          posts = res;
          console.log('********************************************');
        } );
        client.close();
      });

    res.render( 'index.ejs', { posts: posts } ); //возможно сюда нужно получить данные из базы
});

app.get( "/post/:id", function ( req, res ) {
    var id = req.params.id;
    console.log('******** Вот тут **********');
    console.log(req.params.id);
    console.log('********')
    console.log(req.params);
    // console.log('********')
    // console.log(req);
    console.log('******** Вот тут **********');
    res.render( 'post.ejs', { post: posts[ id - 1 ] } );
});

app.get( '/user', function ( req, res ){
    
    res.render( 'user.ejs' );
});

app.post( '/user', function ( req, res ) {
    var username = req.body.username;
    var password = req.body.password;
    if ( username === "admin" && password === "admin" ) {
        res.render( 'write.ejs' );
        return false;
    } else {
        res.send( 'Invalid Password' );
    };

    
} );

// app.get( '/write', function ( req, res ){

//     res.render( 'write.ejs' );
// });

app.post( '/write', function ( req, res ) {

    var title = req.body.title;
    var content = req.body.content;
    // var img = req.body.img;

    MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        var db = client.db(database); //database

        var post = {title : title, content : content}; //, img : img

        db.collection('post').insertOne(post, function (err, rusult) {
            if (err) {
            console.log(err);
            return;
        }
            console.log('************************************')
            console.log('запись внесена');
            console.log(post);
            console.log('************************************')
            client.close();
            res.redirect( '/' );
        });

    });
    // var title = req.body.title;
    // var content = req.body.content;
    // var img = req.body.img;

    // var MongoClient = require('mongodb').MongoClient;
    // // var format = require('util').format;

    // var url = 'mongodb://localhost:27017/userCollectionDB';

    // MongoClient.connect(url, function ( err, db ) {
    //     if (err) {
    //         console.log(err);
    //         res.redirect( '/' );
    //         return;
    //     }
    //         var collection = db.collection('postss');
    //         var post = {title: title, content: content, img: img};

    //         collection.insertOne(post, function(err, result) {
    //             if (err) {
    //                 console.log(err);
    //                 res.redirect( '/' );
    //                 return;
    //             }
    //             console.log(result.ops);
    //             db.close();
    //             res.redirect( '/' );
    //         });
    // });

    // Без БД
    // var title = req.body.title;
    // var content = req.body.content;
    // var img = req.body.img;

    // posts.push( { title: title, content: content, img: img } );
    // res.redirect( '/' );
} );



app.listen( 3000, function() {
    console.log("Сервер включен на порту 3000");
});