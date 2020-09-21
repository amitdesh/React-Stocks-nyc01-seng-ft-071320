import React, { Component } from "react";
import StockContainer from "./StockContainer";
import PortfolioContainer from "./PortfolioContainer";
import SearchBar from "../components/SearchBar";

class MainContainer extends Component {
  state = {
    stocks: [],
    portfolio: [],
    sort: "",
    filter: "",
  };

  componentDidMount() {
    fetch("http://localhost:3000/stocks")
      .then((resp) => resp.json())
      .then((data) => {
        this.setState(() => ({
          stocks: data,
          // filter: data,
        }));
      });
  }

  addClickHandler = (stockObj) => {
    this.setState(() => ({
      portfolio: [...this.state.portfolio, stockObj],
    }));
  };

  removeClickHandler = (stockObj) => {
    let newPortfolio = [...this.state.portfolio];
    let indexStock = newPortfolio.indexOf(stockObj);
    newPortfolio.splice(indexStock, 1);
    this.setState(() => ({
      portfolio: newPortfolio,
    }));
  };

  setSort = (e) => {
    // console.log(e);
    e.persist();
    this.setState(() => ({
      sort: e.target.value,
    }));
  };

  sortStocks = (array) => {
    if (this.state.sort === "Alphabetically") {
      return array.sort((a, b) => (a.ticker > b.ticker ? 1 : -1));
    } else {
      return array.sort((a, b) => (a.price > b.price ? 1 : -1));
    }
  };

  setFilter = (e) => {
    e.persist();
    this.setState(() => ({
      filter: e.target.value,
    }));
  };

  filterStocks = () => {
    let filteredStocksArray = [...this.state.stocks];
    if (this.state.filter !== "") {
      let filteredStocks = filteredStocksArray.filter(
        (stock) => stock.type === this.state.filter
      );
      return this.sortStocks(filteredStocks);
    } else {
      return this.sortStocks(this.state.stocks);
    }
  };

  render() {
    const sortedStocks = this.filterStocks();
    console.log(this.state.filter);

    return (
      <div>
        <SearchBar
          setSort={this.setSort}
          sort={this.state.sort}
          setFilter={this.setFilter}
        />
        <div className="row">
          <div className="col-8">
            <StockContainer
              stocks={sortedStocks}
              clickHandler={this.addClickHandler}
            />
          </div>
          <div className="col-4">
            <PortfolioContainer
              portfolio={this.state.portfolio}
              clickHandler={this.removeClickHandler}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MainContainer;
