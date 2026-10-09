export const languageSettings = [
  {
    name: 'typePost',
    label: 'config.idioma',
    type: 'select',
    content: [
      { id: 'en', dato: 'English', icono: 'language-outline' },
      { id: 'es', dato: 'Español', icono: 'language-outline' },
    ],
    validations: [{ type: 'required' }],
  }
];
