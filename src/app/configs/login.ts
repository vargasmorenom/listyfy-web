export const login = [
  {
    name: 'username',
    label: 'login.usuario',
    type: 'text',
    validations: [{ type: 'required' }, { type: 'minlength', value: 8 }],
  },
  {
    name: 'password',
    label: 'login.contrasena',
    type: 'password',
    validations: [{ type: 'required' }, { type: 'minlength', value: 8 }],
  },
];
