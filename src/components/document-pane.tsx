import { useDocumentStore } from '@/lib/store'

export function DocumentPane() {
  const { items } = useDocumentStore()

  return (
    <div className="flex flex-1 items-center justify-center w-1/2 border-l">
      <ul className="space-y-2 text-lg">
        {items.map((item, index) => (
          <li key={index} className="text-center">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
