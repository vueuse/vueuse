export interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
  submodules?: boolean
  iife?: boolean
}

export interface VueUseFunction {
  name: string
  package: string
  lastUpdated: number
  category?: string
  description?: string
  docs?: string
  depreacted?: boolean
  internal?: boolean
  component?: boolean
  directive?: boolean
}

export interface VueUsePackage extends PackageManifest {
  dir: string
  docs?: string
}

export interface PackageIndexes {
  packages: Record<string, VueUsePackage>
  categories: string[]
  functions: VueUseFunction[]
}

export interface CommitInfo {
  functions: string[]
  version?: string
  hash: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
}
