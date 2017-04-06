import React, {Component} from 'react';

// import { lazyload } from 'react-lazyload';

import Preloader from '../../shared/preloader/Preloader.js';

import NavBar from '../../shared/navigation/NavBar.js';
import Footer from './navigation/Footer.js';

// @lazyload({
// 	height: 200,
// 	// once: true,
// 	// offset: -500
// })

class FrontLayout extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
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
        // window.addEventListener("resize", this.updateDimensions.bind(this));
        // window.addEventListener("scroll", this.updateDimensions.bind(this));
    }
    componentWillUnmount () {
        // window.removeEventListener("resize", this.updateDimensions.bind(this));
        // window.removeEventListener("scroll", this.updateDimensions.bind(this));
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

		if (this.state.loading) {
			return <Preloader />
		}

		// const navBar = this.state.navBarVisible ? <NavBar /> : '';

		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				window: this.state.window
			})
		);

		return (
			<div>
				<NavBar />
				{childrenWithProps}
				<Footer />
			</div>
		);
	}
}

export default FrontLayout;