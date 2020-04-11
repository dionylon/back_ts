export default interface Context {
  user?: {
    id: string,
    roles: string[]
  }
}