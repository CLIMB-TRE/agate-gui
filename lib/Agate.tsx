import { Data } from "./components/Data";
import { Header } from "./components/Header";
import { AgateProps } from "./components/Properties";
import Stack from "react-bootstrap/Stack";
import { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import "./Agate.css";
import "./bootstrap.css";

const VERSION = "0.1.8";

function App(props: AgateProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [project, setProject] = useState("");

  // Fetch the project list
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return props
        .httpPathHandler("projects/")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return [
            ...new Set(
              data.data.map(
                (project: Record<string, unknown>) => project.project,
              ),
            ),
          ] as string[];
        });
    },
  });

  // Set the first project as the default
  useEffect(() => {
    if (!project && projects) {
      setProject(projects[0]);
    }
  }, [project, projects]);

  const toggleTheme = () => {
    const htmlElement = document.querySelector("html");
    htmlElement?.setAttribute("data-bs-theme", !darkMode ? "dark" : "light");
    htmlElement?.setAttribute(
      "data-ag-theme-mode",
      !darkMode ? "dark" : "light",
    );
    setDarkMode(!darkMode);
  };

  return (
    <Stack gap={2} className="Agate h-100">
      <Header
        {...props}
        projectName={project}
        projectList={projects}
        handleProjectChange={setProject}
        handleThemeChange={toggleTheme}
        guiVersion={VERSION}
      />
      <Data {...props} project={project} darkMode={darkMode} />
      <div></div>
    </Stack>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Agate(props: AgateProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <App {...props} />
    </QueryClientProvider>
  );
}

export default Agate;
