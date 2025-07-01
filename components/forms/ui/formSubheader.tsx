export default function FormSubheader({ header }: { header: string }) {
  return (
    <div className="w-full flex flex-col pt-4 border-b-2 shadow border-primary">
      <p className="font-bold">{header}</p>
    </div>
  );
}
