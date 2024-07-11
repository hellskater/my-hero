import { Navbar } from './navbar/navbar';

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="px-4 pb-8 pt-8 sm:px-8">{children}</div>
    </div>
  );
}
