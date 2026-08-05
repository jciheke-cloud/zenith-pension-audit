import re

with open('src/components/Sidebar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

btn_search = """background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '24px',
            height: '24px',"""
btn_replace = """background: 'var(--bg-card)',
            border: '1.5px solid var(--accent-primary)',
            color: 'white',
            width: '28px',
            height: '28px',
            boxShadow: '0 0 10px rgba(200, 30, 30, 0.4)',"""
content = content.replace(btn_search, btn_replace)

content = content.replace("right: isSidebarCollapsed ? '10px' : '-12px',", "right: isSidebarCollapsed ? '10px' : '-14px',")

with open('src/components/Sidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Audit Sidebar.jsx")
