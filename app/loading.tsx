export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    </div>
  )
}
