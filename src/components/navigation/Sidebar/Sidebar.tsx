import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { AiOutlineFund, AiOutlineSetting } from 'react-icons/ai';

export interface SidebarProps {
  width?: number;
  height?: number;
  onAppSelected: (appId: string) => void;
  currentApp: string;
  layout: 'horizontal' | 'vertical';
}

interface SidebarApp {
  id: string;
  name: string;
  icon?: string;
  svg?: React.ReactNode;
  subApps?: SidebarApp[];
  parentId?: string | null;
}

const MAIN_APPS: SidebarApp[] = [
  {
    id: 'explore',
    icon: 'icon-fontastic-search',
    name: 'Explore',
    subApps: [
      { id: 'mat-explore', name: 'Materials Explorer', icon: 'icon-fontastic-search' },
      { id: 'mol-explore', icon: 'icon-fontastic-phase-diagram', name: 'Molecule Explorer' },
      { id: 'porus-explore', icon: 'icon-fontastic-nanoporous', name: 'Nanoporous Explorer' },
      {
        id: 'battery-explore',
        icon: 'icon-fontastic-battery',
        name: 'Battery Explorer',
        svg: <AiOutlineSetting />,
      },
    ],
  },
  {
    id: 'analzye',
    name: 'Analyze',
    svg: <AiOutlineFund />,
    subApps: [
      { id: 'phase-diagram', icon: 'icon-fontastic-phase-diagram', name: 'Phase Diagram' },
      { id: 'pourbaix-diagram', icon: 'icon-fontastic-pourbaix-diagram', name: 'Pourbaix Diagram' },
      { id: 'reaction-calc', icon: 'icon-fontastic-reaction', name: 'Reaction Calculator' },
    ],
  },
  {
    id: 'char',
    icon: 'icon-fontastic-xas',
    name: 'Characterize',
    subApps: [{ name: 'XAS Matcher', id: 'xas', icon: 'icon-fontastic-xas' }],
  },
  {
    id: 'design',
    icon: 'icon-fontastic-toolkit',
    name: 'Design',
    subApps: [
      { id: 'crystal', icon: 'icon-fontastic-toolkit', name: 'Crystal toolkit' },
      {
        id: 'Structure Predictor',
        icon: 'icon-fontastic-struct-predictor',
        name: 'Structure Predictor',
      },
    ],
  },
  { id: 'apply', name: 'Apply', svg: <AiOutlineSetting />, subApps: [] },
];

const buildAppDictionary = (apps: SidebarApp[], parentId: string | null = null, acc: Record<string, SidebarApp> = {}) => {
  apps.forEach((app) => {
    acc[app.id] = { ...app, parentId };
    if (app.subApps) {
      buildAppDictionary(app.subApps, app.id, acc);
    }
  });
  return acc;
};

const APP_DICO = buildAppDictionary(MAIN_APPS);

const SidebarItem = ({
  app,
  currentAppId,
}: {
  app: SidebarApp;
  currentAppId: string;
}) => {
  let renderedIcon = app.icon;
  let renderedSvg = app.svg;
  let subApp: string | null = null;
  const selectedParentAppId = currentAppId ? APP_DICO[currentAppId]?.parentId : '';

  if (currentAppId && selectedParentAppId === app.id) {
    renderedIcon = APP_DICO[currentAppId]?.icon;
    renderedSvg = APP_DICO[currentAppId]?.svg;
    subApp = APP_DICO[currentAppId]?.name ?? null;
  }

  return (
    <span className={clsx('ms-sidebar-menu-item', { 'ms-selected': selectedParentAppId === app.id })}>
      {renderedIcon ? (
        <span className={clsx('ms-sidebar-item ms-icon', renderedIcon)} />
      ) : (
        <span className="ms-sidebar-item">{renderedSvg}</span>
      )}
      <span>{app.name}</span>
      {subApp ? <span className="ms-sub-app">{subApp}</span> : null}
    </span>
  );
};

export const Sidebar = ({ width, currentApp, onAppSelected, layout, height }: SidebarProps) => {
  const [currentAppId, setCurrentAppId] = useState('');
  const [openAppId, setOpenAppId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentAppId(currentApp || '');
  }, [currentApp]);

  const activeSubApps = useMemo(() => (openAppId ? APP_DICO[openAppId]?.subApps ?? [] : []), [openAppId]);

  const setApp = (id: string) => {
    const app = APP_DICO[id];
    if (!app) {
      return;
    }

    setCurrentAppId(app.id);
    setOpenAppId(null);
    onAppSelected(app.id);
  };

  return (
    <div
      className={clsx('ms-sidebar', layout)}
      style={layout === 'vertical' ? { width } : { height }}
      onMouseLeave={() => setOpenAppId(null)}
    >
      <div className="ms-content">
        {MAIN_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            className="ms-is-unstyled"
            data-testid={`sidebar-app-${app.id}`}
            onMouseEnter={() => setOpenAppId(app.id)}
            onFocus={() => setOpenAppId(app.id)}
          >
            <SidebarItem app={app} currentAppId={currentAppId} />
          </button>
        ))}
      </div>

      {openAppId && activeSubApps.length ? (
        <div data-testid="sidebar-popover" className={clsx('ms-sidebar-popover', layout)}>
          {activeSubApps.map((app) => (
            <button
              key={app.id}
              type="button"
              className={clsx('ms-sidebar-menu-item', { 'ms-selected': currentAppId === app.id })}
              onClick={() => setApp(app.id)}
            >
              {app.icon ? (
                <span className={clsx('ms-sidebar-item ms-icon', app.icon)} />
              ) : (
                <span className="ms-sidebar-item">{app.svg}</span>
              )}
              <span>{app.name}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
