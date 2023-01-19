'use strict';

module.exports = {
    responseFormatter: (data, message, status, statusCode, count) => {
        return {
            status: status,
            statusCode: statusCode,
            message: message,
            data: data,
            count: count
        }
    }
};