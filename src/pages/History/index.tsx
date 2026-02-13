import { TrashIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { Heading } from "../../components/Heading";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./styles.module.css";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { formatDate } from "../../utils/formatDate";
import { getTaskStatus } from "../../utils/getTaskStatus";
import { sortTasks, type SortTasksOptions } from "../../utils/sortedTasks";
import { useEffect, useState } from "react";
import { showMessage } from "../../adapters/showMessage";
import { TaskActionTypes } from "../../contexts/TaskContext/taskActions";

export function History() {
  useEffect(() => {
    document.title = "Historico - Chronos Pomodoro";
  }, []);
  const { state, dispatch } = useTaskContext();

  const hasTasks = state.tasks.length > 0;
  const [sortTasksOptions, setStortTaskOptions] = useState<SortTasksOptions>(
    () => {
      return {
        tasks: sortTasks({ tasks: state.tasks }),
        field: "startDate",
        direction: "desc",
      };
    },
  );

  useEffect(() => {
    setStortTaskOptions((prevState) => ({
      ...prevState,
      tasks: sortTasks({
        tasks: state.tasks,
        direction: prevState.direction,
        field: prevState.field,
      }),
    }));
  }, [state.tasks]);

  function handleSortTasks({ field }: Pick<SortTasksOptions, "field">) {
    const newDirection = sortTasksOptions.direction === "desc" ? "asc" : "desc";
    setStortTaskOptions({
      tasks: sortTasks({
        direction: newDirection,
        tasks: sortTasksOptions.tasks,
        field,
      }),
      direction: newDirection,
      field,
    });
  }

  function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm("Testando", (confirm) => {
      if (confirm) {
        console.log("Apaguei");
        dispatch({ type: TaskActionTypes.RESET_STATE });
      }
    });
  }

  return (
    <>
      <MainTemplate>
        <Container>
          <Heading>
            <span>History</span>
            {hasTasks && (
              <span className={styles.buttonContainer}>
                <DefaultButton
                  icon={<TrashIcon />}
                  color="red"
                  aria-label="Apagar historico"
                  title="Apagar historico"
                  onClick={handleResetHistory}
                />
              </span>
            )}
          </Heading>
        </Container>

        <Container>
          {hasTasks && (
            <div className={styles.responsiveTable}>
              <table>
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSortTasks({ field: "name" })}
                      className={styles.thSort}
                    >
                      Tarefa ↕
                    </th>
                    <th
                      onClick={() => handleSortTasks({ field: "duration" })}
                      className={styles.thSort}
                    >
                      Duração ↕
                    </th>
                    <th
                      onClick={() => handleSortTasks({ field: "startDate" })}
                      className={styles.thSort}
                    >
                      Data ↕
                    </th>
                    <th>Status</th>
                    <th>Tipo</th>
                  </tr>
                </thead>

                <tbody>
                  {sortTasksOptions.tasks.map((task) => {
                    const taskTypeDictionary = {
                      workTime: "Foco",
                      shortBreakTime: "Descanso curto",
                      longBreakTime: "Descanso longo",
                    };
                    return (
                      <tr key={task.id}>
                        <td>{task.name}</td>
                        <td>{task.duration}min</td>
                        <td>{formatDate(task.startDate)}</td>
                        <td>{getTaskStatus(task, state.activeTask)}</td>
                        <td>{taskTypeDictionary[task.type]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!hasTasks && (
            <p style={{ textAlign: "center" }}>
              Ainda não existem tarefas criadas!
            </p>
          )}
        </Container>
      </MainTemplate>
    </>
  );
}
