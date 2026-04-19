import { useEffect, useMemo, useState } from 'react';

export interface ScrollspyProps {
  menuGroups: MenuGroup[];
  activeClassName: string;
  menuClassName?: string;
  menuGroupLabelClassName?: string;
  menuItemContainerClassName?: string;
  menuItemClassName?: string;
  offset?: number;
}

export interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

export interface MenuItem {
  label: string;
  targetId: string;
  items?: MenuItem[];
}

type SpyItemMap = Record<string, boolean>;

const flattenMenuItems = (menuGroups: MenuGroup[]) =>
  menuGroups.flatMap((group) =>
    group.items.flatMap((item) => [item, ...(item.items ?? [])])
  );

const initSpyItemsViewMap = (menuGroups: MenuGroup[]): SpyItemMap =>
  Object.fromEntries(flattenMenuItems(menuGroups).map((item) => [item.targetId, false]));

export const Scrollspy = ({
  menuGroups,
  menuClassName = 'menu',
  activeClassName = 'is-active',
  menuGroupLabelClassName = 'menu-label',
  menuItemContainerClassName = 'menu-list',
  menuItemClassName = '',
  offset = -20,
}: ScrollspyProps) => {
  const [spyItemsViewMap, setSpyItemsViewMap] = useState<SpyItemMap>(() => initSpyItemsViewMap(menuGroups));
  const flattenedItems = useMemo(() => flattenMenuItems(menuGroups), [menuGroups]);

  useEffect(() => {
    setSpyItemsViewMap(initSpyItemsViewMap(menuGroups));
  }, [menuGroups]);

  useEffect(() => {
    const isInView = (targetId: string) => {
      const element = document.getElementById(targetId);
      if (!element) {
        return false;
      }
      const rect = element.getBoundingClientRect();
      return rect.bottom >= 0 - offset;
    };

    const spy = () => {
      let firstItemFound = false;
      const nextSpyItemsViewMap: SpyItemMap = {};

      flattenedItems.forEach((item) => {
        nextSpyItemsViewMap[item.targetId] = firstItemFound ? false : isInView(item.targetId);
        if (nextSpyItemsViewMap[item.targetId]) {
          firstItemFound = true;
        }
      });

      setSpyItemsViewMap(nextSpyItemsViewMap);
    };

    spy();
    window.addEventListener('scroll', spy);
    return () => {
      window.removeEventListener('scroll', spy);
    };
  }, [flattenedItems, offset]);

  const renderMenuItemLink = (item: MenuItem) => (
    <a className={spyItemsViewMap[item.targetId] ? activeClassName : ''} href={`#${item.targetId}`}>
      {item.label}
    </a>
  );

  return (
    <aside className={menuClassName}>
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.label ? <p className={menuGroupLabelClassName || undefined}>{group.label}</p> : null}
          <ul className={menuItemContainerClassName || undefined}>
            {group.items.map((item, itemIndex) => (
              <li key={itemIndex} className={menuItemClassName || undefined}>
                {renderMenuItemLink(item)}
                {item.items ? (
                  <ul className={menuItemContainerClassName || undefined}>
                    {item.items.map((subitem, subIndex) => (
                      <li key={subIndex} className={menuItemClassName || undefined}>
                        {renderMenuItemLink(subitem)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};
