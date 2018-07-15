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

		let imageSource = "/images/default_avatar_100x100.jpg"

		if (user.services && user.services.google) {
			imageSource = user.services.google.picture;
		}


		if (user.services && user.services.facebook) {
			imageSource = `http://graph.facebook.com/${user.services.facebook.id}/picture?type=square`;
				
		}

		if (user.profile && user.profile.image) {
			imageSource = `/images/${user.profile.image.localId}?size=100x100`;
				
		}

		const image = <img 
				src={imageSource}
				className="img-responsive"
			/>

		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-4">
						{image}
					</div>
					<div className="col-xs-8">
						<h4>Hei, {user.profile.firstName}</h4>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-xs-12">
						{doorCode}
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						<p>Mer fornuftig stæsj kommer her ...</p>
					</div>
				</div>
			</div>
			
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('doorCode');
	Meteor.subscribe('userData');

	return {
		doorCode: DoorCodes.find().fetch()[0]
	}
})(Dashboard);