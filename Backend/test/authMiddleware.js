const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/auth');

describe('Auth middleware', function () {
  it('should throw an error if no authorization header is present', function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect( () => authMiddleware(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function (headerName) {
        return 'xyz';
      },
    };
    expect(() => new authMiddleware(this, req, {}, () => {})).to.throw();
  });

  it('should yield a customerId after decoding the token', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer djfkalsdjfaslfjdlas';
      },
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ customerId: 'abc' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('customerId');
    expect(req).to.have.property('customerId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('should throw an error if the token cannot be verified', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer xyz';
      },
    };
    expect(() => new authMiddleware(this, req, {}, () => {})).to.throw();
  });
});
