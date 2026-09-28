const books = JSON.parse(
    localStorage.getItem("novelBooks") || "[]"
);

const currentBookId =
    localStorage.getItem("currentBookId");

const currentBook = books.find(
    book => String(book.id) === String(currentBookId)
);

document.getElementById("bookTitle").textContent =
    currentBook?.title || "新书";
