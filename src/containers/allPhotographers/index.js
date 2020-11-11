import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spinner, Pagination } from "reactstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAllPhotographers } from "../../actions";
import ProfileCards from "../../components/profilecards";
import FilterBox from "../../components/filterBox";
import PaginationItem from "../../components/pagination/index";
import { causes, languages } from "../../helpers/form-data-options";
import { length } from "file-loader";

/**
 * When mounted dispatches action to fetch basic info from all photographers and display in proper
 * page routed in /photographers
 * @extends Component
 */
class AllPhotographers extends Component {
    state = {
        featuredPhotographers: [],
        morePhotographers: [],
        filteredFeatPhotographers: [],
        filteredMorePhotographers: [],
        select: "Name",
        condition: "",
        pages: [10, 30, 50, 100],
        languages: "",
        cause: "",
        skill: "",
        locationInput: "",
        dataFilteredFeat: null,
        dataFilteredMore: [],
        currentPage: 10,
        hasMore: true
    };

    componentDidMount() {
        const { allPhotographers, doGetPhotographers, token } = this.props;
        if (!allPhotographers.photographers) {
            doGetPhotographers(token).then(() => this.separatePhotographers());
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.skill !== prevState.skill ||
            this.state.languages !== prevState.languages ||
            this.state.cause !== prevState.cause ||
            this.state.condition !== prevState.condition
        ) {
            this.filteringData();
        }
    }

    handleChange = event => {
        event.preventDefault();
        console.log(event.target.id, event.target.value);
        let selected = null;
        switch (event.target.id) {
            case "selectType":
                selected = "skill";
                break;
            case "selectCause":
                selected = "cause";
                break;
            case "selectLanguage":
                selected = "languages";
                break;
            case "filterSelect":
                selected = "select";
                break;
            case "filter":
                selected = "condition";
                break;
            default:
                break;
        }
        if (selected) {
            console.log(selected);
            this.setState({ [selected]: event.target.value });
        }
    };

    separatePhotographers = () => {
        const { allPhotographers } = this.props;
        const allPhotogArray = Object.values(allPhotographers);
        console.log(allPhotogArray);
        if (allPhotogArray.length > 0) {
            const featuredPhotographers = allPhotogArray.filter(el => el && el.featured);
            const morePhotographers = allPhotogArray.filter(el => el && !el.featured);
            this.setState({
                featuredPhotographers,
                morePhotographers,
                filteredFeatPhotographers: featuredPhotographers.slice(0, 10),
                filteredMorePhotographers: morePhotographers.slice(0, 10)
            });
        }
    };

    filteringData = () => {
        let filteredItemsFeat = this.state.featuredPhotographers;
        let filteredItemsMore = this.state.morePhotographers;
        const { state } = this;
        const filterProperties = ["skill", "languages", "cause", "condition"];
        filterProperties.forEach(filterBy => {
            const filterValue = state[filterBy];
            if (filterValue) {
                if (filterBy === "languages") {
                    filteredItemsFeat = filteredItemsFeat.filter(item =>
                        item.Languages ? item.Languages.find(i => i === filterValue) : true
                    );
                    filteredItemsMore = filteredItemsMore.filter(item =>
                        item.Languages ? item.Languages.find(l => l === filterValue) : true
                    );
                }
                if (filterBy === "skill") {
                    filteredItemsFeat = filteredItemsFeat.filter(
                        item => item.Skill === filterValue
                    );
                    filteredItemsMore = filteredItemsMore.filter(
                        item => item.Skill === filterValue
                    );
                }
                if (filterBy === "cause") {
                    filteredItemsFeat = filteredItemsFeat.filter(item =>
                        item.Causes
                            ? item.Causes.find(i => i.toLowerCase() === filterValue.toLowerCase())
                            : false
                    );
                    filteredItemsMore = filteredItemsMore.filter(item =>
                        item.Causes
                            ? item.Causes.find(i => i.toLowerCase() === filterValue.toLowerCase())
                            : false
                    );
                }
                if (filterBy === "condition") {
                    filteredItemsFeat = filteredItemsFeat.filter(item =>
                        item[this.state.select].toLowerCase().includes(filterValue.toLowerCase())
                    );
                    filteredItemsMore = filteredItemsMore.filter(item =>
                        item[this.state.select].toLowerCase().includes(filterValue.toLowerCase())
                    );
                }
            }
            this.setState({
                ...state,
                dataFilteredFeat: filteredItemsFeat,
                dataFilteredMore: filteredItemsMore
            });
        });
    };

    // Function to filter results depending on user's choice.
    pageHandler = (e, type) => {
        e.preventDefault();
        let filterId = null;
        switch (e.target.id) {
            case "10":
                filterId = 10;
                break;
            case "30":
                filterId = 30;
                break;
            case "50":
                filterId = 50;
                break;
            case "100":
                filterId = 100;
                break;
            default:
                filterId = null;
                break;
        }
        if (filterId) {
            this.setState({ currentPage: filterId });
            this.changePageHandler(filterId, type);
        }
    };

    fetchMoreData = () => {
        console.log("fetch More");
        // if (this.state.dataFilteredMore.length === this.state.morePhotographers.length) {
        //     this.setState({ hasMore: false });
        //     return;
        // }
        setTimeout(() => {
            this.setState({
                dataFilteredMore: this.state.dataFilteredMore.concat(
                    this.state.morePhotographers.slice(0, 20)
                )
            });
            console.log(this.state.dataFilteredMore);
        }, 500);
    };
    //     let counter = this.state.currentPage;

