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

type SpyRect = {
  top: number;
  bottom: number;
};

type ParentMap = Record<string, string | undefined>;

const flattenMenuItems = (menuGroups: MenuGroup[]) =>
  menuGroups.flatMap((group) =>
    group.items.flatMap((item) => [item, ...(item.items ?? [])])
  );

const initSpyItemsViewMap = (menuGroups: MenuGroup[]): SpyItemMap =>
  Object.fromEntries(flattenMenuItems(menuGroups).map((item) => [item.targetId, false]));

const buildParentMap = (menuGroups: MenuGroup[]) => {
  const parentMap: ParentMap = {};

  const walk = (items: MenuItem[], parentTargetId?: string) => {
    items.forEach((item) => {
      parentMap[item.targetId] = parentTargetId;
      if (item.items?.length) {
        walk(item.items, item.targetId);
      }
    });
  };

  menuGroups.forEach((group) => walk(group.items));
  return parentMap;
};

export const Scrollspy = ({
  menuGroups,
  menuClassName = 'ms-menu',
  activeClassName = 'ms-is-active',
  menuGroupLabelClassName = 'ms-menu-label',
  menuItemContainerClassName = 'ms-menu-list',
  menuItemClassName = '',
  offset = -20,
}: ScrollspyProps) => {
  const [spyItemsViewMap, setSpyItemsViewMap] = useState<SpyItemMap>(() => initSpyItemsViewMap(menuGroups));
  const flattenedItems = useMemo(() => flattenMenuItems(menuGroups), [menuGroups]);
  const parentMap = useMemo(() => buildParentMap(menuGroups), [menuGroups]);

  useEffect(() => {
    setSpyItemsViewMap(initSpyItemsViewMap(menuGroups));
  }, [menuGroups]);

  useEffect(() => {
    const getRect = (targetId: string): SpyRect | undefined => {
      const element = document.getElementById(targetId);
      if (!element) {
        return undefined;
      }
      return element.getBoundingClientRect();
    };

    const spy = () => {
      const threshold = 0 - offset;
      let activeTargetId = flattenedItems[0]?.targetId;

      flattenedItems.forEach((item) => {
        const rect = getRect(item.targetId);
        if (rect && rect.top <= threshold) {
          activeTargetId = item.targetId;
        }
      });

      if (!activeTargetId) {
        return;
      }

      const activeRect = getRect(activeTargetId);
      if (!activeRect || activeRect.bottom < threshold) {
        const firstVisibleItem = flattenedItems.find((item) => {
          const rect = getRect(item.targetId);
          return rect ? rect.bottom >= threshold : false;
        }
        );
        activeTargetId = firstVisibleItem?.targetId ?? activeTargetId;
      }

      const activeTargetIds = new Set<string>();
      let currentTargetId: string | undefined = activeTargetId;

      while (currentTargetId) {
        activeTargetIds.add(currentTargetId);
        currentTargetId = parentMap[currentTargetId];
      }

      const nextSpyItemsViewMap: SpyItemMap = {};
      flattenedItems.forEach((item) => {
        nextSpyItemsViewMap[item.targetId] = activeTargetIds.has(item.targetId);
      });

      setSpyItemsViewMap(nextSpyItemsViewMap);
    };

    spy();
    window.addEventListener('scroll', spy);
    window.addEventListener('resize', spy);
    return () => {
      window.removeEventListener('scroll', spy);
      window.removeEventListener('resize', spy);
    };
  }, [flattenedItems, offset, parentMap]);

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
