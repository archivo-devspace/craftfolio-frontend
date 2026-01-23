import { Layers, Palette, Settings } from 'lucide-react';

type TabType = 'sections' | 'theme' | 'settings';

interface SidebarTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  const tabs = [
    { id: 'sections' as TabType, label: 'Sections', icon: Layers },
    { id: 'theme' as TabType, label: 'Theme', icon: Palette },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex border-b border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary'
              : 'text-fog/60 hover:text-fog'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
