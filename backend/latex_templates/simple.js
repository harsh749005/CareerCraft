// templates/simple.js
module.exports = {
  name: 'simple',
  displayName: 'Simple Professional',
  description: 'Clean black and white design, perfect for any industry',
  preview: '/previews/simple.png',
  
  generate(userData, options = {}) {
    const { fontSize = '11pt' } = options;
    
    return `
\\documentclass[letterpaper,${fontSize}]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage{tabularx}

% Page setup
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section formatting - simple black line
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\Huge \\scshape ${this.escapeLatex(userData.name)}} \\\\ \\vspace{1pt}
    \\small ${this.escapeLatex(userData.title || 'Professional')} \\\\
    \\small ${this.escapeLatex(userData.subtitle || '')} \\\\ \\vspace{5pt}
    \\small \\raisebox{-0.1\\height}\\faPhone\\ ${this.escapeLatex(userData.phone || '')} ~ 
    \\href{mailto:${userData.email}}{\\raisebox{-0.2\\height}\\faEnvelope\\  ${this.escapeLatex(userData.email)}} ~ 
    ${userData.linkedin ? `\\href{${userData.linkedin}}{\\raisebox{-0.2\\height}\\faLinkedin\\ ${this.escapeLatex(this.extractUsername(userData.linkedin))}} ~ ` : ''}
    ${userData.github ? `\\href{${userData.github}}{\\raisebox{-0.2\\height}\\faGithub\\ ${this.escapeLatex(this.extractUsername(userData.github))}} ~ ` : ''}
    ${userData.website ? `\\href{${userData.website}}{\\raisebox{-0.2\\height}\\faGlobe\\ ${this.escapeLatex(this.extractUsername(userData.website))}}` : ''}
    \\vspace{-8pt}
\\end{center}

${this.renderExperience(userData.experiences || [])}
${this.renderProjects(userData.projects || [])}
${this.renderSkills(userData.skills || {})}
${this.renderSummary(userData.summary || '')}
${this.renderEducation(userData.education || [])}

\\end{document}
`;
  },

  escapeLatex(text) {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/~/g, '\\textasciitilde{}');
  },

  extractUsername(url) {
    if (!url) return '';
    // Extract username from social media URLs
    const patterns = [
      /linkedin\\.com\\/in\\/([^\\/\\?]+)/,
      /github\\.com\\/([^\\/\\?]+)/,
      /twitter\\.com\\/([^\\/\\?]+)/,
      /x\\.com\\/([^\\/\\?]+)/
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    // If no pattern matches, return the URL as is
    return url.replace(/^https?:\\/\\//, '');
  },

  renderExperience(experiences) {
    if (!experiences.length) return '';
    
    return `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experiences.map(exp => `
    \\resumeSubheading
      {${this.escapeLatex(exp.company)}}{${this.escapeLatex(exp.dates)}}
      {${this.escapeLatex(exp.position)}}{${this.escapeLatex(exp.location)}}
      \\resumeItemListStart
        ${(exp.achievements || []).map(achievement => 
          `\\resumeItem{${this.escapeLatex(achievement)}}`
        ).join('\n        ')}
      \\resumeItemListEnd
`).join('')}
  \\resumeSubHeadingListEnd
\\vspace{-16pt}
`;
  },

  renderProjects(projects) {
    if (!projects.length) return '';
    
    return `
%-----------PROJECTS-----------
\\section{Projects}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
${projects.map(project => `
      \\resumeProjectHeading
          {\\textbf{${this.escapeLatex(project.name)}} $|$ \\emph{${this.escapeLatex(project.tech || '')}}}{${project.date || '--'}}
          \\resumeItemListStart
            ${(project.details || []).map(detail => 
              `\\resumeItem{${this.escapeLatex(detail)}}`
            ).join('\n            ')}
            ${project.url ? `\\resumeItem{A live demo: \\href{${project.url}}{\\underline{${project.url}}}}` : ''}
          \\resumeItemListEnd
          \\vspace{-13pt}
`).join('')}
    \\resumeSubHeadingListEnd
\\vspace{-15pt}
`;
  },

  renderSkills(skills) {
    if (!Object.keys(skills).length) return '';
    
    return `
%-----------PROGRAMMING SKILLS-----------
\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${Object.entries(skills).map(([category, items]) => 
       `\\textbf{${this.escapeLatex(category)}}{: ${this.escapeLatex(Array.isArray(items) ? items.join(', ') : items)}} \\\\`
     ).join('\n     ')}
    }}
 \\end{itemize}
 \\vspace{-16pt}
`;
  },

  renderSummary(summary) {
    if (!summary) return '';
    
    return `
%-----------SUMMARY-----------
\\section{Summary of qualification}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${summary.split('\n').map(line => 
       `\\textbf{}{${this.escapeLatex(line.trim())}} \\\\`
     ).join('\n     ')}
    }}
 \\end{itemize}
 \\vspace{-16pt}
`;
  },

  renderEducation(education) {
    if (!education.length) return '';
    
    return `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${education.map(edu => `
    \\resumeSubheading
      {${this.escapeLatex(edu.institution)}}{${this.escapeLatex(edu.dates)}}
      {${this.escapeLatex(edu.degree)}}{${this.escapeLatex(edu.location || '')}}
      ${edu.gpa ? `\\resumeItemListStart
        \\resumeItem{${this.escapeLatex(edu.gpa)}}
      \\resumeItemListEnd` : ''}
`).join('')}
  \\resumeSubHeadingListEnd
`;
  }
};