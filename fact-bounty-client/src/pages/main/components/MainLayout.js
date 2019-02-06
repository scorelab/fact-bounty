import React, {
    Component
} from 'react';
import { Route } from 'react-router-dom';
import Posts from './Posts';
import TopNavBar from '../../../shared/components/TopNavBar';

class MainLayout extends Component {

    render() {
        const { match } = this.props;
        return (
            <div className="mainLayout">
                <TopNavBar />
                <Route exact path={`/`} component={Posts} />
                <Route path={`/post`} component={() => {
                    return (
                        <h4>sdfgdsfgsdf</h4>
                    )
                }} />
            </div>
        )
    }

}

export default MainLayout;