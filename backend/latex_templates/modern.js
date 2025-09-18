// templates/modern.js
module.exports = {
  description: "Modern, clean design with bold section headers",
  
  generate(userData, options = {}) {
    const { colorScheme = 'blue', fontSize = '11pt' } = options;
    
    return `
\\documentclass[letterpaper,${fontSize}]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage[usenames,dvipsnames]{color}

% Color scheme
\\definecolor{primary}{HTML}{${this.getColorCode(colorScheme)}}

% Page setup
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

% Section formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries\\color{primary}
}{}{0em}{}[\\color{primary}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{{#1 \\vspace{-2pt}}}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\begin{document}

% Header
\\begin{center}
    {\\Huge \\scshape \\color{primary} ${this.escapeLatex(userData.name)}} \\\\ \\vspace{1pt}
    \\small ${this.escapeLatex(userData.title || '')} \\\\ \\vspace{5pt}
    \\small \\faPhone\\ ${this.escapeLatex(userData.phone || '')} ~ 
    \\href{mailto:${userData.email}}{\\faEnvelope\\ ${this.escapeLatex(userData.email)}} ~
    ${userData.linkedin ? `\\href{${userData.linkedin}}{\\faLinkedin\\ LinkedIn} ~` : ''}
    ${userData.github ? `\\href{${userData.github}}{\\faGithub\\ GitHub}` : ''}
\\end{center}

% Summary
${userData.summary ? `
\\section{Summary}
${this.escapeLatex(userData.summary)}
` : ''}

% Experience
${this.renderExperience(userData.experiences || [])}

% Projects  
${this.renderProjects(userData.projects || [])}

% Skills
${this.renderSkills(userData.skills || {})}

% Education
${this.renderEducation(userData.education || [])}

\\end{document}
    `;
  },

  getColorCode(scheme) {
    const colors = {
      blue: '2E86AB',
      green: '06A77D',
      purple: '7209B7', 
      red: 'D00000',
      orange: 'FF6B35'
    };
    return colors[scheme] || colors.blue;
  },

  escapeLatex(text) {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\textbackslash')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/\^/g, '\\textasciicircum')
      .replace(/~/g, '\\textasciitilde');
  },

  renderExperience(experiences) {
    if (!experiences.length) return '';
    
    return `
\\section{Experience}
\\begin{itemize}[leftmargin=0.0in, label={}]
${experiences.map(exp => `
  \\resumeSubheading
    {${this.escapeLatex(exp.company)}}{${this.escapeLatex(exp.dates)}}
    {${this.escapeLatex(exp.position)}}{${this.escapeLatex(exp.location)}}
    \\begin{itemize}
      ${(exp.achievements || []).map(achievement => 
        `\\resumeItem{${this.escapeLatex(achievement)}}`
      ).join('\n      ')}
    \\end{itemize}
`).join('')}
\\end{itemize}
`;
  },

  renderProjects(projects) {
    if (!projects.length) return '';
    
    return `
\\section{Projects}
\\begin{itemize}[leftmargin=0.0in, label={}]
${projects.map(project => `
  \\item
  \\begin{tabular*}{1.0\\textwidth}{l@{\\extracolsep{\\fill}}r}
    \\textbf{${this.escapeLatex(project.name)}} & ${this.escapeLatex(project.tech || '')} \\\\
  \\end{tabular*}\\vspace{-7pt}
  \\begin{itemize}
    ${(project.details || []).map(detail => 
      `\\resumeItem{${this.escapeLatex(detail)}}`
    ).join('\n    ')}
    ${project.url ? `\\resumeItem{Live demo: \\href{${project.url}}{${project.url}}}` : ''}
  \\end{itemize}
`).join('')}
\\end{itemize}
`;
  },

  renderSkills(skills) {
    if (!Object.keys(skills).length) return '';
    
    return `
\\section{Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
    ${Object.entries(skills).map(([category, items]) => 
      `\\textbf{${this.escapeLatex(category)}}{: ${this.escapeLatex(Array.isArray(items) ? items.join(', ') : items)}} \\\\`
    ).join('\n    ')}
  }}
\\end{itemize}
`;
  },

  renderEducation(education) {
    if (!education.length) return '';
    
    return `
\\section{Education}
\\begin{itemize}[leftmargin=0.0in, label={}]
${education.map(edu => `
  \\resumeSubheading
    {${this.escapeLatex(edu.institution)}}{${this.escapeLatex(edu.dates)}}
    {${this.escapeLatex(edu.degree)}}{${this.escapeLatex(edu.location || '')}}
`).join('')}
\\end{itemize}
`;
  }
};