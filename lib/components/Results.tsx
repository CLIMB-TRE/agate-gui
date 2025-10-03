import { ResultsProps } from "./Properties";
import { ResultsTable } from "./ResultsTable";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { useEffect } from "react";

export function Results(props: ResultsProps) {
  const handleRefreshClick = () => {
    props.handleSearch();
  };

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      props.handleSearch();
    }, 10000);

    //Clearing the interval
    return () => clearInterval(interval);
  });

  return (
    <Card className="flex-grow-1">
      <Card.Header>
        <Card.Title>
          Ingestion
          <Button
            className="float-end"
            size="sm"
            variant="success"
            onClick={handleRefreshClick}
          >
            Refresh
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        {props.resultError ? (
          <Alert variant="danger">Error: {props.resultError.message}</Alert>
        ) : (
          <ResultsTable
            data={props.resultData?.results || []}
            httpPathHandler={props.httpPathHandler}
            handleRefreshClick={props.handleSearch}
          />
        )}
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  );
}
