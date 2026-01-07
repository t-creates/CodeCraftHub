exports.successResponse = (res, data, message = 'Success') => {
    res.status(200).json({ message, data });
};

exports.errorResponse = (res, error) => {
    res.status(400).json({ message: error.message || 'Error occurred' });
};