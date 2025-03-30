export type NavabarItem = {
  title: string;
  path: string;
  submenu?: boolean;
  subMenuItems?: NavabarItem[];
};

export type MenuItemWithSubMenuProps = {
  item: NavabarItem;
  toggleOpen: () => void;
};
