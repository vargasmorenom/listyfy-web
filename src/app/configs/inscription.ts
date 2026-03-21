import { environment } from 'src/environments/environment';

export const inscription = [
  {
    name: 'username',
    label: 'inscripcion.usuario',
    type: 'text',
    validations: [
      { type: 'required' },
      { type: 'minlength', value: 8 },
      { type: 'pattern', value: /^[a-zA-Z-0-9_]{8,25}$/ },
    ],
  },
  {
    name: 'email',
    label: 'inscripcion.correo',
    type: 'text',
    validations: [
      { type: 'required' },
      { type: 'pattern', value: /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/ },
    ],
  },
  {
    name: 'pais',
    label: 'inscripcion.pais',
    type: 'custom',
    htmlType: '(ionInput)="onSearchChange($event)"',
    validations: [{ type: 'required' }],
  },
  { name: 'telefono', label: 'inscripcion.telefono', type: 'text', validations: [{ type: 'required' }] },
  {
    name: 'password',
    label: 'inscripcion.contrasena',
    type: 'password',
    validations: [
      { type: 'required' },
      { type: 'pattern', value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^_/()&*-]).{8,}$/ },
    ],
  },
  { name: 'confirmPassword', label: 'inscripcion.confirmar', type: 'password', validations: [{ type: 'required' }] },
  {
    name: 'checkdatos',
    label: 'inscripcion.terminos',
    type: 'checkbox',
    content: [],
    link: environment.servicio[0].termsUrl,
    validations: [{ type: 'required' }],
  },
];
