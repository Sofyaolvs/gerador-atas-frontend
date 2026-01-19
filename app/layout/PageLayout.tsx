import { Header } from "../components/Header";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Header/>
      {children}
    </div>
  );
}