import nodeFetch from 'node-fetch'

// @ts-expect-error override
window.fetch = nodeFetch

export {}
