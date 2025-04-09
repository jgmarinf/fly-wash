export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="px-3 sm:px-10">{children}</div>
    </div>
  );
}
