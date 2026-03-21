export const cambioPassword = [
    {
    name: 'passwordActual',
    label: 'Password Actual',
    type: 'password',
    validations: [
      { type: 'required' }
    ]
  },
  {
    name: 'password',
    label: 'Nuevo Password',
    type: 'password',
    validations: [
      { type: 'required' },
      { type: 'pattern', value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/ },
    ],
  },
  { name: 'confirmPassword', label: 'Confirmar Password', type: 'password', validations: [{ type: 'required' }] },
];
