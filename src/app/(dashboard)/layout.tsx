import ButtonLogout from "@/components/ui/ButtonLogout";


export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <div className="min-h-screen">
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-end">
          <ButtonLogout />
        </div>
      </nav>
      <div className="">{children}</div>
    </div>
  );
}
