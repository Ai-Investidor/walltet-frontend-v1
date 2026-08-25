export { default as AllocationBar } from './AllocationBar.vue'

export interface AllocationSlice {
  label: string
  percent: number
  tone: 'data-1' | 'data-2' | 'data-3' | 'data-4'
}
