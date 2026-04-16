interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-foreground text-primary-foreground px-[18px] py-[10px] rounded-sm text-xs font-medium z-[2000] animate-in fade-in slide-in-from-bottom-2">
      {message}
    </div>
  );
}
