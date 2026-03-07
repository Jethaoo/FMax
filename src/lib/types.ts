export interface Driver {
  id: number | string;
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour?: string;
  headshot_url: string;
  country_code: string;
  session_key: number;
  meeting_key: number;
}

export interface Session {
  session_key: number;
  session_name: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  session_type: string;
  meeting_key: number;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
}

export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  country_flag?: string;
  circuit_key: number;
  circuit_short_name: string;
  circuit_type?: "Permanent" | "Temporary - Street" | "Temporary - Road" | string;
  circuit_image?: string;
  circuit_info_url?: string;
  date_start: string;
  date_end: string;
  year: number;
}

export interface Weather {
  air_temperature: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
  date: string;
  session_key: number;
  meeting_key: number;
}

export interface Constructor {
  team_name: string;
  team_colour: string;
}

export interface Position {
  position: number;
  driver_number: number;
  date: string;
}

export interface StreamObj {
  id: number;
  name: string;
  tag: string;
  poster: string;
  uri_name: string;
  starts_at: number;
  ends_at: number;
  always_live: number;
  category_name: string;
  iframe?: string;
  allowpaststreams?: number;
  viewers?: string;
}

export interface StreamCategory {
  category: string;
  id: number;
  always_live: boolean;
  streams: StreamObj[];
}

export interface StreamsResponse {
  success: boolean;
  timestamp: number;
  READ_ME?: string;
  performance?: number;
  streams: StreamCategory[];
}
