const carouselImages = document.getElementById("carouselImages");
const carouselButtons = document.getElementById("carouselButtons");
const totalSlides = document.querySelectorAll(
".carousel-images img"
).length;

let currentIndex = 0;

// Tự động chuyển slide sau mỗi 3 giây
const autoSlideInterval = 3000; // Thời gian chuyển (ms)
let interval = setInterval(nextSlide, autoSlideInterval);

function nextSlide() {
currentIndex = (currentIndex + 1) % totalSlides; // Chuyển sang slide tiếp theo
updateCarousel();
}

function updateCarousel() {
const offset = -currentIndex * 100; // Mỗi ảnh chiếm 100% chiều rộng container
carouselImages.style.transform = `translateX(${offset}%)`;

const buttons = document.querySelectorAll(".carousel-buttons button");
buttons.forEach((button) => button.classList.remove("active"));
buttons[currentIndex].classList.add("active");
}

// Tạo các nút điều hướng
for (let i = 0; i < totalSlides; i++) {
const button = document.createElement("button");
button.textContent = i + 1;
button.dataset.index = i;
button.addEventListener("click", () => {
    clearInterval(interval); // Dừng tự động chuyển khi người dùng nhấn nút
    currentIndex = i;
    updateCarousel();
    interval = setInterval(nextSlide, autoSlideInterval); // Restart tự động chuyển
});
carouselButtons.appendChild(button);
}

// Khởi tạo slide đầu tiên
updateCarousel();
///////////////////////////////////////////////////////FILTER///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lấy các phần tử
const filterBtn = document.querySelector(".btn-filter");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");

// thanh kéo
const priceRange = document.getElementById("priceRange");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const filterButton = document.querySelector(".filter-button");
// Cập nhật giá trị giá từ thanh trượt
priceRange.addEventListener("input", () => {
  const priceValue = priceRange.value;
  minPrice.textContent = priceValue;
  maxPrice.textContent = 100;
});
// Thanh filter price
$(document).ready(function () {
    // Hàm cập nhật URL
    
    // Khởi tạo slider với giá trị min/max và bước
    $("#priceRange").slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100], // giá trị mặc định
      slide: function (event, ui) {
        // Cập nhật giá trị khi người dùng kéo slider
        $("#range-value").text(
          "Price Range: $" + ui.values[0] + " - $" + ui.values[1]
        );
  
        // Cập nhật giá trị minPrice và maxPrice
        $("#minPrice").val(ui.values[0]);
        $("#maxPrice").val(ui.values[1]);
  
        // Cập nhật URL
        updateURL2();
      },
    });
  
    // Hiển thị giá trị mặc định trên slider và gán giá trị cho minPrice, maxPrice
    const defaultMin = $("#priceRange").slider("values", 0);
    const defaultMax = $("#priceRange").slider("values", 1);
    $("#range-value").text("Price Range: $" + defaultMin + " - $" + defaultMax);
    
    $("#minPrice").val(defaultMin);
    $("#maxPrice").val(defaultMax);
  
    $("input[name='category']").on("change", updateURL2);
    $("input[name='author']").on("change", updateURL2);
  
    $("#page-item").on("change", function () {
      updateURL2();
    });
  
    // Gắn sự kiện khi nhấn nút lọc
    $("#filterButton").click(function () {
      updateURL2();  // Cập nhật URL khi bấm nút lọc
    });
  });

// Lắng nghe sự kiện nhấn nút lọc
filterButton.addEventListener("click", () => {
  const selectedMinPrice = minPrice.textContent;
  const selectedMaxPrice = maxPrice.textContent;
  
  // Đây là nơi bạn có thể áp dụng các bộ lọc cho danh sách sách (hoặc các sản phẩm)
  // Ví dụ, lọc các sản phẩm có giá nằm trong khoảng [selectedMinPrice, selectedMaxPrice]
  
  console.log(`Lọc theo giá từ $${selectedMinPrice} đến $${selectedMaxPrice}`);
});
////////////////////////////////////////////////PROFILE-CARD//////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
const userIcon = document.querySelector(".user-icon");
const profileCard = document.querySelector(".profile-card");
const closeBtn = document.querySelector(".close-btn");

// Hiển thị/hide khi click vào icon
userIcon.addEventListener("click", (event) => {
    event.preventDefault();
    profileCard.style.display = profileCard.style.display === "none" || profileCard.style.display === "" ? "block" : "none";
});

// Đóng khi click vào nút đóng
closeBtn.addEventListener("click", () => {
    profileCard.style.display = "none";
});

