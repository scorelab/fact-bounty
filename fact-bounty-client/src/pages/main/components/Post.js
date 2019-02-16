import React, { Component } from 'react';
import { Card, CardContent, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import postImg1 from '../flag1.jpg';
import postImg2 from '../flag2.jpg';
import postImg3 from '../president.jpg';
import { withStyles } from '@material-ui/core/styles';
import '../Posts.sass';
import ReportProblem from '@material-ui/icons/ReportProblemOutlined';
import Cancel from '@material-ui/icons/CancelOutlined';

const styles = {
    cardContent: {
        padding: 0
    },
    card: {
        marginBottom: '12px',
        backgroundColor: '#fafafa',
        color: '#424242',
        transition: '0.1s ease',
        '&:hover': {
            boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        },
        // boxShadow: '0 0 0 0',
    },
    icon: {
        fontSize: '30px'
    },
    trueBtnHover: {
        color: '#009688',
        fontSize: '30px'
    },
    fakeBtnHover: {
        color: '#f4511e',
        fontSize: '30px'
    },
    mixBtnHover: {
        color: '#0288d1',
        fontSize: '30px'
    }
}

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postStatus: 'true',
            userInput: null,
            postContent: ""
        }
    }

    componentDidMount() {
        this.setState({
            postContent: this.props.post.content
        })
    }

    findHighestVotesColor(post) {
        let value;
        if (post.approved_count >= post.fake_count) {
            if (post.approved_count >= post.mixedvote_count) {
                value = '#009688';
            } else {
                value = '#0288d1';
            }
        } else {
            if (post.fake_count >= post.mixedvote_count) {
                value = '#f4511e';
            } else {
                value = '#0288d1';
            }
        }
        return value;
    }

    displayVote(value, totalVotes) {
        return (value / totalVotes * 100) > 3 ? Math.round(value / totalVotes * 1000) / 10 + "%" : '';
    }

    handleClick = (event) => {
        //handle user vote click
    }

    render() {
        const { post, classes } = this.props;
        const content = post.content.slice(0, 320);
        const totalVotes = post.approved_count + post.fake_count + post.mixedvote_count;
        const highestVotes = this.findHighestVotesColor(post);
        const votes = (
            <div className="vote-status" style={{ backgroundColor: highestVotes }}>
                <div className="votes true-votes" style={{ width: (post.approved_count / totalVotes * 100) + '%' }}><span className="vote-value">{this.displayVote(post.approved_count, totalVotes)}</span></div>
                <div className="votes fake-votes" style={{ width: (post.fake_count / totalVotes * 100) + '%' }}><span className="vote-value">{this.displayVote(post.fake_count, totalVotes)}</span></div>
                <div className="votes mix-votes" style={{ width: (post.mixedvote_count / totalVotes * 100) + '%' }}><span className="vote-value">{this.displayVote(post.mixedvote_count, totalVotes)}</span></div>
            </div>
        );
        return (
            <div className="hover-container">
                <Card className={classes.card}>
                    <CardContent style={styles.cardContent}>
                        <div className="container">
                            <div className="image">
                                <img src={postImg1} alt="fact-bounty" className="post-img"></img>
                            </div>
                            <div className="details">
                                <div className="title">{post.title}</div>
                                <div className="date">{post.date}</div>
                                <div className="content">
                                    {content}
                                    {(post.content.length > 320) ? '...' : ''}
                                </div>
                                <div className="read-more">Read more</div>
                            </div>
                        </div>
                        {votes}
                    </CardContent>
                </Card>
                <div className="btn-column">
                    <div className="true-transition">
                        <div className="true-btn"><Icon className={classes.icon}>check_circle_outline</Icon></div>
                        <div className="true-btn-hover">
                            <Icon className={classes.trueBtnHover}>check_circle</Icon>
                            <div className="true-label">True</div>
                        </div>
                    </div>
                    <div className="fake-transition">
                        <div className="fake-btn"><Cancel className={classes.icon} /></div>
                        <div className="fake-btn-hover">
                            <Icon className={classes.fakeBtnHover}>cancel</Icon>
                            <div className="fake-label">Fake</div>
                        </div>
                    </div>
                    <div className="mix-transition">
                        <div className="mix-btn"><ReportProblem className={classes.icon} /></div>
                        <div className="mix-btn-hover">
                            <Icon className={classes.mixBtnHover}>report_problem</Icon>
                            <div className="mix-label">Mixture</div>
                        </div>
                    </div>
                </div>
                <div className="total-vote-count">{totalVotes} votes</div>
            </div>
        )
    }

}

export default withStyles(styles)(Post);