    //     setTimeout(() => {
    //         this.setState({
    //             filteredMorePhotographers: this.state.filteredMorePhotographers.concat(this.state.filteredMorePhotographers.slice(0, counter))
    //         });
    //         console.log(counter)
    //         console.log(this.state.filteredMorePhotographers)
    //     }, 1000);
    //     counter = this.state.currentPage + counter;
    //     console.log(this.state.filteredMorePhotographers);
    // };

    changePageHandler = (pageNumber, type) => {
        // let currentPage = this.state.currentPage;
        // if (type === "more") {
        //     if (!this.state.dataFilteredMore && this.state.morePhotographers.length > currentPage) {
        //         let selectedPage;
        //         switch (pageNumber) {
        //             case 10:
        //                 selectedPage = currentPage + 10;
        //                 break;
        //             case 30:
        //                 selectedPage = currentPage + 30;
        //                 break;
        //             case 50:
        //                 selectedPage = currentPage + 50;
        //                 break;
        //             case 100:
        //                 selectedPage = currentPage + 100;
        //                 break;
        //             default:
        //                 return;
        //         }
        //         this.setState({
        //             filteredMorePhotographers: this.state.morePhotographers.slice(
        //                 currentPage,
        //                 selectedPage
        //             ),
        //             currentPage: selectedPage
        //         });
        //     } else {
        //         this.setState({
        //             dataFilteredMore: this.state.dataFilteredMore.slice(currentPage, pageNumber),
        //             currentPage: pageNumber
        //         });
        //     }
        // } else if (type === "featured") {
        //     if (!this.state.dataFilteredFeat) {
        //         this.setState({
        //             filteredFeatPhotographers: this.state.featuredPhotographers.slice(
        //                 currentPage,
        //                 pageNumber
        //             ),
        //             currentPage: pageNumber
        //         });
        //     } else {
        //         this.setState({
        //             dataFilteredFeat: this.state.dataFilteredFeat.slice(currentPage, pageNumber),
        //             currentPage: pageNumber
        //         });
        //     }
        // }
        if (type === "more") {
            if (!this.state.dataFilteredMore) {
                this.setState({
                    filteredMorePhotographers: this.state.morePhotographers.slice(0, pageNumber)
                });
            } else {
                this.setState({
                    dataFilteredMore: this.state.dataFilteredMore.slice(0, pageNumber)
                });
            }
        } else if (type === "featured") {
            if (!this.state.dataFilteredFeat) {
                this.setState({
                    filteredFeatPhotographers: this.state.featuredPhotographers.slice(0, pageNumber)
                });
            } else {
                this.setState({
                    dataFilteredFeat: this.state.dataFilteredFeat.slice(0, pageNumber)
                });
            }
        }
    };

    render() {
        const {
            featuredPhotographers,
            morePhotographers,
            filteredFeatPhotographers,
            filteredMorePhotographers,
            dataFilteredMore,
            dataFilteredFeat
        } = this.state;
        let displayFeatFilterData = null;
        let displayMoreFilterData = null;
        if (!dataFilteredMore || !dataFilteredFeat) {
            displayMoreFilterData = filteredMorePhotographers;
            displayFeatFilterData = filteredFeatPhotographers;
        } else {
            console.log(this.state);
            displayMoreFilterData = dataFilteredMore;
            displayFeatFilterData = dataFilteredFeat;
        }
        console.log("dataFilteredMore: ", displayMoreFilterData);
        return (
            <div>
                {this.props.token ? (
                    <FilterBox
                        options={["Name", "Country", "City", "Region"]}
                        select={this.state.select}
                        condition={this.state.condition}
                        handleChange={this.handleChange}
                        skillType={this.state.skill}
                        currentLanguage={this.state.languages}
                        currentLocation={this.state.locationValue}
                        currentCause={this.state.cause}
                        type={[" ", "Professional", "Amateur", "Student"]}
                        cause={causes}
                        language={languages}
                        // location={["Country", "Region", "City"]}
                    />
                ) : (
                    <FilterBox
                        handleChange={this.handleChange}
                        select={this.state.select}
                        options={["Name", "Country"]}
                    />
                )}
                <h2 className="feautured-h3">Featured Photographers </h2>
                <Pagination>
                    {this.state.pages.map(el => (
                        <PaginationItem
                            key={el}
                            pageNumber={el}
                            onClick={e => this.pageHandler(e, "featured")}
                            id={el}
                        />
                    ))}
                </Pagination>

                {featuredPhotographers.length > 0 ? (
                    <ProfileCards
                        userType="photographer"
                        cards={displayFeatFilterData}
                        pushHistory={id => {
                            this.props.history.push(`/photographer/${id}`);
                        }}
                    />
                ) : (
                    <Spinner type="grow" color="success" />
                )}
                <h2 className="feautured-h3">More Photographers </h2>
                <Pagination>
                    {this.state.pages.map(el => (
                        <PaginationItem
                            key={el}
                            onClick={e => this.pageHandler(e, "more")}
                            pageNumber={el}
                            id={el}
                        />
                    ))}
                </Pagination>
                <InfiniteScroll
                    dataLength={this.state.filteredMorePhotographers.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    {morePhotographers.length > 0 ? (
                        <ProfileCards
                            userType="photographer"
                            cards={displayMoreFilterData}
                            pushHistory={id => {
                                this.props.history.push(`/photographer/${id}`);
                            }}
                        />
                    ) : (
                        <Spinner type="grow" color="success" />
                    )}
                </InfiniteScroll>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    allPhotographers: state.allPhotographers,
    token: state.auth.user.token
});
const mapDispatchToProps = dispatch => ({
    doGetPhotographers: token => dispatch(getAllPhotographers(token))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AllPhotographers)
);
