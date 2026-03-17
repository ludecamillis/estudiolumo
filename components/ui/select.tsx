export function Select({ children }: any) {
  return <select className="border p-2 w-full">{children}</select>
}

export function SelectContent({ children }: any) {
  return <>{children}</>
}

export function SelectGroup({ children }: any) {
  return <>{children}</>
}

export function SelectItem({ children, value }: any) {
  return <option value={value}>{children}</option>
}

export function SelectLabel({ children }: any) {
  return <>{children}</>
}

export function SelectTrigger({ children }: any) {
  return <>{children}</>
}

export function SelectValue({ children }: any) {
  return <>{children}</>
}
