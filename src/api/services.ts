import { get } from './client'
import type { SdkSlug } from '@/types'

/** Fetch all distinct SDK slugs from the collector. */
export async function fetchServices(): Promise<SdkSlug[]> {
  return get<SdkSlug[]>('/api/services')
}
