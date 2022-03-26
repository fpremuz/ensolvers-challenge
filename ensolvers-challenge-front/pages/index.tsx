import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

const postToDo = (todo: Omit<ToDoData, "id">) => axios.post("/api/todos", todo);
const putToDo = (id: string, todo: Omit<ToDoData, "id">) =>
  axios.put(`/api/todos/${id}`, todo);

const Home: NextPage = () => {
  const [isEditVisible, setIsEditVisible] = useState(false);
  const { data: toDos, refetch } = useQuery("todos", () =>
    axios.get<ToDoData[]>("/api/todos").then((res) => res.data)
  );
  const [toDoEditing, setToDoEditing] = useState<ToDoData>();
  const onAddNewToDo = (text: string) => {
    postToDo({ isCompleted: false, text });
    refetch();
  };
  const onClickCheckbox = (id: string, isCompleted: boolean) => {
    const toDoEditing = toDos?.find((toDo) => toDo.id === id);
    if (toDoEditing === undefined) throw Error();
    putToDo(toDoEditing.id, { ...toDoEditing, isCompleted });
    setIsEditVisible(false);
    refetch();
  };
  const onEdit = (id: string) => {
    const editToDo = toDos?.find((toDo) => toDo.id === id);
    if (editToDo === undefined) throw Error();
    setToDoEditing(editToDo);
    setIsEditVisible(true);
  };

  const onSave = (text: string) => {
    if (toDoEditing === undefined) throw Error();
    putToDo(toDoEditing.id, { ...toDoEditing, text });
    setIsEditVisible(false);
    refetch();
  };

  const onCancel = () => {
    setIsEditVisible(false);
  };
  if (toDos === undefined) return <div>Loading...</div>;
  return (
    <div>
      <Head>
        <title>To-Do List</title>
      </Head>
      <div className={styles.container}>
        {isEditVisible && toDoEditing ? (
          <EditToDo
            onCancel={onCancel}
            onSave={onSave}
            text={toDoEditing.text}
          />
        ) : (
          <ToDoList
            onAddNewToDo={onAddNewToDo}
            onClickCheckbox={onClickCheckbox}
            onEdit={onEdit}
            toDos={toDos}
          />
        )}
      </div>
    </div>
  );
};

export default Home;

type ToDoData = {
  id: string;
  text: string;
  isCompleted: boolean;
};

type ToDoListProps = {
  toDos: ToDoData[];
  onEdit: (id: string) => void;
  onClickCheckbox: (id: string, isChecked: boolean) => void;
  onAddNewToDo: (text: string) => void;
};

const ToDoList = ({
  toDos,
  onClickCheckbox,
  onEdit,
  onAddNewToDo,
}: ToDoListProps) => {
  const [newTodo, setNewToDo] = useState("");
  const onAddNewToDoHandler = () => {
    onAddNewToDo(newTodo);
    setNewToDo("");
  };

  return (
    <div>
      <p>To-Do List</p>
      {toDos.map((toDo) => (
        <ToDoItem
          text={toDo.text}
          isCompleted={toDo.isCompleted}
          onClickCheckbox={(isChecked) => onClickCheckbox(toDo.id, isChecked)}
          onEdit={() => onEdit(toDo.id)}
          key={toDo.id}
        />
      ))}
      <div className={styles.newToDoItemContainer}>
        <input
          placeholder="New Task"
          value={newTodo}
          onChange={(e) => setNewToDo(e.target.value)}
        />
        <button onClick={onAddNewToDoHandler}>Add</button>
      </div>
    </div>
  );
};

type ToDoItemProps = {
  text: string;
  isCompleted: boolean;
  onEdit: () => void;
  onClickCheckbox: (isChecked: boolean) => void;
};

const ToDoItem = ({
  text,
  isCompleted,
  onEdit,
  onClickCheckbox,
}: ToDoItemProps) => {
  return (
    <div className={styles.toDoItemContainer}>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={(e) => onClickCheckbox(e.target.checked)}
      />
      <p className={styles.toDoItemText}>{text}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};

type EditToDoProps = {
  text: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
};

const EditToDo = ({ onCancel, onSave, text }: EditToDoProps) => {
  const [newText, setNewText] = useState(text);
  return (
    <div>
      <input value={newText} onChange={(e) => setNewText(e.target.value)} />
      <button onClick={() => onSave(newText)}>Save</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  );
};
