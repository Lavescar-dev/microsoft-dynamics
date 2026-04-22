import { useLocale } from '../../contexts/LocaleContext';

interface FormNotificationBarProps {
  message: string;
}

export function FormNotificationBar({ message }: FormNotificationBarProps) {
  const { tr } = useLocale();
  return (
    <div className="border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 rounded-md">
      {tr(message)}
    </div>
  );
}
