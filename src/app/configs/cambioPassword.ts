import { PASSWORD_PATTERN } from 'src/app/utils/password.utils';

export const cambioPassword = [
    {
    name: 'passwordActual',
    label: 'config.label_password_actual',
    type: 'password',
    validations: [
      { type: 'required' }
    ]
  },
  {
    name: 'password',
    label: 'config.label_password_nueva',
    type: 'password',
    validations: [
      { type: 'required' },
      { type: 'pattern', value: PASSWORD_PATTERN },
    ],
  },
  { name: 'confirmPassword', label: 'config.label_confirmar_password', type: 'password', validations: [{ type: 'required' }] },
];
