module.exports = pathToRegexp

function pathToRegexp(path) {
  const keys = []
  let extraOffset = 0
  const slashAtEnd = path[path.length - 1] === "/"

  path = ("^" + path + (slashAtEnd ? '?' : '/?')).replace(/(\\\/)?:(\w+)/g, function(
    match,
    slash,
    key,
    offset
  ) {
    const result = "(?:([^\\/]+?))"

    keys.push({
      name: key,
      offset: offset + extraOffset
    })

    extraOffset += result.length - match.length + 2

    return result
  })
  return [new RegExp(path + (slashAtEnd ? "$" : "(?=\\/|$)"), "i"), keys]
}
