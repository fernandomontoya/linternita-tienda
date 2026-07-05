export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
          }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
