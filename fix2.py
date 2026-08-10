import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Profile Image URL
content = content.replace(
    'const profileImgUrl = "WhatsApp Image 2026-08-05 at 18.49.57.jpeg";',
    'const profileImgUrl = "/profile.png";'
)

# 2. Update Download Resume button 1 (around line 388)
content = re.sub(
    r'<button\s*onClick=\{\(\) => setShowResumeModal\(true\)\}\s*onMouseEnter=\{\(\) => setCursorHovered\(true\)\}\s*onMouseLeave=\{\(\) => setCursorHovered\(false\)\}\s*className="px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-blue-500/40 font-semibold shadow-\[0_0_15px_rgba\(34,211,238,0\.2\)\] transform hover:-translate-y-1 transition-all flex items-center gap-2 backdrop-blur-md"\s*>\s*<Download className="w-5 h-5" />\s*<span>Download Resume</span>\s*</button>',
    r'<a href="/resume.pdf" download="Rohith_William_G_Resume.pdf" onMouseEnter={() => setCursorHovered(true)} onMouseLeave={() => setCursorHovered(false)} className="px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-blue-500/40 font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)] transform hover:-translate-y-1 transition-all flex items-center gap-2 backdrop-blur-md">\n                <Download className="w-5 h-5" />\n                <span>Download Resume</span>\n              </a>',
    content
)

# 3. Update View Resume button 2 (around line 908)
content = re.sub(
    r'<button\s*onClick=\{\(\) => setShowResumeModal\(true\)\}\s*className="px-6 py-3 md:py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md flex items-center justify-center gap-2 transition-all"\s*>\s*<Eye className="w-5 h-5" />\s*<span>View Resume</span>\s*</button>',
    r'<a href="/resume.pdf" target="_blank" rel="noreferrer" className="px-6 py-3 md:py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md flex items-center justify-center gap-2 transition-all">\n                <Eye className="w-5 h-5" />\n                <span>View Resume</span>\n              </a>',
    content
)

# 4. Update Download Resume button 3 (around line 916)
content = re.sub(
    r'<button\s*onClick=\{\(\) => setShowResumeModal\(true\)\}\s*className="px-6 py-3 md:py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold shadow-md flex items-center justify-center gap-2 transition-all border border-blue-500/30"\s*>\s*<Download className="w-5 h-5" />\s*<span>Download Resume</span>\s*</button>',
    r'<a href="/resume.pdf" download="Rohith_William_G_Resume.pdf" className="px-6 py-3 md:py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold shadow-md flex items-center justify-center gap-2 transition-all border border-blue-500/30">\n                <Download className="w-5 h-5" />\n                <span>Download Resume</span>\n              </a>',
    content
)

# 5. Update modal download button
content = content.replace(
    'href={profileImgUrl}\n                download="Rohith_William_G_Resume.pdf"',
    'href="/resume.pdf"\n                download="Rohith_William_G_Resume.pdf"'
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied to App.tsx")
