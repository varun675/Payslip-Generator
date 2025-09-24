# Payslip Generator

A modern, responsive payslip generator built with React, TypeScript, and Vite. This application allows users to create professional payslips with PDF generation and download functionality.

## Features

- 📄 Professional payslip templates
- 🎨 Modern, responsive UI built with React and Tailwind CSS
- 📱 Mobile-friendly design
- 💾 PDF generation and download
- 🚀 Fast development with Vite
- 📊 Support for earnings, deductions, and tax calculations

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **PDF Generation**: jsPDF, html2canvas
- **UI Components**: Radix UI, Shadcn/ui
- **Icons**: Lucide React

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd PaySlip-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:frontend` - Build frontend only (for static deployment)
- `npm run preview` - Preview production build locally
- `npm run check` - Type check with TypeScript

## Deployment

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Setup Instructions:

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository.

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "GitHub Actions"

3. **Automatic Deployment**: 
   - The workflow will automatically trigger on pushes to the `main` branch
   - The built site will be available at `https://yourusername.github.io/Payslip-Generator/`

#### Manual Deployment:

You can also trigger deployment manually:
- Go to the "Actions" tab in your GitHub repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

### Local Production Build

To test the production build locally:

```bash
npm run build:frontend
npm run preview
```

## Project Structure

```
PaySlip-Generator/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions workflow
├── dist/                  # Build output
├── package.json
├── vite.config.ts
└── README.md
```

## Static Deployment Notes

When deployed to GitHub Pages (static hosting):
- The application runs in "static mode"
- PDF generation and download functionality works normally
- Email functionality is replaced with direct PDF download
- All features work client-side without requiring a backend server
- SPA routing is handled via 404.html redirect for GitHub Pages compatibility

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
