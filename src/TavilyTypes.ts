// Typed models for the Tavily SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Search {
  answer?: string
  include_answer?: boolean
  max_results?: number
  query?: string
  response_time?: number
  results?: any[]
  search_depth?: string
}

export interface SearchCreateData {
  include_answer?: boolean
  max_results?: number
  query: string
  search_depth?: string
}

