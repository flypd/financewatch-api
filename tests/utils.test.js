const pathRegexp = require("../src/utils/pathRegexp")

describe("pathRegex", () => {
  it.each([
    ["/", /^\/?$/i, []],
    [
      "/foo",
      /^\/foo\/?(?=\/|$)/i,
      []
    ],
    [
      "/foo/:bar",
      /^\/foo\/(?:([^/]+?))\/?(?=\/|$)/i,
      [
        {
          name: "bar",
          offset: 6
        }
      ]
    ],
    [
      "/foo/:bar-:baz",
      /^\/foo\/(?:([^/]+?))-(?:([^/]+?))\/?(?=\/|$)/i,
      [{ name: "bar", offset: 6 }, { name: "baz", offset: 22 }]
    ],
    [
      "/foo/:bar/test/:baz",
      /^\/foo\/(?:([^/]+?))\/test\/(?:([^/]+?))\/?(?=\/|$)/i,
      [{ name: "bar", offset: 6 }, { name: "baz", offset: 27 }]
    ]
  ])("should handle params", (path, expectedRegexp, expectedKeys) => {
    const [regexp, keys] = pathRegexp(path)

    expect(keys).toEqual(expectedKeys)
    expect(regexp).toEqual(expectedRegexp)
  })
})
