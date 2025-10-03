export interface IngestionResponse {
  next: string;
  previous: string;
  results: IngestionItem[];
}

export interface IngestionItem {
  uuid: string;
  project: string;
  platform: string;
  site: string;
  name: string;
  run_index: string;
  run_id: string;
  is_published: boolean;
  is_test_attempt: boolean;
  climb_id: string;
  error_message: string;
  status: string;
}
