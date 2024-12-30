document.addEventListener('DOMContentLoaded', () => {
  const salesContainer = document.getElementById('salesBookList');
  const editSalePopup = document.getElementById('editSalePopup');
  const deleteSalePopup = document.getElementById('deleteSalePopup');
  const closeEditSalePopupBtn = document.getElementById('closeEditSalePopup');
  const closeDeleteSalePopupBtn = document.getElementById('closeDeleteSalePopup');
  const addSalePopup = document.getElementById('addSalePopup');
  const openAddSaleModalBtn = document.getElementById('openAddSaleModal');
  const closeAddSalePopupBtn = document.getElementById('closeAddSalePopup');
  // Hàm reset các trường trong popup
  function resetPopupFields() {
    document.getElementById('editSaleID').value = '';
    document.getElementById('editAddDiscountPrice').value = '';
    document.getElementById('editAddDiscountPercent').value = '';
    document.getElementById('editStartDate').value ='';
    document.getElementById('editEndDate').value ='';
    document.getElementById('editAddSoldCount').value = '';
    document.getElementById('saleMaxQuality').value = '';
    document.getElementById('editSaleDescription').value = '';
  }
  // Hàm hiển thị modal
  function showModal(modal) {
    modal.style.display = 'flex';
  }

  // Hàm ẩn modal
  function hideModal(modal) {
    modal.style.display = 'none';
  }
  // Khi bấm nút "New Deal"
  openAddSaleModalBtn.addEventListener('click', () => {
    showModal(addSalePopup);
  });

  // Khi bấm nút "Close" trong popup
  closeAddSalePopupBtn.addEventListener('click', () => {
    hideModal(addSalePopup);
  });
  // Sự kiện đóng modal Edit
  closeEditSalePopupBtn.addEventListener('click', () => hideModal(editSalePopup));

  // Sự kiện đóng modal Delete
  closeDeleteSalePopupBtn.addEventListener('click', () => hideModal(deleteSalePopup));
  let currentPage =1;
  // Hàm tải dữ liệu sách
  function fetchBooks(page = 1) {
    const BOOKS_PER_PAGE = 4;
  
    fetch(`http://localhost:3000/staff/sales?page=${page}&limit=${BOOKS_PER_PAGE}`)
      .then((response) => response.json())
      .then((data) => {
        const { books, totalPages, currentPage } = data;
  
        // Hiển thị danh sách sách
        renderSalesBooks(books);
  
        // Hiển thị phân trang
        renderSalesPagination(totalPages, currentPage);
      })
      .catch((error) => console.error('Error fetching books:', error));
  }
  function renderSalesBooks(books) {
    const salesContainer = document.getElementById('salesBookList');
    salesContainer.innerHTML = ''; // Xóa dữ liệu cũ
  
    books.forEach((book) => {
      const bookHTML = `
        <div class="col-xl-3">
          <div class="book-box">
            <div class="book-image">
              <img src="${book.thumbnail}" alt="${book.title}" />
            </div>
            <div class="book-content">
              <h4>${book.title}</h4>
              <p>Author: ${book.author}</p>
              <p>New Price: $${(book.price * (1 - book.percentDiscount / 100)).toFixed(2)}</p>
              <p>Prime Price: $${book.price}</p>
              <button class="editSale" data-id="${book._id}">Edit</button>
              <button class="deleteBtn" data-id="${book._id}">Delete</button>
            </div>
          </div>
        </div>
      `;
      salesContainer.insertAdjacentHTML('beforeend', bookHTML);
    });
  }
  function renderSalesPagination(totalPages, currentPage) {
    const paginationList = document.getElementById('salespagination-list');
    paginationList.innerHTML = ''; // Xóa nội dung cũ
  
    // Nút "Previous"
    const prevButton = document.createElement('li');
    prevButton.innerHTML = `<a href="#topSales"><i class="fa-solid fa-chevron-left"></i></a>`;
    if (currentPage === 1) prevButton.classList.add('disabled');
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        fetchBooks(currentPage - 1);
      }
    });
    paginationList.appendChild(prevButton);
  
    // Số trang
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('li');
      pageButton.innerHTML = `<a href="#topSales">${i}</a>`;
      if (currentPage === i) {
        pageButton.classList.add("current");
      }
  
      pageButton.addEventListener('click', () => {
        if (currentPage !== i) {
          fetchBooks(i);
        }
      });
      paginationList.appendChild(pageButton);
      
    }
  
    // Nút "Next"
    const nextButton = document.createElement('li');
    nextButton.innerHTML = `<a href="#topSales"><i class="fa-solid fa-chevron-right"></i></a>`;
    if (currentPage === totalPages) nextButton.classList.add('disabled');
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        fetchBooks(currentPage + 1);
      }
    });
    paginationList.appendChild(nextButton);
  }
