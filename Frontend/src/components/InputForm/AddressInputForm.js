import React from 'react';

const AddressInputForm = ({
  touched,
  handleChange,
  addressData,
  hasInputError,
}) => {
  // error messages
  const onlyAlphaErrMsg = 'Please type only English alphabetic characters';
  const invalidEmailErrMsg = 'Please type a valid email address';
  const onlyNumbersErrMsg = 'Please enter a valid phone number';
  const invalidZipCodeErrMsg = `${onlyAlphaErrMsg} or numbers`;

  return (
    <>
      <div className="fieldset group-select">
        <ul>
          <li>
            <div className="customer-name">
              <div className="input-box name-firstname">
                <label htmlFor="firstname">
                  First Name<span className="required">*</span>
                </label>
                <div className="input-box1">
                  <input
                    onChange={handleChange}
                    value={addressData.firstName}
                    autoFocus
                    type="text"
                    id="firstname"
                    name="firstName"
                    title="First name"
                    placeholder="Enter your first name"
                    maxLength={255}
                    className="input-text required-entry"
                  />
                  {hasInputError.firstNameInputError && touched.firstName && (
                    <p className="required">{onlyAlphaErrMsg}</p>
                  )}
                </div>
              </div>
              <div className="input-box name-lastname">
                <label htmlFor="lastname">
                  Last Name<span className="required">*</span>
                </label>
                <div className="input-box1">
                  <input
                    onChange={handleChange}
                    value={addressData.lastName}
                    type="text"
                    id="lastname"
                    name="lastName"
                    title="Last name"
                    placeholder="Enter your last name"
                    maxLength={255}
                    className="input-text required-entry"
                  />
                  {hasInputError.lastNameInputError && touched.lastName && (
                    <p className="required">{onlyAlphaErrMsg}</p>
                  )}
                </div>
              </div>
            </div>
          </li>
          <li>
            <div>
              <label htmlFor="company">Company</label>
              <br />
              <input
                onChange={handleChange}
                value={addressData.company}
                type="text"
                name="company"
                title="Company"
                id="company"
                placeholder="Enter your company name"
                className="input-text "
              />
            </div>
          </li>
          <li>
            <div className="input-box">
              <label htmlFor="telephone">
                Telephone<em className="required">*</em>
              </label>
              <br />
              <input
                onChange={handleChange}
                value={addressData.telephone}
                type="text"
                name="telephone"
                title="Telephone"
                placeholder="Enter your phone number (only digits)"
                className="input-text   required-entry"
                id="telephone"
              />
              {hasInputError.telephoneInputError && touched.telephone && (
                <p className="required">{onlyNumbersErrMsg}</p>
              )}
            </div>
            <div className="input-box">
              <label htmlFor="email">
                Email<em className="required">*</em>
              </label>
              <br />
              <input
                onChange={handleChange}
                value={addressData.email}
                type="email"
                name="email"
                title="Email"
                placeholder="Enter your email address"
                className="input-text   required-entry"
                id="email"
              />
              {hasInputError.emailInputError && touched.email && (
                <p className="required">{invalidEmailErrMsg}</p>
              )}
            </div>
          </li>
        </ul>
      </div>
      <div className="fieldset group-select">
        <h2 className="legend">Address</h2>
        <ul>
          <li>
            <label htmlFor="street_1">
              Street Address<em className="required">*</em>
            </label>
            <br />
            <input
              onChange={handleChange}
              value={addressData.street}
              type="text"
              name="street"
              title="Street"
              placeholder="Enter your street name and house number"
              id="street_1"
              className="input-text  required-entry"
            />
            {hasInputError.streetInputError && touched.street && (
              <p className="required">{invalidEmailErrMsg}</p>
            )}
          </li>
          <li>
            <div className="field">
              <div className="input-box">
                <label htmlFor="city">
                  City<em className="required">*</em>
                </label>
                <br />
                <input
                  onChange={handleChange}
                  value={addressData.city}
                  type="text"
                  name="city"
                  title="City"
                  placeholder="Enter your city name"
                  className="input-text  required-entry"
                  id="city"
                />
                {hasInputError.cityInputError && touched.city && (
                  <p className="required">{onlyAlphaErrMsg}</p>
                )}
              </div>
            </div>
            <div className="field">
              <div className="input-box">
                <label htmlFor="region_id">State/Province</label>
                <br />
                <select
                  onChange={handleChange}
                  value={addressData.stateOrProvince}
                  id="region_id"
                  name="stateOrProvince"
                  titel="State or Province"
                  className="validate-select required-entry"
                >
                  <option value="">
                    Please select region, state or province
                  </option>
                  <option value="Alabama" title="Alabama">
                    Alabama
                  </option>
                  <option value="Alaska" title="Alaska">
                    Alaska
                  </option>
                  <option value="American Samoa" title="American Samoa">
                    American Samoa
                  </option>
                  <option value="Arizona" title="Arizona">
                    Arizona
                  </option>
                  <option value="Arkansas" title="Arkansas">
                    Arkansas
                  </option>
                  <option value="New Jersey" title="New Jersey">
                    New Jersey
                  </option>
                </select>
              </div>
            </div>
          </li>
          <li>
            <div className="field">
              <div className="input-box">
                <label htmlFor="zip">
                  Zip/Postal Code<em className="required">*</em>
                </label>
                <br />
                <input
                  onChange={handleChange}
                  value={addressData.zipCode}
                  type="text"
                  name="zipCode"
                  placeholder="Enter your zip/ postal code"
                  title="Zip/Postal Code"
                  id="zip"
                  className="input-text validate-zip-international  required-entry"
                />
                {hasInputError.alphanumericInputError && touched.zipCode && (
                  <p className="required">{invalidZipCodeErrMsg}</p>
                )}
              </div>
            </div>
            <div className="field">
              <div className="input-box">
                <label htmlFor="country">
                  Country<em className="required">*</em>
                </label>
                <br />
                <input
                  onChange={handleChange}
                  value={addressData.country}
                  type="text"
                  name="country"
                  title="Country"
                  placeholder="Enter your country name"
                  className="input-text  required-entry"
                  id="country"
                />
                {hasInputError.countryInputError && touched.country && (
                  <p className="required">{onlyAlphaErrMsg}</p>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
export default AddressInputForm;
