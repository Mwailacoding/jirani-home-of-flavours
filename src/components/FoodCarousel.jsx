import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './FoodCarousel.css';

// SVG Star Rating Component
const StarRating = ({ rating, reviewCount }) => {
  return (
    <div className="star-rating">
      <div className="stars-container">
        {/* Background stars (empty) */}
        <div className="stars-empty">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={`empty-${i}`} 
              width="20" 
              height="20" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill="#ddd"
              />
            </svg>
          ))}
        </div>
        {/* Filled stars (based on rating) */}
        <div 
          className="stars-filled" 
          style={{ width: `${(rating / 5) * 100}%` }}
        >
          {[...Array(5)].map((_, i) => (
            <svg 
              key={`filled-${i}`} 
              width="20" 
              height="20" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill="#ffc107"
              />
            </svg>
          ))}
        </div>
      </div>
      <span className="rating-text">{rating.toFixed(1)}</span>
      <span className="review-count">({reviewCount} reviews)</span>
    </div>
  );
};

const FoodCarousel = () => {
    const foodItems = [
        {
            id: 1,
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            alt: "Fresh salad bowl",
            title: "Seasonal Special",
            description: "Try our new summer salad with organic greens and locally-sourced vegetables. Perfect for a light and healthy meal.",
            price: 299,
            promo: "15% OFF TODAY",
            rating: 4.7,
            reviewCount: 128,
            dietaryInfo: ["vegetarian", "gluten-free"],
            prepTime: "15 mins"
        },
        {
            id: 2,
            imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
            alt: "Delicious pizza",
            title: "Kenyan Made Pizzas",
            description: "Wood-fired with fresh local ingredients. Choose from our selection of premium toppings including truffle oil and burrata.",
            price: 1499,
            promo: "BUY 1 GET 1 HALF PRICE",
            rating: 4.9,
            reviewCount: 215,
            dietaryInfo: ["vegetarian"],
            prepTime: "20 mins"
        },
        {
            id: 3,
            imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
            alt: "Gourmet burger",
            title: "Cakes",
            description: "100% grass-fed beef with our secret sauce, served on a brioche bun with hand-cut fries. Add bacon for KSh 200 more.",
            price: 1099,
            promo: "MEAL DEAL KSh 1599",
            rating: 4.5,
            reviewCount: 183,
            dietaryInfo: [],
            prepTime: "10 mins"
        },
        {
            id: 4,
            imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929",
            alt: "Fresh baked goods",
            title: "Daily Fresh Bakes",
            description: "Made fresh each morning by our master baker. Selection varies daily but always includes vegan and gluten-free options.",
            price: 499,
            promo: "EARLY BIRD SPECIAL",
            rating: 4.8,
            reviewCount: 97,
            dietaryInfo: ["vegetarian", "vegan"],
            prepTime: "5 mins"
        }
    ];

    // Format price in Kenyan Shillings
    const formatPrice = (price) => {
        return `KSh ${price.toLocaleString('en-KE')}`;
    };

    return (
        <div className="food-carousel-container">
            <div className="carousel-header">
                <h2 className="carousel-title">Today's Specials</h2>
                <div className="carousel-controls">
                   
                </div>
            </div>
            
            <Carousel
                autoPlay={true}
                infiniteLoop={true}
                showThumbs={false}
                showStatus={false}
                interval={6000}
                transitionTime={700}
                swipeable={true}
                emulateTouch={true}
                showArrows={true}
                stopOnHover={true}
                dynamicHeight={false}
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                    hasPrev && (
                        <button 
                            type="button" 
                            onClick={onClickHandler} 
                            title={label}
                            className="food-nav-arrow food-nav-arrow-left"
                            aria-label="Previous slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                            </svg>
                        </button>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                        <button 
                            type="button" 
                            onClick={onClickHandler} 
                            title={label}
                            className="food-nav-arrow food-nav-arrow-right"
                            aria-label="Next slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                            </svg>
                        </button>
                    )
                }
            >
                {foodItems.map((item) => (
                    <div key={item.id} className="food-slide">
                        <div className="food-image-container">
                            <img 
                                src={item.imageUrl} 
                                alt={item.alt} 
                                className="food-image"
                                loading="lazy"
                            />
                            {item.promo && (
                                <div className="promo-badge">
                                    <span>{item.promo.replace('$', 'KSh ')}</span>
                                </div>
                            )}
                            {item.dietaryInfo.length > 0 && (
                                <div className="dietary-tags">
                                    {item.dietaryInfo.map((diet) => (
                                        <span key={diet} className={`dietary-tag ${diet}`}>
                                            {diet}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="food-info">
                            <div className="food-header">
                                <h3 className="food-title">{item.title}</h3>
                                <span className="prep-time">{item.prepTime}</span>
                            </div>
                            <StarRating rating={item.rating} reviewCount={item.reviewCount} />
                            <p className="food-description">{item.description}</p>
                            <div className="food-footer">
                                <div className="food-price">{formatPrice(item.price)}</div>
                             
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default FoodCarousel;