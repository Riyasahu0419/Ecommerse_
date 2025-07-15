import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { toast } from "react-toastify";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isInStock, setIsInStock] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(10);

  const dispatch = useDispatch();

  const addProduct = (product, qty = 1) => {
    if (!isInStock) {
      toast.error("Product is out of stock");
      return;
    }
    
    const productWithDetails = {
      ...product,
      quantity: qty,
      selectedSize,
      selectedColor,
    };
    
    dispatch(addCart(productWithDetails));
    toast.success(`${qty} item(s) added to cart`);
  };

  // Simulate stock check based on product ID
  const checkStock = (productData) => {
    // Mock stock logic - in real app, this would come from API
    const mockStock = Math.floor(Math.random() * 15);
    setStockQuantity(mockStock);
    setIsInStock(mockStock > 0);
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
        checkStock(data);
        setLoading(false);
        
        const response2 = await fetch(
          `https://fakestoreapi.com/products/category/${data.category}`
        );
        const data2 = await response2.json();
        setSimilarProducts(data2.filter(item => item.id !== parseInt(id)));
        setLoading2(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        setLoading2(false);
      }
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 py-3">
            <Skeleton height={500} width="100%" />
          </div>
          <div className="col-md-6 py-5">
            <Skeleton height={30} width={250} />
            <Skeleton height={40} width="80%" className="my-3" />
            <Skeleton height={20} width={150} className="my-2" />
            <Skeleton height={35} width={100} className="my-3" />
            <Skeleton height={80} className="my-3" />
            <Skeleton height={40} width={120} className="my-2" />
            <Skeleton height={50} width="60%" className="my-3" />
          </div>
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const colors = ["Black", "White", "Blue", "Red", "Green"];
    
    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 col-sm-12 py-3">
            <div className="product-image-container position-relative">
              <img
                className="img-fluid rounded shadow-sm"
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "contain",
                  backgroundColor: "#f8f9fa"
                }}
              />
              {!isInStock && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                     style={{backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "0.375rem"}}>
                  <span className="badge bg-danger fs-4 p-3">OUT OF STOCK</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-md-6 py-5">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                {/* <li className="breadcrumb-item">
                  <Link to={`/category/${product.category}`}>{product.category}</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  {product.title?.substring(0, 20)}...
                </li>
              </ol>
            </nav>

            <div className="mb-2">
              <span className="badge bg-secondary text-uppercase">
                {product.category}
              </span>
            </div>

            <h1 className="display-6 fw-bold mb-3">{product.title}</h1>
            
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fa fa-star ${
                      i < Math.floor(product.rating?.rate || 0)
                        ? "text-warning"
                        : "text-muted"
                    }`}
                  ></i>
                ))}
              </div>
              <span className="text-muted">
                ({product.rating?.rate || 0}) · {product.rating?.count || 0} reviews
              </span>
            </div>

            <div className="mb-4">
              <h2 className="display-5 fw-bold text-primary mb-2">
                ${product.price}
              </h2>
              <small className="text-muted">
                Stock: {isInStock ? (
                  <span className="text-success">{stockQuantity} available</span>
                ) : (
                  <span className="text-danger">Out of stock</span>
                )}
              </small>
            </div>

            <p className="lead mb-4">{product.description}</p>

            {/* Size Selection */}
            {product.category === "men's clothing" || product.category === "women's clothing" ? (
              <div className="mb-4">
                <h6 className="fw-bold mb-2">Size:</h6>
                <div className="btn-group" role="group" aria-label="Size selection">
                  {sizes.map((size) => (
                    <input
                      key={size}
                      type="radio"
                      className="btn-check"
                      name="size"
                      id={`size-${size}`}
                      value={size}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      disabled={!isInStock}
                    />
                  ))}
                  {sizes.map((size) => (
                    <label
                      key={size}
                      className="btn btn-outline-secondary"
                      htmlFor={`size-${size}`}
                    >
                      {size}
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Color Selection */}
            {/* <div className="mb-4">
              <h6 className="fw-bold mb-2">Color:</h6>
              <div className="btn-group" role="group" aria-label="Color selection">
                {colors.map((color) => (
                  <input
                    key={color}
                    type="radio"
                    className="btn-check"
                    name="color"
                    id={`color-${color}`}
                    value={color}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    disabled={!isInStock}
                  />
                ))}
                {colors.map((color) => (
                  <label
                    key={color}
                    className="btn btn-outline-secondary"
                    htmlFor={`color-${color}`}
                  >
                    {color}
                  </label>
                ))}
              </div>
            </div> */}

            {/* Quantity Selection */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2">Quantity:</h6>
              <div className="input-group" style={{width: "120px"}}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isInStock}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={stockQuantity}
                  disabled={!isInStock}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                  disabled={!isInStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2 d-md-flex mb-4">
              <button
                className={`btn btn-lg ${!isInStock ? 'btn-secondary' : 'btn-primary'} me-md-2`}
                onClick={() => addProduct(product, quantity)}
                disabled={!isInStock}
              >
                <i className="fa fa-cart-plus me-2"></i>
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              {/* <button className="btn btn-outline-primary btn-lg">
                <i className="fa fa-heart me-2"></i>
                Add to Wishlist
              </button> */}
            </div>

            <div className="d-grid">
              <Link to="/cart" className="btn btn-dark btn-lg">
                <i className="fa fa-shopping-cart me-2"></i>
                Go to Cart
              </Link>
            </div>

         
           
          </div>
        </div>
      </div>
    );
  };

  const Loading2 = () => {
    return (
      <div className="d-flex">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mx-3">
            <Skeleton height={300} width={250} />
            <Skeleton height={20} width={200} className="mt-2" />
            <Skeleton height={15} width={150} className="mt-1" />
          </div>
        ))}
      </div>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <div className="d-flex">
        {similarProducts.map((item) => {
          const itemStock = Math.floor(Math.random() * 15);
          const itemInStock = itemStock > 0;
          
          return (
            <div key={item.id} className="mx-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="position-relative">
                  <Link to={`/product/${item.id}`} className="text-decoration-none">
                    <img
                      className="card-img-top p-3"
                      src={item.image}
                      alt={item.title}
                      style={{
                        height: "250px",
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa"
                      }}
                    />
                  </Link>
                  {!itemInStock && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                         style={{backgroundColor: "rgba(255,255,255,0.9)"}}>
                      <span className="badge bg-danger">OUT OF STOCK</span>
                    </div>
                  )}
                </div>
                
                <div className="card-body text-center">
                  <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                    <h6 className="card-title fw-bold">
                      {item.title.substring(0, 25)}...
                    </h6>
                  </Link>
                  <p className="text-primary fw-bold mb-2">${item.price}</p>
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa fa-star ${
                          i < Math.floor(item.rating?.rate || 0)
                            ? "text-warning"
                            : "text-muted"
                        }`}
                        style={{fontSize: "0.8rem"}}
                      ></i>
                    ))}
                  </div>
                </div>
                
                <div className="card-footer bg-transparent border-0">
                  <div className="d-grid gap-2">
                    <button
                      className={`btn btn-sm ${!itemInStock ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => addProduct(item)}
                      disabled={!itemInStock}
                    >
                      {itemInStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <Link
                      to={`/product/${item.id}`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          {loading ? <Loading /> : <ShowProduct />}
        </div>
        
        <div className="row my-5 py-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">You May Also Like</h2>
              <Link to="/" className="btn btn-outline-primary">
                View All Products
              </Link>
            </div>
            
            <div className="d-none d-md-block">
              <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
                {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
              </Marquee>
            </div>
            
            <div className="d-md-none">
              <div className="row">
                {similarProducts.slice(0, 2).map((item) => {
                  const itemStock = Math.floor(Math.random() * 15);
                  const itemInStock = itemStock > 0;
                  
                  return (
                    <div key={item.id} className="col-6 mb-3">
                      <div className="card h-100 shadow-sm">
                        <Link to={`/product/${item.id}`}>
                          <img
                            className="card-img-top p-2"
                            src={item.image}
                            alt={item.title}
                            style={{height: "150px", objectFit: "contain"}}
                          />
                        </Link>
                        <div className="card-body text-center p-2">
                          <h6 className="card-title small">
                            {item.title.substring(0, 20)}...
                          </h6>
                          <p className="text-primary fw-bold">${item.price}</p>
                          <button
                            className={`btn btn-sm w-100 ${!itemInStock ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => addProduct(item)}
                            disabled={!itemInStock}
                          >
                            {itemInStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      <style jsx>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .btn-check:checked + .btn {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: white;
        }
        
        .breadcrumb-item + .breadcrumb-item::before {
          content: ">";
        }
        
        @media (max-width: 768px) {
          .display-6 {
            font-size: 1.5rem;
          }
          
          .display-5 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default Product;