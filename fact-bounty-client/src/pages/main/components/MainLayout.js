import React, {
    Component
} from 'react';
import { Route } from 'react-router-dom';
import Posts from './Posts';
import TopNavBar from '../../../shared/components/TopNavBar';
import About from '../../about/About';

class MainLayout extends Component {

    render() {
        const { match } = this.props;
        return (
            <div className="mainLayout">
                <TopNavBar />
                <Route exact path={`/`} component={Posts} />
                <Route path="/about" component={About} />
            </div>
        )
    }

}

export default MainLayout;