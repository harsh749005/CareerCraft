const express = require('express');
const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const fs = require('fs-extra');
// const path = require('path');
// const { spawn } = require('child_process');
// const Redis = require('redis');
// const multer = require('multer');
// const winston = require('winston');

const app = express();

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many PDF generation requests, please try again later.'
// });
// app.use('/api/', limiter);

// // Body parsing
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Logger setup
// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'app.log' })
//   ]
// });

// // Redis for caching (optional but recommended)
// const redis = process.env.REDIS_URL ? Redis.createClient({
//   url: process.env.REDIS_URL
// }) : null;

// // Template storage
// const TEMPLATE_DIR = path.join(__dirname, 'latex_templates');
// const TEMP_DIR = process.env.TEMP_DIR || path.join(__dirname, 'temp');

// // Ensure directories exist
// fs.ensureDirSync(TEMPLATE_DIR);
// fs.ensureDirSync(TEMP_DIR);

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // Template management
// const templates = {
//   'modern': require('./latex_templates/modern.js'),
//   'classic': require('./latex_templates/classic.js'),
//   'minimal': require('./latex_templates/minimal.js'),
//   'creative': require('./latex_templates/creative.js')
// };

// // PDF Generation Service
// class PDFGenerationService {
//   constructor() {
//     this.activeProcesses = new Map();
//     this.maxConcurrent = parseInt(process.env.MAX_CONCURRENT_PDFS) || 5;
//   }

//   async generatePDF(templateName, userData, options = {}) {
//     const startTime = Date.now();
//     const jobId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
//     try {
//       // Check if template exists
//       if (!templates[templateName]) {
//         throw new Error(`Template '${templateName}' not found`);
//       }

//       // Check concurrent limit
//       if (this.activeProcesses.size >= this.maxConcurrent) {
//         throw new Error('Too many concurrent PDF generations. Please try again later.');
//       }

//       this.activeProcesses.set(jobId, { startTime, userData: userData.email });

//       // Generate LaTeX content
//       const latexContent = templates[templateName].generate(userData, options);
      
//       // Create unique temp directory
//       const jobTempDir = path.join(TEMP_DIR, jobId);
//       await fs.ensureDir(jobTempDir);
      
//       const texFile = path.join(jobTempDir, 'resume.tex');
//       const pdfFile = path.join(jobTempDir, 'resume.pdf');
      
//       // Write LaTeX file
//       await fs.writeFile(texFile, latexContent);
      
//       // Compile PDF
//       const pdfBuffer = await this.compileLaTeX(texFile, jobTempDir);
      
//       // Log success
//       const duration = Date.now() - startTime;
//       logger.info('PDF generated successfully', {
//         jobId,
//         templateName,
//         duration,
//         userEmail: userData.email
//       });

//       // Clean up
//       await fs.remove(jobTempDir);
//       this.activeProcesses.delete(jobId);
      
//       return pdfBuffer;

//     } catch (error) {
//       // Clean up on error
//       const jobTempDir = path.join(TEMP_DIR, jobId);
//       await fs.remove(jobTempDir).catch(() => {});
//       this.activeProcesses.delete(jobId);
      
//       const duration = Date.now() - startTime;
//       logger.error('PDF generation failed', {
//         jobId,
//         templateName,
//         duration,
//         error: error.message,
//         userEmail: userData.email
//       });
      
//       throw error;
//     }
//   }

//   async compileLaTeX(texFile, outputDir) {
//     return new Promise((resolve, reject) => {
//       const process = spawn('pdflatex', [
//         '-output-directory', outputDir,
//         '-interaction=nonstopmode',
//         '-halt-on-error',
//         texFile
//       ], {
//         stdio: ['pipe', 'pipe', 'pipe'],
//         cwd: outputDir
//       });

//       let stdout = '';
//       let stderr = '';

//       process.stdout.on('data', (data) => {
//         stdout += data.toString();
//       });

//       process.stderr.on('data', (data) => {
//         stderr += data.toString();
//       });

//       process.on('close', async (code) => {
//         if (code === 0) {
//           try {
//             const pdfPath = path.join(outputDir, 'resume.pdf');
//             if (await fs.pathExists(pdfPath)) {
//               const pdfBuffer = await fs.readFile(pdfPath);
//               resolve(pdfBuffer);
//             } else {
//               reject(new Error('PDF file was not created'));
//             }
//           } catch (err) {
//             reject(err);
//           }
//         } else {
//           reject(new Error(`LaTeX compilation failed with code ${code}: ${stderr}`));
//         }
//       });

