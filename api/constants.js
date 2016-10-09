module.exports = {
    response : {
        dbError : {
            code : 999,
            message : "Internal database error"
        },
        nullValues : {
            code : 123,
            message : "Message length must be less than 160 chars, no empty values, hashtag must being with #, userID must begin"
                + "with _"
        },
        success : {
            code : 0,
            message : "Successful Execution"
        }
    }
};