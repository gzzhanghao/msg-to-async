export function genReqId() {
  const rand = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}.${rand}`;
}
