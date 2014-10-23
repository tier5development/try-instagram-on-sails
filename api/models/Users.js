/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
  	username:{
  		type: 'string',
  		required:true
  	},
  	instagram_id:{
  		type: 'string',
  		required:true
  	},
  	full_name:{
  		type: 'string',
  		required:false
  	},
  	profile_picture:{
  		type: 'string',
  		required:false
  	},
  	token:{
  		type: 'string',
  		required: true
  	}
  }
};

