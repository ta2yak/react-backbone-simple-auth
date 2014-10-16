module.exports = function(app, db, _, bcrypt) {

	app.get('/ping', function(req, res) {
		res.send(JSON.stringify({ status: "OK"  }));
	});

	app.get('/auth', function(req, res) {

		res.setHeader('Content-Type', 'application/json');
		db.get("SELECT * FROM users WHERE id = ? AND auth_token = ?", [ req.signedCookies.user_id, req.signedCookies.auth_token ], function(err, user){
	        if(user){
				res.send(JSON.stringify({ user: _.omit(user, ['password', 'auth_token']) }));
	        } else {  
				res.status("403");
				res.send(JSON.stringify({ error: "Client has no valid login cookies."  }));
	        }
	    });

	});

	app.post('/auth/login', function(req, res) {
		res.setHeader('Content-Type', 'application/json');

	    db.get("SELECT * FROM users WHERE username = ?", [ req.body.username ], function(err, user){
	        if(user){

	            if( bcrypt.compareSync( req.body.password, user.password)){
	                res.cookie('user_id', user.id, { signed: true, maxAge: (1000 * 60 * 60 * 24 * 365)  });
	                res.cookie('auth_token', user.auth_token, { signed: true, maxAge: (1000 * 60 * 60 * 24 * 365)  });

	                res.send(JSON.stringify({ user: _.omit(user, ['password', 'auth_token']) }));   

	            } else {
					res.status("403");
	                res.send(JSON.stringify({ error: "Invalid username or password."  }));   
	            }
	        } else {
				res.status("403");
	            res.send(JSON.stringify({ error: "Username does not exist."  }));   
	        }
	    });
	});

	app.post("/auth/signup", function(req, res){
	    db.serialize(function(){
	        db.run("INSERT INTO users(username, name, password, auth_token) VALUES (?, ?, ?, ?)", 
	                [ req.body.username, req.body.name, bcrypt.hashSync(req.body.password, 8), bcrypt.genSaltSync(8) ], function(err, rows){
	            if(err){
					res.status("403");
	                res.send(JSON.stringify({ error: "Username has been taken.", field: "username" })); 
	            } else {

	                // Retrieve the inserted user data
	                db.get("SELECT * FROM users WHERE username = ?", [ req.body.username ], function(err, user){
	                    if(!user) {
	                        console.log(err, rows);
							res.status("403");
	                        res.send(JSON.stringify({ error: "Error while trying to register user." })); 
	                    } else {

	                        // Set the user cookies and return the cleansed user data
	                        res.cookie('user_id', user.id, { signed: true, maxAge: (1000 * 60 * 60 * 24 * 365)  });
	                        res.cookie('auth_token', user.auth_token, { signed: true, maxAge: (1000 * 60 * 60 * 24 * 365)  });
	                        res.send(JSON.stringify({ user: _.omit(user, ['password', 'auth_token']) }));   
	                    }
	                });
	            }
	        });
	    });
	});

	app.post('/auth/logout', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
	    res.clearCookie('user_id');
	    res.clearCookie('auth_token');
	    res.send(JSON.stringify({ success: "User successfully logged out." }));
	});

};