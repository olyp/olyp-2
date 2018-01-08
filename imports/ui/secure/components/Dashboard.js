import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Glyphicon } from 'react-bootstrap';

import DoorCodes from '../../../api/collections/doorCodes';

import Preloader from '../../shared/preloader/Preloader';

class Dashboard extends Component {

	render() {

		const user = Meteor.users.findOne({_id: Meteor.userId()});

		if (!user) {
			return <Preloader />;
		}

		const doorCode = this.props.doorCode ?
			<h4><Glyphicon glyph="lock" /> {this.props.doorCode.code}</h4> :
			null;

		return (
			<div className="container">
				<div className="row">
					<h4 className="col-xs-12">Hei, {user.profile.firstName}</h4>
				</div>
				<hr />
				<div className="row">
					<div className="col-xs-12">
						{doorCode}
					</div>
				</div>
			</div>
			
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('doorCode');

	return {
		doorCode: DoorCodes.find().fetch()[0]
	}
})(Dashboard);