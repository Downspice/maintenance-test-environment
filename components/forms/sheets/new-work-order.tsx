import { Button } from "@/components/ui/button";
import { useSheet } from "@/lib/sheet-providers";
import WorkOrderForm from "../actualForms/work-order-form";



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
