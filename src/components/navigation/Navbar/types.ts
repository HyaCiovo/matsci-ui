export interface NavbarItem {
  className?: string;
  label?: string;
  href?: string;
  target?: string;
  icon?: string;
  image?: string;
  isDivider?: boolean;
  isMenuLabel?: boolean;
  items?: NavbarItem[];
  isArrowless?: boolean;
  isRight?: boolean;
  isActiveOnClick?: boolean;
  isModal?: boolean;
  id?: string;
  header?: string;
  content?: string;
}
