import validator from 'validator';
import isEmpty from './isEmpty';

const validateOrderInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.name = !isEmpty(data.name) ? data.name : "";
    data.phone = !isEmpty(data.phone) ? data.phone: "";

    if (!validator.isEmail(data.email)) {
        errors.email = "Please enter a valid email";
    }
    
    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }

    if (validator.isEmpty(data.name)) {
        errors.name = "Name is required";
    }

    if (!validator.isMobilePhone(data.phone)) {
        errors.phone = "Please enter a valid phone number. Format: 1234567890"
    }

    if (validator.isEmpty(data.phone)) {
        errors.phone = "Phone is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

export default validateOrderInput