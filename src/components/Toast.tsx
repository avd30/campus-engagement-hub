interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-5 py-2.5 rounded-xl text-xs font-medium shadow-lg z-[9999] animate-in fade-in slide-in-from-bottom-4">
      {message}
    </div>
  );
}
