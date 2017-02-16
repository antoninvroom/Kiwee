'use strict';

/*
 * Custom ERROR codes
 * 190 : token facebook expiré ou non valide
 *
 */
// This module is used to return custom error messages
module.exports = function ErrorCode(status, message) {
  Error.captureStackTrace(this, this.constructor);

  // If no message has been sent
  if (typeof(message) == 'undefined') {
    switch (status) {
      case 404:
        message = 'Not Found';
        break;
      case 401:
        message = 'Unauthorized';
        break;
      default:
        message = 'Error';
    }
  }

  this.status = status;
  this.message = message;
};

require('util').inherits(module.exports, Error);
