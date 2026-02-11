import "./styles/theme.css";
import "./styles/global.css";
import { TaskContextProvider } from "./contexts/TaskContext/TaskContextProvider";
import { MessagesContainer } from "./components/MessagesContainer";
import { MainRouter } from "./routers/MainRouter";

export const App = () => {
  return (
    <TaskContextProvider>
      <MainRouter />

      <MessagesContainer />
    </TaskContextProvider>
  );
};
