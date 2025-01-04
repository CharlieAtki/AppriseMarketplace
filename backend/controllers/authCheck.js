// This API is used to check whether the user has logged in. In other words, whether a session has been created
export const authCheck = async (req, res) => {

    // Setting headers for Safari
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);

    if (req.session.user) {
        return res.status(200).send({
            success: true,
            message: 'Authentication Successful!'
        });
    } else {
        return res.status(401).send({
            success: false,
            message: "No session present"
        });
    }
}