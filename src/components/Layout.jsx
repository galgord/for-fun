import BottomNav from './BottomNav';

export default function Layout({ children, activePage, onNavigate }) {
  return (
    <div className="min-h-dvh bg-bg">
      <main style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 120, maxWidth: 480, marginInline: 'auto' }}>
        {children}
      </main>
      <BottomNav active={activePage} onNavigate={onNavigate} />
    </div>
  );
}
