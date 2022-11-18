module.exports = {
  noFound: msg => {
    const error = new Error(msg);
    error.code = 404;
    throw error;
  },
  invalidInput: errArray => {
    const error = new Error('Invalid input.');
    error.data = errArray;
    error.code = 422;
    throw error;
  },
  notAuthenticated: () => {
    const error = new Error('Not authenticated!');
    error.code = 401;
    throw error;
  },
  incorrectPasswordOrEmail: () => {
    const error = new Error('You have entered an invalid email or password.');
    error.code = 404;
    throw error;
  },
  accessDenied: () => {
    const error = new Error('Access Denied');
    error.code = 403;
    throw error;
  },
};
