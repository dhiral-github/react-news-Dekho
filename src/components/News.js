import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articlesNews, setArticlesNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country
      }&category=${props.category}&apiKey=fe415a344cea4034bef041fac54c308c&page=${page
      }&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    console.log("updateNews==>>>", parsedData);
    props.setProgress(70);
    setArticlesNews(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsDekho`;
    updateNews();
  }, []);

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country
      }&category=${props.category}&apiKey=fe415a344cea4034bef041fac54c308c&page=${page + 1
      }&pageSize=${props.pageSize}`;
    console.log("fetchMoreData==>>>", url);
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticlesNews(articlesNews.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsDekho - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articlesNews.length}
        next={fetchMoreData}
        hasMore={articlesNews.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articlesNews.map((element) => {
              console.log(element);
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element?.title && element.title}
                    description={element?.description && element.description}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
