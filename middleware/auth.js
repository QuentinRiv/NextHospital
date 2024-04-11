const jwt = require('jsonwebtoken');
 
exports.requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;
    console.log("\nToken = " + token);

    if (token) {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decodedToken) => {
            if (err) {
                console.log("\nErreur : " + err.message);
                res.redirect('/auth/connect');
            }
            else {
                console.log(decodedToken);
                next();
            }
        } );
    }
    else {
        res.redirect('/auth/connect');
    }
   
};
