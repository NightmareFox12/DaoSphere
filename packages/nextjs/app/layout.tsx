import { ScaffoldStarkAppWithProviders } from '~~/components/ScaffoldStarkAppWithProviders';
import '~~/styles/globals.css';
import { ThemeProvider } from '~~/components/ThemeProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DaoSphere',
  description:
    'Descentralized Application designed to create and manage proposals for resolve problems in a democratic way',
  icons: '/logo.ico',
};

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldStarkAppWithProviders>
            {children}
          </ScaffoldStarkAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
