export const posted = [
  {
    name: 'name',
    label: 'newlist.titulo',
    type: 'text',
    validations: [{ type: 'required' }, { type: 'pattern', value: /^[A-Za-z-ZñÑáéíóúÁÉÍÓÚ0-9\s]{2,100}$/ }],
  },
  {
    name: 'description',
    label: 'newlist.descripcion',
    type: 'textarea',
    validations: [{ type: 'required' }, { type: 'maxlength', value: 600 }],
  },
  {
    name: 'typePost',
    label: 'newlist.tipo',
    type: 'radio',
    content: [
      { id: '1', dato: 'Twitter-or-X', icono: 'logo-twitter' },
      { id: '2', dato: 'Facebook', icono: 'logo-facebook' },
      { id: '3', dato: 'Instagram', icono: 'logo-instagram' },
      { id: '4', dato: 'TikTok', icono: 'logo-tiktok' },
      { id: '5', dato: 'Youtube', icono: 'logo-youtube' },
    ],
    validations: [{ type: 'required' }],
  },
  {
    name: 'imagen',
    label: 'newlist.imagen',
    type: 'file',
    validations: [{ type: 'required' }],
  },
  {
    name: 'tags',
    label: 'newlist.tags',
    type: 'text',
    validations: [{ type: 'pattern', value: /^[A-Za-z-ZñÑáéíóúÁÉÍÓÚ0,@#-9\s]{2,300}$/ }],
  },
  {
    name: 'access',
    label: 'newlist.acceso',
    type: 'radio',
    content: [
      { id: '1', dato: 'newlist.publico', icono: 'earth-outline' },
      { id: '2', dato: 'newlist.privado', icono: 'key-outline' },
    ],
    validations: [{ type: 'required' }],
  },
];
