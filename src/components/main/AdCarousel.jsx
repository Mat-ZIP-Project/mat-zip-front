import React from "react";
import Carousel from "../common/Carousel";
import advertiseList from "../../data/advertiseList";
import styles from "../../assets/styles/common/Home.module.css";

const AdCarousel = () => (
  // <div style={{ margin: "40px 0", textAlign: "center" }}>
  <section className={styles.adSection}>
    <Carousel
      items={advertiseList}
      width={600}      
      height={200}   
      showText={false}
      autoSlide={true}
      showIndex={false}
      interval={5000}
    />
  </section>
);

export default AdCarousel;