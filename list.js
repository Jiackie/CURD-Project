let pageNum = 0;
const pageSize = 10;
let sortAscending = true;



function insertInList() {
  //extract input value
  let inputVal = document.getElementById('inputcontent');
  let listNode = document.getElementById('list');

  //check if input is NULL;
  if (!inputVal.value.trim()) {
    alert('Input cannot be empty! Please try again.');
    return;
  }

  //creat a new li element
  let newList = document.createElement('li');
  let textNode = document.createTextNode(inputVal.value);
  newList.appendChild(textNode);

  //add delete button to it;
  let delbutton = document.createElement('button');
  delbutton.type = 'button';
  delbutton.className = 'no';
  delbutton.innerHTML = 'del';
  // console.log(delbutton);
  delbutton.onclick = function () {
    deleteTheList();
  }
  newList.appendChild(delbutton);

  //add edit button to it;
  let editbutton = document.createElement('button');
  editbutton.type = 'button';
  editbutton.className = 'yes';
  editbutton.innerHTML = 'edit';
  editbutton.onclick = function() {
    startEdit();
  };
  newList.appendChild(editbutton);

  //sort to the right positon and insert;
  sortAndInsert(newList);

  //call pagination.
  paginationBar();

  //show the updated page;
  showPageN(pageNum);

  //remove content of input;
  inputVal.value = "";
}

function editedTheList() {
  //get the input value;
  let inputVal = document.getElementById('updatedcontent').value;

  //check the updated content is NULL;

  if (!inputVal.trim()) {
    alert('Updates cannot be empty! Please try again.');
    return;
  }
  // console.log(editElement);
  editElement.childNodes[0].textContent = inputVal;

  //sort and insert into the specific position;
  sortAndInsert(editElement);

  showPageN(pageNum);

  //hide the edit div;
  let hideEditDiv = document.getElementById('edit');
  hideEditDiv.style.display = 'none';

}

function cancelEdit() {
  let hideEditDiv = document.getElementById('edit');
  hideEditDiv.style.display = 'none';
}

//function for demo only;
function startEdit() {
  // to display the edit div
  let showEditDiv = document.getElementById('edit');
  showEditDiv.style.display = 'block';
  // put the content in edit input box;
  let setInputValue = document.getElementById('updatedcontent');
  //get the position of the list that user want to edit;
  editElement = event.srcElement.parentElement;
  setInputValue.value = editElement.childNodes[0].textContent;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

//function for demo only;
function deleteTheList() {
  let deleteElement = event.srcElement.parentElement;
  let listNode = document.getElementById('list');

  deleteElement.remove();
  paginationBar();

  //check if need to change page;
  if (pageNum === Math.ceil(listNode.children.length / pageSize)) {
    pageNum = 0;
  }
  showPageN(pageNum);
}

function sortAndInsert(newItem) {
  let orderlist = document.getElementById('list');
  //compared with each value of the element;
  console.log(sortAscending);
  if (sortAscending) {
    for (let llist of orderlist.children) {
      if (newItem.childNodes[0].textContent.trim().toLowerCase() < llist.childNodes[0].textContent.trim().toLowerCase()) {
        orderlist.insertBefore(newItem, llist);
        return;
      }
    }

  } else {
    for (let llist of orderlist.children) {
      if (newItem.childNodes[0].textContent.trim().toLowerCase() > llist.childNodes[0].textContent.trim().toLowerCase()) {
        orderlist.insertBefore(newItem, llist);
        return;
      }
    }
    orderlist.appendChild(newItem);
  }

}

function reverseTheListOrder() {
  let orderChangeButton = document.getElementById('sort');
  if (orderChangeButton.textContent[0] === '\u2191') {
    orderChangeButton.textContent = '\u2193A-Z';
    sortAscending = false;
  } else {
    orderChangeButton.textContent = '\u2191A-Z';
    sortAscending = true;
    // orderChangeButton.textContent[0] = '\u2191';
  };

  //reverse the order;
  let orderlist = document.getElementById('list');
  for (let i = 1; i < orderlist.children.length; i++) {
    // console.log(orderlist.firstChild);
    orderlist.insertBefore(orderlist.children[i], orderlist.firstChild);
  };
  showPageN(pageNum);
}

//set pagination;
window.onload = function () {
  paginationBar();
  showPageN(pageNum);
};

function paginationBar() {
  let listNode = document.getElementById('list');
  let pageNode = document.getElementById('pagination');

  //remoce stored children of pagination;
  pageNode.innerHTML = '';
  // console.log(listNode.children.length);

  //previous button
  let firstButton = document.createElement('button');
  firstButton.type = 'button';
  firstButton.innerHTML = '<';
  firstButton.onclick = function () {
    if (pageNum === 0) {alert('This is the first page.');}
    else {
      pageNum -= 1;
      showPageN(pageNum);
    }
  };
  pageNode.appendChild(firstButton);

  //button for each page;
  for (let i = 0; i < Math.max(1,Math.ceil(listNode.children.length / pageSize)); i++) {
    let newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.innerHTML = i + 1;
    newButton.onclick = function () {
      pageNum = Number(newButton.innerHTML) - 1;
      showPageN(pageNum);
    };

    pageNode.appendChild(newButton);
  }

  // next button;
  let lastButton = document.createElement('button');
  lastButton.type = 'button';
  lastButton.innerHTML = '>';
  lastButton.onclick = function () {
    if (pageNum === Math.ceil(listNode.children.length / pageSize) - 1 || listNode.children.length === 0) {
      alert('This is the last page.');
    } else {
      pageNum += 1;
      showPageN(pageNum);
    }};
  pageNode.appendChild(lastButton);


}



function showPageN(pageNumber) {
  let listNode = document.getElementById('list');

  for (let item of listNode.children) {
    item.style.display = 'none';
  }

  for (let item = pageNumber * pageSize; item < (pageSize + pageNumber * pageSize); item ++) {
    if (!listNode.children[item]) break;
    // console.log(listNode.children[item]);
    listNode.children[item].style.display = 'list-item';
  }

  let pageNode = document.getElementById('pagination');
  // if only one page, then only one button here;

  for (let page = 0; page < pageNode.children.length - 1; page++) {
    // console.log(pageNode.children[page],pageNode.children;
    // console.log(pageNode.children[page]);
    if (page === pageNum + 1) {
      pageNode.children[page].style.backgroundColor = '#0229b5';
    } else {
      pageNode.children[page].style.backgroundColor = null;
    }
  }
}
