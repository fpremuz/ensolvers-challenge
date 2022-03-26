import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { type } from "os";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [toDos, setToDos] = useState<ToDoData[]>([]);
  const [toDoEditing, setToDoEditing] = useState<ToDoData>();
  const onAddNewToDo = (text: string) => {
    setToDos((prevTodos) => [
      ...prevTodos,
      { id: `${prevTodos.length + 1}`, text, isCompleted: false },
    ]);
  };
  const onClickCheckbox = (id: string, isCompleted: boolean) => {
    setToDos((prevTodos) =>
      prevTodos.map((toDo) =>
        toDo.id === id ? { ...toDo, isCompleted } : toDo
      )
    );
  };
  const onEdit = (id: string) => {
    const editToDo = toDos.find((toDo) => toDo.id === id);
    if (editToDo === undefined) throw Error();
    setToDoEditing(editToDo);
    setIsEditVisible(true);
  };

  const onSave = (text: string) => {
    const id = toDoEditing?.id;
    if (id === undefined) throw Error();
    setToDos((prevTodos) =>
      prevTodos.map((toDo) => (toDo.id === id ? { ...toDo, text } : toDo))
    );
    setIsEditVisible(false);
  };

  const onCancel = () => {
    setIsEditVisible(false);
  };

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
