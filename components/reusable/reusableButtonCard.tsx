'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";

type HomeCardDataType = {
  name: string;
  description: string;
  id: string;
  overdue: string;
  soon: string;
};

export default function ReusableButtonCard({
  data,
  onClick,
  isActive=false
}: {
  data: HomeCardDataType,
  onClick:()=>void,
  isActive:boolean;
}) {
  return (
    <Card className={`w-full h-fit ${isActive ? "shadow-primary bg-#ffffff" : ""}`}
 onClick={onClick}>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        {/* <CardDescription>{data.description}</CardDescription> */}
      </CardHeader>
      <CardContent className="font-bold text-2xl">{data.value}
        
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between">
        <span className="text-destructive">{data.overdue} Overdue </span><Separator orientation="vertical" />
        {data.soon} Soon
      </CardFooter>
    </Card>
  );
}
