import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation, type NavItem } from '../lib/navigation'

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const [open, setOpen] = useState(depth === 0)
  const location = useLocation()
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.path ? location.pathname === item.path : false

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
              : 'text-blue-200 hover:bg-[#16468E]/70 hover:text-white'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className="truncate">{item.label}</span>
          <svg
            className={`w-3 h-3 shrink-0 transition-transform ml-2 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="mt-0.5 space-y-0.5">
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
          ? 'bg-[#16468E] text-white font-medium shadow-sm'
          : 'text-blue-200 hover:bg-[#16468E]/70 hover:text-white'
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
      className={`bg-[#0D2D6B] overflow-y-auto transition-all duration-200 flex flex-col shadow-lg shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-[#16468E]">
        {!collapsed && (
          <div className="flex flex-col items-center gap-1.5">
            <img src="/homecare/images/logo_cacsb_blanc.png" alt="HomeCare Soft" className="h-10" />
            <span className="font-bold text-white text-xs tracking-wide">HomeCare Soft</span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <img src="/homecare/images/logo_cacsb_blanc.png" alt="HomeCare Soft" className="h-8" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 mx-auto block p-1.5 rounded hover:bg-[#16468E] text-blue-300 hover:text-white transition-colors"
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={collapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
          </svg>
        </button>
      </div>
      <nav className="p-2 space-y-0.5 flex-1 overflow-y-auto scrollbar-thin">
        {navigation.map((item, i) => (
          <NavItemComponent key={i} item={item} />
        ))}
      </nav>
      <div className="p-3 border-t border-[#16468E] text-center">
        <p className="text-[10px] text-blue-400 font-light">v1.0.0</p>
      </div>
    </aside>
  )
}
