type Props = {
  title: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, action }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      {action}
    </div>
  );
}
