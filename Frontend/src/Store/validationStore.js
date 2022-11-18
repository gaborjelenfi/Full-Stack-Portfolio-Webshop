import create from 'zustand';
import validator from 'validator';
import { devtools, persist } from 'zustand/middleware';

const validationStore = (set, get) => ({
  isFormComplete: {},
  steps: {
    firstStep: 'firstStep',
    secondStep: 'secondStep',
    thirdStep: 'thirdStep',
  },
  isStepOpen: { firstStep: true },
  activateCheckoutStep: step => {
    set({ isStepOpen: {} });
    set({ isStepOpen: { [`${step}`]: true } });
  },
  setIsFormComplete: data => {
    set({
      isFormComplete: { ...get().isFormComplete, [`${data.key}`]: data.value },
    });
  },
  clearIsFormComplete: () => {
    set({ isFormComplete: {} });
  },
  validateIsEmpty: (...data) => {
    let hasInputError = {};
    data.forEach(value => {
      if (validator.isEmpty(value.data))
        hasInputError = {
          ...hasInputError,
          [`${value.inputKey}InputError`]: true,
        };
    });
    return hasInputError;
  },
  validateIsAlpha: (...data) => {
    let hasInputError = {};
    data.forEach(value => {
      if (!validator.isAlpha(value.data, 'en-US', { ignore: ' -' }))
        hasInputError = {
          ...hasInputError,
          [`${value.inputKey}InputError`]: true,
        };
    });
    return hasInputError;
  },
  validateIsInt: value => {
    if (!validator.isInt(value.data)) {
      return { [`${value.inputKey}InputError`]: true };
    }
  },
  validateIsFloat: data => {
    if (!validator.isFloat(data)) {
      return { priceInputError: true };
    }
  },
  validateIsMobilePhone: data => {
    if (!validator.isMobilePhone(data)) {
      return { telephoneInputError: true };
    }
  },
  validateIsEmail: data => {
    if (!validator.isEmail(data)) {
      return { emailInputError: true };
    }
  },
  validateIsAlphanumeric: data => {
    if (
      !validator.isAlphanumeric(data, 'en-US', {
        ignore: ' -',
      })
    ) {
      return { alphanumericInputError: true };
    }
  },
  validateIsLength: data => {
    if (!validator.isLength(data, { min: 6 })) {
      return { lengthInputError: true };
    }
  },
});

const useValidationStore = create(
  devtools(persist(validationStore, { name: 'validationStore' }))
);

export default useValidationStore;
