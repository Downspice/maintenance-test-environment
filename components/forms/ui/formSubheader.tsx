export default function FormSubheader({ header }: { header: string }) {
  return (
    <div className="w-full flex flex-col  border-b border-primary">
      <p>{header}</p>
    </div>
  );
}