// Ẩn profile-card khi click ngoài khu vực
document.addEventListener("click", (event) => {
    if (!profileCard.contains(event.target) && !userIcon.contains(event.target)) {
        profileCard.style.display = "none";
    }
});
});
////////////////////////////////////////////////////API LIST BOOK//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render books
function renderbooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Xóa nội dung cũ

    books.forEach(book => {
        // Bao quanh hình ảnh bằng thẻ <a> để tạo liên kết
        const bookHTML = `
            <div class="book-item">
                <div class="inner-box">
                    <div class="inner-image">
                        <a href="../detail/detail.html?id=${book._id}">
                            <img 
                                src="${book.thumbnail || 'assets/images/sp.jpg'}" 
                                alt="${book.title}" 
                                style="cursor: pointer;" />
                        </a>
                    </div>
                    <div class="inner-content">
                        <div class="inner-title">${book.title}</div>
                        <div class="inner-author">${book.author}</div>
                        <div class="inner-price-new">
                        ${book.price}</div>
                        <div class="inner-price-old">{price-old}</div>
                      
                    </div>
                </div>
            </div>
        `;
        bookList.innerHTML += bookHTML;
    });
}

/////////////////////////////////////////CHECK-BOX///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hàm để lấy dữ liệu tác giả và thể loại
function fetchData() {
    fetch('http://localhost:3000/authors')
      .then(response => response.json())
      .then(authors => {
        const authorList = document.getElementById('author-list');
        authors.forEach(author => {
          const li = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = author.name;  
          const label = document.createElement('label');
          label.setAttribute('for', author.name);
          label.textContent = author.name; 
          li.appendChild(checkbox);
          li.appendChild(label);
          authorList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching authors:', error));
  
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(categories => {
        const genreList = document.getElementById('genre-list');
        categories.forEach(category => {
          const li = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = category.id;
          const label = document.createElement('label');
          label.setAttribute('for', category.id);
          label.textContent = category.name;  // Thể loại sách
          li.appendChild(checkbox);
          li.appendChild(label);
          genreList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching categories:', error));
  }
/////////////////////////////////////////SEARCH////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function searchBooks() {
    const selectedAuthors = [];
    const selectedGenres = [];
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const sortOption = document.querySelector('.sorting select').value;
    // Lấy các tác giả đã chọn
    document.querySelectorAll('#author-list input[type="checkbox"]:checked').forEach(checkbox => {
        selectedAuthors.push(checkbox.id);
    });

    // Lấy các thể loại đã chọn
    document.querySelectorAll('#genre-list input[type="checkbox"]:checked').forEach(checkbox => {
        selectedGenres.push(checkbox.id);
    });

    // Xây dựng query params
    const params = new URLSearchParams();
    if (selectedAuthors.length) params.append('author', selectedAuthors.join(','));
    if (selectedGenres.length) params.append('genre', selectedGenres.join(','));
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortOption !== "Default sorting") params.append('sort', sortOption);
    
    params.append('page', 1);  // Nếu bạn có phân trang, đặt page là 1 khi tìm kiếm lại
    
    // Gọi API tìm kiếm sách
    fetch(`http://localhost:3000/book/search?${params.toString()}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const bookList = document.getElementById('book-list');
      bookList.innerHTML = '';

      // Kiểm tra nếu có sách trong dữ liệu trả về
      if (data.books.length > 0) {
          // Nếu có sách, hiển thị chúng
          data.books.forEach(book => {
              const bookDiv = document.createElement('div');
              bookDiv.classList.add('book');
              bookDiv.innerHTML = `
                  <div class="book-item">
                  <div class="inner-box">
                      <div class="inner-image">
                          <a href="../detail/detail.html?id=${book._id}">
                              <img 
                                  src="${book.thumbnail || 'assets/images/sp.jpg'}" 
                                  alt="${book.title}" 
                                  style="cursor: pointer;" />
                          </a>
                      </div>
                      <div class="inner-content">
                          <div class="inner-title">${book.title}</div>
                          <div class="inner-author">${book.author}</div>
                          <div class="inner-price-new">
                          ${book.price}</div>
                          <div class="inner-price-old">{price-old}</div>
                        
                      </div>
                  </div>
              </div>
              `;
              bookList.appendChild(bookDiv); // Thêm sách vào book-list
          });
        currentPage = 1
      } else {
          // Nếu không có sách, hiển thị thông báo
          bookList.innerHTML = '<p>No books found matching your criteria.</p>';
      }
      
  })
    .catch(error => {
        console.error('Error fetching books:', error);
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    });
  }
// Gọi hàm fetchData khi trang được tải
document.addEventListener('DOMContentLoaded', fetchData);
// Gắn sự kiện cho nút tìm kiếm
const searchButton = document.querySelector('.filter-button');
searchButton.addEventListener('click', searchBooks);
searchButton.addEventListener('click', updateURL2);
searchButton.addEventListener('click', () => fetchbooks(1));
//////////////////////////////////////////////////////////URL///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateURL2() {
    const urlParams = new URLSearchParams(window.location.search);
    const author = [];
    const genre = [];
    document.querySelectorAll('#author-list input[type="checkbox"]:checked').forEach(checkbox => {
        author.push(checkbox.id);
    });

    // Lấy các thể loại đã chọn
    document.querySelectorAll('#genre-list input[type="checkbox"]:checked').forEach(checkbox => {
        genre.push(checkbox.id);
    });
    const minPrice = $("#minPrice").val(); // Lấy giá trị minPrice từ input
    const maxPrice = $("#maxPrice").val(); // Lấy giá trị maxPrice từ input
    const page = currentPage ; // Lấy giá trị page, mặc định là trang 1 nếu không có giá trị
    console.log(page)
    
    // Cập nhật các tham số vào URL
    if (genre) urlParams.set("genre", genre);
    if (author) urlParams.set("author", author);
    if (minPrice) urlParams.set("minPrice", minPrice);
    if (maxPrice) urlParams.set("maxPrice", maxPrice);
    urlParams.set("page", page);  // Đảm bảo rằng trang hiện tại luôn được thêm vào URL

    // Cập nhật URL mà không làm tải lại trang
    window.history.pushState({}, "", "?" + urlParams.toString());
  }


/////////////////////////////////////////////////////////PAGINATION///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const BASE_URL = 'http://localhost:3000/book';
const LIMIT = 20; // Số sản phẩm trên mỗi trang
let currentPage = 1; // Trang hiện tại
document.addEventListener('DOMContentLoaded', async () => {
    // Kiểm tra xem có tham số 'page' trong URL không
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromURL = parseInt(urlParams.get('page'));
    
    if (!isNaN(pageFromURL)) {
        // Chuyển về trang đầu (page 1)
        currentPage = 1;
        
        // Xóa tham số page trong URL mà không reload trang
        history.replaceState(null, '', window.location.pathname);  // Xóa tất cả tham số URL
    }

    // Gọi hàm fetch để lấy dữ liệu sách khi trang tải
    await fetchbooks(currentPage);
    
    
    
    
});
    
// Fetch books
async function fetchbooks(page) {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre') || ''; // Lấy thể loại
    const author = urlParams.get('author') || ''; // Lấy tác giả
    const minPrice = urlParams.get('minPrice') || ''; // Lấy giá min
    const maxPrice = urlParams.get('maxPrice') || ''; // Lấy giá max
    const sortOption = document.querySelector('.sorting select').value || 'Default sorting';
    document.getElementById('spinner-container').style.display = 'flex';

        // Thời gian hiển thị spinner (1 giây)
        setTimeout(() => {
            document.getElementById('spinner-container').style.display = 'none';
        }, 1000);
    try {
        
        const queryParams = new URLSearchParams({
            author,
            genre,
            minPrice,
            maxPrice,
            page,
            sort: sortOption !== 'Default sorting' ? sortOption : ''
        });
        console.log("Query: ")
        console.log(queryParams.get('page'));
        console.log(`Fetching books for page ${page}`);
        console.log(`Fetching books from http://localhost:3000/book/search?${queryParams}`);

        const response = await fetch(`http://localhost:3000/book/search?${queryParams}`);
        const data = await response.json();
        console.log('Fetched books:', data);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        console.log("TOTAL",data.totalPages)
        if (data.totalPages === 0) {
            document.getElementById('book-list').innerHTML = '<p class="centered-text">Không có sách phù hợp</p>'; // Thay thế nội dung của danh sách sách bằng thông báo
            document.getElementById('pagination-list').innerHTML = ''; // Xóa phân trang
        } else {
            renderbooks(data.books); // Hiển thị sản phẩm
            renderPagination(data.totalPages, page); // Hiển thị phân trang
        }
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Render pagination
function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination-list');
    paginationContainer.innerHTML = ''; // Clear previous content
    console.log("Page",currentPage)
    // Create "Prev" button
    const prevButton = document.createElement('button');
    prevButton.textContent = '<';
    prevButton.classList.add('pagination-button');
    prevButton.disabled = currentPage === 1;  // Disable when on the first page
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateURL(currentPage);  // Update URL
            window.scrollTo(0, 0);
            fetchbooks(currentPage);  // Fetch new data for the current page
        }
    });
    paginationContainer.appendChild(prevButton);

    // Create page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-button');
        if (i === currentPage) {
            pageButton.classList.add('active'); // Highlight the current page
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            updateURL(currentPage);  // Update URL
            window.scrollTo(0, 0);
            fetchbooks(currentPage);  // Fetch new data for the selected page
        });

        paginationContainer.appendChild(pageButton);
    }

    // Create "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = '>';
    nextButton.classList.add('pagination-button');
    nextButton.disabled = currentPage === totalPages;  // Disable when on the last page
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateURL(currentPage);  // Update URL
            window.scrollTo(0, 0);
            fetchbooks(currentPage);  // Fetch new data for the next page
        }
    });
    paginationContainer.appendChild(nextButton);
}
// Cập nhật URL khi bấm vào số trang
function updateURL(page) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);  // Thêm hoặc cập nhật tham số 'page'
    history.pushState({}, '', url);  // Cập nhật URL mà không reload trang
}
const sortSelect = document.querySelector('.sorting select');

// Lắng nghe sự kiện thay đổi lựa chọn sắp xếp
sortSelect.addEventListener('change', () => {
    // Gọi lại fetchBooks khi thay đổi sắp xếp
    const currentPage = getCurrentPageFromURL();
    fetchbooks(currentPage);
});
function getCurrentPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    return page ? parseInt(page) : 1;
}

