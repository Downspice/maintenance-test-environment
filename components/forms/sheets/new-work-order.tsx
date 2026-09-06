import { useSheet } from "@/lib/providers/sheet-providers";
import WorkOrderForm from "../entities/work-order-form";



export default function NewWorkOrder() {
  const { openSheet } = useSheet();

  const handleOpenNewWorkOrderSheet = () => {
    openSheet({
      title: "User Profile",
      description: "View and edit user information",
      content: (
        <WorkOrderForm/>
      ),
    });
  };
  return handleOpenNewWorkOrderSheet;
}
