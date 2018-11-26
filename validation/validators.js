const validators = {};

// Validates the input to create a new user
validators.validateRegisterUser = data => {
  const errors = {};
  let { name, username, email, password, confirm } = data;
  name = typeof name == 'string' && name.trim().length > 0 ? name : '';
  username =
    typeof username == 'string' && username.trim().length > 0 ? username : '';
  email =
    typeof email == 'string' &&
    email.trim().length > 0 &&
    email.indexOf('@') > -1
      ? email
      : '';
  password =
    typeof password == 'string' && password.trim().length > 5 ? password : '';
  confirm =
    typeof confirm == 'string' && confirm.trim().length > 5 ? confirm : '';

  if (name === '') {
    errors.name = 'Enter your name';
  }

  if (username === '') {
    errors.username = 'Enter your username';
  }

  if (email === '') {
    errors.email = 'Enter a valid email';
  }

  if (password === '') {
    errors.password = 'Enter your name';
  }

  if (confirm !== password) {
    errors.confirm = 'Passwords should match';
  }

  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true
  };
};

module.exports = validators;
