export interface MenuItem {
  name: string;
  url: string;
  icon?: string;
  image?: string;
  showWhen: 'logged' | 'guest' | 'always';
}
