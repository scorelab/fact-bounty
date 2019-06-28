import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './styles.sass'

class Twitter extends Component {

    render() {
        return (
            <div className="twitterContainer">

                <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Twitter Network</h2>

                <div className="container">
                    <form v-if="import_or_search == 'search'">
                        <div className="col-12 text-center">

                            <div className="col-12 text-center d-md-flex align-items-center">
                                <div className="pr-2 text-nowrap">Search by:</div>
                                <div className="">
                                    <div className="btn-group btn-group-toggle pr-2">
                                        <Button disabled id="searchByTwitter" data-toggle="tooltip" data-delay="0" title="search Twitter content from the past 7 days" type="Button"
                                            color="primary" variant="contained">Twitter</Button>
                                    </div>
                                </div>
                                <TextField variant="outlined" margin="normal" id="query" ref="searchBox" data-toggle="tooltip" style={{ width: "80%" }} label="Enter any phrase" />
                                &nbsp; &nbsp; &nbsp; &nbsp;
                            </div>



                        </div>
                        <div className="check-box-list">
                            <div className="radio-container">
                                <label className="show-label">Show:</label>
                                <input type="radio" name="sort_by" id='sort_by_relevant' value="relevant" /> Relevant
                            </div>
                            <span className="radio-container">
                                <label className="">
                                    <input type="radio" name="sort_by" id="sort_by_recent" value="recent" /> Recent
							</label>
                            </span>
                            <span className="radio-container">
                                <label className="">
                                    <input type="radio" name="sort_by" id="search_by_mixed" value="mixed" /> Mixed
							</label>
                            </span>
                        </div>

                        <div className="col-12 text-center">
                            <input type="hidden" name="include_user_mentions" id="include_user_mentions_true" value="true" />
                            <Button className="btn btn-primary btn-blue" id="submit" variant="contained" color="primary" style={{ width: "50%" }}>Search</Button>
                        </div>

                    </form>

                    <div className="container">
                    </div>

                    <div className="clearfix"></div>
                </div>

            </div>
        )
    }

}

export default Twitter