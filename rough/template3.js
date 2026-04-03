/**
 * Classic single-column resume — centered name, horizontal rule divider,
 * bold uppercase section titles, company+date on same row, job title bold below.
 * Matches the "mechanical engineer" reference design.
 * Placeholders are filled by `fillTemplate3` / `fillResumeTemplate` in FillTemplate3.tsx.
 */
export const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 10.5pt;
        line-height: 1.4;
        color: #111;
        background: #fff;
        margin: 0.55in 0.7in;
      }

      .resume {
        max-width: 720px;
        margin: 0 auto;
      }

      /* ── Header ── */
      .name {
        text-align: center;
        font-size: 20pt;
        font-weight: bold;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      .contact-line {
        text-align: center;
        font-size: 9.5pt;
        color: #222;
        margin-bottom: 10px;
      }

      .contact-line a {
        color: #111;
        text-decoration: none;
      }

      .header-rule {
        border: none;
        border-top: 1.5px solid #111;
        margin-bottom: 10px;
      }

      /* ── Summary / objective ── */
      .summary-text {
        font-size: 10pt;
        text-align: center;
        margin-bottom: 14px;
        line-height: 1.5;
        color: #111;
      }

      /* ── Section ── */
      .section {
        margin-bottom: 14px;
      }

      .section-title {
        text-align: center;
        font-size: 10.5pt;
        font-weight: bold;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        
        border-bottom: 1.5px solid #111;
        padding: 3px 0;
        margin-bottom: 10px;
      }

      /* ── Experience block ── */
      .exp-block {
        margin-bottom: 10px;
      }

      .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .exp-company {
        font-size: 10.5pt;
        font-weight: normal;
      }

      .exp-date {
        font-size: 10pt;
        font-weight: normal;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .exp-title {
        font-size: 10.5pt;
        font-weight: bold;
        margin-top: 1px;
        margin-bottom: 3px;
      }

      /* ── Education block ── */
      .edu-block {
        margin-bottom: 8px;
      }

      .edu-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .edu-institution {
        font-size: 10.5pt;
        font-weight: normal;
      }

      .edu-year {
        font-size: 10pt;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .edu-degree {
        font-size: 10.5pt;
        font-weight: bold;
        margin-top: 1px;
        margin-bottom: 3px;
      }

      /* ── Bullet lists ── */
      ul {
        margin: 4px 0 0 0;
        padding-left: 22px;
        list-style-type: disc;
      }

      li {
        font-size: 10pt;
        line-height: 1.45;
        margin-bottom: 3px;
      }

      /* ── Skills section ── */
      .skills-block {
        font-size: 10pt;
        line-height: 1.55;
      }

      .skills-block strong {
        font-weight: bold;
      }

      /* ── Links ── */
      a { color: #111; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="resume">

      <!-- Header -->
      <div class="name">{{name}}</div>
      <div class="contact-line">{{contact}}</div>
      <hr class="header-rule" />

      <!-- Summary -->
      {{summary_block}}

      <!-- Experience -->
      <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        <div>{{experience}}</div>
      </div>

      <!-- Education -->
      <div class="section">
        <h2 class="section-title">Education</h2>
        <div>{{education}}</div>
      </div>

      <!-- Projects (optional — hidden if empty) -->
      <div class="section">
        <h2 class="section-title">Projects</h2>
        <div>{{projects}}</div>
      </div>

      <!-- Skills -->
      <div class="section">
        <h2 class="section-title">Skills &amp; Other</h2>
        <div class="skills-block">{{skills}}</div>
      </div>

      {{links_block}}

    </div>
  </body>
</html>
`;