// A deterministic, gently irregular superellipse on a 3px grid. No animation or random jitter.
// Orthogonal steps and deliberate gaps keep the hand-drawn outline pixel-crisp at any size.
export function pixelOutline(width: number, height: number): string {
  const grid = 3
  const rx = Math.max(grid, width / 2 - grid),
    ry = Math.max(grid, height / 2 - grid)
  const steps = Math.ceil(((width + height) * 2) / grid)
  let path = '',
    previous: [number, number] | null = null,
    distance = 0
  for (let index = 0; index <= steps; index++) {
    const angle = (index / steps) * Math.PI * 2
    const wave = 1 + 0.025 * Math.sin(3 * angle + 0.6)
    const cos = Math.cos(angle),
      sin = Math.sin(angle)
    const x =
      Math.round(
        (width / 2 +
          Math.sign(cos) * Math.pow(Math.abs(cos), 0.85) * rx * wave) /
          grid,
      ) * grid
    const y =
      Math.round(
        (height / 2 +
          Math.sign(sin) * Math.pow(Math.abs(sin), 0.85) * ry * wave) /
          grid,
      ) * grid
    if (previous && (x !== previous[0] || y !== previous[1])) {
      if (Math.floor(distance / 9) % 2 === 0)
        path += `M${previous[0]} ${previous[1]}H${x}V${y}`
      distance += Math.abs(x - previous[0]) + Math.abs(y - previous[1])
    }
    previous = [x, y]
  }
  return path
}
