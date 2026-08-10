import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: unused React import
content = re.sub(r"import React, { ", "import { ", content)

# Fix 2: unused BookOpen, Briefcase
content = re.sub(r"BookOpen, Briefcase, ", "", content)

# Fix 3: replace Github, Linkedin with FaGithub, FaLinkedin
content = re.sub(r"Linkedin, Github, ", "", content)
if "from 'react-icons/fa'" not in content:
    content = content.replace("from 'lucide-react';", "from 'lucide-react';\nimport { FaGithub, FaLinkedin } from 'react-icons/fa';")
content = content.replace("<Github ", "<FaGithub ")
content = content.replace("<Linkedin ", "<FaLinkedin ")

# Fix 4: function parameters types
content = re.sub(r"const handleMouseMove = \(e\) =>", "const handleMouseMove = (e: any) =>", content)
content = re.sub(r"const handleCanvasMouseMove = \(e\) =>", "const handleCanvasMouseMove = (e: any) =>", content)
content = re.sub(r"const drawPolygon = \(x, y, radius, sides, color\) =>", "const drawPolygon = (x: any, y: any, radius: any, sides: any, color: any) =>", content)
content = re.sub(r"const handleContactSubmit = \(e\) =>", "const handleContactSubmit = (e: any) =>", content)

# Fix 5: Variable types
content = content.replace("let animationFrameId;", "let animationFrameId: any;")
content = content.replace("const particles = [];", "const particles: any[] = [];")

# Fix 6: getContext, width, height on canvas
# `const canvas = canvasRef.current;` -> `const canvas = canvasRef.current as any;`
content = content.replace("const canvas = canvasRef.current;", "const canvas = canvasRef.current as any;")

# Fix 7: rows="4" -> rows={4}
content = content.replace('rows="4"', 'rows={4}')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("App.tsx fixed")
