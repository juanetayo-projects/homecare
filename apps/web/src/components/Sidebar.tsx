import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation, type NavItem } from '../lib/navigation'

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.path
    ? location.pathname === item.path
    : false

  if (hasChildren) {
    const isActiveGroup = item.children?.some(
      (c) => c.path && location.pathname.startsWith(c.path)
    )

    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
            isActiveGroup
              ? 'bg-[#16468E] text-white font-medium'
              : 'text-blue-200 hover:bg-[#16468E] hover:text-white'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span>{item.label}</span>
          <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child, i) => (
              <NavItemComponent key={i} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.path || '#'}
      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
        isActive
          ? 'bg-[#16468E] text-white font-medium'
          : 'text-blue-200 hover:bg-[#16468E] hover:text-white'
      }`}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      {item.label}
    </Link>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`bg-[#0D2D6B] overflow-y-auto transition-all duration-200 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-[#16468E]">
        {!collapsed && (
          <div className="flex flex-col items-center gap-1">
            <img src="/homecare/images/logo_cacsb_blanc.png" alt="HomeCare Soft" className="h-12" />
            <span className="font-bold text-white text-sm">HomeCare Soft</span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <img src="/homecare/images/logo_cacsb_blanc.png" alt="HomeCare Soft" className="h-8" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 mx-auto block p-1 rounded hover:bg-[#16468E] text-blue-200 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={collapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
          </svg>
        </button>
      </div>
      <nav className="p-2 space-y-1 flex-1">
        {navigation.map((item, i) => (
          <NavItemComponent key={i} item={item} />
        ))}
      </nav>
    </aside>
  )
}
