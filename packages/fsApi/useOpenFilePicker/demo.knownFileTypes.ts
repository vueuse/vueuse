import type { FileSystemAccessShowOpenFileOptions } from '../types.js'

export const knownTypes: Exclude<FileSystemAccessShowOpenFileOptions['types'], undefined> = [
  {
    description: 'text',
    accept: {
      'text/plain': ['.txt', '.html'],
    },
  },
  {
    description: 'image',
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
    },
  },
  {
    description: 'audio',
    accept: {
      'audio/*': ['.mp3', '.wav'],
    },
  },
  {
    description: 'video',
    accept: {
      'video/*': ['.mp4', '.mov'],
    },
  },
  {
    description: 'pdf',
    accept: {
      'application/pdf': ['.pdf'],
    },
  },
  {
    description: 'json',
    accept: {
      'application/json': ['.json'],
    },
  },
  {
    description: 'yaml',
    accept: {
      'application/x-yaml': ['.yaml', '.yml'],
    },
  },
  {
    description: 'markdown',
    accept: {
      'text/markdown': ['.md'],
    },
  },
  {
    description: 'html',
    accept: {
      'text/html': ['.html'],
    },
  },
  {
    description: 'css',
    accept: {
      'text/css': ['.css'],
    },
  },
  {
    description: 'javascript',
    accept: {
      'text/javascript': ['.js'],
    },
  },
  {
    description: 'typescript',
    accept: {
      'text/typescript': ['.ts'],
    },
  },
  {
    description: 'tsx',
    accept: {
      'text/tsx': ['.tsx'],
    },
  },
  {
    description: 'jsx',
    accept: {
      'text/jsx': ['.jsx'],
    },
  },
  {
    description: 'vue',
    accept: {
      'text/vue': ['.vue'],
    },
  },
  {
    description: 'svg',
    accept: {
      'image/svg+xml': ['.svg'],
    },
  },
  {
    description: 'xml',
    accept: {
      'text/xml': ['.xml'],
    },
  },
  {
    description: 'csv',
    accept: {
      'text/csv': ['.csv'],
    },
  },
  {
    description: 'zip',
    accept: {
      'application/zip': ['.zip'],
    },
  },
  {
    description: 'tar',
    accept: {
      'application/x-tar': ['.tar'],
    },
  },
]
