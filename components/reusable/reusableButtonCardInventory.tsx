import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";

type InventoryDataType = {
  name: string;
  description: string;
  id: string;
  outOfStock: string;
  soon: string;
};

export default function ReusableButtonInventoryCard({
  data,
  onClick,
  isActive = false,
}: {
  data: InventoryDataType;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <Card
      className={`w-full h-fit ${isActive ? "shadow-primary bg-#ffffff" : ""}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        {/* <CardDescription >{data.description}</CardDescription> */}
      </CardHeader>
      <CardContent className="font-bold text-2xl">{data.value}</CardContent>
      <Separator />

      <CardFooter className="flex justify-between">
        <span className="text-destructive">{data.outOfStock} Out of stock</span>
        <Separator orientation="vertical" />
        {data.soon} Low
      </CardFooter>
    </Card>
  );
}
