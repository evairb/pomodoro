import { SaveIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { DefaultInput } from "../../components/DefaultInput";
import { Heading } from "../../components/Heading";

import { MainTemplate } from "../../templates/MainTemplate";
import { useEffect, useRef } from "react";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { showMessage } from "../../adapters/showMessage";
import { TaskActionTypes } from "../../contexts/TaskContext/taskActions";

export function Settings() {
  useEffect(() => {
    document.title = "Configurações - Chronos Pomodoro";
  }, []);
  const { state, dispatch } = useTaskContext();
  const workTimeInputRef = useRef<HTMLInputElement>(null);
  const shortBreakTimeInputRef = useRef<HTMLInputElement>(null);
  const longBreakTimeInputRef = useRef<HTMLInputElement>(null);

  function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formErrors = [];
    const workTime = Number(workTimeInputRef.current?.value);
    const shortBreakTime = Number(shortBreakTimeInputRef.current?.value);
    const longBreakTime = Number(longBreakTimeInputRef.current?.value);

    if (isNaN(workTime) || isNaN(longBreakTime) || isNaN(shortBreakTime)) {
      formErrors.push("Digite apenas numeros para todos os campos");
    }

    if (workTime < 1 || workTime > 60) {
      formErrors.push("Digite valores entre 1 e 99 para foco");
    }
    if (shortBreakTime < 1 || workTime > 30) {
      formErrors.push("Digite valores entre 1 e 30 para Descanso Curto");
    }
    if (longBreakTime < 1 || longBreakTime > 60) {
      formErrors.push("Digite valores entre 1 e 99 para Descanso Longo");
    }

    if (formErrors.length > 0) {
      formErrors.forEach((error) => showMessage.error(error));
      return;
    }
    dispatch({
      type: TaskActionTypes.CHANGE_SETTINGS,
      payload: {
        workTime,
        shortBreakTime,
        longBreakTime,
      },
    });
    showMessage.success("Configuracoes salvas com sucesso");
  }
  return (
    <>
      <MainTemplate>
        <Container>
          <Heading>Configurações</Heading>
        </Container>
        <Container>
          <p style={{ textAlign: "center" }}>
            Modifique as configurações para tempo de foco, descanso curto e
            descanso longo.
          </p>
        </Container>

        <Container>
          <form action="" onSubmit={handleSaveSettings} className="form">
            <div className="formRow">
              <DefaultInput
                id="workTime"
                labelText="Foco"
                ref={workTimeInputRef}
                defaultValue={state.config.workTime}
                type="number"
                min={1}
              />
            </div>
            <div className="formRow">
              <DefaultInput
                id="shortBreakTime"
                labelText="Descanso Curto"
                ref={shortBreakTimeInputRef}
                defaultValue={state.config.shortBreakTime}
                type="number"
                min={1}
              />
            </div>
            <div className="formRow">
              <DefaultInput
                id="longBreakTime"
                labelText="Descanso Longo"
                ref={longBreakTimeInputRef}
                defaultValue={state.config.longBreakTime}
                type="number"
                min={1}
              />
            </div>
            <div className="formRow">
              <DefaultButton
                icon={<SaveIcon />}
                arial-label="Salvar configuracoes"
                title="Salvar configuracoes"
              />
            </div>
          </form>
        </Container>
      </MainTemplate>
    </>
  );
}
