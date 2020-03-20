crudObj = {
  pageNum: 0,
  sortAscending: true,
  pageSize: 10,

  //get favorites from local storage or an empty object;
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  inputVal: document.getElementById('inputcontent'),
  listNode: document.getElementById('list'),
  updateVal: document.getElementById('updatedcontent'),
  editDiv: document.getElementById('edit'),
  orderChangeButton: document.getElementById('sort'),
  favoriteContent: document.getElementById('favoriteList'),
  pageNode: document.getElementById('pagination'),
  editElement: null,
  closeBtn: document.querySelector('.close-btn'),
  modal: document.querySelector('.modal'),

  insertInList: function () {
    //check if input is NULL;
    if (!this.inputVal.value.trim()) {
      alert('Input cannot be empty! Please try again.');
      return;
    }

    //creat a new li element
    let newList = document.createElement('li');
    newList.innerHTML = this.inputVal.value;
    newList.id = this.inputVal.value;
    // let textNode = document.createTextNode(this.inputVal.value);
    // newList.appendChild(textNode);

    //add delete button to it;
    let delbutton = document.createElement('button');
    delbutton.type = 'button';
    delbutton.className = 'no';
    delbutton.innerHTML = 'del';
    delbutton.onclick = () => crudObj.deleteTheList();
    newList.appendChild(delbutton);

    //add edit button to it;
    let editbutton = document.createElement('button');
    editbutton.type = 'button';
    editbutton.className = 'yes';
    editbutton.innerHTML = 'edit';
    editbutton.onclick = () => crudObj.startEdit();
    newList.appendChild(editbutton);

    //sort to the right positon and insert;
    this.sortAndInsert(newList);

    this.addFavorites();

    //call pagination.
    this.paginationBar();

    //show the updated page;
    this.showPageN(this.pageNum);

    //remove content of input;
    this.inputVal.value = '';
  },

  showPageN: function (pageNumber) {
    for (let item of this.listNode.children) {
      item.style.display = 'none';
    }

    for (let item = pageNumber * this.pageSize; item < (this.pageSize + pageNumber * this.pageSize); item ++) {
      if (!this.listNode.children[item]) break;
      this.listNode.children[item].style.display = 'list-item';
    }

    // if only one page, then only one button here;

    for (let page = 0; page < this.pageNode.children.length - 1; page++) {
      if (page === this.pageNum + 1) {
        this.pageNode.children[page].style.backgroundColor = '#0229b5';
      } else {
        this.pageNode.children[page].style.backgroundColor = null;
      }
    }
  },

  editedTheList: function () {
    //check the updated content is NULL;

    if (!this.updateVal.value.trim()) {
      alert('Updates cannot be empty! Please try again.');
      return;
    }

    this.editElement.childNodes[0].textContent = this.updateVal.value;

    //sort and insert into the specific position;
    this.sortAndInsert(this.editElement);

    this.showPageN(this.pageNum);

    //hide the edit div;
    this.editDiv.style.display = 'none';
  },

  cancelEdit: function () {
    this.editDiv.style.display = 'none';
  },

  startEdit: function () {
    // to display the edit div
    this.editDiv.style.display = 'block';

    // put the content in edit input box;
    //get the position of the list that user want to edit;
    this.editElement = event.srcElement.parentElement;
    this.updateVal.value = this.editElement.childNodes[0].textContent;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  deleteTheList: function () {
    this.editElement = event.srcElement.parentElement;
    this.favorites.splice(this.favorites.indexOf(this.editElement.id), 1);
    this.editElement.remove();
    this.paginationBar();
    this.showPageN(this.pageNum);
  },

  sortAndInsert: function (newItem) {

    //compared with each value of the element;
    if (this.sortAscending) {
      for (let llist of this.listNode.children) {
        if (newItem.childNodes[0].textContent.trim().toLowerCase() < llist.childNodes[0].textContent.trim().toLowerCase()) {
          this.listNode.insertBefore(newItem, llist);
          return;
        }
      }
      this.listNode.appendChild(newItem);
    } else {
      for (let llist of this.listNode.children) {
        if (newItem.childNodes[0].textContent.trim().toLowerCase() > llist.childNodes[0].textContent.trim().toLowerCase()) {
          this.listNode.insertBefore(newItem, llist);
          return;
        }
      }
      this.listNode.appendChild(newItem);
    }
  },

  reverseTheListOrder: function () {
    if (this.orderChangeButton.textContent[0] === '\u2191') {
      this.orderChangeButton.textContent = '\u2193A-Z';
      this.sortAscending = false;
    } else {
      this.orderChangeButton.textContent = '\u2191A-Z';
      this.sortAscending = true;
    }

    //reverse the order;
    for (let i = 1, len = this.listNode.children.length; i < len; i++) {
      this.listNode.insertBefore(this.listNode.children[i], this.listNode.firstChild);
    }

    this.showPageN(this.pageNum);
  },

  paginationBar: function () {
    //remoce stored children of pagination;
    this.pageNode.innerHTML = '';

    //previous button
    let firstButton = document.createElement('button');
    firstButton.type = 'button';
    firstButton.innerHTML = '<';
    firstButton.onclick = function () {
      if (crudObj.pageNum === 0) {
        alert('This is the first page.');
      } else {
        crudObj.pageNum -= 1;
        crudObj.showPageN(crudObj.pageNum);
      }
    };
    this.pageNode.appendChild(firstButton);

    //button for each page;
    for (let i = 0, maxPage = Math.max(1,Math.ceil(this.listNode.children.length / this.pageSize)); i < maxPage; i++) {
      let newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.innerHTML = i + 1;
      newButton.onclick = function () {
        crudObj.pageNum = Number(newButton.innerHTML) - 1;
        crudObj.showPageN(crudObj.pageNum);
      };

      this.pageNode.appendChild(newButton);
    }

    // next button;
    let lastButton = document.createElement('button');
    lastButton.type = 'button';
    lastButton.innerHTML = '>';
    lastButton.onclick = function () {
      if (crudObj.pageNum === Math.ceil(crudObj.listNode.children.length / crudObj.pageSize) - 1 || crudObj.listNode.children.length === 0) {
        alert('This is the last page.');
      } else {
        crudObj.pageNum += 1;
        crudObj.showPageN(crudObj.pageNum);
      }
    };
    this.pageNode.appendChild(lastButton);
  },

  getURL: function (url) {
    return new Promise(function (resolve, reject) {
      let req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.onload = function () {
        if (req.status === 200) {
          // console.log(req, 'res')
          resolve(req.responseText);
        } else {
          reject(new Error(req.statusText));
        }
      };

      req.onerror = function () {
        reject(new Error(req.statusText));
      };

      req.send();
    });
  },

  createListElement: function (title, releaseDate) {
    //creat a new li element
    let newList = document.createElement('li');
    newList.innerHTML = title + ' (' + releaseDate + ')';
    newList.id = title;

    //add delete button to it;
    let delbutton = document.createElement('button');
    delbutton.type = 'button';
    delbutton.className = 'no';
    delbutton.innerHTML = 'del';
    delbutton.onclick = () => crudObj.deleteTheList();
    newList.appendChild(delbutton);

    //add edit button to it;
    let editbutton = document.createElement('button');
    editbutton.type = 'button';
    editbutton.className = 'yes';
    editbutton.innerHTML = 'edit';
    editbutton.onclick = () => crudObj.startEdit();
    newList.appendChild(editbutton);


    //sort to the right positon and insert;
    this.sortAndInsert(newList);
  },

  addFavorites: function () {
    //add fav class to favorite lists;
    for (let item of this.favorites) {
      document.getElementById(item).className = 'fav';
    }

    //click evernt generation;
    document.querySelector('#list').addEventListener('click', function (event) {
      // console.log(event);
      let id = event.target.id,
          target = event.target,
          index = crudObj.favorites.indexOf(id);

      if (!id) return;

      if (index === -1) {
        crudObj.favorites.push(id);
        console.log(crudObj.favorites);
        target.className = 'fav';
      } else {
        crudObj.favorites.splice(index, 1);
        console.log(crudObj.favorites);
        target.className = '';
      }

      localStorage.setItem('favorites', JSON.stringify(crudObj.favorites));
    });
  },

  showModal: function () {
    this.modal.style.display = 'block';
    console.log(this.favoriteContent.children);
    while (this.favoriteContent.hasChildNodes()) {
      this.favoriteContent.removeChild(this.favoriteContent.firstChild);
    }
      
    for (let item of this.favorites) {
      let newList = document.createElement('p');
      newList.innerHTML = item;
      crudObj.favoriteContent.appendChild(newList);
    }

  },

  closeButton: function () {
    this.closeBtn.onclick = function () {
      crudObj.modal.style.display = 'none';
    };
  },
};

window.onload = function () {
  let page = 1;
  var URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=192609c7f94b658639a4a513b0421e27&language=en-US&page=' + page;
  crudObj.getURL(URL).then(function onFulfilled(value) {
    let resObj = JSON.parse(value);
    // innerHTML
    for (let i = 0; i < 20; i++) {
      let movieItem = resObj.results[i];
      crudObj.createListElement(movieItem.title, movieItem.release_date);
    }
    crudObj.paginationBar();
    crudObj.showPageN(crudObj.pageNum);
    crudObj.addFavorites();
  })
  .catch(function onRejected(error) {
    console.log(error);
  });
};

window.onclick = function(element) {
  if (element.target == crudObj.modal) {
    crudObj.modal.style.display = 'none';
  }
};

crudObj.closeBtn.onclick = function () {
  crudObj.modal.style.display = 'none';
};