////////////////////////////////////////////////////////////////EDIT//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Lắng nghe sự kiện trên container
  salesContainer.addEventListener('click', (event) => {
    const target = event.target;

    // Nếu nhấn vào nút Edit
    if (target.classList.contains('editSale')) {
      const bookId = target.dataset.id;
      document.getElementById('editSaleID').value = bookId;
      // Fetch thông tin Discount liên quan
      fetch(`http://localhost:3000/staff/sales/discount/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
          // Lấy dữ liệu từ discount
          document.getElementById('hiddenOriginPrice').value = data.originalPrice || 0;
          document.getElementById('editDiscountPrice').value = data.discountPrice ||'';
          document.getElementById('editDiscountPercent').value = data.discountPercentage || '';
          document.getElementById('editStartDate').value = data.startDate || '';
          document.getElementById('editEndDate').value = data.endDate || '';
          if (data.dealActive === true) {
            document.getElementById('activeTrue').checked = true;
          } else {
            document.getElementById('activeFalse').checked = true;
          }
          document.getElementById('editSoldCount').value = data.soldCount || '';
          document.getElementById('editMaxQuality').value = data.maxQuantity || '';
          
          // Hiển thị modal
          showModal(editSalePopup);
        })
        .catch((error) => console.error('Error fetching discount:', error));
    }

    // Nếu nhấn vào nút Delete
    if (target.classList.contains('deleteBtn')) {
      const bookId = target.dataset.id;
    
      showModal(deleteSalePopup);
    
      document.getElementById('deleteSaleBtn').onclick = () => {
        fetch(`http://localhost:3000/staff/sales/${bookId}`, {
          method: 'DELETE', // Sử dụng DELETE thay vì PATCH
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => {
            if (response.ok) {
              alert('Discount removed successfully!');
              hideModal(deleteSalePopup);
              fetchBooks(currentPage); // Làm mới giao diện
            } else {
              alert('Failed to remove discount.');
            }
          })
          .catch((error) => console.error('Error removing discount:', error));
      };
    }
  
  });
  document.getElementById('saveEditSalePopup').addEventListener('click', () => {
    const bookId = document.getElementById('editSaleID').value;
    // Dữ liệu từ form
    const discountData = {
      discountPrice: parseFloat(document.getElementById('editDiscountPrice').value),
      discountPercentage: parseFloat(document.getElementById('editDiscountPercent').value),
      startDate: document.getElementById('editStartDate').value,
      endDate: document.getElementById('editEndDate').value,
      dealActive: document.querySelector('input[name="active"]:checked').value === 'true',
      soldCount: parseInt(document.getElementById('editSoldCount').value, 10),
      maxQuantity: parseInt(document.getElementById('editMaxQuality').value, 10),
    };
    fetch(`http://localhost:3000/staff/sales/discount/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discountData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Discount updated successfully!');
        hideModal(editSalePopup);

        fetchBooks(currentPage); // Làm mới danh sách sách
      })
      .catch((error) => console.error('Error updating discount:', error));
  });
  // Gọi hàm fetchBooks khi nhấn vào nút "sale"
  document.getElementById("sale").addEventListener("click", () => {
    currentPage = 1; // Đặt lại currentPage về 1 khi chuyển sang trang Sale
    fetchBooks(currentPage); // Truyền currentPage vào hàm fetchBooks
  });
  const discountPriceInput = document.getElementById('editDiscountPrice');
  const discountPercentInput = document.getElementById('editDiscountPercent');
  const originPriceInput = document.getElementById('hiddenOriginPrice');
  function calculateDiscountPercent() {
    const originPrice = parseFloat(originPriceInput.value);
    const discountPrice = parseFloat(discountPriceInput.value);

    if (!isNaN(originPrice) && !isNaN(discountPrice) && originPrice > 0) {
      const discountPercent = ((originPrice - discountPrice) / originPrice) * 100;
      discountPercentInput.value = discountPercent.toFixed(2);
    }
  }

  function calculateDiscountPrice() {
    const originPrice = parseFloat(originPriceInput.value);
    const discountPercent = parseFloat(discountPercentInput.value);

    if (!isNaN(originPrice) && !isNaN(discountPercent) && originPrice > 0) {
      const discountPrice = originPrice * (1 - discountPercent / 100);
      discountPriceInput.value = discountPrice.toFixed(2);
    }
  }
  // Lắng nghe sự kiện input trên các trường
  discountPriceInput.addEventListener('input', calculateDiscountPercent);
  discountPercentInput.addEventListener('input', calculateDiscountPrice);

///////////////////////////////////////////////////////////////////////ADD///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const saveAddSaleBtn = document.getElementById('saveAddSaleBtn'); // Nút Save

  saveAddSaleBtn.addEventListener('click', () => {
    // Lấy dữ liệu từ các input
    const bookId = document.getElementById('editSaleID').value; // ID của sách
    const discountPrice = parseFloat(document.getElementById('editAddDiscountPrice').value);
    const discountPercent = parseFloat(document.getElementById('editAddDiscountPercent').value);
    const startDate = document.getElementById('editAddStartDate').value; // Start Date
    const endDate = document.getElementById('editAddEndDate').value; // End Date
    const soldCount = parseInt(document.getElementById('editAddSoldCount').value, 10);
    const maxQuantity = parseInt(document.getElementById('saleMaxQuality').value, 10);
    const description = document.getElementById('editSaleDescription').value;
  
    // Tạo dữ liệu gửi lên server
    const data = {
      bookId, // ID của sách
      discountPrice,
      discountPercent,
      startDate, // Start Date
      endDate, // End Date
      soldCount,
      maxQuantity,
      description,
    };
  
    // Gửi yêu cầu POST lên server
    fetch(`http://localhost:3000/staff/sales/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert('Sale added successfully!');
          addSalePopup.style.display = 'none'; // Ẩn popup
          resetPopupFields();
          fetchBooks(currentPage); // Làm mới danh sách sách
        } else {
          alert('Failed to add sale.');
        }
      })
      .catch((error) => console.error('Error adding sale:', error));
  });
});