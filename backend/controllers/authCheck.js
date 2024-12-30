// This API is used to check whether the user has logged in. In other words, whether a session has been created
export const authCheck = async (req, res) => {
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