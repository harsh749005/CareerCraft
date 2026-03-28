/**
 * Modern single-column resume (uppercase section titles, row-between headers).
 * Placeholders are filled by `fillTemplate2` / `fillResumeTemplate` in FillTemplate2.tsx.
 */
export const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0.55in 0.75in;
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.35;
        color: #111;
      }
      .resume {
        max-width: 720px;
        margin: 0 auto;
      }
      .name {
        text-align: center;
        font-size: 22pt;
        font-weight: bold;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin: 0 0 6px 0;
      }
      .contact {
        text-align: center;
        font-size: 10pt;
        color: #333;
        padding-bottom: 10px;
        margin-bottom: 14px;
        border-bottom: 1px solid #000;
      }
      .section {
        margin-bottom: 16px;
      }
      .section-title {
        font-size: 9.5pt;
        font-weight: bold;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        border-bottom: 1px solid #bbb;
        padding-bottom: 3px;
        margin: 0 0 8px 0;
      }
      .summary-body {
        font-size: 10.5pt;
        line-height: 1.45;
        text-align: left;
      }
      a { color: #111; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="resume">
      <h1 class="name">{{name}}</h1>
      <div class="contact">{{contact}}</div>

      {{summary_block}}

      <div class="section">
        <h2 class="section-title">Education</h2>
        <div>{{education}}</div>
      </div>

      <div class="section">
        <h2 class="section-title">Experience</h2>
        <div>{{experience}}</div>
      </div>

      <div class="section">
        <h2 class="section-title">Projects</h2>
        <div>{{projects}}</div>
      </div>

      <div class="section">
        <h2 class="section-title">Technical Skills</h2>
        <div>{{skills}}</div>
      </div>

      {{links_block}}
    </div>
  </body>
</html>
`;
