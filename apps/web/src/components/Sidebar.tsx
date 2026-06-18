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
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
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
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
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
      className={`bg-white border-r border-gray-200 overflow-y-auto transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <span className="font-bold text-gray-900 text-lg">HomeCare Soft</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100 text-gray-500"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={collapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
          </svg>
        </button>
      </div>
      <nav className="p-2 space-y-1">
        {navigation.map((item, i) => (
          <NavItemComponent key={i} item={item} />
        ))}
      </nav>
    </aside>
  )
}
