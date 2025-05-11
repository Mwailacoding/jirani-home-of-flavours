import React from "react";

const ProductCard = ({ item, image_path, navigate }) => {
  return (
    <div className="col-md-3">
      <div className="card shadow-lg h-100">
        <img
          src={`${image_path}${item.image}`}
          className="card-img-top"
          alt={item.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title text-dark">{item.name}</h5>
          <p className="card-text text-muted">{item.description}</p>
          <p className="card-text text-warning fw-bold">${item.price}</p>
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;