//       // Timeout after 30 seconds
//       setTimeout(() => {
//         process.kill('SIGKILL');
//         reject(new Error('PDF compilation timeout'));
//       }, 30000);
//     });
//   }

//   getActiveJobs() {
//     return Array.from(this.activeProcesses.entries()).map(([jobId, info]) => ({
//       jobId,
//       duration: Date.now() - info.startTime,
//       userEmail: info.userData
//     }));
//   }
// }

// const pdfService = new PDFGenerationService();

// // Main PDF generation endpoint
// app.post('/api/generate-resume', async (req, res) => {
//   try {
//     const { template = 'modern', userData, options = {} } = req.body;
    
//     // Validate required fields
//     if (!userData || !userData.name || !userData.email) {
//       return res.status(400).json({
//         error: 'Missing required fields: name and email are required'
//       });
//     }

//     // Check cache first (if Redis is available)
//     const cacheKey = `pdf_${template}_${JSON.stringify(userData)}`;
//     if (redis) {
//       try {
//         const cached = await redis.get(cacheKey);
//         if (cached) {
//           logger.info('Serving cached PDF', { template, userEmail: userData.email });
//           const buffer = Buffer.from(cached, 'base64');
//           return res.set({
//             'Content-Type': 'application/pdf',
//             'Content-Disposition': `attachment; filename="resume_${userData.name.replace(/\s+/g, '_')}.pdf"`
//           }).send(buffer);
//         }
//       } catch (cacheError) {
//         logger.warn('Cache read failed', { error: cacheError.message });
//       }
//     }

//     // Generate PDF
//     const pdfBuffer = await pdfService.generatePDF(template, userData, options);
    
//     // Cache the result (expire in 1 hour)
//     if (redis && pdfBuffer.length < 1024 * 1024) { // Only cache PDFs < 1MB
//       try {
//         await redis.setEx(cacheKey, 3600, pdfBuffer.toString('base64'));
//       } catch (cacheError) {
//         logger.warn('Cache write failed', { error: cacheError.message });
//       }
//     }

//     // Send PDF
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': `attachment; filename="resume_${userData.name.replace(/\s+/g, '_')}.pdf"`,
//       'Content-Length': pdfBuffer.length
//     });
    
//     res.send(pdfBuffer);

//   } catch (error) {
//     logger.error('PDF generation request failed', { error: error.message });
    
//     if (error.message.includes('not found')) {
//       return res.status(404).json({ error: error.message });
//     }
    
//     if (error.message.includes('concurrent')) {
//       return res.status(429).json({ error: error.message });
//     }
    
//     res.status(500).json({ error: 'PDF generation failed. Please try again.' });
//   }
// });

// // Get available templates
// app.get('/api/templates', (req, res) => {
//   const templateList = Object.keys(templates).map(name => ({
//     name,
//     displayName: name.charAt(0).toUpperCase() + name.slice(1),
//     description: templates[name].description || `${name} template`,
//     preview: `/api/templates/${name}/preview`
//   }));
  
//   res.json({ templates: templateList });
// });

// // System status endpoint
// app.get('/api/status', (req, res) => {
//   res.json({
//     status: 'operational',
//     activeJobs: pdfService.getActiveJobs(),
//     maxConcurrent: pdfService.maxConcurrent,
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     templatesAvailable: Object.keys(templates)
//   });
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   logger.error('Unhandled error', { error: error.message, stack: error.stack });
//   res.status(500).json({ error: 'Internal server error' });
// });

// // Graceful shutdown
// process.on('SIGTERM', async () => {
//   logger.info('SIGTERM received, shutting down gracefully');
  
//   // Wait for active PDF generations to complete
//   const maxWait = 30000; // 30 seconds
//   const startTime = Date.now();
  
//   while (pdfService.activeProcesses.size > 0 && Date.now() - startTime < maxWait) {
//     logger.info(`Waiting for ${pdfService.activeProcesses.size} active jobs to complete`);
//     await new Promise(resolve => setTimeout(resolve, 1000));
//   }
  
//   if (redis) {
//     await redis.quit();
//   }
  
//   process.exit(0);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   logger.info(`PDF generation service started on port ${PORT}`);
// });

// module.exports = app;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/generate-resume', (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log("Received data:", data);

    // Send valid JSON
    res.json({ message: "Hey! Backend here" });

  } catch (e) {
    console.log("Error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/',(req,res)=>{
  res.send("Hello !")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PDF generation service started on port http://localhost:${PORT}`);
});

