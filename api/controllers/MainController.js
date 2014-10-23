/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var instagram 	= require('instagram-node').instagram();
var Instagram 	= require('instagram-node-lib');


instagram.use({
  client_id: sails.config.instagram.client_id,
  client_secret: sails.config.instagram.client_secret
});

Instagram.set('client_id', 'sails.config.instagram.client_id');
Instagram.set('client_secret', 'sails.config.instagram.client_secret');

function sendMessage(url) {
  console.log(url);
  sails.sockets.emit('show', { show: url });
}

module.exports = {
	login: function(req,res){
		res.redirect(instagram.get_authorization_url(sails.config.instagram.redirect_url, { scope: ['likes'], state: 'a state' }));
	},
	callback: function (req, res) {
          instagram.authorize_user(req.query.code, sails.config.instagram.redirect_url, function(err, result) {
		    if (err) {
		      console.log(err.body);
		      res.send("Didn't work");
		    } else {
		      	Users.findOneByUsername(result.user.username).exec(function(err, usr){
		            if (err) {
		                res.send(500, { error: "DB Error" });
		            } else if (usr) {
		                req.session.user = usr;
		                res.redirect('/dashboard');
		            } else {
		                Users.create({
		                	username 		: result.user.username,
		                	instagram_id	: result.user.id,
		                	full_name		: result.user.full_name,
		                	profile_picture	: result.user.profile_picture,
		                	token 			: result.access_token
		                }).exec(function(error, user) {
			                if (error) {
			                    res.send(500, {error: error});
			                } else {
			                    req.session.user = user;
			                    res.redirect('/dashboard');
			                }
			            });
		        	}
		    	});
		    }

		  });
    },
    appo:function(req,res){
    	res.send(sails);
    },
	subscriber: function(req,res){
		instagram.subscriptions(function(err, subscriptions, remaining, limit){
		  res.json(subscriptions);
		});
	},
	handshake:function(req,res){
		Instagram.subscriptions.handshake(req, res);
		res.end();
	},
	tag:function(req,res){
		instagram.use({
		  client_id: sails.config.instagram.client_id,
		  client_secret: sails.config.instagram.client_secret
		});
		instagram.add_tag_subscription(req.query.tag, 'https://instajegu.ngrok.com/tagging',{
  			verify_token: 'TAG_SUB'
		},
		function(err, result) {
  			console.log({err:err, res:result});
  			/*if(result){
  				res.json(result);
  				result.forEach(function(tag) {
			      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+sails.config.instagram.client_id;
			      sendMessage(url);

			    });
			    res.end();
  			}*/
		});
	},
	tagging:function(req,res){
		var data = req.body;
		console.log(data);

		if(req.method == "GET"){
			Instagram.subscriptions.handshake(req, res);
			res.end();
		}
		// Grab the hashtag "tag.object_id"
	    // concatenate to the url and send as a argument to the client side
		if(req.method == "POST"){
			data.forEach(function(tag) {
		      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+sails.config.instagram.client_id;
		      sendMessage(url);

		    });
		    res.end();
		}
	},
	cobareq:function(req,res){
		console.log(req);
		res.json(req.query.tag);
	}

};