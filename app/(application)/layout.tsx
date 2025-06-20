import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Navbar } from "@/components/admin-panel/navbar";

export default function DemoLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AdminPanelLayout>
			<Navbar /> {children}
		</AdminPanelLayout>
	);
}
