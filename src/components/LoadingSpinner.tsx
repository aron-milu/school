export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand rounded-full animate-spin" />
        <p className="text-brand font-medium">Loading...</p>
      </div>
    </div>
  );
}
