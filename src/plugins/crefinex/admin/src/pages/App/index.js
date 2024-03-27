import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { AnErrorOccurred } from "@strapi/helper-plugin";
import { LessonsPage, ExercisesPage, SectionsPage } from "../../pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "../../utils/contexts/ModalContext";
import { AlertProvider } from "../../utils/contexts/AlertContext";
import { ROUTES, APP_ROUTES } from "../../utils/constants/routes.constants";
import WorldsPage from "../Worlds/WorldsPage";
// Create a client
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <AlertProvider>
          <Switch>
            <Route path={APP_ROUTES.HOME} component={WorldsPage} exact>
              <Redirect to={ROUTES.WORLDS} />
            </Route>

            <Route path={APP_ROUTES.SECTIONS} component={SectionsPage} exact />
            <Route path={APP_ROUTES.LESSONS} component={LessonsPage} exact />
            <Route path={APP_ROUTES.EXERCISES} component={ExercisesPage} exact />
            <Route path={APP_ROUTES.WORLDS} render={() => <WorldsPage />} exact />

            <Route component={AnErrorOccurred} />
          </Switch>
        </AlertProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
}

export default App;
