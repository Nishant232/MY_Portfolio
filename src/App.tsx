import { lazy, Suspense } from "react";
import "./App.css";
import CharacterErrorBoundary from "./components/Character/CharacterErrorBoundary";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<div className="app-loading-fallback" />}>
          <MainContainer>
            <CharacterErrorBoundary>
              <Suspense
                fallback={<div className="character-fallback" aria-hidden="true" />}
              >
                <CharacterModel />
              </Suspense>
            </CharacterErrorBoundary>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
