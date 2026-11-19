export const metadata = { title: 'Staff', robots: { index: false, follow: false } };
export default function StaffLayout({ children }) {
  return <div className="staff-shell"><div className="staff-shell__in">{children}</div></div>;
}
