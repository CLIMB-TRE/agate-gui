import { IngestionResponse } from "./IngestionItem";

export interface AgateProps {
  httpPathHandler: (path: string) => Promise<Response>;
  s3PathHandler?: (path: string) => void;
  fileWriter?: (path: string, content: string) => void;
  extVersion?: string;
}

export interface DataProps extends AgateProps {
  project: string;
  darkMode: boolean;
}

interface SearchProps extends DataProps {
  handleSearch: () => void;
}

export interface ResultsProps extends SearchProps {
  resultError: Error | null;
  resultData?: IngestionResponse;
}
