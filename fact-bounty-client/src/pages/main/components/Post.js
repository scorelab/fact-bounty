import React, { Component } from 'react';
import { Card, CardContent, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import postImg1 from '../flag1.jpg';
import postImg2 from '../flag2.jpg';
import postImg3 from '../president.jpg';
import LinesEllipsis from 'react-lines-ellipsis';
import { withStyles } from '@material-ui/core/styles';
import '../Posts.sass';
import ReportProblem from '@material-ui/icons/ReportProblemOutlined';
import Cancel from '@material-ui/icons/CancelOutlined';

const styles = {
    cardContent: {
        padding: 0
    },
    card: {
        marginBottom: '7px',
        // boxShadow: '0 0 0 0',
        backgroundColor: '#fafafa',
        color: '#424242',
        transition: '0.1s ease',
        '&:hover': {
            boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            '&:cardContent': {
                padding: '20px'
            }
        }
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

    render() {
        const { post, classes } = this.props;
        const content = post.content.slice(0, 320);
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
                                <div className="read-more"><Link to="/post">Read more</Link></div>
                            </div>
                        </div>
                        <div className="vote-status"></div>
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
                {/* <div className="btn-column-hover">
                    <div className="fake-btn"><Cancel className={classes.icon} /></div>
                    <div className="mix-btn"><ReportProblem className={classes.icon} /></div>
                </div> */}
            </div>
        )
    }

}

export default withStyles(styles)(Post);