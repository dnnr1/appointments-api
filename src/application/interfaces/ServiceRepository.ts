export interface ServiceRepository {
  exists(id: string): Promise<boolean>
}
