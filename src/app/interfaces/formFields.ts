export interface FormField {
  name: string;
  label: string;
  explicacion?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'file' | 'custom' | 'radio' | 'array' | 'tag-input';
  content?: any[];
  htmlvalue?: string;
  htmlType?: any;
  link?: string;
  value: any;
  placeholder?: string;
  validations: any[];
}
