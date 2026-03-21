export const postedEdit = [
  {
    name: 'name',
    label: 'Titulo',
    type: 'text',
    validations: [{ type: 'required' }, { type: 'pattern', value: /^[A-Za-z-ZñÑáéíóúÁÉÍÓÚ0-9\s]{2,100}$/ }],
  },
  {
    name: 'description',
    label: 'descripcion',
    type: 'textarea',
    validations: [{ type: 'required' }, { type: 'pattern', value: /^[A-Za-z-ZñÑáéíóúÁÉÍÓÚ0-9\s]{2,300}$/ }],
  },
  {
    name: 'typePost',
    label: 'Tipo de Contenido',
    type: 'select',
    content: [
      { id: '1', dato: 'Twitter-or-X', icono: 'logo-twitter' },
      { id: '2', dato: 'Facebook', icono: 'logo-facebook' },
      { id: '3', dato: 'Instagram', icono: 'logo-instagram' },
      { id: '4', dato: 'TikTok', icono: 'logo-tiktok' },
      { id: '5', dato: 'Youtube', icono: 'logo-youtube' },
    ],
    validations: [{ type: 'required' }],
  },
  { name: 'imagen', label: 'Imagen de perfil', type: 'file', validations: [{ type: 'required' }] },
  {
    name: 'tags',
    label: 'Tags',
    type: 'text',
    validations: [{ type: 'pattern', value: /^[A-Za-z-ZñÑáéíóúÁÉÍÓÚ0,@#-9\s]{2,300}$/ }],
  },
  {
    name: 'access',
    label: 'Nivel de Acceso',
    type: 'select',
    content: [
      { id: '1', dato: 'publico', icono: 'earth-outline' },
      { id: '2', dato: 'privado', icono: 'key-outline' },
    ],
    validations: [{ type: 'required' }],
  },
];
