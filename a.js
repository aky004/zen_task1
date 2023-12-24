const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const apiUrl = 'https://s3.amazonaws.com/open-to-cors/assignment.json';

// Function to fetch and parse JSON data
async function fetchData() {
  try {
    const response = await axios.get(apiUrl);
    const productsObject = response.data.products;
    const products = Object.values(productsObject);
    const sortedProducts = products.sort((a, b) => b.popularity - a.popularity);

    return sortedProducts;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

// Express route to handle the request
app.get('/', async (req, res) => {
  try {
    const sortedProducts = await fetchData();
    const html = `
      <html>
        <head>
          <title>Product List</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          <style>
            body {
              font-family: 'Grumpy', sans-serif;
              margin: 20px;
           
                background-image: url('bg.jpg');
                background-repeat: no-repeat;
                background-attachment: fixed;
                background-size: 100% 100%;
                background-color: #950740; 
             
              /* Dark text color */
            }

            h1 {
              color: #000; /* Orange title color */
              text-align: center;
              margin-bottom: 20px;
              animation: fadeInUp 1s ease-out;
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            ul {
              list-style-type: none;
              padding: 0;
              margin: 0;
            }

            li {
                margin: 5px 100px;
                cursor: pointer;
                color: #EDF5E1; 
                position: relative;
                transition: background-color 0.3s;
                background-color: #000; /* White background for each item */
                border-radius: 5px; /* Rounded corners */
                padding: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle box shadow */
                height: 60px;
              }
  
              li:hover {
                background-color:#4E4E50; /* Light orange background on hover */
                height: 180px;
              }

            .additional-details {
              background-color: #C3073F; /* Orange background for details */
              color: #EDF5E1; /* White text color */
              padding: 10px;
              opacity: 0;
              transition: opacity 1s ease-in-out;
              border-radius: 5px; /* Rounded corners */
              margin-top: 10px;
              text-align: center;
              transition: transform 1s;
            }

            li:hover .additional-details {
              opacity: 1;
              transform: rotateX(360deg) scale(1.1);
            }
          </style>
        </head>
        <body>
          <h1>Product List</h1>
          <ul id="productList">
            ${sortedProducts.map(product => `<li onmouseenter="showProductDetails(this, '${product.title}', '${product.price}', '${product.popularity}', '${product.subcategory}')" onmouseleave="hideProductDetails(this)">
                                              ${product.title}
                                              <div class="additional-details">
                                                <div>Price: $${product.price}</div>
                                                <div>Popularity: ${product.popularity}</div>
                                                <div>Subcategory: ${product.subcategory}</div>
                                              </div>
                                            </li>`).join('')}
          </ul>
        </body>
        <script>
          function showProductDetails(element, title, price, popularity, subcategory) {
            // Display details in the additional-details div
            const additionalDetails = element.querySelector('.additional-details');
            additionalDetails.innerHTML = '<div>Title: ' + title + '</div>' +
              '<div>Price: $' + price + '</div>' +
              '<div>Popularity: ' + popularity + '</div>' +
              '<div>Subcategory: ' + subcategory + '</div>';
          }

          function hideProductDetails(element) {
            // Clear the additional-details div when not hovering
            const additionalDetails = element.querySelector('.additional-details');
            additionalDetails.innerHTML = '';
          }
        </script>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on : http://localhost:3000");
});
