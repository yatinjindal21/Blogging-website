//------------------------ home button--------------------------------
// window.onload = function () {
//     const button = document.getElementById("home-button");
//     button.click();
//  };

//--------------------------- open search------------------------------------

// const search = document.getElementById('search-button');
// const searchbar = document.querySelector('#searchbar');
// const cover = document.querySelector('#cover-screen');


function openSearch() {

   const searchbar = document.getElementById('searchbar');
   searchbar.classList.toggle('hidden');
   searchbar.classList.toggle('shown');
   
   const cover = document.getElementById('cover-screen');
   cover.classList.toggle('d-none');
   cover.classList.toggle('d-block');


   // const w = searchbar.style.left;
   // const computedStyle = window.getComputedStyle(searchbar);
   // const seaerchwidth = parseInt(computedStyle.width);
   // const computedwindow = parseInt(window.innerWidth);

   // console.log(seaerchwidth);
   // console.log(computedwindow);
   // const ratio = Math.round(computedwindow/seaerchwidth);
   // console.log(ratio);

   // if (ratio === 4) {
   //    if (w === '75%') {
   //       searchbar.style.left = '100%';
   //       cover.style.display = "none";
   //    }
   //    else {
   //       searchbar.style.left = '75%';
   //       cover.style.display = "block";
   //    }
   // }
   // else if (ratio === 1){
   //    if (w === '75%') {
   //       searchbar.style.left = '100%';
   //       cover.style.display = "none";
   //    }
   //    else {
   //       searchbar.style.left = '0%';
   //       cover.style.display = "block";
   //    }
   // }
};

function openSelected(id){
   location.href = `/view-blog/${id}`;
}

function searchContent(event) {
   const item = event.target.value;

   if (item === "") {
      const resultsContainer = document.getElementById('searched-content');
      resultsContainer.innerHTML = '';

      const emptysearch = document.createElement('h4');
      emptysearch.innerHTML = 'Type Something to Search ✌️';
      emptysearch.style.margin = '50px';
      emptysearch.style.color = '#2E3944';
      resultsContainer.appendChild(emptysearch);
   } else {
      fetch(`/get-searched-records?item=` + encodeURIComponent(item))
         .then(response => response.json())
         .then(data => {

            const resultsContainer = document.getElementById('searched-content');
            resultsContainer.innerHTML = ''; // Clear previous results

            let hasResults = false; // Track if there are any results

            // -------------------------------- SEARCHING BLOGS -------------------------------
            if (data.blogs && data.blogs.length > 0) {
               const blogsearch = document.createElement('span');
               blogsearch.id = "search-title";
               blogsearch.innerHTML = 'Blogs';
               resultsContainer.appendChild(blogsearch);

               data.blogs.forEach(blog => {
                  const linkElement = document.createElement('a');
                  linkElement.id = 'search-list';
                  linkElement.className = 'p-2 nav-icons2 d-flex align-items-center';
                  linkElement.style.height = '16.66%';
                  linkElement.style.textDecoration = 'none';
                  linkElement.style.color = 'black';
                  linkElement.onclick = () => openSelected(blog.blogid);

                  const imgElement = document.createElement('img');
                  imgElement.src = `/uploads/${blog.image}`;
                  imgElement.alt = 'Logo';
                  imgElement.width = 25;
                  imgElement.height = 25;
                  imgElement.className = 'rounded-circle border border-3 border-dark';
                  imgElement.id = 'user-pic';
                  linkElement.appendChild(imgElement);

                  const spanElement = document.createElement('span');
                  spanElement.className = 'search-name ms-3';
                  spanElement.innerHTML = `<b>${blog.blogname}</b>`;
                  linkElement.appendChild(spanElement);

                  resultsContainer.appendChild(linkElement);
               });

               hasResults = true;
            }

            // -------------------------------- SEARCHING USERS ----------------------------------------
            if (data.users && data.users.length > 0) {
               const usersearch = document.createElement('span');
               usersearch.id = "search-title";
               usersearch.innerHTML = 'Accounts';
               resultsContainer.appendChild(usersearch);

               data.users.forEach(user => {
                  const linkElement = document.createElement('a');
                  linkElement.id = 'search-list';
                  linkElement.className = 'p-2 nav-icons2 d-flex align-items-center';
                  linkElement.style.height = '16.66%';
                  linkElement.style.textDecoration = 'none';
                  linkElement.style.color = 'black';

                  const imgElement = document.createElement('img');
                  imgElement.src = `/uploads/${user.pic}`;
                  imgElement.alt = 'Logo';
                  imgElement.width = 25;
                  imgElement.height = 25;
                  imgElement.className = 'rounded-circle border border-3 border-dark';
                  imgElement.id = 'user-pic';
                  linkElement.appendChild(imgElement);

                  const spanElement = document.createElement('span');
                  spanElement.className = 'search-name ms-3';
                  spanElement.innerHTML = `<b>${user.username}</b>`;
                  linkElement.appendChild(spanElement);

                  resultsContainer.appendChild(linkElement);
               });

               hasResults = true;
            }

            // Handle the case when no results are found
            if (!hasResults) {
               const noresults = document.createElement('h4');
               noresults.innerHTML = 'No results found 🤡';
               noresults.style.margin = '50px';
               noresults.style.color = '#2E3944';
               resultsContainer.appendChild(noresults);
            }
         })
         .catch(error => alert('Error:', error));
   }
}


$(document).ready(function () {
   //--------------------------------Navbar ---------------------------
   $(window).resize(function () {
      if ($(window).width() > $(window).height()) {
         $('#nav-control').removeClass('fixed-bottom');
      }
      else {
         $('#nav-control').addClass('fixed-bottom');
      }
   });

   $('#searching').focusin(function () {
      $('.bi-search').addClass('glow-icon');
      $('#search-box').addClass('glow-search');
      $('#search-list').css('display', 'block');
   })

   $('#searching').focusout(function () {
      $('.bi-search').removeClass('glow-icon');
      $('#search-box').removeClass('glow-search');
      // $('#search-list').css('display', 'none');
   })

   var au = localStorage.getItem("activeID");
   $("#username").val(au);

   localStorage.setItem("activeID", au);
});


