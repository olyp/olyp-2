import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import NavBar from './navigation/NavBar.js';
import Footer from './navigation/Footer.js';

export default class FrontLayout extends Component {

	constructor(props) {
		super(props);
		this.state = {
			window: {
				height: 0,
				width: 0,
				scroll: 0
			},
			navBarVisible: true
		}
	}

	componentWillMount () {
		this.updateDimensions();
	}
    componentDidMount () {
        window.addEventListener("resize", this.updateDimensions.bind(this));
        window.addEventListener("scroll", this.updateDimensions.bind(this));
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("scroll", this.updateDimensions.bind(this));
    }

	updateDimensions () {

		// const scroll = $(window).scrollTop();

		// if (scroll < this.state.window.scroll) {
		// 	this.setState({
		// 		navBarVisible: true
		// 	});
		// } else if (scroll > 100) {
		// 	this.setState({
		// 		navBarVisible: false
		// 	});
		// }

        this.setState({
        	window: {
        		width: $(window).width(), 
        		height: $(window).height(),
        		scroll: $(window).scrollTop()
        	}
        });
    }


	render() {

		const navBar = this.state.navBarVisible ? <NavBar window={this.state.window}/> : '';

		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				window: this.state.window
			})
		);

		return (
			<div>
				{navBar}
				<ReactCSSTransitionGroup
					transitionName='page-content'
					transitionEnterTimeout={600}
					transitionLeaveTimeout={600}
					transitionAppear={true}
					transitionAppearTimeout={600}
				>
					{childrenWithProps}
				</ReactCSSTransitionGroup>
				<Footer />
			</div>
		);
	}
}