import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const Room1 = () => {
	return (
		<div className="fp-room-wrapper">
			<div id="fp-room-1" className="fp-room">
				<ReactCSSTransitionGroup
					transitionName='fp-animate'
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
					transitionAppear={true}
					transitionAppearTimeout={2000}
				>
					<div className="fp-room-border-top-right"></div>
				</ReactCSSTransitionGroup>
				<ReactCSSTransitionGroup
					transitionName='fp-animate-2'
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
					transitionAppear={true}
					transitionAppearTimeout={2000}
				>
					<div className="fp-room-border-bottom-left"></div>
				</ReactCSSTransitionGroup>
			</div>
		</div>
	);
}

export default Room1;