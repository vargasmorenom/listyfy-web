import { PASSWORD_PATTERN } from 'src/app/utils/password.utils';

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
      { type: 'pattern', value: PASSWORD_PATTERN },
    ],
  },
  { name: 'confirmPassword', label: 'Confirmar Password', type: 'password', validations: [{ type: 'required' }] },
];
