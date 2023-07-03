import express from "express";
import crypto from "crypto";
// import path from "path";
// import { fileURLToPath } from "url";
// import configViewEngine from "./configs/viewEngine.js";
// import "dotenv/config";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// configViewEngine(app);
app.get("/", (req, res) => {
  // res.render("index.ejs");
  res.end("alskfj");
});

let todoList = [];

app.get("/todoList", (req, res) => {
  res.send({
    message: "Done",
    data: todoList,
    success: true,
  });
});

app.get("/todoList/add", (req, res) => {
  const { todoName } = req.query;
  if (!todoName) {
    res.send({
      message: "Fail",
      data: todoList,
      success: false,
    });
  } else {
    const newTodo = {
      id: crypto.randomUUID(),
      todoName: todoName,
      createdAt: new Date().getHours(),
    };
    todoList.push(newTodo);
    res.send({
      message: "Done",
      data: todoList,
      success: true,
    });
  }
});

// YC1: xoá todoList theo id
app.get("/todoList/deleteById", (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.send({
      message: "Fail",
      data: todoList,
      success: false,
    });
  } else {
    todoList = todoList.filter((f) => f.id != id);
    res.send({
      message: "Done",
      data: todoList,
      success: true,
    });
  }
});

// YC2: searchTodoname
app.get("/todoList/search", (req, res) => {
  const { todoName } = req.query;
  if (!todoName) {
    res.send({
      message: "Fail",
      data: todoList,
      success: false,
    });
  } else {
    const todoListFilter = todoList.filter((f) =>
      f.todoName.toLowerCase().includes(todoName.toLowerCase())
    );
    res.send({
      message: "Done",
      data: todoListFilter,
      success: true,
    });
  }
});

// YC3: làm rỗng mảng
app.get("/todoList/deleteAll", (req, res) => {
  if (!todoList || todoList.length === 0) {
    res.send({
      message: "Empty Array",
      data: todoList,
      success: true,
    });
  } else {
    // todoList.splice(0, todoList.length);
    todoList = [];
    res.send({
      message: "Deleted",
      data: todoList,
      success: true,
    });
  }
});

// YC4: xoá những phần tử có todoName trùng nhau
app.get("/todoList/deleteDuplicateName", (req, res) => {
  // const newTodoList = [...new Set(todoList.todoName)] (hàm Set() kh làm thay đổi mảng ban đầu. uggh)
  for (let i = 0; i < todoList.length; i++) {
    for (let j = i + 1; j < todoList.length; j++) {
      if (todoList[i].todoName === todoList[j].todoName) {
        todoList.splice(j, 1);
        j--;
      }
    }
  }
  res.send({
    message: "Done",
    data: todoList,
    success: true,
  });
});

// YC6: updateId, updateTodoName
app.get("/todoList/updateId/:oldId/:newId", (req, res) => {
  const { oldId, newId } = req.params;
  const todoUpdate = todoList.find((todo) => todo.id === oldId); //
  if (!todoUpdate) {
    res.send({
      message: "Fail",
      data: todoList,
      success: false,
    });
  } else {
    todoUpdate.id = newId;
    res.send({
      message: "Done",
      data: todoList,
      success: true,
    });
  }
});
app.get("/todoList/updateTodoName/:id/:newTodoName", (req, res) => {
  const { id, newTodoName } = req.params;
  const todoUpdate = todoList.find((todo) => todo.id === id);
  if (!todoUpdate) {
    res.send({
      message: "Fail",
      data: todoList,
      success: false,
    });
  } else {
    todoUpdate.todoName = newTodoName;
    res.send({
      message: "Done",
      data: todoList,
      success: true,
    });
  }
});

// YC5: pagination array js
app.get("/todoList/pagination", (req, res) => {
  const { page, pageSize } = req.query;
  const currentPage = parseInt(page) || 1;
  const size = parseInt(pageSize) || 10;
  const start = (currentPage - 1) * size;
  const end = start + size;
  const dataPage = todoList.slice(start, end);
  const totalPage = Math.ceil(todoList.length / size);

  res.send({
    message: "Done",
    data: dataPage,
    currentPage: currentPage,
    totalPage: totalPage,
    success: true,
  });
});

app.listen(port, () => {
  console.log(`manifest`);
});

//BTVn
//YC1: viết api dùng cho việc xóa todo theo id truyền qua query param
//YC2: tìm kiếm todoName theo các ký tự được truyền qua query param
//YC3: xóa mảng todoList -> làm rỗng
//YC4: xóa những phần tử todo trùng nhau về todoNam
//YC5: thực hiện phân trang dữ liệu(query param)
//truyền lên query param: + trang hiện tại dùng là gì?
//                        + số dữ liệu cần hiển thị trên 1 trang -> pagination array js

//YC6: thực hiện cập nhật 1 cái todo: id, update todoName