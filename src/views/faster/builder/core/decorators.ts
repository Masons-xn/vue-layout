export function UnitType(params: string) {
  return (target: any) => {
    target.prototype.unitType = params
  }
}
export function unitDataPath(params: string) {
  return (target: any) => {
    target.prototype.unitDataPath = params
  }
}
export function RenderType(params: string) {
  return (target: any) => {
    target.prototype.renderType = params
  }
}
