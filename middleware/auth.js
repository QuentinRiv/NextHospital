import pkg from 'jsonwebtoken';
const { verify } = pkg;
 
export function requireAuth(req, res, next) {

    const token = req.cookies.jwt;

    if (token) {
        verify(token, 'RANDOM_TOKEN_SECRET', (err, decodedToken) => {
            if (err) {
                console.log("\nErreur : " + err.message);
                res.redirect('/auth/connect');
            }
            else {
                console.log("Token décodé : ", decodedToken);
                req.user = decodedToken.userId;
                next();
            }
        } );
    }
    else {
        res.redirect('/auth/connect');
    }
   
}
