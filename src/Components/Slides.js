import React, { useRef, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Add from "../imgs/heart.png";
import Added from "../imgs/red-heart.png";
import { AddToList, RemoveList } from "../action/List";
import { useSelector, useDispatch } from "react-redux";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { GrPrevious, GrNext } from "react-icons/gr";
import { RxDividerVertical } from "react-icons/rx";
import { NavLink } from "react-router-dom";

import "./slides.css";
import { url } from "./url";
import axios from "axios";
import Spinner from "./Spinner";

function FillExample() {
  const reviews = [
    { _id: 1, text: "abc" },
    { _id: 2, text: "def" },
    { _id: 3, text: "ghi" },
    { _id: 4, text: "jkl" },
    { _id: 5, text: "mno" },
    { _id: 6, text: "pqr" },
    { _id: 7, text: "stu" },
    { _id: 8, text: "vwx" },
    { _id: 9, text: "yza" },
  ];
  const [AllProducts, setAllProducts] = useState([]);
  const [AddedIds, setAddedIds] = useState([]);
  const [loading, setLoading] = useState(true); // add loading state

  const ListItems = useSelector((state) => state.ItemsAdded.ListItems);
  const dispatch = useDispatch();

  useEffect(() => {
    const GetProducts = async () => {
      const { data } = await axios.get(`${url}/api/products/`);

      setLoading(false);
      setAllProducts(data);
      // Add a review number property to each item object
      // const productsWithReviewNumber = new_data.map((item) => ({
      //   ...item,
      //   reviewNumber: Math.floor(Math.random() * (150 - 50 + 1)) + 50,
      // }));
      // setAllProducts(productsWithReviewNumber);
    };

    GetProducts();
  }, []);

  useEffect(() => {
    // Update the added ids whenever the list items change
    const ids = ListItems.map((item) => item._id);
    setAddedIds(ids);
  }, [ListItems]);

  const isAdded = (itemId) => {
    // Check if the item id is in the added ids
    return AddedIds.includes(itemId);
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 10,
    },
  };

  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlidePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
      setActiveSlide((prevSlide) => prevSlide - 1);
    }
  };

  const handleSlideNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
      setActiveSlide((prevSlide) => prevSlide + 1);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Tab.Container
          defaultActiveKey='home'
          id='noanim-tab-example'
          className='mb-3'
        >
          <Nav className='border-bottom'>
            <Nav.Item className='border rounded-top border-bottom-0 text-danger'>
              <Nav.Link eventKey='home'>
                <b>Latest</b>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='profile'>
                <b>Featured</b>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='contact'>
                <b>Specials</b>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link className='px-0 mx-0' onClick={handleSlidePrev}>
                <GrPrevious />
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={handleSlidePrev} className='px-0'>
                <RxDividerVertical style={{ color: "#D3D3D3" }} />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='px-0 mx-0' onClick={handleSlideNext}>
                <GrNext />
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey='home'>
              <Carousel
                ref={carouselRef}
                responsive={responsive}
                infinite
                draggable
                removeArrowOnDeviceType={["tablet", "mobile"]}
                containerClass='carousel-container'
                controls={false}
                nextIcon=''
                nextLabel=''
                indicators={false}
                beforeChange={(prevSlide, nextSlide) =>
                  setActiveSlide(nextSlide)
                }
              >
                {AllProducts &&
                  AllProducts.map((items) => {
                    return (
                      <div className='deal1-items' key={items._id}>
                        <div className='card1'>
                          <div className='card1-img-data'>
                            <img src={items.image} className='card1-img' />
                            <img
                              onClick={() => {
                                if (!isAdded(items._id)) {
                                  dispatch(AddToList(items));
                                } else {
                                  dispatch(RemoveList(items._id));
                                }
                              }}
                              src={isAdded(items._id) ? Added : Add}
                              className='add-list'
                            />

                            <NavLink
                              to={`/product/${items._id}`}
                              key={items._id}
                            >
                              <button className='view'>View product</button>
                            </NavLink>
                          </div>
                          <div className='card1-data'>
                            <p className='card1-title'>
                              {items.name.length >= 32
                                ? items.name.slice(0, 32) + ".."
                                : items.name}
                            </p>
                            <div className='category-rating'>
                              <p className='card1-category'>{items.category}</p>
                              <div className='rating'>
                                <div className='productsRatingDiv text-warning'>
                                  <span>
                                    {items.rating >= 1 ? (
                                      <BsStarFill />
                                    ) : items.rating >= 0.5 ? (
                                      <BsStarHalf />
                                    ) : (
                                      <BsStar />
                                    )}
                                  </span>
                                  <span>
                                    {items.rating >= 2 ? (
                                      <BsStarFill />
                                    ) : items.rating >= 1.5 ? (
                                      <BsStarHalf />
                                    ) : (
                                      <BsStar />
                                    )}
                                  </span>
                                  <span>
                                    {items.rating >= 3 ? (
                                      <BsStarFill />
                                    ) : items.rating >= 2.5 ? (
                                      <BsStarHalf />
                                    ) : (
                                      <BsStar />
                                    )}
                                  </span>
                                  <span>
                                    {items.rating >= 4 ? (
                                      <BsStarFill />
                                    ) : items.rating >= 3.5 ? (
                                      <BsStarHalf />
                                    ) : (
                                      <BsStar />
                                    )}
                                  </span>
                                  <span>
                                    {items.rating >= 5 ? (
                                      <BsStarFill />
                                    ) : items.rating >= 4.5 ? (
                                      <BsStarHalf />
                                    ) : (
                                      <BsStar />
                                    )}
                                  </span>
                                </div>
                                <p className='rating-text'>
                                  {`(${items.numReviews}   reviews)`}
                                </p>
                              </div>
                            </div>
                            <div className='card1-price'>
                              <p className='discount'>${items.price}</p>
                              <p className='mrp'>
                                ${Math.round(items.price * 1.66)}
                              </p>
                              <p className='price-off'>(60% OFF)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Carousel>
            </Tab.Pane>
            <Tab.Pane eventKey='profile'>latest</Tab.Pane>
            <Tab.Pane eventKey='contact'>promo</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      )}
    </>
  );
}

export default FillExample;
